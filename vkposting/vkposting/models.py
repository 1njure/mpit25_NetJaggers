from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator


class Post(BaseModel):
    id: int
    owner_id: int
    from_id: int | None = None
    date: int | None = None
    text: str = ""
    attachments: list[dict[str, Any]] = Field(default_factory=list)
    is_pinned: int | None = None
    marked_as_ads: int | None = None
    is_favorite: bool | None = None
    postponed_id: int | None = None


class PostCreate(BaseModel):
    message: str = Field(min_length=1)
    publish_date: int = Field(default=0, description="Unix timestamp; 0 means publish immediately")
    attachments: list[str] = Field(
        default_factory=list,
        description="List of attachment strings like photo{owner_id}_{media_id}",
    )
    from_group: bool = True
    lat: float | None = None
    long: float | None = None
    close_comments: bool | None = None
    friends_only: bool | None = None
    signed: bool | None = None

    @field_validator("publish_date")
    @classmethod
    def validate_publish_date(cls, v: int) -> int:
        if v < 0:
            raise ValueError("publish_date must be >= 0 unix timestamp")
        return v

    @model_validator(mode="after")
    def validate_geo(self) -> "PostCreate":
        if (self.lat is None) ^ (self.long is None):
            raise ValueError("lat and long must be provided together")
        return self


class PostEdit(BaseModel):
    message: str | None = None
    publish_date: int | None = Field(default=None, description="Unix timestamp")
    attachments: list[str] | None = None
    from_group: bool | None = None
    lat: float | None = None
    long: float | None = None
    close_comments: bool | None = None
    friends_only: bool | None = None
    signed: bool | None = None

    @field_validator("publish_date")
    @classmethod
    def validate_publish_date(cls, v: int | None) -> int | None:
        if v is None:
            return v
        if v <= 0:
            raise ValueError("publish_date must be a positive unix timestamp")
        return v

    @model_validator(mode="after")
    def validate_geo(self) -> "PostEdit":
        if (self.lat is None) ^ (self.long is None):
            raise ValueError("lat and long must be provided together")
        return self


def parse_datetime_to_unix(value: str, tz: timezone = timezone.utc) -> int:
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=tz)
    return int(dt.timestamp())
