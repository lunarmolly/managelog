import os

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    WORKERS: int = int(os.getenv("WORKERS", 1))
    FORWARDED_ALLOW_IPS: str = os.getenv("FORWARDED_ALLOW_IPS", "*")
    KEEPALIVE: int = int(os.getenv("KEEPALIVE", 120))
    REDIS_DSN: str = os.getenv('REDIS_DSN', "redis://localhost:6380")
    DATABASE_DSN: str = os.getenv("DATABASE_DSN", "postgresql+asyncpg://postgres:db_password@postgres:5432/database")
    # DATABASE_DSN: str = os.getenv("DATABASE_DSN", "postgresql+asyncpg://postgres:db_password@localhost:5431/database")
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", 2)) 
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "1c93ca1692d5bf624d440a73ccb9dba43a1cb31dbf0c99ba718fe626ee7aecbaaceda1adbea0d5942397c32d28b3302899cad130705a48a99117d7454b86d853")
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "1c93ca1692d5bf624d440a73ccb9dba43a1cb31dbf0c99ba718fe626ee7aecbaaceda1adbea0d5942397c32d28b3302899cad130705a48a99117d7454b86d853")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    REFRESH_TOKEN_EXPIRE_HOURS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_HOURS", "24"))
    # MODS
    TEST_MODE: bool = bool(os.getenv("TEST_MODE", False))
        
settings = Settings()
