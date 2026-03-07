import graphene
from graphene_django import DjangoObjectType
from stationary_storage.models import Document
from stationary_accounts.models import User
from tarxemo_django_graphene_utils import (
    BaseResponseDTO,
    ResponseObject,
    build_success_response,
    build_error
)
import uuid

class DocumentType(DjangoObjectType):
    upload_url = graphene.String() # Real file serving URL
    download_url = graphene.String() # Download URL with attachment disposition
    
    class Meta:
        model = Document
        fields = "__all__"

    def resolve_upload_url(self, info):
        """Return URL for inline preview using REST API"""
        request = info.context
        if request and hasattr(request, 'build_absolute_uri'):
            return f"{request.build_absolute_uri('/api/storage/files/')}{self.id}/"
        return f"/api/storage/files/{self.id}/"
    
    def resolve_download_url(self, info):
        """Return URL for forced download using REST API"""
        request = info.context
        if request and hasattr(request, 'build_absolute_uri'):
            return f"{request.build_absolute_uri('/api/storage/files/')}{self.id}/?download=1"
        return f"/api/storage/files/{self.id}/?download=1"

class DocumentResponseDTO(BaseResponseDTO):
    data = graphene.List(DocumentType)

class CreateDocumentMutation(graphene.Mutation):
    class Arguments:
        file_name = graphene.String(required=True)
        file_size = graphene.Int(required=True)
        file_type = graphene.String()

    response = graphene.Field(ResponseObject)
    document = graphene.Field(DocumentType)

    def mutate(self, info, file_name, file_size, file_type="application/pdf"):
        user = info.context.user
        if not user.is_authenticated:
            return CreateDocumentMutation(response=build_error("Authentication required"))

        try:
            # We create a placeholder document record.
            # In a real app, we'd return a presigned URL, client uploads file, then calls 'finalize_upload'.
            document = Document.objects.create(
                owner=user,
                file_name=file_name,
                file_size=file_size,
                file_type=file_type,
                # file field is required but we can set a placeholder or allow null in model (I didn't set blank=True/null=True)
                # I defined `file = models.FileField(...)` which implies required locally.
                # I'll just put a dummy value for the file path since we aren't handling real files in this mock steps.
                file="pending_upload/" + str(uuid.uuid4())
            )
            
            return CreateDocumentMutation(
                response=build_success_response("Document metadata created. Proceed to upload."),
                document=document
            )
        except Exception as e:
            return CreateDocumentMutation(response=build_error(str(e)))

class CreateGuestDocumentMutation(graphene.Mutation):
    class Arguments:
        file_name = graphene.String(required=True)
        file_size = graphene.Int(required=True)
        file_type = graphene.String()

    response = graphene.Field(ResponseObject)
    document = graphene.Field(DocumentType)

    def mutate(self, info, file_name, file_size, file_type="application/pdf"):
        # No authentication required for guest uploads
        try:
            # Create document without owner for guest uploads
            document = Document.objects.create(
                owner=None,  # No owner for guest documents
                file_name=file_name,
                file_size=file_size,
                file_type=file_type,
                file="guest_upload/" + str(uuid.uuid4())
            )
            
            return CreateGuestDocumentMutation(
                response=build_success_response("Guest document metadata created. Proceed to upload."),
                document=document
            )
        except Exception as e:
            return CreateGuestDocumentMutation(response=build_error(str(e)))

class Query(graphene.ObjectType):
    my_documents = graphene.List(DocumentType)
    documents = graphene.Field(DocumentResponseDTO)
    
    def resolve_my_documents(self, info):
        user = info.context.user
        if user.is_authenticated:
            return Document.objects.filter(owner=user)
        return []

    def resolve_documents(self, info):
        # Admin query to get all documents
        user = info.context.user
        if not user.is_authenticated or user.role != User.Role.ADMIN:
            return {"response": build_error("Permission denied"), "data": []}
        
        try:
            documents = Document.objects.all()
            return {
                "response": build_success_response("Documents retrieved successfully"),
                "data": documents
            }
        except Exception as e:
            return {
                "response": build_error(str(e)),
                "data": []
            }

class Mutation(graphene.ObjectType):
    create_document = CreateDocumentMutation.Field()
    create_guest_document = CreateGuestDocumentMutation.Field()
