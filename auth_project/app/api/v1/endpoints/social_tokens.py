from __future__ import annotations

from datetime import datetime, timezone
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decrypt_secret, encrypt_secret
from app.dependencies import get_current_user, rate_limit
from app.redis_client import get_redis_client
from app.schemas.social_token import SocialTokenCreate, SocialTokenList, SocialTokenPrivate, SocialTokenPublic

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/social-tokens", tags=["social-tokens"])


def _normalize_provider(provider: str) -> str:
    return provider.strip().lower()


def _provider_set_key(user_id: str) -> str:
    return f"social_tokens:providers:{user_id}"


def _token_key(user_id: str, provider: str) -> str:
    return f"social_tokens:token:{user_id}:{provider}"


@router.get("", response_model=SocialTokenList, dependencies=[Depends(rate_limit)])
async def list_tokens(
    user=Depends(get_current_user),
) -> SocialTokenList:
    redis = get_redis_client()
    providers = await redis.smembers(_provider_set_key(str(user.id)))

    items: list[SocialTokenPublic] = []
    for provider in sorted(p for p in providers if p):
        token_data = await redis.hgetall(_token_key(str(user.id), provider))
        if not token_data:
            continue

        created_at_raw = token_data.get("created_at")
        updated_at_raw = token_data.get("updated_at")
        try:
            created_at = datetime.fromisoformat(created_at_raw) if created_at_raw else datetime.now(timezone.utc)
            updated_at = datetime.fromisoformat(updated_at_raw) if updated_at_raw else created_at
        except ValueError:
            created_at = datetime.now(timezone.utc)
            updated_at = created_at

        items.append(
            SocialTokenPublic(
                provider=provider,
                expires_at=None,
                created_at=created_at,
                updated_at=updated_at,
            )
        )

    return SocialTokenList(items=items)


@router.get("/{provider}", response_model=SocialTokenPublic | SocialTokenPrivate, dependencies=[Depends(rate_limit)])
async def get_token(
    provider: str,
    include_tokens: bool = Query(default=False),
    user=Depends(get_current_user),
):
    provider_n = _normalize_provider(provider)

    redis = get_redis_client()
    token_data = await redis.hgetall(_token_key(str(user.id), provider_n))
    if not token_data:
        raise HTTPException(status_code=404, detail="Token not found")

    created_at_raw = token_data.get("created_at")
    updated_at_raw = token_data.get("updated_at")
    try:
        created_at = datetime.fromisoformat(created_at_raw) if created_at_raw else datetime.now(timezone.utc)
        updated_at = datetime.fromisoformat(updated_at_raw) if updated_at_raw else created_at
    except ValueError:
        created_at = datetime.now(timezone.utc)
        updated_at = created_at

    if not include_tokens:
        return SocialTokenPublic(
            provider=provider_n,
            expires_at=None,
            created_at=created_at,
            updated_at=updated_at,
        )

    return SocialTokenPrivate(
        provider=provider_n,
        expires_at=None,
        created_at=created_at,
        updated_at=updated_at,
        provider_access_token=decrypt_secret(token_data.get("access_token", "")),
    )


@router.post("", response_model=SocialTokenPublic, status_code=status.HTTP_201_CREATED, dependencies=[Depends(rate_limit)])
async def create_token(
    payload: SocialTokenCreate,
    user=Depends(get_current_user),
) -> SocialTokenPublic:
    provider_n = _normalize_provider(payload.provider)
    redis = get_redis_client()

    now = datetime.now(timezone.utc)
    await redis.sadd(_provider_set_key(str(user.id)), provider_n)
    await redis.hset(
        _token_key(str(user.id), provider_n),
        mapping={
            "access_token": encrypt_secret(payload.provider_access_token),
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        },
    )

    return SocialTokenPublic(provider=provider_n, expires_at=None, created_at=now, updated_at=now)


@router.delete("/{provider}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(rate_limit)])
async def delete_token(
    provider: str,
    user=Depends(get_current_user),
) -> None:
    provider_n = _normalize_provider(provider)

    redis = get_redis_client()
    removed = await redis.delete(_token_key(str(user.id), provider_n))
    await redis.srem(_provider_set_key(str(user.id)), provider_n)
    if removed == 0:
        raise HTTPException(status_code=404, detail="Token not found")
    return None
