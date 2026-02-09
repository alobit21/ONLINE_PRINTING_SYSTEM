from graphql_jwt.middleware import JSONWebTokenMiddleware
from graphql_jwt.exceptions import JSONWebTokenError

class SafeJSONWebTokenMiddleware:
    """
    A wrapper around JSONWebTokenMiddleware that catches decoding errors
    and allows the request to proceed as an AnonymousUser.
    """
    def __init__(self):
        self.jwt_middleware = JSONWebTokenMiddleware()

    def resolve(self, next, root, info, **kwargs):
        try:
            return self.jwt_middleware.resolve(next, root, info, **kwargs)
        except JSONWebTokenError as e:
            # If the token is malformed or signature is invalid, 
            # we just don't authenticate the user and continue.
            print(f"JWT Error: {e}")
            return next(root, info, **kwargs)
        except Exception as e:
            # Catch any other potential JWT-related blowups
            print(f"JWT Middleware Exception: {e}")
            return next(root, info, **kwargs)
