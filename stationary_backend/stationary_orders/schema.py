import graphene
from graphene_django import DjangoObjectType
from stationary_orders.models import Order, OrderItem
from stationary_shops.models import Shop, ShopPricing, PageRangeDiscount, ServiceType
from stationary_storage.models import Document
from stationary_accounts.models import User
from tarxemo_django_graphene_utils import (
    BaseResponseDTO,
    ResponseObject,
    build_success_response,
    build_error
)
from decimal import Decimal
import json
from django.db import transaction, models

# ------------------------------
# Types
# ------------------------------

class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = "__all__"

class OrderItemType(DjangoObjectType):
    class Meta:
        model = OrderItem
        fields = "__all__"

class OrderResponseDTO(BaseResponseDTO):
    data = graphene.List(OrderType)

class SingleOrderResponseDTO(BaseResponseDTO):
    data = graphene.Field(OrderType)

class OrderItemInput(graphene.InputObjectType):
    document_id = graphene.UUID(required=True)
    page_count = graphene.Int(required=True)
    is_color = graphene.Boolean(required=True)
    is_binding = graphene.Boolean()
    is_lamination = graphene.Boolean()
    paper_size = graphene.String(default_value="A4")

# ------------------------------
# Pricing Logic
# ------------------------------
def calculate_item_price(shop, item_input, user=None):
    """
    Calculates price for a single item.
    """
    is_color = item_input.is_color
    pages = item_input.page_count
    size = item_input.paper_size
    
    # 1. Base Price
    service_type = ServiceType.PRINTING_COLOR if is_color else ServiceType.PRINTING_BW
    try:
        pricing_rule = ShopPricing.objects.get(shop=shop, service_type=service_type)
        base_rate = pricing_rule.base_price
        modifiers = pricing_rule.modifiers
    except ShopPricing.DoesNotExist:
        base_rate = Decimal("100.00") if not is_color else Decimal("500.00")
        modifiers = {}

    size_mod = Decimal(str(modifiers.get(size, "1.0")))
    raw_cost = (Decimal(pages) * base_rate) * size_mod
    
    # 2. Tier Discount
    tier = PageRangeDiscount.objects.filter(
        shop=shop,
        min_pages__lte=pages
    ).filter(
        models.Q(max_pages__gte=pages) | models.Q(max_pages__isnull=True)
    ).first()
    
    if not tier:
         tier = PageRangeDiscount.objects.filter(
            shop__isnull=True,
            min_pages__lte=pages
        ).filter(
             models.Q(max_pages__gte=pages) | models.Q(max_pages__isnull=True)
        ).first()

    if tier:
        discount = raw_cost * (tier.discount_percent / Decimal("100.0"))
        raw_cost -= discount

    # 3. Extras
    extras_cost = Decimal("0.00")
    if item_input.is_binding:
        try:
            b_rule = ShopPricing.objects.get(shop=shop, service_type=ServiceType.BINDING)
            extras_cost += b_rule.base_price
        except:
             extras_cost += Decimal("1000.00")
             
    if item_input.is_lamination:
        try:
             l_rule = ShopPricing.objects.get(shop=shop, service_type=ServiceType.LAMINATION)
             extras_cost += l_rule.base_price
        except:
             extras_cost += Decimal("1000.00")

    # 4. Customer Subscription Discount
    if user:
        sub_discount = Decimal("0.00")
        if user.subscription_tier == User.Subscription.STUDENT:
            sub_discount = Decimal("0.10")
        elif user.subscription_tier == User.Subscription.BUSINESS:
            sub_discount = Decimal("0.20")
        
        # Apply discount to total cost of this item
        return (raw_cost + extras_cost) * (Decimal("1.0") - sub_discount)

    return raw_cost + extras_cost

# ------------------------------
# Mutations
# ------------------------------

