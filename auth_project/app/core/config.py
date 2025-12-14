from __future__ import annotations

from pydantic import AnyUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/fastapi_db"
    redis_url: str = "redis://localhost:6379/0"

    secret_key: str = "change-me-please"
    algorithm: str = "HS256"

    # Optional Fernet key for encrypting social tokens at rest.
    # If not provided, a key will be derived from SECRET_KEY (acceptable for dev, not ideal for prod).
    social_token_encryption_key: str | None = None

    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    auth_cookie_access_name: str = "access_token"
    auth_cookie_refresh_name: str = "refresh_token"
    auth_cookie_secure: bool = False
    auth_cookie_samesite: str = "lax"  # lax|strict|none
    auth_cookie_domain: str | None = None

    cors_origins: str = ""

    rate_limit_requests: int = 60
    rate_limit_window_seconds: int = 60

    vk_group_id: int = 0
    vk_api_version: str = "5.199"
    vk_cache_ttl_s: float = 0.0


settings = Settings()
