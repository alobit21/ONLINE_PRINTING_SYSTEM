from django.urls import path
from . import views

app_name = 'stationary_orders'

urlpatterns = [
    # Payment endpoints
    path('api/payments/initiate/', views.initiate_payment, name='initiate_payment'),
    path('api/payments/status/<int:payment_id>/', views.check_payment_status, name='check_payment_status'),
    path('api/payments/methods/', views.get_payment_methods, name='get_payment_methods'),
    
    # Webhook endpoint (no authentication required)
    path('api/payments/webhook/clickpesa/', views.clickpesa_webhook, name='clickpesa_webhook'),
]
