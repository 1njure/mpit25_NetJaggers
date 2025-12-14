from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    username: str | None = Field(default=None, min_length=1, max_length=150)


class UserPublic(BaseModel):
    user_id: UUID
    email: EmailStr
    created_at: datetime


class UserInDB(BaseModel):
    id: UUID
    email: EmailStr
    username: str | None
    hashed_password: str
    is_active: bool
    is_deleted: bool
