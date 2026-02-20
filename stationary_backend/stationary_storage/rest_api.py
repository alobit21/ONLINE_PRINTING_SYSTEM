from django.http import JsonResponse, HttpResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Document
import mimetypes
import uuid
import os

class MediaUploadViewDev(APIView):
    """
    Development-only upload endpoint without authentication
    POST /api/storage/upload/dev/
    """
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, *args, **kwargs):
        try:
            # Get uploaded file
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'No file provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            uploaded_file = request.FILES['file']
            file_name = uploaded_file.name
            file_size = uploaded_file.size
            file_type = uploaded_file.content_type or mimetypes.guess_type(file_name)[0]
            
            # Validate file
            if file_size > 50 * 1024 * 1024:  # 50MB limit
                return Response(
                    {'error': 'File too large. Maximum size is 50MB'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate unique filename
            file_extension = os.path.splitext(file_name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            upload_path = f"secure_uploads/{unique_filename}"
            
            # Save file to storage
            path = default_storage.save(upload_path, uploaded_file)
            
            # Create document record with dummy user (for development)
            from django.contrib.auth import get_user_model
            User = get_user_model()
            dummy_user = User.objects.first()  # Get first user for testing
            
            document = Document.objects.create(
                owner=dummy_user or User.objects.create_user('devuser', 'dev@example.com', 'devpass123'),
                file=path,
                file_name=file_name,
                file_type=file_type,
                file_size=file_size,
                is_scanned=False,
                virus_detected=False
            )
            
            # Build URLs
            request_host = f"{request.scheme}://{request.get_host()}"
            upload_url = f"{request_host}/api/storage/files/{document.id}/"
            download_url = f"{request_host}/api/storage/files/{document.id}/?download=1"
            
            return Response({
                'id': str(document.id),
                'fileName': document.file_name,
                'fileType': document.file_type,
                'fileSize': document.file_size,
                'uploadUrl': upload_url,
                'downloadUrl': download_url,
                'createdAt': document.created_at.isoformat(),
                'message': 'File uploaded successfully (dev mode)'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Upload failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MediaUploadView(APIView):
    """
    REST API for media uploads
    POST /api/storage/upload/
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        try:
            # Get uploaded file
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'No file provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            uploaded_file = request.FILES['file']
            file_name = uploaded_file.name
            file_size = uploaded_file.size
            file_type = uploaded_file.content_type or mimetypes.guess_type(file_name)[0]
            
            # Validate file
            if file_size > 50 * 1024 * 1024:  # 50MB limit
                return Response(
                    {'error': 'File too large. Maximum size is 50MB'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate unique filename
            file_extension = os.path.splitext(file_name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            upload_path = f"secure_uploads/{unique_filename}"
            
            # Save file to storage
            path = default_storage.save(upload_path, uploaded_file)
            
            # Create document record
            document = Document.objects.create(
                owner=request.user,
                file=path,
                file_name=file_name,
                file_type=file_type,
                file_size=file_size,
                is_scanned=False,  # In production, implement virus scanning
                virus_detected=False
            )
            
            # Build URLs
            request_host = f"{request.scheme}://{request.get_host()}"
            upload_url = f"{request_host}/api/storage/files/{document.id}/"
            download_url = f"{request_host}/api/storage/files/{document.id}/?download=1"
            
            return Response({
                'id': str(document.id),
                'fileName': document.file_name,
                'fileType': document.file_type,
                'fileSize': document.file_size,
                'uploadUrl': upload_url,
                'downloadUrl': download_url,
                'createdAt': document.created_at.isoformat(),
                'message': 'File uploaded successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': f'Upload failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MediaDetailView(APIView):
    """
    REST API for media retrieval and management
    GET /api/storage/media/:id/ - Get file metadata
    DELETE /api/storage/media/:id/ - Delete file
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, document_id, *args, **kwargs):
        try:
            document = Document.objects.get(id=document_id)
            
            # Check permissions
            if document.owner != request.user:
                # Check if user has access through orders
                from stationary_orders.models import OrderItem
                has_access = OrderItem.objects.filter(
                    document=document,
                    order__customer=request.user
                ).exists()
                
                if not has_access and not (request.user.is_staff or request.user.is_superuser):
                    return Response(
                        {'error': 'Permission denied'}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
            
            request_host = f"{request.scheme}://{request.get_host()}"
            upload_url = f"{request_host}/api/storage/files/{document.id}/"
            download_url = f"{request_host}/api/storage/files/{document.id}/?download=1"
            
            return Response({
                'id': str(document.id),
                'fileName': document.file_name,
                'fileType': document.file_type,
                'fileSize': document.file_size,
                'uploadUrl': upload_url,
                'downloadUrl': download_url,
                'createdAt': document.created_at.isoformat(),
                'isScanned': document.is_scanned,
                'virusDetected': document.virus_detected
            })
            
        except Document.DoesNotExist:
            return Response(
                {'error': 'File not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Retrieval failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def delete(self, request, document_id, *args, **kwargs):
        try:
            document = Document.objects.get(id=document_id)
            
            # Only owner can delete
            if document.owner != request.user and not request.user.is_superuser:
                return Response(
                    {'error': 'Permission denied'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Delete file from storage
            if document.file and default_storage.exists(document.file.name):
                default_storage.delete(document.file.name)
            
            # Delete document record
            document.delete()
            
            return Response({
                'message': 'File deleted successfully'
            })
            
        except Document.DoesNotExist:
            return Response(
                {'error': 'File not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Deletion failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MediaListView(APIView):
    """
    REST API for listing user's media files
    GET /api/storage/media/ - List user's files
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        try:
            # Get user's documents
            documents = Document.objects.filter(owner=request.user).order_by('-created_at')
            
            request_host = f"{request.scheme}://{request.get_host()}"
            
            media_list = []
            for document in documents:
                upload_url = f"{request_host}/api/storage/files/{document.id}/"
                download_url = f"{request_host}/api/storage/files/{document.id}/?download=1"
                
                media_list.append({
                    'id': str(document.id),
                    'fileName': document.file_name,
                    'fileType': document.file_type,
                    'fileSize': document.file_size,
                    'uploadUrl': upload_url,
                    'downloadUrl': download_url,
                    'createdAt': document.created_at.isoformat(),
                    'isScanned': document.is_scanned,
                    'virusDetected': document.virus_detected
                })
            
            return Response({
                'media': media_list,
                'count': len(media_list)
            })
            
        except Exception as e:
            return Response(
                {'error': f'List retrieval failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_presigned_upload(request):
    """
    Create presigned upload URL for client-side uploads
    POST /api/storage/presigned-upload/
    """
    try:
        file_name = request.data.get('fileName')
        file_type = request.data.get('fileType')
        file_size = request.data.get('fileSize')
        
        if not file_name or not file_size:
            return Response(
                {'error': 'fileName and fileSize are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size
        if file_size > 50 * 1024 * 1024:  # 50MB limit
            return Response(
                {'error': 'File too large. Maximum size is 50MB'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create document record first
        document = Document.objects.create(
            owner=request.user,
            file=f"pending_upload/{uuid.uuid4()}_{file_name}",
            file_name=file_name,
            file_type=file_type,
            file_size=file_size,
            is_scanned=False,
            virus_detected=False
        )
        
        # Return upload URL (for now, return the file serving URL)
        request_host = f"{request.scheme}://{request.get_host()}"
        upload_url = f"{request_host}/api/storage/upload/{document.id}/"
        
        return Response({
            'documentId': str(document.id),
            'uploadUrl': upload_url,
            'fileName': file_name,
            'fileType': file_type,
            'fileSize': file_size
        })
        
    except Exception as e:
        return Response(
            {'error': f'Presigned URL creation failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
