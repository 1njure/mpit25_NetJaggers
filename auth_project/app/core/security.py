from __future__ import annotations

import base64
import hashlib
import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from cryptography.fernet import Fernet, InvalidToken
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _new_jti() -> str:
    return secrets.token_urlsafe(32)


def create_access_token(*, subject: str, expires_minutes: int) -> str:
    now = _utcnow()
    payload: dict[str, Any] = {
        "sub": subject,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=expires_minutes)).timestamp()),
        "jti": _new_jti(),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(*, subject: str, expires_days: int) -> tuple[str, str]:
    now = _utcnow()
    jti = _new_jti()
    payload: dict[str, Any] = {
        "sub": subject,
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(days=expires_days)).timestamp()),
        "jti": jti,
    }
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    return token, jti


def decode_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError as exc:
        logger.info("JWT decode error: %s", exc)
        raise
    return payload


def token_fingerprint(token: str) -> str:
    # Avoid storing raw refresh token in Redis; store a hash fingerprint instead.
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _get_fernet() -> Fernet:
    # Fernet key must be urlsafe base64-encoded 32-byte key.
    if settings.social_token_encryption_key:
        key_b = settings.social_token_encryption_key.encode("utf-8")
        return Fernet(key_b)

    # Dev-friendly fallback: derive a stable Fernet key from SECRET_KEY.
    digest = hashlib.sha256(settings.secret_key.encode("utf-8")).digest()
    key = base64.urlsafe_b64encode(digest)
    return Fernet(key)


def encrypt_secret(value: str) -> str:
    if value == "":
        return value
    f = _get_fernet()
    token = f.encrypt(value.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_secret(value: str) -> str:
    if value == "":
        return value
    f = _get_fernet()
    try:
        decrypted = f.decrypt(value.encode("utf-8"))
    except InvalidToken as exc:
        logger.warning("Failed to decrypt secret: %s", exc)
        raise
    return decrypted.decode("utf-8")
