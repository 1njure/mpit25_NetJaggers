from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class SocialTokenCreate(BaseModel):
    provider: str = Field(min_length=2, max_length=32)
    provider_access_token: str = Field(min_length=1, validation_alias="access_token")


class SocialTokenPublic(BaseModel):
    provider: str
    expires_at: datetime | None
    created_at: datetime
    updated_at: datetime


class SocialTokenPrivate(SocialTokenPublic):
    provider_access_token: str


class SocialTokenList(BaseModel):
    items: list[SocialTokenPublic]


class ProviderPath(BaseModel):
    provider: str = Field(min_length=2, max_length=32)
