from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.user import UserPublic


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class SigninRequest(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=1)


class SignupResponse(BaseModel):
    user: UserPublic
    tokens: TokenPair


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=20)


class LogoutRequest(BaseModel):
    refresh_token: str = Field(min_length=20)
