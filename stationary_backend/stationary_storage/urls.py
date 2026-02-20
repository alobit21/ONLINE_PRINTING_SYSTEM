from django.urls import path
from . import views
from . import rest_api

app_name = 'storage'

urlpatterns = [
    # File serving endpoints
    path('files/<uuid:document_id>/', views.serve_file, name='serve_file'),
    path('files/dev/<uuid:document_id>/', views.serve_file_dev, name='serve_file_dev'),
    path('files/<uuid:document_id>/check/', views.check_file_exists, name='check_file_exists'),
    
    # REST API endpoints
    path('upload/', rest_api.MediaUploadView.as_view(), name='media_upload'),
    path('upload/dev/', rest_api.MediaUploadViewDev.as_view(), name='media_upload_dev'),
    path('media/', rest_api.MediaListView.as_view(), name='media_list'),
    path('media/<uuid:document_id>/', rest_api.MediaDetailView.as_view(), name='media_detail'),
    path('presigned-upload/', rest_api.create_presigned_upload, name='presigned_upload'),
]
