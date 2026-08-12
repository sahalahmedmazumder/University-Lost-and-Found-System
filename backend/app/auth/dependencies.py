from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials

from app.auth.jwt import verify_token


# Used by the normal login-protected routes
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# Used for admin routes
# This gives Swagger a simple "Value" field
# where you can paste the JWT token.
bearer_scheme = HTTPBearer()


def get_current_user(
    token: str = Depends(oauth2_scheme),
):
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return payload


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
):
    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return payload