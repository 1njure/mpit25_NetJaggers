from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import ValidationError as PydanticValidationError

from app.core.config import settings
from app.core.security import decrypt_secret
from app.dependencies import get_current_user, rate_limit
from app.redis_client import get_redis_client
from app.schemas.vk_posting import (
    VKOkResponse,
    VKPostCreateRequest,
    VKPostIdResponse,
    VKPostList,
    VKPostPublic,
    VKPostEditRequest,
)

from vkposting.exceptions import (
    VKAccessDeniedError,
    VKAPIError,
    VKAuthError,
    VKCaptchaRequiredError,
    VKFloodControlError,
    VKInternalServerError,
    VKNotFoundError,
    VKRateLimitError,
    VKUnknownMethodError,
    VKValidationRequiredError,
)
from vkposting.wall_scheduler import VKWallScheduler

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/vk-posting", tags=["vk-posting"])


def _token_key(user_id: str, provider: str) -> str:
    return f"social_tokens:token:{user_id}:{provider}"


def _http_error_from_vk(exc: VKAPIError) -> HTTPException:
    if isinstance(exc, VKAuthError):
        return HTTPException(status_code=401, detail=str(exc))
    if isinstance(exc, VKAccessDeniedError):
        return HTTPException(status_code=403, detail=str(exc))
    if isinstance(exc, VKRateLimitError):
        return HTTPException(status_code=429, detail=str(exc))
    if isinstance(exc, (VKValidationRequiredError, VKCaptchaRequiredError)):
        return HTTPException(status_code=409, detail=str(exc))
    if isinstance(exc, (VKFloodControlError, VKInternalServerError)):
        return HTTPException(status_code=502, detail=str(exc))
    if isinstance(exc, (VKUnknownMethodError, VKNotFoundError)):
        return HTTPException(status_code=502, detail=str(exc))

    return HTTPException(status_code=502, detail=str(exc))


async def _get_vk_scheduler(*, user_id) -> VKWallScheduler:
    if settings.vk_group_id == 0:
        raise HTTPException(status_code=500, detail="VK_GROUP_ID is not configured")

    group_id = abs(int(settings.vk_group_id))
    if group_id == 0:
        raise HTTPException(status_code=500, detail="VK_GROUP_ID is not configured")

    redis = get_redis_client()
    token_data = await redis.hgetall(_token_key(str(user_id), "vk"))
    if not token_data:
        raise HTTPException(status_code=404, detail="VK token is not set for this user")

    access_token = decrypt_secret(token_data.get("access_token", ""))

    return VKWallScheduler(
        access_token=access_token,
        group_id=group_id,
        api_version=settings.vk_api_version,
        cache_ttl_s=float(settings.vk_cache_ttl_s),
    )


@router.get("", response_model=VKPostList, dependencies=[Depends(rate_limit)])
async def list_scheduled_posts(
    count: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user=Depends(get_current_user),
) -> VKPostList:
    scheduler = await _get_vk_scheduler(user_id=user.id)
    try:
        async with scheduler:
            posts = await scheduler.get_scheduled_posts(count=count, offset=offset)
    except VKAPIError as exc:
        raise _http_error_from_vk(exc)

    return VKPostList(items=[VKPostPublic.model_validate(p.model_dump()) for p in posts])


@router.get("/{post_id}", response_model=VKPostPublic, dependencies=[Depends(rate_limit)])
async def get_scheduled_post(
    post_id: int,
    user=Depends(get_current_user),
) -> VKPostPublic:
    scheduler = await _get_vk_scheduler(user_id=user.id)
    try:
        async with scheduler:
            post = await scheduler.get_post_by_id(post_id)
    except VKAPIError as exc:
        raise _http_error_from_vk(exc)

    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    return VKPostPublic.model_validate(post.model_dump())


@router.post("", response_model=VKPostIdResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(rate_limit)])
async def create_scheduled_post(
    payload: VKPostCreateRequest,
    user=Depends(get_current_user),
) -> VKPostIdResponse:
    scheduler = await _get_vk_scheduler(user_id=user.id)
    try:
        async with scheduler:
            post_id = await scheduler.create_scheduled_post(**payload.model_dump())
    except (ValueError, PydanticValidationError) as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except VKAPIError as exc:
        raise _http_error_from_vk(exc)

    return VKPostIdResponse(post_id=post_id)


@router.patch("/{post_id}", response_model=VKOkResponse, dependencies=[Depends(rate_limit)])
async def edit_scheduled_post(
    post_id: int,
    payload: VKPostEditRequest,
    user=Depends(get_current_user),
) -> VKOkResponse:
    scheduler = await _get_vk_scheduler(user_id=user.id)

    data = payload.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=422, detail="No fields to update")

    try:
        async with scheduler:
            ok = await scheduler.edit_scheduled_post(post_id, **data)
    except VKAPIError as exc:
        raise _http_error_from_vk(exc)

    return VKOkResponse(ok=bool(ok))


@router.delete("/{post_id}", response_model=VKOkResponse, dependencies=[Depends(rate_limit)])
async def delete_scheduled_post(
    post_id: int,
    user=Depends(get_current_user),
) -> VKOkResponse:
    scheduler = await _get_vk_scheduler(user_id=user.id)
    try:
        async with scheduler:
            ok = await scheduler.delete_scheduled_post(post_id)
    except VKAPIError as exc:
        raise _http_error_from_vk(exc)

    return VKOkResponse(ok=bool(ok))
