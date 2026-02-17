import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from django.conf import settings
from tarxemo_django_graphene_utils import (
    BaseResponseDTO,
    ResponseObject,
    build_success_response,
    build_error,
    get_paginated_and_non_paginated_data,
    UserFilterInput
)

User = get_user_model()

# ------------------------------
# Types
# ------------------------------

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            "id", "email", "first_name", "last_name", "role", "subscription_tier", 
            "phone_number", "is_verified", "avatar", 
            "created_at", "updated_at", "is_active",
            "date_joined", "last_login"
        )

class AdminUserResponseDTO(BaseResponseDTO):
    data = graphene.List(UserType)

class AuthResponseDTO(BaseResponseDTO):
    token = graphene.String()
    refresh_token = graphene.String()
    user = graphene.Field(UserType)

class LoginResponseDTO(graphene.ObjectType):
    token = graphene.String()
    refresh_token = graphene.String()
    user = graphene.Field(UserType)
    response = graphene.Field(ResponseObject)

# ------------------------------
# Mutations
# ------------------------------

class RegisterUserMutation(graphene.Mutation):
    # This ensures the mutation remains accessible even if a malformed token is present
    allow_any = True

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        role = graphene.String(required=True)
        phone_number = graphene.String()
    
    response = graphene.Field(ResponseObject)
    user = graphene.Field(UserType)

    def mutate(self, info, email, password, role, phone_number=None):
        # Validate Role
        if role not in [User.Role.CUSTOMER.value, User.Role.SHOP_OWNER.value]:
            return RegisterUserMutation(response=build_error("Invalid role specified."))
        
        try:
            if User.objects.filter(email=email).exists():
                return RegisterUserMutation(response=build_error("Email already registered."))

            user = User.objects.create_user(
                email=email, 
                password=password, 
                role=role,
                phone_number=phone_number
            )
            # Auto-verify customers? Shop owner triggers verify workflow?
            # Keeping default verify=False for now.
            
            return RegisterUserMutation(
                response=build_success_response("User registered successfully."),
                user=user
            )
        except Exception as e:
            return RegisterUserMutation(response=build_error(str(e)))


class LoginMutation(graphql_jwt.ObtainJSONWebToken):
    # Standardizing the response to match the frontend expectations
    # ObtainJSONWebToken returns token by default, but we need to explicitly 
    # redefine 'user' if we want it to be guaranteed in our custom class
    user = graphene.Field(UserType)
    response = graphene.Field(ResponseObject)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        try:
            # super().resolve handles the authentication via the GraphQL-JWT logic
            result = super().resolve(root, info, **kwargs)
            
            # If authentication is successful, we populate our custom fields
            if result:
                # The authenticated user is placed in info.context.user by the backend
                result.user = info.context.user
                result.response = build_success_response("Login successful.")
            return result
        except Exception as e:
            return cls(user=None, response=build_error(str(e)))

# ------------------------------
# Schema Definition
# ------------------------------

class Mutation(graphene.ObjectType):
    register_user = RegisterUserMutation.Field()
    token_auth = LoginMutation.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

class Query(graphene.ObjectType):
    users = graphene.Field(AdminUserResponseDTO, filter_input=UserFilterInput())
    me = graphene.Field(UserType)

    def resolve_users(self, info, filter_input=None):
        # RBAC: Only admin should see all users?
        user = info.context.user
        if not user.is_authenticated or user.role != User.Role.ADMIN:
             return {"response": build_error("Permission denied"), "data": []}

        # Define custom lookups for filters that don't match model fields exactly
        lookups = {
            'store_id': 'shops__id' # If UserFilterInput has store_id
        }
        
        return get_paginated_and_non_paginated_data(
            User,
            filter_input,
            UserType,
            custom_look_up_filter=lookups
        )

    def resolve_me(self, info):
        user = info.context.user
        if user.is_authenticated:
            return user
        return None
