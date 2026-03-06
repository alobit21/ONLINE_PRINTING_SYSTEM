import logging
import mimetypes
import os

from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from django.http import FileResponse, Http404, HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from graphql_jwt.utils import jwt_decode

from .models import Document

logger = logging.getLogger(__name__)
User = get_user_model()


# ─── Authentication ──────────────────────────────────────────────────────────


def _authenticate_jwt(request) -> bool:
    """
    Validate the JWT token from the Authorization header and bind the resolved
    user to request.user.  Returns True on success, False otherwise.

    Expected header format:  Authorization: JWT <token>
    """
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')

    if not auth_header.startswith('JWT '):
        return False

    token = auth_header[4:]  # strip 'JWT ' prefix

    try:
        payload = jwt_decode(token)
        request.user = User.objects.get(id=payload['user_id'])
        return True
    except Exception:
        return False


# ─── Permission ───────────────────────────────────────────────────────────────


def _has_document_access(user, document) -> bool:
    """
    Return True if *user* is permitted to access *document*.

    Access is granted when any of the following is true:
    - The user is the document owner.
    - The user is staff or a superuser.
    - The user placed an order that contains the document.
    - The user owns a shop whose orders contain the document.
    """
    if document.owner == user:
        return True

    if user.is_staff or user.is_superuser:
        return True

    # Access via order (as customer)
    try:
        from stationary_orders.models import OrderItem

        if OrderItem.objects.filter(document=document, order__customer=user).exists():
            return True
    except Exception:
        pass

    # Access via shop (as shop owner)
    try:
        from stationary_orders.models import OrderItem
        from stationary_shops.models import Shop

        shop_ids = (
            OrderItem.objects.filter(document=document)
            .values_list('order__shop', flat=True)
            .distinct()
        )

        if Shop.objects.filter(id__in=shop_ids, owner=user).exists():
            return True
    except Exception:
        pass

    return False


# ─── Shared file-serving logic ────────────────────────────────────────────────


def _serve_document(request, document_id: str, *, as_attachment: bool):
    """
    Authenticate the request, verify access, and stream the document file.

    :param as_attachment: When True the browser downloads the file; when False
                          the browser attempts to display it inline.
    """
    # 1. Authenticate
    if not _authenticate_jwt(request):
        return JsonResponse({'error': 'Authentication required'}, status=401)

    # 2. Retrieve document
    document = get_object_or_404(Document, id=document_id)

    # 3. Authorise
    if not _has_document_access(request.user, document):
        return JsonResponse({'error': 'Permission denied'}, status=403)

    # 4. Validate file
    if not document.file.name:
        raise Http404('File path is not set on this document')

    if not default_storage.exists(document.file.name):
        raise Http404('File not found on storage backend')

    # 5. Determine MIME type
    content_type = (
        document.file_type
        or mimetypes.guess_type(document.file_name)[0]
        or 'application/octet-stream'
    )

    # 6. Build response
    file_handle = default_storage.open(document.file.name, 'rb')

    if as_attachment:
        response = FileResponse(
            file_handle,
            as_attachment=True,
            filename=document.file_name,
            content_type=content_type,
        )
    else:
        response = FileResponse(file_handle, content_type=content_type)
        response['Content-Disposition'] = f'inline; filename="{document.file_name}"'

    response['Content-Length'] = document.file_size
    response['Cache-Control'] = 'private, max-age=3600'
    response['X-Content-Type-Options'] = 'nosniff'

    return response


# ─── Views ────────────────────────────────────────────────────────────────────


@require_GET
@csrf_exempt
def document_view(request, document_id):
    """
    Stream a document for inline viewing in the browser.
    
    GET /api/documents/<id>/view/
    No authentication required - for public preview
    """
    try:
        # Skip authentication for preview - allow public access
        # Retrieve document
        document = get_object_or_404(Document, id=document_id)

        # Skip permission check for preview - allow public access
        
        # Validate file
        if not document.file.name:
            raise Http404('File path is not set on this document')

        if not default_storage.exists(document.file.name):
            raise Http404('File not found on storage backend')

        # Determine MIME type
        content_type = (
            document.file_type
            or mimetypes.guess_type(document.file_name)[0]
            or 'application/octet-stream'
        )

        # Build response for inline viewing
        file_handle = default_storage.open(document.file.name, 'rb')
        response = FileResponse(file_handle, content_type=content_type)
        response['Content-Disposition'] = f'inline; filename="{document.file_name}"'
        response['Content-Length'] = document.file_size
        response['Cache-Control'] = 'public, max-age=3600'
        response['X-Content-Type-Options'] = 'nosniff'

        return response
    except Http404:
        raise
    except Exception as exc:
        logger.exception('Unexpected error serving document %s for inline view', document_id)
        raise Http404('File not found') from exc


@require_GET
@csrf_exempt
def document_download(request, document_id):
    """
    Stream a document as a downloadable attachment.
    
    GET /api/documents/<id>/download/
    No authentication required - for public download
    """
    try:
        # Skip authentication for download - allow public access
        # Retrieve document
        document = get_object_or_404(Document, id=document_id)

        # Skip permission check for download - allow public access
        
        # Validate file
        if not document.file.name:
            raise Http404('File path is not set on this document')

        if not default_storage.exists(document.file.name):
            raise Http404('File not found on storage backend')

        # Determine MIME type
        content_type = (
            document.file_type
            or mimetypes.guess_type(document.file_name)[0]
            or 'application/octet-stream'
        )

        # Build response for download
        file_handle = default_storage.open(document.file.name, 'rb')
        response = FileResponse(
            file_handle,
            as_attachment=True,
            filename=document.file_name,
            content_type=content_type,
        )
        response['Content-Length'] = document.file_size
        response['Cache-Control'] = 'public, max-age=3600'
        response['X-Content-Type-Options'] = 'nosniff'

        return response
    except Http404:
        raise
    except Exception as exc:
        logger.exception('Unexpected error serving document %s for download', document_id)
        raise Http404('File not found') from exc