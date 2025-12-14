from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import decode_token
from app.crud.user import get_user_by_id
from app.database import get_db_session
from app.redis_client import get_redis_client

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/signin", auto_error=False)


async def rate_limit(request: Request) -> None:
    redis = get_redis_client()

    client_ip = request.client.host if request.client else "unknown"
    key = f"rl:{client_ip}:{request.url.path}"

    try:
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, settings.rate_limit_window_seconds)

        if count > settings.rate_limit_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
            )
    except HTTPException:
        raise
    except Exception as exc:
        logger.warning("Rate limit redis error: %s", exc)
        # Fail-open on Redis issues
        return


async def get_current_user(
    request: Request,
    token: str | None = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_db_session),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        token = request.cookies.get(settings.auth_cookie_access_name)

    if not token:
        raise credentials_exception

    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise credentials_exception
        sub = payload.get("sub")
        if not sub:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user_by_id(session, sub)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    if user.is_deleted:
        raise credentials_exception

    return user
