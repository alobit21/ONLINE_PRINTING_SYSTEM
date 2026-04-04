i have the following files 

1.stationary_backend/stationary_orders/clickpesa_service.py 

import requests
import hashlib
import hmac
import json
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from .models import Payment
from .models import Payment as PaymentModel


class ClickPesaService:
    """
    ClickPesa API integration service for mobile money payments
    """
    
    BASE_URL = "https://api.clickpesa.com/v1"
    
    def __init__(self):
        self.client_id = settings.CLICKPESA_CLIENT_ID
        self.api_key = settings.CLICKPESA_API_KEY
        self.secret_key = getattr(settings, 'CLICKPESA_SECRET_KEY', '')
    
    def _generate_checksum(self, payload):
        """Generate checksum for API request validation"""
        if not self.secret_key:
            return None
        
        # Convert payload to JSON string and sort keys
        payload_str = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        
        # Generate HMAC-SHA256 checksum
        checksum = hmac.new(
            self.secret_key.encode('utf-8'),
            payload_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return checksum
    
    def _get_headers(self, checksum=None):
        """Get request headers with authentication"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
            'X-Client-Id': self.client_id,
        }
        
        if checksum:
            headers['X-Checksum'] = checksum
        
        return headers
    
    def initiate_mobile_money_payment(self, payment, phone_number, payment_method):
        """
        Initiate mobile money payment via ClickPesa
        
        Args:
            payment: Payment model instance
            phone_number: Customer phone number
            payment_method: Payment method (MPESA, TIGOPESA, etc.)
        
        Returns:
            dict: API response
        """
        endpoint = f"{self.BASE_URL}/payments/mobile-money"
        
        payload = {
            'amount': float(payment.amount),
            'currency': 'TZS',  # Tanzanian Shillings
            'payment_method': payment_method,
            'phone_number': phone_number,
            'reference': f"ORDER-{payment.order.id}",
            'callback_url': f"{settings.BASE_URL}/api/payments/webhook/clickpesa/",
            'description': f"Payment for order #{payment.order.id}",
        }
        
        # Generate checksum if secret key is configured
        checksum = self._generate_checksum(payload)
        headers = self._get_headers(checksum)
        
        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            
            response_data = response.json()
            
            # Update payment with ClickPesa details
            payment.clickpesa_payment_id = response_data.get('id')
            payment.reference_number = response_data.get('reference')
            payment.phone_number = phone_number
            payment.status = PaymentModel.Status.PROCESSING
            payment.save()
            
            # Update order payment status
            payment.order.payment_status = payment.order.PaymentStatus.PENDING_PAYMENT
            payment.order.save()
            
            return {
                'success': True,
                'data': response_data,
                'payment_id': payment.id
            }
            
        except requests.exceptions.RequestException as e:
            error_msg = str(e)
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg = error_data.get('message', error_msg)
                except:
                    pass
            
            payment.status = PaymentModel.Status.FAILED
            payment.failure_reason = error_msg
            payment.save()
            
            return {
                'success': False,
                'error': error_msg,
                'payment_id': payment.id
            }
    
    def check_payment_status(self, payment):
        """
        Check payment status from ClickPesa
        
        Args:
            payment: Payment model instance
        
        Returns:
            dict: Payment status information
        """
        if not payment.clickpesa_payment_id:
            return {'success': False, 'error': 'No ClickPesa payment ID'}
        
        endpoint = f"{self.BASE_URL}/payments/{payment.clickpesa_payment_id}"
        headers = self._get_headers()
        
        try:
            response = requests.get(endpoint, headers=headers, timeout=30)
            response.raise_for_status()
            
            response_data = response.json()
            self._update_payment_status(payment, response_data)
            
            return {
                'success': True,
                'data': response_data
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _update_payment_status(self, payment, clickpesa_data):
        """Update payment status based on ClickPesa response"""
        clickpesa_status = clickpesa_data.get('status', '').upper()
        
        status_mapping = {
            'PENDING': PaymentModel.Status.PENDING,
            'PROCESSING': PaymentModel.Status.PROCESSING,
            'COMPLETED': PaymentModel.Status.COMPLETED,
            'SUCCESS': PaymentModel.Status.COMPLETED,
            'FAILED': PaymentModel.Status.FAILED,
            'CANCELLED': PaymentModel.Status.CANCELLED,
        }
        
        if clickpesa_status in status_mapping:
            payment.status = status_mapping[clickpesa_status]
            
            # Update transaction ID if available
            if clickpesa_data.get('transaction_id'):
                payment.transaction_id = clickpesa_data['transaction_id']
            
            # Handle failure reason
            if clickpesa_status in ['FAILED', 'CANCELLED']:
                payment.failure_reason = clickpesa_data.get('failure_reason', 'Payment failed')
            
            payment.save()
            
            # Update order payment status
            if payment.status == Payment.Status.COMPLETED:
                payment.order.payment_status = payment.order.PaymentStatus.PAID
            elif payment.status == Payment.Status.FAILED:
                payment.order.payment_status = payment.order.PaymentStatus.PAYMENT_FAILED
            
            payment.order.save()
    
    def process_webhook(self, webhook_data):
        """
        Process webhook notification from ClickPesa
        
        Args:
            webhook_data: Webhook payload from ClickPesa
        
        Returns:
            dict: Processing result
        """
        try:
            payment_id = webhook_data.get('payment_id')
            if not payment_id:
                return {'success': False, 'error': 'No payment ID in webhook'}
            
            # Find payment by ClickPesa payment ID
            payment = Payment.objects.filter(clickpesa_payment_id=payment_id).first()
            if not payment:
                return {'success': False, 'error': 'Payment not found'}
            
            # Update payment status
            self._update_payment_status(payment, webhook_data)
            
            return {
                'success': True,
                'payment_id': payment.id,
                'status': payment.status
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }



2.GraphQL Schema:

stationary_backend/stationary_orders/schema.py 


import graphene
from graphene_django import DjangoObjectType
from graphene.types import JSONString
from stationary_orders.models import Payment, Order, OrderItem, GuestCustomer
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
from .clickpesa_service import ClickPesaService

# ------------------------------
# Types
# ------------------------------

class GuestCustomerType(DjangoObjectType):
    class Meta:
        model = GuestCustomer
        fields = "__all__"

class PaymentType(DjangoObjectType):
    class Meta:
        model = Payment
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

class PaymentInput(graphene.InputObjectType):
    payment_method = graphene.String(required=True)
    phone_number = graphene.String(required=True)

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
        payment = graphene.Argument(PaymentInput, required=False)

    response = graphene.Field(ResponseObject)
    order = graphene.Field(OrderType)
    payment = graphene.Field(PaymentType)

    def mutate(self, info, shop_id, guest_customer, items, payment_option=None, payment=None):
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

            # Validate payment if provided
            payment_obj = None
            if payment:
                # Validate payment method
                valid_methods = [choice[0] for choice in Payment.PaymentMethod.choices]
                if payment.payment_method not in valid_methods:
                    return CreateGuestOrderMutation(response=build_error(f'Invalid payment method. Valid methods: {valid_methods}'))

                # Validate phone number
                if not payment.phone_number or not payment.phone_number.strip():
                    return CreateGuestOrderMutation(response=build_error('Phone number is required for payment'))

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
                
                # Set payment status based on whether payment is provided
                payment_status = Order.PaymentStatus.PENDING_PAYMENT.value if payment else Order.PaymentStatus.UNPAID.value
                
                order = Order.objects.create(
                    customer=None,  # No registered customer
                    guest_customer=guest_customer_obj,
                    shop=shop,
                    status=Order.Status.UPLOADED.value,
                    payment_option=payment_option,
                    payment_status=payment_status,
                    total_price=total_order_price,
                    commission_fee=commission
                )
                
                # Create payment record if payment is provided
                if payment:
                    payment_obj = Payment.objects.create(
                        order=order,
                        payment_method=payment.payment_method,
                        amount=total_order_price,
                        phone_number=payment.phone_number,
                        status=Payment.Status.PENDING
                    )
                    
                    # Initiate payment with ClickPesa
                    clickpesa_service = ClickPesaService()
                    payment_result = clickpesa_service.initiate_mobile_money_payment(
                        payment_obj, payment.phone_number, payment.payment_method
                    )
                    
                    if not payment_result['success']:
                        # If payment initiation fails, delete order and return error
                        order.delete()
                        return CreateGuestOrderMutation(response=build_error(f"Payment initiation failed: {payment_result['error']}"))
                
                for data in order_items_data:
                    OrderItem.objects.create(
                        order=order,
                        document=data["document"],
                        price=data["price"],
                        page_count=data["page_count"],
                        config_snapshot=data["config_snapshot"]
                    )

            return CreateGuestOrderMutation(
                response=build_success_response("Guest order placed successfully" + (" and payment initiated" if payment else "")),
                order=order,
                payment=payment_obj
            )

        except Shop.DoesNotExist:
            return CreateGuestOrderMutation(response=build_error("Shop not found"))
        except Document.DoesNotExist:
            return CreateGuestOrderMutation(response=build_error("Document not found"))
        except Exception as e:
            return CreateGuestOrderMutation(response=build_error(str(e)))

class CreateOrderMutation(graphene.Mutation):
    allow_any = True  # Allow unauthenticated access
    
    class Arguments:
        shop_id = graphene.UUID(required=True)
        items = graphene.List(OrderItemInput, required=True)
        payment = graphene.Argument(PaymentInput, required=True)

    response = graphene.Field(ResponseObject)
    order = graphene.Field(OrderType)
    payment = graphene.Field(PaymentType)

    def mutate(self, info, shop_id, items, payment):
        user = info.context.user
        print(f'Debug - GraphQL User: {user}')
        print(f'Debug - User is_authenticated: {user.is_authenticated if user else "No user"}')
        print(f'Debug - User type: {type(user)}')
        print(f'Debug - Context type: {type(info.context)}')
        print(f'Debug - Has user attribute: {hasattr(info.context, "user")}')
        
        # Allow unauthenticated access since allow_any = True
        # if not user.is_authenticated:
        #     return CreateOrderMutation(response=build_error("Authentication required"))

        # Validate payment method
        valid_methods = [choice[0] for choice in Payment.PaymentMethod.choices]
        if payment.payment_method not in valid_methods:
            return CreateOrderMutation(response=build_error(f'Invalid payment method. Valid methods: {valid_methods}'))

        # Validate phone number
        if not payment.phone_number or not payment.phone_number.strip():
            return CreateOrderMutation(response=build_error('Phone number is required'))

        try:
            shop = Shop.objects.get(id=shop_id)
            if not shop.is_accepting_orders:
                 return CreateOrderMutation(response=build_error("Shop is not currently accepting orders"))

            # Validations and calculations
            order_items_data = []
            total_order_price = Decimal("0.00")
            
            # Pre-calculation loop
            for item in items:
                price = calculate_item_price(shop, item, user=user if user.is_authenticated else None)
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
                    customer=user if user.is_authenticated else None,
                    shop=shop,
                    status=Order.Status.UPLOADED.value,
                    payment_status=Order.PaymentStatus.PENDING_PAYMENT.value,
                    total_price=total_order_price,
                    commission_fee=commission
                )
                
                # Create payment record
                payment_obj = Payment.objects.create(
                    order=order,
                    payment_method=payment.payment_method,
                    amount=total_order_price,
                    phone_number=payment.phone_number,
                    status=Payment.Status.PENDING
                )
                
                # Initiate payment with ClickPesa
                clickpesa_service = ClickPesaService()
                payment_result = clickpesa_service.initiate_mobile_money_payment(
                    payment_obj, payment.phone_number, payment.payment_method
                )
                
                if not payment_result['success']:
                    # If payment initiation fails, delete order and return error
                    order.delete()
                    return CreateOrderMutation(response=build_error(f"Payment initiation failed: {payment_result['error']}"))
                
                for data in order_items_data:
                    OrderItem.objects.create(
                        order=order,
                        document=data["document"],
                        price=data["price"],
                        page_count=data["page_count"],
                        config_snapshot=data["config_snapshot"]
                    )

            return CreateOrderMutation(
                response=build_success_response("Order placed successfully and payment initiated"),
                order=order,
                payment=payment_obj
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
    payment_status = graphene.Field(PaymentType, payment_id=graphene.UUID(required=True))

    def resolve_payment_status(self, info, payment_id):
        user = info.context.user
        try:
            # Allow payment status check for both authenticated and unauthenticated users
            # as long as they have the payment ID
            payment = Payment.objects.get(id=payment_id)
            
            # Additional security: only allow if user owns the order or is guest
            if user.is_authenticated:
                if payment.order.customer != user:
                    return None
            else:
                # For unauthenticated users, check if it's a guest order
                if not payment.order.guest_customer:
                    return None
            
            return payment
            
        except Payment.DoesNotExist:
            return None

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




3.API Views:

stationary_backend/stationary_orders/views.py


from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
import json
import logging

from .models import Payment, Order
from .clickpesa_service import ClickPesaService

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    """
    Initiate payment for an order using ClickPesa
    """
    try:
        data = request.data
        
        # Validate required fields
        order_id = data.get('order_id')
        payment_method = data.get('payment_method')
        phone_number = data.get('phone_number')
        
        if not all([order_id, payment_method, phone_number]):
            return Response({
                'error': 'Missing required fields: order_id, payment_method, phone_number'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate payment method
        valid_methods = [choice[0] for choice in Payment.PaymentMethod.choices]
        if payment_method not in valid_methods:
            return Response({
                'error': f'Invalid payment method. Valid methods: {valid_methods}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get order and verify ownership
        try:
            order = Order.objects.get(id=order_id, customer=request.user)
        except Order.DoesNotExist:
            return Response({
                'error': 'Order not found or access denied'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if payment already exists
        if hasattr(order, 'payment'):
            return Response({
                'error': 'Payment already initiated for this order',
                'payment_id': order.payment.id
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create payment record
        payment = Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=order.total_price,
            phone_number=phone_number
        )
        
        # Initiate payment with ClickPesa
        clickpesa_service = ClickPesaService()
        result = clickpesa_service.initiate_mobile_money_payment(
            payment, phone_number, payment_method
        )
        
        if result['success']:
            return Response({
                'success': True,
                'message': 'Payment initiated successfully',
                'payment_id': payment.id,
                'payment_status': payment.status,
                'clickpesa_payment_id': payment.clickpesa_payment_id,
                'reference_number': payment.reference_number,
                'amount': float(payment.amount),
                'phone_number': payment.phone_number
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': result['error'],
                'payment_id': payment.id
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Payment initiation error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_payment_status(request, payment_id):
    """
    Check payment status
    """
    try:
        # Get payment and verify ownership
        try:
            payment = Payment.objects.get(
                id=payment_id, 
                order__customer=request.user
            )
        except Payment.DoesNotExist:
            return Response({
                'error': 'Payment not found or access denied'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check status with ClickPesa
        clickpesa_service = ClickPesaService()
        result = clickpesa_service.check_payment_status(payment)
        
        if result['success']:
            return Response({
                'success': True,
                'payment_status': payment.status,
                'payment_method': payment.payment_method,
                'amount': float(payment.amount),
                'transaction_id': payment.transaction_id,
                'reference_number': payment.reference_number,
                'failure_reason': payment.failure_reason,
                'created_at': payment.created_at,
                'updated_at': payment.updated_at
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': result['error'],
                'payment_status': payment.status
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Payment status check error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_methods(request):
    """
    Get available payment methods
    """
    try:
        payment_methods = [
            {
                'code': choice[0],
                'name': choice[1],
                'description': get_payment_method_description(choice[0])
            }
            for choice in Payment.PaymentMethod.choices
        ]
        
        return Response({
            'success': True,
            'payment_methods': payment_methods
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Get payment methods error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@require_http_methods(["POST"])
def clickpesa_webhook(request):
    """
    Webhook endpoint for ClickPesa payment notifications
    """
    try:
        # Parse webhook data
        try:
            webhook_data = json.loads(request.body)
        except json.JSONDecodeError:
            logger.error("Invalid JSON in webhook payload")
            return Response({
                'error': 'Invalid JSON'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Process webhook
        clickpesa_service = ClickPesaService()
        result = clickpesa_service.process_webhook(webhook_data)
        
        if result['success']:
            logger.info(f"Webhook processed successfully for payment {result['payment_id']}")
            return Response({
                'success': True,
                'message': 'Webhook processed successfully'
            }, status=status.HTTP_200_OK)
        else:
            logger.error(f"Webhook processing failed: {result['error']}")
            return Response({
                'error': result['error']
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_payment_method_description(method_code):
    """Get description for payment method"""
    descriptions = {
        'MPESA': 'M-Pesa mobile money transfer',
        'TIGOPESA': 'Tigo Pesa mobile money transfer',
        'AIRTELMONEY': 'Airtel Money mobile money transfer',
        'HALOPESA': 'Halopesa mobile money transfer',
        'CARD': 'Credit/Debit card payment'
    }
    return descriptions.get(method_code, 'Payment method')


