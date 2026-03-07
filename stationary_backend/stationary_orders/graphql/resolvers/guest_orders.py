import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q
from ..models import Order, GuestCustomer
from ..types import OrderType

class GuestContactInput(graphene.InputObjectType):
    email = graphene.String(required=False)
    whatsapp_number = graphene.String(required=False)

class GuestOrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'status', 'total_amount', 'created_at', 'delivery_date',
            'shop', 'items', 'customer_info', 'tracking_info'
        )

class Query(graphene.ObjectType):
    guest_orders = graphene.List(
        GuestOrderType,
        contact_info=GuestContactInput(required=True)
    )

    def resolve_guest_orders(self, info, contact_info):
        """
        Resolve guest orders based on contact information (email or WhatsApp number)
        """
        if not contact_info:
            return Order.objects.none()

        email = contact_info.get('email')
        whatsapp_number = contact_info.get('whatsapp_number')

        # Build query filters
        filters = Q(is_guest_order=True)

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

        return orders
