import graphene
from graphene_django import DjangoObjectType
from graphene.types import JSONString
from stationary_orders.models import Order, OrderItem, GuestCustomer
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
from django.db.models import Q
import re

# ------------------------------
# Types
# ------------------------------

class GuestCustomerType(DjangoObjectType):
    class Meta:
        model = GuestCustomer
        fields = "__all__"

class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = "__all__"
    
    customer_info = JSONString()
    is_guest_order = graphene.Boolean()
    
    def resolve_customer_info(self, info):
        return self.customer_info
    
    def resolve_is_guest_order(self, info):
        return self.is_guest_order

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

class GuestCustomerInput(graphene.InputObjectType):
    name = graphene.String(required=True, help_text="Customer's full name")
    whatsapp_number = graphene.String(required=True, help_text="WhatsApp number for communication")
    email = graphene.String(help_text="Optional email for order confirmation")

class GuestContactInput(graphene.InputObjectType):
    email = graphene.String(required=False, help_text="Email address for order lookup")
    whatsapp_number = graphene.String(required=False, help_text="WhatsApp number for order lookup")

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
        base_rate = Decimal("100.00")  # Standard rate of TSh 100 per page for all printing
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

class CreateGuestOrderMutation(graphene.Mutation):
    allow_any = True  # Allow unauthenticated access
    
    class Arguments:
        shop_id = graphene.UUID(required=True)
        guest_customer = graphene.Argument(GuestCustomerInput, required=True)
        items = graphene.List(OrderItemInput, required=True)
        payment_option = graphene.String(required=False)

    response = graphene.Field(ResponseObject)
    order = graphene.Field(OrderType)

    def mutate(self, info, shop_id, guest_customer, items, payment_option=None):
        try:
            shop = Shop.objects.get(id=shop_id)
            if not shop.is_accepting_orders:
                 return CreateGuestOrderMutation(response=build_error("Shop is not currently accepting orders"))

            # Validate guest customer information
            if not guest_customer.name or not guest_customer.name.strip():
                return CreateGuestOrderMutation(response=build_error("Customer name is required"))
            
            if not guest_customer.whatsapp_number or not guest_customer.whatsapp_number.strip():
                return CreateGuestOrderMutation(response=build_error("WhatsApp number is required"))
            
            # Basic phone number validation
            whatsapp_number = guest_customer.whatsapp_number.strip()
            if not re.match(r'^\+?[\d\s\-()]+$', whatsapp_number):
                return CreateGuestOrderMutation(response=build_error("Invalid WhatsApp number format"))
            
            # Email validation if provided
            if guest_customer.email and guest_customer.email.strip():
                email = guest_customer.email.strip()
                if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
                    return CreateGuestOrderMutation(response=build_error("Invalid email format"))

            # Create guest customer
            guest_customer_obj = GuestCustomer.objects.create(
                name=guest_customer.name.strip(),
                whatsapp_number=whatsapp_number,
                email=guest_customer.email.strip() if guest_customer.email else None,
                ip_address=info.context.META.get('REMOTE_ADDR'),
                user_agent=info.context.META.get('HTTP_USER_AGENT', '')
            )

            # Validations and calculations
            order_items_data = []
            total_order_price = Decimal("0.00")
            
            # Pre-calculation loop (no user discounts for guests)
            for item in items:
                price = calculate_item_price(shop, item, user=None)
                total_order_price += price
                
                try:
                    doc = Document.objects.get(id=item.document_id)
                except Document.DoesNotExist:
                    return CreateGuestOrderMutation(response=build_error(f"Document with ID {item.document_id} not found"))
                
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
                
                # Validate payment option
                valid_payment_options = [choice[0] for choice in Order.PaymentOption.choices]
                if payment_option and payment_option not in valid_payment_options:
                    payment_option = Order.PaymentOption.PAY_BEFORE.value
                elif not payment_option:
                    payment_option = Order.PaymentOption.PAY_BEFORE.value
                
                order = Order.objects.create(
                    customer=None,  # No registered customer
                    guest_customer=guest_customer_obj,
                    shop=shop,
                    status=Order.Status.UPLOADED.value,
                    payment_option=payment_option,
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

            return CreateGuestOrderMutation(
                response=build_success_response("Guest order placed successfully"),
                order=order
            )

        except Shop.DoesNotExist:
            return CreateGuestOrderMutation(response=build_error("Shop not found"))
        except Document.DoesNotExist:
            return CreateGuestOrderMutation(response=build_error("Document not found"))
        except Exception as e:
            return CreateGuestOrderMutation(response=build_error(str(e)))

class CreateOrderMutation(graphene.Mutation):
    class Arguments:
        shop_id = graphene.UUID(required=True)
        items = graphene.List(OrderItemInput, required=True)

    response = graphene.Field(ResponseObject)
    order = graphene.Field(OrderType)

    def mutate(self, info, shop_id, items):
        user = info.context.user
        print(f'Debug - GraphQL User: {user}')
        print(f'Debug - User is_authenticated: {user.is_authenticated if user else "No user"}')
        print(f'Debug - User type: {type(user)}')
        print(f'Debug - Context type: {type(info.context)}')
        print(f'Debug - Has user attribute: {hasattr(info.context, "user")}')
        
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
                
                try:
                    doc = Document.objects.get(id=item.document_id)
                except Document.DoesNotExist:
                    return CreateOrderMutation(response=build_error(f"Document with ID {item.document_id} not found. Please upload a new document or select from your documents."))
                
                # For testing, allow any user to use any document
                # In production, you might want to enforce ownership: if doc.owner != user:
                # For now, let's allow cross-ownership for testing purposes
                
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
    orders = graphene.Field(OrderResponseDTO)
    guest_orders = graphene.List(OrderType, contact_info=graphene.Argument(GuestContactInput, required=True))

    def resolve_my_orders(self, info):
        user = info.context.user
        print(f'Debug - my_orders resolver - user: {user}')
        print(f'Debug - my_orders resolver - is_authenticated: {user.is_authenticated if user else "No user"}')
        
        if not user.is_authenticated: 
            print('Debug - my_orders resolver: returning [] (not authenticated)')
            return []
        
        orders = Order.objects.filter(customer=user)
        print(f'Debug - my_orders resolver - found {orders.count()} orders for user')
        
        return orders

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
        except Shop.DoesNotExist:
            return []

    def resolve_orders(self, info):
        # Admin query to get all orders
        user = info.context.user
        if not user.is_authenticated or user.role != User.Role.ADMIN:
            return {"response": build_error("Permission denied"), "data": []}
        
        try:
            orders = Order.objects.all()
            return {
                "response": build_success_response("Orders retrieved successfully"),
                "data": orders
            }
        except Exception as e:
            return {
                "response": build_error(str(e)),
                "data": []
            }

    def resolve_guest_orders(self, info, contact_info):
        """
        Resolve guest orders based on contact information (email or WhatsApp number)
        """
        if not contact_info:
            return Order.objects.none()

        email = contact_info.get('email')
        whatsapp_number = contact_info.get('whatsapp_number')

        # Build query filters - use guest_customer field instead of is_guest_order property
        filters = Q(guest_customer__isnull=False)

        if email:
            filters &= Q(guest_customer__email__iexact=email)
        
        if whatsapp_number:
            filters &= Q(guest_customer__whatsapp_number__iexact=whatsapp_number)

        # If neither email nor whatsapp provided, return empty
        if not email and not whatsapp_number:
            return Order.objects.none()

        # Query orders matching the contact information
        orders = Order.objects.filter(filters).select_related(
            'shop', 'guest_customer'
        ).prefetch_related('items').order_by('-created_at')

        print(f'Debug - guest_orders resolver - found {orders.count()} orders for contact: {contact_info}')
        return orders

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
    create_guest_order = CreateGuestOrderMutation.Field()
    update_order_status = UpdateOrderStatusMutation.Field()
