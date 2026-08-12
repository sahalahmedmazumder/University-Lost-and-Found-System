import uuid

from boto3.dynamodb.conditions import Key
from pwdlib import PasswordHash

from app.auth.jwt import create_access_token
from app.config import dynamodb
from app.models.user import (
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)


password_hash = PasswordHash.recommended()

users_table = dynamodb.Table("Users")


class AuthService:

    @staticmethod
    def register(user: UserRegister):

        # Check if email already exists
        response = users_table.query(
            IndexName="email-index",
            KeyConditionExpression=Key("email").eq(user.email),
        )

        if response["Items"]:
            raise Exception("Email already exists")

        # Generate user ID
        user_id = str(uuid.uuid4())

        # Hash password
        hashed_password = password_hash.hash(user.password)

        # Create new user
        users_table.put_item(
            Item={
                "user_id": user_id,
                "name": user.name,
                "email": user.email,
                "password": hashed_password,
                "role": "user",
                "flagged": False,
            }
        )

        return UserResponse(
            user_id=user_id,
            name=user.name,
            email=user.email,
            role="user",
            flagged=False,
        )

    @staticmethod
    def login(user: UserLogin):

        # Find user by email
        response = users_table.query(
            IndexName="email-index",
            KeyConditionExpression=Key("email").eq(user.email),
        )

        if not response["Items"]:
            raise Exception("Invalid email or password")

        db_user = response["Items"][0]

        # Verify password
        if not password_hash.verify(
            user.password,
            db_user["password"],
        ):
            raise Exception("Invalid email or password")

        # Get role
        # Existing users without a role are treated as normal users
        role = db_user.get("role", "user")

        # Get flagged status
        # Existing users without flagged field are treated as not flagged
        flagged = db_user.get("flagged", False)

        # Create JWT token
        access_token = create_access_token(
            {
                "user_id": db_user["user_id"],
                "email": db_user["email"],
                "name": db_user["name"],
                "role": role,
                "flagged": flagged,
            }
        )

        # Return login response
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                user_id=db_user["user_id"],
                name=db_user["name"],
                email=db_user["email"],
                role=role,
                flagged=flagged,
            ),
        )