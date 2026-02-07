from django.db import models
from django.conf import settings
from stationary_core.models import BaseModel

class Document(BaseModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='secure_uploads/')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, blank=True, help_text="MIME type")
    file_size = models.PositiveIntegerField(help_text="Size in bytes")
    is_scanned = models.BooleanField(default=False)
    virus_detected = models.BooleanField(default=False)

    def __str__(self):
        return self.file_name
