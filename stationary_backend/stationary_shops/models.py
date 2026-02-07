from django.db import models
from django.conf import settings
from stationary_core.models import BaseModel

class Shop(BaseModel):
    class Subscription(models.TextChoices):
        STARTER = "STARTER", "Starter"
        PRO = "PRO", "Pro"
        BUSINESS = "BUSINESS", "Business"

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shops')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    address = models.TextField()
    banner = models.ImageField(upload_to='shop_banners/', blank=True, null=True)
    
    # Geo-location
    latitude = models.FloatField(help_text="Latitude coordinate")
    longitude = models.FloatField(help_text="Longitude coordinate")
    
    is_verified = models.BooleanField(default=False)
    is_accepting_orders = models.BooleanField(default=True)
    
    subscription_tier = models.CharField(
        max_length=20, 
        choices=Subscription.choices, 
        default=Subscription.STARTER
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    
    # Configuration
    queue_capacity = models.PositiveIntegerField(default=10)
    operating_hours = models.JSONField(default=dict, blank=True, help_text="Structured operating hours")
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Override system commission rate")

    def __str__(self):
        return self.name

class ServiceType(models.TextChoices):
    PRINTING_BW = "PRINTING_BW", "Black & White Printing"
    PRINTING_COLOR = "PRINTING_COLOR", "Color Printing"
    BINDING = "BINDING", "Binding"
    LAMINATION = "LAMINATION", "Lamination"
    SCANNIG = "SCANNING", "Scanning"

class ShopPricing(BaseModel):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='pricing_rules')
    service_type = models.CharField(max_length=50, choices=ServiceType.choices)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    # Flexible JSON for modifiers (e.g., {'A3': 1.5, 'legal': 1.2})
    modifiers = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ('shop', 'service_type')

class PageRangeDiscount(BaseModel):
    """
    Global or Shop-specific page range discounts.
    If shop is null, it's a global default.
    """
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='page_discounts', null=True, blank=True)
    min_pages = models.PositiveIntegerField()
    max_pages = models.PositiveIntegerField(null=True, blank=True) # None means infinity
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ['min_pages']
