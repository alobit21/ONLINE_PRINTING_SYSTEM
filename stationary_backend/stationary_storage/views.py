from django.http import FileResponse, Http404, HttpResponseForbidden, JsonResponse
from django.core.files.storage import default_storage
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from .models import Document
import mimetypes
import os
from graphql_jwt.utils import jwt_decode, get_payload
from django.contrib.auth import get_user_model

User = get_user_model()

def authenticate_jwt_request(request):
    """
    Authenticate JWT token from Authorization header and set request.user
    Returns True if authenticated, False otherwise
    """
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    
    if not auth_header or not auth_header.startswith('JWT '):
        return False
    
    token = auth_header[4:]  # Remove 'JWT ' prefix
    
    try:
        payload = jwt_decode(token)
        user = User.objects.get(id=payload['user_id'])
        request.user = user
        return True
    except Exception:
        return False

@require_GET
@csrf_exempt
def document_view(request, document_id):
    """
    Serve document for inline viewing (opens in browser)
    GET /api/documents/<id>/view/
    """
    try:
        # Check JWT authentication
        if not authenticate_jwt_request(request):
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        # Get document and verify ownership
        document = get_object_or_404(Document, id=document_id)
        
        # Check user permissions
        if not _has_document_access(request.user, document):
            return HttpResponseForbidden("You don't have permission to access this document")
        
        # Validate file path
        if not document.file.name:
            raise Http404("File not found")
        
        # Check if file exists
        if not default_storage.exists(document.file.name):
            raise Http404("File not found on server")
        
        # Determine content type
        content_type = document.file_type or mimetypes.guess_type(document.file_name)[0] or 'application/octet-stream'
        
        # Open and serve file
        file_handle = default_storage.open(document.file.name, 'rb')
        response = FileResponse(file_handle, content_type=content_type)
        
        # Set headers for inline viewing
        response['Content-Disposition'] = f'inline; filename="{document.file_name}"'
        response['Content-Length'] = document.file_size
        response['Cache-Control'] = 'private, max-age=3600'
        response['X-Content-Type-Options'] = 'nosniff'
        
        return response
        
    except Http404:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error serving document {document_id}: {str(e)}")
        raise Http404("File not found")

@require_GET
@csrf_exempt
def document_download(request, document_id):
    """
    Serve document for download (as attachment)
    GET /api/documents/<id>/download/
    """
    try:
        # Check JWT authentication
        if not authenticate_jwt_request(request):
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        # Get document and verify ownership
        document = get_object_or_404(Document, id=document_id)
        
        # Check user permissions
        if not _has_document_access(request.user, document):
            return HttpResponseForbidden("You don't have permission to access this document")
        
        # Validate file path
        if not document.file.name:
            raise Http404("File not found")
        
        # Check if file exists
        if not default_storage.exists(document.file.name):
            raise Http404("File not found on server")
        
        # Determine content type
        content_type = document.file_type or mimetypes.guess_type(document.file_name)[0] or 'application/octet-stream'
        
        # Open and serve file
        file_handle = default_storage.open(document.file.name, 'rb')
        response = FileResponse(file_handle, as_attachment=True, filename=document.file_name)
        
        # Set headers for download
        response['Content-Type'] = content_type
        response['Content-Length'] = document.file_size
        response['Cache-Control'] = 'private, max-age=3600'
        response['X-Content-Type-Options'] = 'nosniff'
        
        return response
        
    except Http404:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error downloading document {document_id}: {str(e)}")
        raise Http404("File not found")

def _has_document_access(user, document):
    """
    Check if user has permission to access document
    - Owner can always access
    - Users with order items containing the document can access
    - Staff/superusers can access everything
    """
    # Owner can always access
    if document.owner == user:
        return True
    
    # Staff/superusers can access everything
    if user.is_staff or user.is_superuser:
        return True
    
    # Check if user has access through order items (as customer)
    try:
        from stationary_orders.models import OrderItem
        has_order_access = OrderItem.objects.filter(
            document=document,
            order__customer=user
        ).exists()
        
        if has_order_access:
            return True
    except:
        pass
    
    # Check if user has access through shop (as shop owner)
    try:
        from stationary_shops.models import Shop
        from stationary_orders.models import OrderItem
        
        shop_orders_with_document = OrderItem.objects.filter(
            document=document
        ).values_list('order__shop', flat=True).distinct()
        
        user_shops = Shop.objects.filter(
            id__in=shop_orders_with_document,
            owner=user
        ).exists()
        
        if user_shops:
            return True
    except:
        pass
    
    return False
