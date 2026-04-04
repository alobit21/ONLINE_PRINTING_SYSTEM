from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
import json
import logging
from django.http import JsonResponse



from .models import Payment, Order
from .clickpesa_service import ClickPesaService

logger = logging.getLogger(__name__)



@csrf_exempt
@require_http_methods(["POST"])
def clickpesa_webhook(request):
    try:
        webhook_data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    clickpesa_service = ClickPesaService()
    result = clickpesa_service.process_webhook(webhook_data)

    if result['success']:
        return JsonResponse({'success': True}, status=200)
    else:
        return JsonResponse({'error': result['error']}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_payment_status(request, payment_id):
    """
    Check payment status
    """
    try:
        # Get payment and verify ownership
        try:
            payment = Payment.objects.get(
                id=payment_id, 
                order__customer=request.user
            )
        except Payment.DoesNotExist:
            return Response({
                'error': 'Payment not found or access denied'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check status with ClickPesa
        clickpesa_service = ClickPesaService()
        result = clickpesa_service.check_payment_status(payment)
        
        if result['success']:
            return Response({
                'success': True,
                'payment_status': payment.status,
                'payment_method': payment.payment_method,
                'amount': float(payment.amount),
                'transaction_id': payment.transaction_id,
                'reference_number': payment.reference_number,
                'failure_reason': payment.failure_reason,
                'created_at': payment.created_at,
                'updated_at': payment.updated_at
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': result['error'],
                'payment_status': payment.status
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Payment status check error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_methods(request):
    """
    Get available payment methods
    """
    try:
        payment_methods = [
            {
                'code': choice[0],
                'name': choice[1],
                'description': get_payment_method_description(choice[0])
            }
            for choice in Payment.PaymentMethod.choices
        ]
        
        return Response({
            'success': True,
            'payment_methods': payment_methods
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Get payment methods error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@require_http_methods(["POST"])
def clickpesa_webhook(request):
    """
    Webhook endpoint for ClickPesa payment notifications
    """
    try:
        # Parse webhook data
        try:
            webhook_data = json.loads(request.body)
        except json.JSONDecodeError:
            logger.error("Invalid JSON in webhook payload")
            return Response({
                'error': 'Invalid JSON'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Process webhook
        clickpesa_service = ClickPesaService()
        result = clickpesa_service.process_webhook(webhook_data)
        
        if result['success']:
            logger.info(f"Webhook processed successfully for payment {result['payment_id']}")
            return Response({
                'success': True,
                'message': 'Webhook processed successfully'
            }, status=status.HTTP_200_OK)
        else:
            logger.error(f"Webhook processing failed: {result['error']}")
            return Response({
                'error': result['error']
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_payment_method_description(method_code):
    """Get description for payment method"""
    descriptions = {
        'MPESA': 'M-Pesa mobile money transfer',
        'TIGOPESA': 'Tigo Pesa mobile money transfer',
        'AIRTELMONEY': 'Airtel Money mobile money transfer',
        'HALOPESA': 'Halopesa mobile money transfer',
        'CARD': 'Credit/Debit card payment'
    }
    return descriptions.get(method_code, 'Payment method')
