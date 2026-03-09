import requests
import hashlib
import hmac
import json
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from .models import Payment
from .models import Payment as PaymentModel


class ClickPesaService:
    """
    ClickPesa API integration service for mobile money payments
    """
    
    BASE_URL = "https://api.clickpesa.com/v1"
    
    def __init__(self):
        self.client_id = settings.CLICKPESA_CLIENT_ID
        self.api_key = settings.CLICKPESA_API_KEY
        self.secret_key = getattr(settings, 'CLICKPESA_SECRET_KEY', '')
    
    def _generate_checksum(self, payload):
        """Generate checksum for API request validation"""
        if not self.secret_key:
            return None
        
        # Convert payload to JSON string and sort keys
        payload_str = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        
        # Generate HMAC-SHA256 checksum
        checksum = hmac.new(
            self.secret_key.encode('utf-8'),
            payload_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return checksum
    
    def _get_headers(self, checksum=None):
        """Get request headers with authentication"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
            'X-Client-Id': self.client_id,
        }
        
        if checksum:
            headers['X-Checksum'] = checksum
        
        return headers
    
    def initiate_mobile_money_payment(self, payment, phone_number, payment_method):
        """
        Initiate mobile money payment via ClickPesa
        
        Args:
            payment: Payment model instance
            phone_number: Customer phone number
            payment_method: Payment method (MPESA, TIGOPESA, etc.)
        
        Returns:
            dict: API response
        """
        endpoint = f"{self.BASE_URL}/payments/mobile-money"
        
        payload = {
            'amount': float(payment.amount),
            'currency': 'TZS',  # Tanzanian Shillings
            'payment_method': payment_method,
            'phone_number': phone_number,
            'reference': f"ORDER-{payment.order.id}",
            'callback_url': f"{settings.BASE_URL}/api/payments/webhook/clickpesa/",
            'description': f"Payment for order #{payment.order.id}",
        }
        
        # Generate checksum if secret key is configured
        checksum = self._generate_checksum(payload)
        headers = self._get_headers(checksum)
        
        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            
            response_data = response.json()
            
            # Update payment with ClickPesa details
            payment.clickpesa_payment_id = response_data.get('id')
            payment.reference_number = response_data.get('reference')
            payment.phone_number = phone_number
            payment.status = PaymentModel.Status.PROCESSING
            payment.save()
            
            # Update order payment status
            payment.order.payment_status = payment.order.PaymentStatus.PENDING_PAYMENT
            payment.order.save()
            
            return {
                'success': True,
                'data': response_data,
                'payment_id': payment.id
            }
            
        except requests.exceptions.RequestException as e:
            error_msg = str(e)
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg = error_data.get('message', error_msg)
                except:
                    pass
            
            payment.status = PaymentModel.Status.FAILED
            payment.failure_reason = error_msg
            payment.save()
            
            return {
                'success': False,
                'error': error_msg,
                'payment_id': payment.id
            }
    
    def check_payment_status(self, payment):
        """
        Check payment status from ClickPesa
        
        Args:
            payment: Payment model instance
        
        Returns:
            dict: Payment status information
        """
        if not payment.clickpesa_payment_id:
            return {'success': False, 'error': 'No ClickPesa payment ID'}
        
        endpoint = f"{self.BASE_URL}/payments/{payment.clickpesa_payment_id}"
        headers = self._get_headers()
        
        try:
            response = requests.get(endpoint, headers=headers, timeout=30)
            response.raise_for_status()
            
            response_data = response.json()
            self._update_payment_status(payment, response_data)
            
            return {
                'success': True,
                'data': response_data
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _update_payment_status(self, payment, clickpesa_data):
        """Update payment status based on ClickPesa response"""
        clickpesa_status = clickpesa_data.get('status', '').upper()
        
        status_mapping = {
            'PENDING': PaymentModel.Status.PENDING,
            'PROCESSING': PaymentModel.Status.PROCESSING,
            'COMPLETED': PaymentModel.Status.COMPLETED,
            'SUCCESS': PaymentModel.Status.COMPLETED,
            'FAILED': PaymentModel.Status.FAILED,
            'CANCELLED': PaymentModel.Status.CANCELLED,
        }
        
        if clickpesa_status in status_mapping:
            payment.status = status_mapping[clickpesa_status]
            
            # Update transaction ID if available
            if clickpesa_data.get('transaction_id'):
                payment.transaction_id = clickpesa_data['transaction_id']
            
            # Handle failure reason
            if clickpesa_status in ['FAILED', 'CANCELLED']:
                payment.failure_reason = clickpesa_data.get('failure_reason', 'Payment failed')
            
            payment.save()
            
            # Update order payment status
            if payment.status == Payment.Status.COMPLETED:
                payment.order.payment_status = payment.order.PaymentStatus.PAID
            elif payment.status == Payment.Status.FAILED:
                payment.order.payment_status = payment.order.PaymentStatus.PAYMENT_FAILED
            
            payment.order.save()
    
    def process_webhook(self, webhook_data):
        """
        Process webhook notification from ClickPesa
        
        Args:
            webhook_data: Webhook payload from ClickPesa
        
        Returns:
            dict: Processing result
        """
        try:
            payment_id = webhook_data.get('payment_id')
            if not payment_id:
                return {'success': False, 'error': 'No payment ID in webhook'}
            
            # Find payment by ClickPesa payment ID
            payment = Payment.objects.filter(clickpesa_payment_id=payment_id).first()
            if not payment:
                return {'success': False, 'error': 'Payment not found'}
            
            # Update payment status
            self._update_payment_status(payment, webhook_data)
            
            return {
                'success': True,
                'payment_id': payment.id,
                'status': payment.status
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
