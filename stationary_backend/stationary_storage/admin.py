from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'owner', 'file_type', 'human_readable_size', 'created_at', 'is_scanned', 'virus_detected')
    list_filter = ('is_scanned', 'virus_detected', 'created_at')
    search_fields = ('file_name', 'owner__email')
    readonly_fields = ('file_size', 'created_at', 'updated_at')
    
    def human_readable_size(self, obj):
        if not obj.file_size: return "0 B"
        size = obj.file_size
        power = 2**10
        n = 0
        power_labels = {0 : 'B', 1: 'KB', 2: 'MB', 3: 'GB', 4: 'TB'}
        while size >= power:
            size /= power
            n += 1
        return f"{size:.2f} {power_labels[n]}"
    human_readable_size.short_description = 'Size'
