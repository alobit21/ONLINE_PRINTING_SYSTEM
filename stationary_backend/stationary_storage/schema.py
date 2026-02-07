import graphene
from graphene_django import DjangoObjectType
from stationary_storage.models import Document
from tarxemo_django_graphene_utils import (
    BaseResponseDTO,
    ResponseObject,
    build_success_response,
    build_error
)
import uuid

class DocumentType(DjangoObjectType):
    upload_url = graphene.String() # Mocked presigned URL
    
    class Meta:
        model = Document
        fields = "__all__"

    def resolve_upload_url(self, info):
        # Mock logic: checking for cloud storage signatures would happen here
        return f"https://mock-storage.com/upload/{self.id}"

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

class Query(graphene.ObjectType):
    my_documents = graphene.List(DocumentType)
    
    def resolve_my_documents(self, info):
        user = info.context.user
        if user.is_authenticated:
            return Document.objects.filter(owner=user)
        return []

class Mutation(graphene.ObjectType):
    create_document = CreateDocumentMutation.Field()
