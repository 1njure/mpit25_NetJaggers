from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.social_token import SocialToken


async def get_by_user_and_provider(session: AsyncSession, *, user_id, provider: str) -> SocialToken | None:
    stmt = select(SocialToken).where(SocialToken.user_id == user_id, SocialToken.provider == provider)
    res = await session.execute(stmt)
    return res.scalar_one_or_none()


async def list_by_user(session: AsyncSession, *, user_id) -> list[SocialToken]:
    stmt = select(SocialToken).where(SocialToken.user_id == user_id).order_by(SocialToken.provider.asc())
    res = await session.execute(stmt)
    return list(res.scalars().all())


async def upsert_social_token(
    session: AsyncSession,
    *,
    user_id,
    provider: str,
    access_token: str,
) -> SocialToken:
    existing = await get_by_user_and_provider(session, user_id=user_id, provider=provider)
    if existing is None:
        obj = SocialToken(
            user_id=user_id,
            provider=provider,
            access_token=access_token,
            refresh_token=None,
            token_type=None,
            scope=None,
            expires_at=None,
        )
        session.add(obj)
        await session.commit()
        await session.refresh(obj)
        return obj

    existing.access_token = access_token
    existing.refresh_token = None
    existing.token_type = None
    existing.scope = None
    existing.expires_at = None

    await session.commit()
    await session.refresh(existing)
    return existing


async def delete_by_user_and_provider(session: AsyncSession, *, user_id, provider: str) -> bool:
    obj = await get_by_user_and_provider(session, user_id=user_id, provider=provider)
    if obj is None:
        return False
    await session.delete(obj)
    await session.commit()
    return True
