from graphql_jwt.utils import jwt_decode
from django.contrib.auth import get_user_model

User = get_user_model()

def get_user_from_jwt(request):
    auth_header = request.META.get("HTTP_AUTHORIZATION")

    if not auth_header:
        return None

    token = None

    if auth_header.startswith("Bearer "):
        token = auth_header[7:]

    elif auth_header.startswith("JWT "):
        token = auth_header[4:]

    if not token:
        return None

    try:
        payload = jwt_decode(token)
        return User.objects.get(id=payload["user_id"])
    except Exception:
        return None