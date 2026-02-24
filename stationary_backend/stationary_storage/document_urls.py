from django.urls import path
from . import views

app_name = 'documents'

urlpatterns = [
    path('<uuid:document_id>/view/', views.document_view, name='document_view'),
    path('<uuid:document_id>/download/', views.document_download, name='document_download'),
]
