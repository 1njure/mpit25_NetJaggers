from __future__ import annotations

import logging
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    token_fingerprint,
    verify_password,
)
from app.crud.user import create_user, get_user_by_email, get_user_by_username
from app.database import get_db_session
from app.dependencies import rate_limit
from app.schemas.token import LogoutRequest, RefreshRequest, SigninRequest, SignupResponse, TokenPair
from app.schemas.user import UserCreate, UserPublic

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


def _refresh_redis_key(user_id: str, jti: str) -> str:
    return f"refresh:{user_id}:{jti}"


def _set_auth_cookies(response: Response, *, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key=settings.auth_cookie_access_name,
        value=access_token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        domain=settings.auth_cookie_domain,
        path="/",
        max_age=int(timedelta(minutes=settings.access_token_expire_minutes).total_seconds()),
    )
    response.set_cookie(
        key=settings.auth_cookie_refresh_name,
        value=refresh_token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        domain=settings.auth_cookie_domain,
        path="/",
        max_age=int(timedelta(days=settings.refresh_token_expire_days).total_seconds()),
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key=settings.auth_cookie_access_name, domain=settings.auth_cookie_domain, path="/")
    response.delete_cookie(key=settings.auth_cookie_refresh_name, domain=settings.auth_cookie_domain, path="/")


@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(rate_limit)])
async def signup(
    request: Request,
    response: Response,
    payload: UserCreate,
    session: AsyncSession = Depends(get_db_session),
) -> SignupResponse:
    existing = await get_user_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(status_code=409, detail="Email already registered")

    if payload.username:
        existing_username = await get_user_by_username(session, payload.username)
        if existing_username is not None:
            raise HTTPException(status_code=409, detail="Username already taken")

    user = await create_user(
        session,
        email=str(payload.email).lower(),
        username=payload.username,
        hashed_password=hash_password(payload.password),
    )

    access = create_access_token(subject=str(user.id), expires_minutes=settings.access_token_expire_minutes)
    refresh, jti = create_refresh_token(subject=str(user.id), expires_days=settings.refresh_token_expire_days)

    redis = request.app.state.redis
    key = _refresh_redis_key(str(user.id), jti)
    ttl_seconds = int(timedelta(days=settings.refresh_token_expire_days).total_seconds())
    await redis.setex(key, ttl_seconds, token_fingerprint(refresh))

    _set_auth_cookies(response, access_token=access, refresh_token=refresh)

    return SignupResponse(
        user=UserPublic(user_id=user.id, email=user.email, created_at=user.created_at),
        tokens=TokenPair(access_token=access, refresh_token=refresh),
    )


@router.post("/signin", response_model=TokenPair, dependencies=[Depends(rate_limit)])
async def signin(payload: SigninRequest, request: Request, response: Response, session: AsyncSession = Depends(get_db_session)) -> TokenPair:
    user = await get_user_by_email(session, str(payload.email).lower())
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.is_deleted:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(subject=str(user.id), expires_minutes=settings.access_token_expire_minutes)
    refresh, jti = create_refresh_token(subject=str(user.id), expires_days=settings.refresh_token_expire_days)

    redis = request.app.state.redis
    key = _refresh_redis_key(str(user.id), jti)
    ttl_seconds = int(timedelta(days=settings.refresh_token_expire_days).total_seconds())

    # Store only fingerprint (hash) of refresh token
    await redis.setex(key, ttl_seconds, token_fingerprint(refresh))

    _set_auth_cookies(response, access_token=access, refresh_token=refresh)

    return TokenPair(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenPair, dependencies=[Depends(rate_limit)])
async def refresh_tokens(payload: RefreshRequest | None, request: Request, response: Response) -> TokenPair:
    redis = request.app.state.redis

    refresh_token = payload.refresh_token if payload is not None else None
    if not refresh_token:
        refresh_token = request.cookies.get(settings.auth_cookie_refresh_name)

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token is required")

    try:
        decoded = decode_token(refresh_token)
        if decoded.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = decoded.get("sub")
        jti = decoded.get("jti")
        if not user_id or not jti:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    key = _refresh_redis_key(str(user_id), str(jti))
    stored_fp = await redis.get(key)
    if not stored_fp:
        raise HTTPException(status_code=401, detail="Refresh token revoked or expired")

    if stored_fp != token_fingerprint(refresh_token):
        raise HTTPException(status_code=401, detail="Refresh token mismatch")

    # rotate refresh token
    await redis.delete(key)

    access = create_access_token(subject=str(user_id), expires_minutes=settings.access_token_expire_minutes)
    refresh, new_jti = create_refresh_token(subject=str(user_id), expires_days=settings.refresh_token_expire_days)

    ttl_seconds = int(timedelta(days=settings.refresh_token_expire_days).total_seconds())
    await redis.setex(_refresh_redis_key(str(user_id), new_jti), ttl_seconds, token_fingerprint(refresh))

    _set_auth_cookies(response, access_token=access, refresh_token=refresh)

    return TokenPair(access_token=access, refresh_token=refresh)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(rate_limit)])
async def logout(payload: LogoutRequest | None, request: Request, response: Response) -> None:
    redis = request.app.state.redis

    refresh_token = payload.refresh_token if payload is not None else None
    if not refresh_token:
        refresh_token = request.cookies.get(settings.auth_cookie_refresh_name)

    if not refresh_token:
        _clear_auth_cookies(response)
        return None

    try:
        decoded = decode_token(refresh_token)
        if decoded.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = decoded.get("sub")
        jti = decoded.get("jti")
        if not user_id or not jti:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    await redis.delete(_refresh_redis_key(str(user_id), str(jti)))
    _clear_auth_cookies(response)
    return None
