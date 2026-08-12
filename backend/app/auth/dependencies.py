from fastapi import Depends, HTTPException, status
from fastapi.security import (
    OAuth2PasswordBearer,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)

from app.auth.jwt import verify_token
from app.config import dynamodb


# Users table
users_table = dynamodb.Table("Users")


# Used by normal login-protected routes
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# Used for admin routes
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


def require_active_user(
    current_user=Depends(get_current_user),
):
    # Get user ID from JWT
    user_id = current_user.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token",
        )

    # Get the latest user data from DynamoDB
    response = users_table.get_item(
        Key={
            "user_id": user_id
        }
    )

    user = response.get("Item")

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Check if the user is flagged
    if user.get("flagged", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been flagged. You cannot submit reports.",
        )

    return current_user


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