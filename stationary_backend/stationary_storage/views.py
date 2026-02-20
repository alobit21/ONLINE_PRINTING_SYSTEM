from django.http import HttpResponse, Http404, HttpResponseForbidden
from django.core.files.storage import default_storage
from django.core.exceptions import SuspiciousOperation
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Document
import mimetypes
import os

@api_view(['GET'])
def serve_file_dev(request, document_id):
    """
    Development-only file serving endpoint without authentication
    GET /api/storage/files/dev/:id/?download=1 (for download)
    GET /api/storage/files/dev/:id/ (for preview)
    """
    try:
        # Get document
        document = get_object_or_404(Document, id=document_id)
        
        # Security: Validate file path to prevent directory traversal
        if not document.file.name:
            raise Http404("File not found")
            
        # Ensure file is within allowed upload directory
        if not document.file.name.startswith('secure_uploads/') and not document.file.name.startswith('pending_upload/'):
            raise SuspiciousOperation("Invalid file path")
        
        # Check if file exists in storage
        if not default_storage.exists(document.file.name):
            # For development: create a mock file if it doesn't exist
            if document.file.name.startswith('pending_upload/'):
                # Create a simple text file for testing
                mock_content = f"This is a mock file for {document.file_name}\n\nFile Type: {document.file_type}\nFile Size: {document.file_size} bytes\nCreated: {document.created_at}\n\nThis is a placeholder file for development purposes."
                from django.core.files.base import ContentFile
                mock_file = ContentFile(mock_content.encode('utf-8'), name=document.file_name)
                default_storage.save(document.file.name, mock_file)
            else:
                raise Http404("File not found")
        
        # Determine content type
        content_type = document.file_type or mimetypes.guess_type(document.file_name)[0] or 'application/octet-stream'
        
        # Open file from storage
        file_handle = default_storage.open(document.file.name, 'rb')
        
        # Prepare response
        response = HttpResponse(file_handle, content_type=content_type)
        
        # Set content disposition based on query parameter
        is_download = request.GET.get('download', '0') == '1'
        if is_download:
            response['Content-Disposition'] = f'attachment; filename="{document.file_name}"'
        else:
            response['Content-Disposition'] = f'inline; filename="{document.file_name}"'
        
        # Set additional headers
        response['Content-Length'] = document.file_size
        response['Cache-Control'] = 'private, max-age=3600'  # Cache for 1 hour
        response['X-Content-Type-Options'] = 'nosniff'
        
        return response
        
    except Http404:
        raise
    except SuspiciousOperation:
        return HttpResponseForbidden("Invalid file access")
    except Exception as e:
        # Log error for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error serving file {document_id}: {str(e)}")
        raise Http404("File not found")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def serve_file(request, document_id):
    """
    Serve files for document preview and download
    GET /api/storage/files/:id/?download=1 (for download)
    GET /api/storage/files/:id/ (for preview)
    """
    try:
        # Get document and verify ownership
        document = get_object_or_404(Document, id=document_id)
        
        # Security: Check if user owns the document or has access via order
        if document.owner != request.user:
            # Check if user has access through order items (as customer)
            from stationary_orders.models import OrderItem
            has_order_access = OrderItem.objects.filter(
                document=document,
                order__customer=request.user
            ).exists()
            
            # Check if user has access through shop (as shop owner/employee)
            if not has_order_access:
                # For development: allow access if user is staff/superuser
                if request.user.is_staff or request.user.is_superuser:
                    has_order_access = True
                else:
                    # Check if user is associated with the shop that has the order
                    from stationary_shops.models import Shop
                    shop_orders_with_document = OrderItem.objects.filter(
                        document=document
                    ).values_list('order__shop', flat=True).distinct()
                    
                    user_shops = Shop.objects.filter(
                        id__in=shop_orders_with_document,
                        owner=request.user
                    ).exists()
                    
                    if user_shops:
                        has_order_access = True
            
            if not has_order_access:
                return HttpResponseForbidden(f"You don't have permission to access this file. Document owner: {document.owner.username}, Your user: {request.user.username}")
        
        # Security: Validate file path to prevent directory traversal
        if not document.file.name:
            raise Http404("File not found")
            
        # Ensure file is within allowed upload directory
        if not document.file.name.startswith('secure_uploads/'):
            raise SuspiciousOperation("Invalid file path")
        
        # Check if file exists in storage
        if not default_storage.exists(document.file.name):
            # For development: create a mock file if it doesn't exist
            if document.file.name.startswith('pending_upload/'):
                # Create a simple text file for testing
                mock_content = f"This is a mock file for {document.file_name}\n\nFile Type: {document.file_type}\nFile Size: {document.file_size} bytes\nCreated: {document.created_at}\n\nThis is a placeholder file for development purposes."
                from django.core.files.base import ContentFile
                mock_file = ContentFile(mock_content.encode('utf-8'), name=document.file_name)
                default_storage.save(document.file.name, mock_file)
            else:
                raise Http404("File not found")
        
        # Determine content type
        content_type = document.file_type or mimetypes.guess_type(document.file_name)[0] or 'application/octet-stream'
        
        # Open file from storage
        file_handle = default_storage.open(document.file.name, 'rb')
        
        # Prepare response
        response = HttpResponse(file_handle, content_type=content_type)
        
        # Set content disposition based on query parameter
        is_download = request.GET.get('download', '0') == '1'
        if is_download:
            response['Content-Disposition'] = f'attachment; filename="{document.file_name}"'
        else:
            response['Content-Disposition'] = f'inline; filename="{document.file_name}"'
        
        # Set additional headers
        response['Content-Length'] = document.file_size
        response['Cache-Control'] = 'private, max-age=3600'  # Cache for 1 hour
        response['X-Content-Type-Options'] = 'nosniff'
        
        return response
        
    except Http404:
        raise
    except SuspiciousOperation:
        return HttpResponseForbidden("Invalid file access")
    except Exception as e:
        # Log error for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error serving file {document_id}: {str(e)}")
        raise Http404("File not found")

@api_view(['HEAD'])
@permission_classes([IsAuthenticated])
def check_file_exists(request, document_id):
    """
    Check if file exists without downloading it
    Useful for frontend to validate URLs before attempting download
    """
    try:
        document = get_object_or_404(Document, id=document_id)
        
        # Same ownership check as serve_file
        if document.owner != request.user:
            # Check if user has access through order items (as customer)
            from stationary_orders.models import OrderItem
            has_order_access = OrderItem.objects.filter(
                document=document,
                order__customer=request.user
            ).exists()
            
            # Check if user has access through shop (as shop owner/employee)
            if not has_order_access:
                # For development: allow access if user is staff/superuser
                if request.user.is_staff or request.user.is_superuser:
                    has_order_access = True
                else:
                    # Check if user is associated with the shop that has the order
                    from stationary_shops.models import Shop
                    shop_orders_with_document = OrderItem.objects.filter(
                        document=document
                    ).values_list('order__shop', flat=True).distinct()
                    
                    user_shops = Shop.objects.filter(
                        id__in=shop_orders_with_document,
                        owner=request.user
                    ).exists()
                    
                    if user_shops:
                        has_order_access = True
            
            if not has_order_access:
                return HttpResponseForbidden()
        
        # Check file existence
        exists = default_storage.exists(document.file.name)
        
        if exists:
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=404)
            
    except:
        return HttpResponse(status=404)
