from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "CHANGE_THIS_TO_A_RANDOM_SECRET_KEY_123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440


settings = Settings()