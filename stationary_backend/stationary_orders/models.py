from django.db import models
from django.conf import settings
from stationary_core.models import BaseModel
from stationary_shops.models import Shop
from stationary_storage.models import Document
import uuid

class Payment(BaseModel):
    class PaymentMethod(models.TextChoices):
        MPESA = "MPESA", "M-Pesa"
        TIGOPESA = "TIGOPESA", "Tigo Pesa"
        AIRTELMONEY = "AIRTELMONEY", "Airtel Money"
        HALOPESA = "HALOPESA", "Halopesa"
        CARD = "CARD", "Card"
    
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PROCESSING = "PROCESSING", "Processing"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"
        CANCELLED = "CANCELLED", "Cancelled"
    
    order = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING.value)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    reference_number = models.CharField(max_length=100, null=True, blank=True)
    clickpesa_payment_id = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    failure_reason = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']

class GuestCustomer(BaseModel):
    """Temporary customer information for guest checkout"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, help_text="Customer's full name")
    whatsapp_number = models.CharField(max_length=20, help_text="WhatsApp number for communication")
    email = models.EmailField(blank=True, null=True, help_text="Optional email for order confirmation")
    
    # Metadata for tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.whatsapp_number})"

class Order(BaseModel):
    class Status(models.TextChoices):
        UPLOADED = "UPLOADED", "Uploaded"
        ACCEPTED = "ACCEPTED", "Accepted"
        PRINTING = "PRINTING", "Printing"
        READY = "READY", "Ready"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"
    
    class PaymentOption(models.TextChoices):
        PAY_BEFORE = "PAY_BEFORE", "Pay Before Service"
        PAY_AFTER = "PAY_AFTER", "Pay After Service"
    
    class PaymentStatus(models.TextChoices):
        UNPAID = "UNPAID", "Unpaid"
        PENDING_PAYMENT = "PENDING_PAYMENT", "Pending Payment"
        PAID = "PAID", "Paid"
        PAYMENT_FAILED = "PAYMENT_FAILED", "Payment Failed"

    # Customer information - either registered user or guest
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='orders', 
        null=True, 
        blank=True,
        help_text="Registered customer (null for guest orders)"
    )
    guest_customer = models.ForeignKey(
        GuestCustomer, 
        on_delete=models.SET_NULL, 
        related_name='orders', 
        null=True, 
        blank=True,
        help_text="Guest customer information (null for registered user orders)"
    )
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UPLOADED.value)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.UNPAID.value)
    payment_option = models.CharField(max_length=20, choices=PaymentOption.choices, default=PaymentOption.PAY_BEFORE.value, help_text="Payment preference")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Final calculated price")
    commission_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Tracking
    estimated_completion_time = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
    
    @property
    def customer_info(self):
        """Returns customer information regardless of user type"""
        if self.customer:
            return {
                'type': 'registered',
                'name': self.customer.get_full_name() or self.customer.email,
                'email': self.customer.email,
                'phone': self.customer.phone_number,
                'id': str(self.customer.id)
            }
        elif self.guest_customer:
            return {
                'type': 'guest',
                'name': self.guest_customer.name,
                'email': self.guest_customer.email,
                'phone': self.guest_customer.whatsapp_number,
                'id': str(self.guest_customer.id)
            }
        return None
    
    @property
    def is_guest_order(self):
        """Check if this is a guest order"""
        return self.guest_customer is not None
    
    def clean(self):
        """Ensure either customer or guest_customer is set, but not both"""
        if self.customer and self.guest_customer:
            raise ValueError("Order cannot have both a registered customer and a guest customer")
        if not self.customer and not self.guest_customer:
            raise ValueError("Order must have either a registered customer or a guest customer")

class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    document = models.ForeignKey(Document, on_delete=models.PROTECT, related_name='order_items')
    # Configuration snapshot for this item at time of order
    config_snapshot = models.JSONField(help_text="Print configuration (color, size, binding, etc.)")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    page_count = models.PositiveIntegerField()
