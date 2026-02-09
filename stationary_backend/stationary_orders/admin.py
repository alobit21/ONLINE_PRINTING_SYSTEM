from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('document', 'price', 'page_count', 'config_snapshot')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id_short', 'customer', 'shop', 'status', 'total_price', 'created_at', 'time_since_creation')
    list_filter = ('status', 'created_at', 'shop')
    search_fields = ('id', 'customer__email', 'shop__name')
    inlines = [OrderItemInline]
    readonly_fields = ('total_price', 'commission_fee', 'created_at', 'updated_at')
    
    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = 'ID'
    
    def time_since_creation(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at)
    time_since_creation.short_description = 'Created Since'

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'document_name', 'price', 'page_count')
    list_filter = ('order__shop',)
    
    def document_name(self, obj):
        return obj.document.file_name if obj.document else "Unknown"
