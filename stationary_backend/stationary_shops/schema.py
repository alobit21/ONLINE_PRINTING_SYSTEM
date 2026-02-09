import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from django.conf import settings
from stationary_shops.models import Shop, ShopPricing, PageRangeDiscount, ServiceType
from tarxemo_django_graphene_utils import (
    BaseResponseDTO,
    ResponseObject,
    PageObject,
    build_success_response,
    build_error,
    get_paginated_and_non_paginated_data,
    UserFilterInput # Reusing or defining new? use new.
)
import math

# ------------------------------
# Utility: Haversine
# ------------------------------
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) * math.sin(dlat / 2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon / 2) * math.sin(dlon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# ------------------------------
# Types
# ------------------------------

class ShopPricingType(DjangoObjectType):
    class Meta:
        model = ShopPricing
        fields = "__all__"

class PageRangeDiscountType(DjangoObjectType):
    class Meta:
        model = PageRangeDiscount
        fields = "__all__"

class ShopType(DjangoObjectType):
    distance = graphene.Float() # Annotated field
    
    class Meta:
        model = Shop
        fields = "__all__"
    
    def resolve_distance(self, info):
        # Allow dynamic distance calculation if not annotated
        if hasattr(self, 'distance'):
            return self.distance
        return None

class ShopFilterInput(graphene.InputObjectType):
    page_number = graphene.Int()
    items_per_page = graphene.Int()
    search_term = graphene.String()
    is_verified = graphene.Boolean()
    subscription_tier = graphene.String()
    # Geo
    latitude = graphene.Float()
    longitude = graphene.Float()
    radius_km = graphene.Float()

class ShopResponseDTO(BaseResponseDTO):
    data = graphene.List(ShopType)

class SingleShopResponseDTO(BaseResponseDTO):
    data = graphene.Field(ShopType)

# ------------------------------
# Mutations
# ------------------------------

class CreateShopMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        address = graphene.String(required=True)
        latitude = graphene.Float(required=True)
        longitude = graphene.Float(required=True)
        description = graphene.String()
    
    response = graphene.Field(ResponseObject)
    shop = graphene.Field(ShopType)

    def mutate(self, info, name, address, latitude, longitude, description=""):
        user = info.context.user
        if not user.is_authenticated:
            return CreateShopMutation(response=build_error("Authentication required"))
        
        # Optionally strict check for SHOP_OWNER role
        # if user.role != "SHOP_OWNER": return error...
        
        try:
            shop = Shop.objects.create(
                owner=user,
                name=name,
                address=address,
                latitude=latitude,
                longitude=longitude,
                description=description
            )
            return CreateShopMutation(
                response=build_success_response("Shop created successfully"),
                shop=shop
            )
        except Exception as e:
            return CreateShopMutation(response=build_error(str(e)))

class UpdatePricingMutation(graphene.Mutation):
    class Arguments:
        shop_id = graphene.UUID(required=True)
        service_type = graphene.String(required=True)
        base_price = graphene.Float(required=True)
        modifiers = graphene.JSONString()

    response = graphene.Field(ResponseObject)
    pricing = graphene.Field(ShopPricingType)

    def mutate(self, info, shop_id, service_type, base_price, modifiers=None):
        user = info.context.user
        if not user.is_authenticated:
            return UpdatePricingMutation(response=build_error("Authentication required"))
        
        try:
            shop = Shop.objects.get(id=shop_id)
            if shop.owner != user:
                return UpdatePricingMutation(response=build_error("Permission denied"))
            
            pricing, created = ShopPricing.objects.update_or_create(
                shop=shop,
                service_type=service_type,
                defaults={
                    'base_price': base_price,
                    'modifiers': modifiers or {}
                }
            )
            return UpdatePricingMutation(
                response=build_success_response("Pricing updated"),
                pricing=pricing
            )
        except Shop.DoesNotExist:
            return UpdatePricingMutation(response=build_error("Shop not found"))
        except Exception as e:
            return UpdatePricingMutation(response=build_error(str(e)))


# ------------------------------
# Query
# ------------------------------

class Query(graphene.ObjectType):
    shops = graphene.Field(ShopResponseDTO, filter_input=ShopFilterInput())
    my_shops = graphene.Field(ShopResponseDTO)
    shop_details = graphene.Field(SingleShopResponseDTO, id=graphene.UUID(required=True))
    pending_shops = graphene.Field(ShopResponseDTO)

    def resolve_shops(self, info, filter_input=None):
        # Start with base queryset
        qs = Shop.objects.filter(is_accepting_orders=True)
        
        # Extract geo params
        lat = getattr(filter_input, 'latitude', None)
        lon = getattr(filter_input, 'longitude', None)
        radius = getattr(filter_input, 'radius_km', None)
        search_term = getattr(filter_input, 'search_term', None)
        
        # Apply geographic filtering if coordinates provided
        if lat is not None and lon is not None and radius is not None:
            lat_delta = radius / 111.0
            try:
                cos_val = math.cos(math.radians(lat))
                if abs(cos_val) < 0.0001: cos_val = 0.0001
                lon_delta = radius / (111.0 * cos_val)
                
                qs = qs.filter(
                    latitude__range=(lat - lat_delta, lat + lat_delta),
                    longitude__range=(lon - lon_delta, lon + lon_delta)
                )
            except:
                pass
        
        # Apply search term filtering
        if search_term:
            qs = qs.filter(
                Q(name__icontains=search_term) | 
                Q(address__icontains=search_term)
            )
        
        # Return in the expected format
        return {
            "response": build_success_response(),
            "data": qs,
            "page": PageObject(has_next_page=False, total_elements=qs.count())
        }

    
    def resolve_my_shops(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return {"response": build_error("Authentication required"), "data": []}
        
        return {
            "response": build_success_response(),
            "data": Shop.objects.filter(owner=user)
        }

    def resolve_shop_details(self, info, id):
        try:
            shop = Shop.objects.get(id=id)
            return {"response": build_success_response(), "data": shop}
        except Shop.DoesNotExist:
            return {"response": build_error("Shop not found"), "data": None}

    def resolve_pending_shops(self, info):
        user = info.context.user
        if not user.is_authenticated or user.role != 'ADMIN':
            return {"response": build_error("Admin access required"), "data": []}
        
        qs = Shop.objects.filter(is_verified=False)
        return {
            "response": build_success_response(),
            "data": qs,
            "page": PageObject(has_next_page=False, total_elements=qs.count())
        }

class Mutation(graphene.ObjectType):
    create_shop = CreateShopMutation.Field()
    update_pricing = UpdatePricingMutation.Field()

