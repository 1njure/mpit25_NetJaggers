from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email, User.is_deleted.is_(False))
    res = await session.execute(stmt)
    return res.scalar_one_or_none()


async def get_user_by_username(session: AsyncSession, username: str) -> User | None:
    stmt = select(User).where(User.username == username, User.is_deleted.is_(False))
    res = await session.execute(stmt)
    return res.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id) -> User | None:
    stmt = select(User).where(User.id == user_id, User.is_deleted.is_(False))
    res = await session.execute(stmt)
    return res.scalar_one_or_none()


async def create_user(session: AsyncSession, *, email: str, username: str | None, hashed_password: str) -> User:
    user = User(email=email, username=username, hashed_password=hashed_password)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