class CreateOrderMutation(graphene.Mutation):
    class Arguments:
        shop_id = graphene.UUID(required=True)
        items = graphene.List(OrderItemInput, required=True)

    response = graphene.Field(ResponseObject)
    order = graphene.Field(OrderType)

    def mutate(self, info, shop_id, items):
        user = info.context.user
        if not user.is_authenticated:
            return CreateOrderMutation(response=build_error("Authentication required"))

        try:
            shop = Shop.objects.get(id=shop_id)
            if not shop.is_accepting_orders:
                 return CreateOrderMutation(response=build_error("Shop is not currently accepting orders"))

            # Validations and calculations
            order_items_data = []
            total_order_price = Decimal("0.00")
            
            # Pre-calculation loop
            for item in items:
                price = calculate_item_price(shop, item, user=user)
                total_order_price += price
                
                doc = Document.objects.get(id=item.document_id)
                if doc.owner != user:
                     return CreateOrderMutation(response=build_error(f"Document {doc.id} does not belong to you"))

                order_items_data.append({
                    "document": doc,
                    "price": price,
                    "page_count": item.page_count,
                    "config_snapshot": {
                        "is_color": item.is_color,
                        "paper_size": item.paper_size,
                        "binding": item.is_binding,
                        "lamination": item.is_lamination
                    }
                })

            # Atomic Order Creation
            with transaction.atomic():
                commission = total_order_price * Decimal("0.05")
                
                order = Order.objects.create(
                    customer=user,
                    shop=shop,
                    status=Order.Status.UPLOADED.value,
                    total_price=total_order_price,
                    commission_fee=commission
                )
                
                for data in order_items_data:
                    OrderItem.objects.create(
                        order=order,
                        document=data["document"],
                        price=data["price"],
                        page_count=data["page_count"],
                        config_snapshot=data["config_snapshot"]
                    )

            return CreateOrderMutation(
                response=build_success_response("Order placed successfully"),
                order=order
            )

        except Shop.DoesNotExist:
            return CreateOrderMutation(response=build_error("Shop not found"))
        except Document.DoesNotExist:
            return CreateOrderMutation(response=build_error("Document not found"))
        except Exception as e:
            return CreateOrderMutation(response=build_error(str(e)))

# ------------------------------
# Query
# ------------------------------

class Query(graphene.ObjectType):
    my_orders = graphene.List(OrderType)
    shop_orders = graphene.List(OrderType, shop_id=graphene.UUID(required=True))
    all_my_shop_orders = graphene.List(OrderType)

    def resolve_my_orders(self, info):
        user = info.context.user
        if not user.is_authenticated: return []
        return Order.objects.filter(customer=user)

    def resolve_all_my_shop_orders(self, info):
        user = info.context.user
        if not user.is_authenticated: return []
        # Return all orders for all shops owned by this user
        return Order.objects.filter(shop__owner=user)

    def resolve_shop_orders(self, info, shop_id):
        user = info.context.user
        if not user.is_authenticated: return []
        try:
             shop = Shop.objects.get(id=shop_id)
             if shop.owner != user: return []
             return Order.objects.filter(shop=shop)
        except:
             return []

class UpdateOrderStatusMutation(graphene.Mutation):
    class Arguments:
        order_id = graphene.UUID(required=True)
        status = graphene.String(required=True)

    response = graphene.Field(ResponseObject)
    order = graphene.Field(OrderType)

    def mutate(self, info, order_id, status):
        user = info.context.user
        if not user.is_authenticated:
            return UpdateOrderStatusMutation(response=build_error("Authentication required"))

        try:
            order = Order.objects.get(id=order_id)
            # Check if user owns the shop associated with the order
            if order.shop.owner != user:
                return UpdateOrderStatusMutation(response=build_error("Permission denied"))
            
            # Validate status
            if status not in Order.Status.values:
                 return UpdateOrderStatusMutation(response=build_error("Invalid status"))

            order.status = status
            # Auto-set timestamps if needed (e.g. completed_at)
            from django.utils import timezone
            if status == Order.Status.COMPLETED:
                order.completed_at = timezone.now()
            
            order.save()

            return UpdateOrderStatusMutation(
                response=build_success_response("Order status updated"),
                order=order
            )
        except Order.DoesNotExist:
             return UpdateOrderStatusMutation(response=build_error("Order not found"))
        except Exception as e:
             return UpdateOrderStatusMutation(response=build_error(str(e)))

class Mutation(graphene.ObjectType):
    create_order = CreateOrderMutation.Field()
    update_order_status = UpdateOrderStatusMutation.Field()
