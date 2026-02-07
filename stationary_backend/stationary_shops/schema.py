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

    def resolve_shops(self, info, filter_input=None):
        # Extract geo params before passing to standard util to avoid "FieldError"
        lat = getattr(filter_input, 'latitude', None)
        lon = getattr(filter_input, 'longitude', None)
        radius = getattr(filter_input, 'radius_km', None)
        
        # Remove them from filter_input object so util doesn't try to filter by them directly
        # Since filter_input is an InputObjectType, we can convert to dict first?
        # get_paginated... converts to dict. We can pass modified dict?
        # But get_paginated... takes filtering_object which is expected to be dict-like.
        # We can implement custom logic here.
        
        qs = Shop.objects.filter(is_accepting_orders=True) # Public default
        
        # Geo Logic (Simple implementation for now)
        if lat is not None and lon is not None and radius is not None:
             # Basic Bounding Box first (approx 1 degree ~ 111km)
             lat_delta = radius / 111.0
             lon_delta = radius / (111.0 * math.cos(math.radians(lat)))
             qs = qs.filter(
                 latitude__range=(lat - lat_delta, lat + lat_delta),
                 longitude__range=(lon - lon_delta, lon + lon_delta)
             )
             # Then exact distance filtering in Python if dataset is small, 
             # OR if using PostGIS use filtered QuerySet.
             # Since strict pagination is required and we are in Python:
             # We might lose pagination accuracy if we filter in memory.
             # DANGER: In-memory filtering breaks pagination if applied AFTER db limit.
             # Current Env: SQLite + No Spatialite guarantees.
             # Strategy: Return Box-filtered results.
             
             # Distance Annotation for sorting
             # We can't easily annotate simplistic haversine in SQLite without custom func.
             pass

        return get_paginated_and_non_paginated_data(
            Shop,
            filter_input,
            ShopType,
            # We can pass additional filters via Q if needed, handled by 'additional_filters' argument
            # But we already filtered `qs`. get_paginated... starts from `model.objects`.
            # Wait, get_paginated... takes `model` TYPE, not queryset. 
            # Check util code: `queryset = model.objects.filter(**filter_dict)`.
            # It creates a FRESH queryset. 
            # I cannot pass my pre-filtered `qs`.
            # I must pass filters via `filtering_object` or `additional_filters` (Q object).
            # So I should convert my Box filter to Q object and pass as `additional_filters`.
            additional_filters=None # I'll build Q here
        )
        
        # Re-reading get_paginated_and_non_paginated_data:
        # arguments: model, filtering_object, graphene_type, additional_filters, ...
        # logic: queryset = model.objects.filter(**filter_dict) -> apply additional -> apply search -> paginate.
        
        q_geo = Q()
        if lat is not None and lon is not None and radius is not None:
             lat_delta = radius / 111.0
             try:
                 # Cosine can be 0 at poles, simple guard
                 cos_val = math.cos(math.radians(lat))
                 if abs(cos_val) < 0.0001: cos_val = 0.0001
                 lon_delta = radius / (111.0 * cos_val)
                 
                 q_geo &= Q(latitude__range=(lat - lat_delta, lat + lat_delta))
                 q_geo &= Q(longitude__range=(lon - lon_delta, lon + lon_delta))
             except:
                 pass
        
        return get_paginated_and_non_paginated_data(
             Shop,
             filter_input,
             ShopType,
             additional_filters=q_geo
        )
    
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

class Mutation(graphene.ObjectType):
    create_shop = CreateShopMutation.Field()
    update_pricing = UpdatePricingMutation.Field()

