from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, model_validator


class VKPostPublic(BaseModel):
    id: int
    owner_id: int
    from_id: int | None = None
    date: int | None = None
    text: str = ""
    attachments: list[dict[str, Any]] = Field(default_factory=list)
    postponed_id: int | None = None


class VKPostList(BaseModel):
    items: list[VKPostPublic]


class VKPostCreateRequest(BaseModel):
    message: str = Field(min_length=1)
    publish_date: int = Field(ge=0, description="Unix timestamp; 0 means publish immediately")
    attachments: list[str] = Field(default_factory=list)
    from_group: bool = True


class VKPostEditRequest(BaseModel):
    message: str | None = None
    publish_date: int | None = Field(default=None, description="Unix timestamp")
    attachments: list[str] | None = None
    from_group: bool | None = None
    lat: float | None = None
    long: float | None = None
    close_comments: bool | None = None
    friends_only: bool | None = None
    signed: bool | None = None

    @model_validator(mode="after")
    def _validate_geo(self) -> "VKPostEditRequest":
        if (self.lat is None) ^ (self.long is None):
            raise ValueError("lat and long must be provided together")
        return self


class VKPostIdResponse(BaseModel):
    post_id: int


class VKOkResponse(BaseModel):
    ok: bool
