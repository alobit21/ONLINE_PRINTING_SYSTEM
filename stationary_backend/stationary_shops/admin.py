from django.contrib import admin
from .models import Shop, ShopPricing, PageRangeDiscount

class ShopPricingInline(admin.TabularInline):
    model = ShopPricing
    extra = 1

class PageRangeDiscountInline(admin.TabularInline):
    model = PageRangeDiscount
    extra = 1

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'get_location', 'is_verified', 'is_accepting_orders', 'subscription_tier', 'rating')
    list_filter = ('is_verified', 'is_accepting_orders', 'subscription_tier')
    search_fields = ('name', 'owner__email', 'address')
    inlines = [ShopPricingInline, PageRangeDiscountInline]
    
    def get_location(self, obj):
        return f"{obj.latitude:.4f}, {obj.longitude:.4f}"
    get_location.short_description = 'Location'

@admin.register(ShopPricing)
class ShopPricingAdmin(admin.ModelAdmin):
    list_display = ('shop', 'service_type', 'base_price')
    list_filter = ('service_type', 'shop')
    search_fields = ('shop__name',)

@admin.register(PageRangeDiscount)
class PageRangeDiscountAdmin(admin.ModelAdmin):
    list_display = ('shop', 'min_pages', 'max_pages', 'discount_percent')
    list_filter = ('shop',)
