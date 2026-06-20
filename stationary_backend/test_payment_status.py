import os
import sys
import django

sys.path.append('/home/tarxemo/ONLINE_PRINTING_SYSTEM/stationary_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stationary_config.settings')
django.setup()

from stationary_orders.models import Payment
from stationary_orders.clickpesa_service import ClickPesaService

payment = Payment.objects.order_by('-created_at').first()
print(f"Latest payment ID: {payment.id}, Status: {payment.status}")
print(f"ClickPesa ID: {payment.clickpesa_payment_id}")

service = ClickPesaService()
try:
    token = service.generate_token()
    import requests
    response = requests.get(
        f"{service.BASE_URL}/payments/{payment.clickpesa_payment_id}",
        headers=service._get_auth_headers(token)
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
