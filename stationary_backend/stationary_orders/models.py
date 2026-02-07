from django.db import models
from django.conf import settings
from stationary_core.models import BaseModel
from stationary_shops.models import Shop
from stationary_storage.models import Document

class Order(BaseModel):
    class Status(models.TextChoices):
        UPLOADED = "UPLOADED", "Uploaded"
        ACCEPTED = "ACCEPTED", "Accepted"
        PRINTING = "PRINTING", "Printing"
        READY = "READY", "Ready"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UPLOADED)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Final calculated price")
    commission_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Tracking
    estimated_completion_time = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    document = models.ForeignKey(Document, on_delete=models.PROTECT, related_name='order_items')
    # Configuration snapshot for this item at time of order
    config_snapshot = models.JSONField(help_text="Print configuration (color, size, binding, etc.)")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    page_count = models.PositiveIntegerField()
