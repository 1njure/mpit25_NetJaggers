from __future__ import annotations

import asyncio
import contextlib
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Optional
import time

import aiohttp
from dotenv import load_dotenv

from .exceptions import (
    VKAPIError,
    VKAuthError,
    VKAccessDeniedError,
    VKClientError,
    VKNotFoundError,
    VKRateLimitError,
    vk_api_error_from_payload,
)
from .models import Post, PostCreate, PostEdit


logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class _CacheEntry:
    expires_at: float
    value: Any


class VKWallScheduler:
    def __init__(
        self,
        access_token: str,
        group_id: int,
        api_version: str = "5.199",
        *,
        timeout_s: float = 30.0,
        cache_ttl_s: float = 0.0,
    ):
        if not access_token:
            raise ValueError("access_token is required")
        if group_id == 0:
            raise ValueError("group_id must be non-zero")
        self._access_token = access_token
        self._group_id = group_id
        self._api_version = api_version
        self._timeout = aiohttp.ClientTimeout(total=timeout_s)
        self._session: aiohttp.ClientSession | None = None
        self._cache_ttl_s = float(cache_ttl_s)
        self._cache: dict[str, _CacheEntry] = {}
        self._max_retries = 3
        self._retry_base_delay_s = 0.35

    async def __aenter__(self) -> "VKWallScheduler":
        await self._ensure_session()
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.close()

    async def close(self) -> None:
        if self._session is not None and not self._session.closed:
            await self._session.close()
        self._session = None

    async def _ensure_session(self) -> None:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession(timeout=self._timeout)

    def _cache_get(self, key: str) -> Any | None:
        if self._cache_ttl_s <= 0:
            return None
        entry = self._cache.get(key)
        if not entry:
            return None
        if time.time() >= entry.expires_at:
            self._cache.pop(key, None)
            return None
        return entry.value

    def _cache_set(self, key: str, value: Any) -> None:
        if self._cache_ttl_s <= 0:
            return
        self._cache[key] = _CacheEntry(expires_at=time.time() + self._cache_ttl_s, value=value)

    def _sanitize_params_for_log(self, params: dict[str, Any]) -> dict[str, Any]:
        sanitized = dict(params)
        if "access_token" in sanitized:
            sanitized["access_token"] = "<redacted>"
        return sanitized

    async def _vk_call(self, method: str, params: dict[str, Any]) -> Any:
        await self._ensure_session()
        assert self._session is not None

        url = f"https://api.vk.com/method/{method}"
        req_params = {
            **params,
            "access_token": self._access_token,
            "v": self._api_version,
        }

        cache_key = None
        if method == "wall.get" and self._cache_ttl_s > 0:
            cache_key = f"{method}:{sorted(req_params.items())}"
            cached = self._cache_get(cache_key)
            if cached is not None:
                return cached

        attempt = 0
        while True:
            attempt += 1
            try:
                async with self._session.post(url, data=req_params) as resp:
                    data = await resp.json(content_type=None)
            except asyncio.TimeoutError as e:
                if attempt <= self._max_retries:
                    await asyncio.sleep(self._retry_base_delay_s * attempt)
                    continue
                raise VKClientError("VK request timed out") from e
            except aiohttp.ClientError as e:
                if attempt <= self._max_retries:
                    await asyncio.sleep(self._retry_base_delay_s * attempt)
                    continue
                raise VKClientError(f"VK HTTP client error: {e}") from e

            if "error" in data:
                err = data["error"]
                exc = vk_api_error_from_payload(err, method=method, params=self._sanitize_params_for_log(req_params))

                logger.warning(
                    "VK API error method=%s code=%s msg=%s attempt=%s",
                    method,
                    exc.error_code,
                    exc.error_msg,
                    attempt,
                )

                if exc.is_retryable and attempt <= self._max_retries:
                    await asyncio.sleep(self._retry_base_delay_s * attempt)
                    continue

                raise exc
            break

        result = data.get("response")
        if cache_key is not None:
            self._cache_set(cache_key, result)
        return result

    async def _upload_call(self, url: str, form: aiohttp.FormData) -> Any:
        await self._ensure_session()
        assert self._session is not None

        try:
            async with self._session.post(url, data=form) as resp:
                data = await resp.json(content_type=None)
        except asyncio.TimeoutError as e:
            raise VKClientError("VK upload request timed out") from e
        except aiohttp.ClientError as e:
            raise VKClientError(f"VK upload HTTP client error: {e}") from e

        return data

    def _owner_id(self) -> int:
        # VK wall methods expect negative owner_id for communities.
        return -abs(self._group_id)

    def _group_id_positive(self) -> int:
        return abs(self._group_id)

    def _validate_files_exist(self, paths: list[str | os.PathLike[str]]) -> list[Path]:
        result: list[Path] = []
        for p in paths:
            path = Path(p)
            if not path.exists() or not path.is_file():
                raise ValueError(f"file does not exist: {path}")
            result.append(path)
        return result

    @staticmethod
    def _to_attachment_string(kind: str, owner_id: int, media_id: int, access_key: str | None = None) -> str:
        base = f"{kind}{owner_id}_{media_id}"
        if access_key:
            return f"{base}_{access_key}"
        return base

    def _merge_attachments(self, *parts: Optional[list[str]]) -> list[str]:
        merged: list[str] = []
        for p in parts:
            if not p:
                continue
            merged.extend([x for x in p if x])
        seen: set[str] = set()
        uniq: list[str] = []
        for x in merged:
            if x in seen:
                continue
            seen.add(x)
            uniq.append(x)
        return uniq

    async def upload_wall_photos(self, photo_paths: list[str | os.PathLike[str]]) -> list[str]:
        paths = self._validate_files_exist(photo_paths)
        if not paths:
            return []
        if len(paths) > 5:
            raise ValueError("VK limits wall photo upload to 5 files per request")

        server = await self._vk_call(
            "photos.getWallUploadServer",
            {"group_id": self._group_id_positive()},
        )
        upload_url = (server or {}).get("upload_url")
        if not upload_url:
            raise VKClientError("VK returned no upload_url for photos")

        form = aiohttp.FormData()
        opened = []
        try:
            for i, path in enumerate(paths, start=1):
                f = path.open("rb")
                opened.append(f)
                form.add_field(
                    name=f"photo{i}",
                    value=f,
                    filename=path.name,
                    content_type="application/octet-stream",
                )

            uploaded = await self._upload_call(upload_url, form)
        finally:
            for f in opened:
                with contextlib.suppress(Exception):
                    f.close()

        photo = uploaded.get("photo")
        server_id = uploaded.get("server")
        upload_hash = uploaded.get("hash")
        if not photo or server_id is None or not upload_hash:
            raise VKClientError("VK photo upload returned unexpected response")

        saved = await self._vk_call(
            "photos.saveWallPhoto",
            {
                "group_id": self._group_id_positive(),
                "photo": photo,
                "server": server_id,
                "hash": upload_hash,
            },
        )
        if not isinstance(saved, list):
            raise VKClientError("VK photo save returned unexpected response")

        attachments: list[str] = []
        for item in saved:
            owner_id = int(item.get("owner_id"))
            media_id = int(item.get("id"))
            access_key = item.get("access_key")
            attachments.append(self._to_attachment_string("photo", owner_id, media_id, access_key))
        return attachments

    async def upload_videos(self, video_paths: list[str | os.PathLike[str]], *, name: str | None = None) -> list[str]:
        paths = self._validate_files_exist(video_paths)
        if not paths:
            return []

        attachments: list[str] = []
        for path in paths:
            resp = await self._vk_call(
                "video.save",
                {
                    "group_id": self._group_id_positive(),
                    "name": name or path.stem,
                    "wallpost": 0,
                },
            )
            upload_url = (resp or {}).get("upload_url")
            owner_id = (resp or {}).get("owner_id")
            video_id = (resp or {}).get("video_id")
            access_key = (resp or {}).get("access_key")
            if not upload_url:
                raise VKClientError("VK returned no upload_url for video")

            form = aiohttp.FormData()
            f = None
            try:
                f = path.open("rb")
                form.add_field(
                    name="video_file",
                    value=f,
                    filename=path.name,
                    content_type="application/octet-stream",
                )
                uploaded = await self._upload_call(upload_url, form)
            finally:
                if f is not None:
                    with contextlib.suppress(Exception):
                        f.close()

            if "error" in uploaded:
                raise VKClientError(f"VK video upload returned error: {uploaded.get('error')}")

            if owner_id is None or video_id is None:
                owner_id = uploaded.get("owner_id", owner_id)
                video_id = uploaded.get("video_id", video_id)

            if owner_id is None or video_id is None:
                raise VKClientError("VK video upload returned unexpected response")

            attachments.append(self._to_attachment_string("video", int(owner_id), int(video_id), access_key))

        return attachments

    async def upload_docs(self, doc_paths: list[str | os.PathLike[str]]) -> list[str]:
        paths = self._validate_files_exist(doc_paths)
        if not paths:
            return []

        attachments: list[str] = []
        for path in paths:
            server = await self._vk_call(
                "docs.getWallUploadServer",
                {"group_id": self._group_id_positive()},
            )
            upload_url = (server or {}).get("upload_url")
            if not upload_url:
                raise VKClientError("VK returned no upload_url for docs")

            form = aiohttp.FormData()
            f = None
            try:
                f = path.open("rb")
                form.add_field(
                    name="file",
                    value=f,
                    filename=path.name,
                    content_type="application/octet-stream",
                )
                uploaded = await self._upload_call(upload_url, form)
            finally:
                if f is not None:
                    with contextlib.suppress(Exception):
                        f.close()

            file_token = uploaded.get("file")
            if not file_token:
                raise VKClientError("VK doc upload returned unexpected response")

            saved = await self._vk_call(
                "docs.save",
                {
                    "file": file_token,
                    "title": path.stem,
                },
            )
            doc = (saved or {}).get("doc")
            if not doc:
                raise VKClientError("VK doc save returned unexpected response")
            owner_id = int(doc.get("owner_id"))
            media_id = int(doc.get("id"))
            access_key = doc.get("access_key")
            attachments.append(self._to_attachment_string("doc", owner_id, media_id, access_key))

        return attachments

    async def get_scheduled_posts(self, count: int = 10, offset: int = 0) -> list[Post]:
        if count <= 0 or count > 100:
            raise ValueError("count must be in 1..100")
        if offset < 0:
            raise ValueError("offset must be >= 0")

        resp = await self._vk_call(
            "wall.get",
            {
                "owner_id": self._owner_id(),
                "filter": "postponed",
                "count": count,
                "offset": offset,
            },
        )
        items = (resp or {}).get("items", [])
        return [Post.model_validate(x) for x in items]

    async def get_post_by_id(self, post_id: int) -> Post | None:
        if post_id <= 0:
            raise ValueError("post_id must be positive")

        resp = await self._vk_call(
            "wall.getById",
            {
                "posts": f"{self._owner_id()}_{post_id}",
            },
        )
        if not resp:
            return None
        return Post.model_validate(resp[0])

    async def create_scheduled_post(
        self,
        message: str,
        publish_date: int = 0,
        attachments: Optional[list[str]] = None,
        photo_paths: Optional[list[str | os.PathLike[str]]] = None,
        doc_paths: Optional[list[str | os.PathLike[str]]] = None,
        video_paths: Optional[list[str | os.PathLike[str]]] = None,
        from_group: bool = True,
        **kwargs: Any,
    ) -> int:
        uploaded_photos: list[str] = []
        uploaded_docs: list[str] = []
        uploaded_videos: list[str] = []
        if photo_paths:
            uploaded_photos = await self.upload_wall_photos(list(photo_paths))
        if doc_paths:
            uploaded_docs = await self.upload_docs(list(doc_paths))
        if video_paths:
            uploaded_videos = await self.upload_videos(list(video_paths))

        merged_attachments = self._merge_attachments(attachments or [], uploaded_photos, uploaded_docs, uploaded_videos)

        payload = PostCreate(
            message=message,
            publish_date=publish_date,
            attachments=merged_attachments,
            from_group=from_group,
            **kwargs,
        )

        params: dict[str, Any] = {
            "owner_id": self._owner_id(),
            "message": payload.message,
            "from_group": 1 if payload.from_group else 0,
        }
        if payload.publish_date and payload.publish_date > 0:
            params["publish_date"] = payload.publish_date
        if payload.attachments:
            params["attachments"] = ",".join(payload.attachments)
        if payload.lat is not None:
            params["lat"] = payload.lat
            params["long"] = payload.long
        if payload.close_comments is not None:
            params["close_comments"] = 1 if payload.close_comments else 0
        if payload.friends_only is not None:
            params["friends_only"] = 1 if payload.friends_only else 0
        if payload.signed is not None:
            params["signed"] = 1 if payload.signed else 0

        resp = await self._vk_call("wall.post", params)
        post_id = int((resp or {}).get("post_id", 0))
        if post_id <= 0:
            raise VKClientError("VK returned invalid post_id")
        return post_id

    async def edit_scheduled_post(self, post_id: int, **kwargs: Any) -> bool:
        if post_id <= 0:
            raise ValueError("post_id must be positive")

        photo_paths = kwargs.pop("photo_paths", None)
        doc_paths = kwargs.pop("doc_paths", None)
        video_paths = kwargs.pop("video_paths", None)
        payload = PostEdit(**kwargs)

        uploaded_photos: list[str] = []
        uploaded_docs: list[str] = []
        uploaded_videos: list[str] = []
        if photo_paths:
            uploaded_photos = await self.upload_wall_photos(list(photo_paths))
        if doc_paths:
            uploaded_docs = await self.upload_docs(list(doc_paths))
        if video_paths:
            uploaded_videos = await self.upload_videos(list(video_paths))

        params: dict[str, Any] = {
            "owner_id": self._owner_id(),
            "post_id": post_id,
        }
        if payload.message is not None:
            params["message"] = payload.message
        if payload.publish_date is not None:
            params["publish_date"] = payload.publish_date
        if payload.from_group is not None:
            params["from_group"] = 1 if payload.from_group else 0
        if payload.attachments is not None or uploaded_photos or uploaded_docs or uploaded_videos:
            merged_attachments = self._merge_attachments(payload.attachments or [], uploaded_photos, uploaded_docs, uploaded_videos)
            params["attachments"] = ",".join(merged_attachments)
        if payload.lat is not None:
            params["lat"] = payload.lat
            params["long"] = payload.long
        if payload.close_comments is not None:
            params["close_comments"] = 1 if payload.close_comments else 0
        if payload.friends_only is not None:
            params["friends_only"] = 1 if payload.friends_only else 0
        if payload.signed is not None:
            params["signed"] = 1 if payload.signed else 0

        resp = await self._vk_call("wall.edit", params)
        return bool(resp == 1 or (isinstance(resp, dict) and resp.get("success") == 1))

    async def delete_scheduled_post(self, post_id: int) -> bool:
        if post_id <= 0:
            raise ValueError("post_id must be positive")

        resp = await self._vk_call(
            "wall.delete",
            {
                "owner_id": self._owner_id(),
                "post_id": post_id,
            },
        )
        return bool(resp == 1)


def load_scheduler_from_env() -> VKWallScheduler:
    load_dotenv()

    token = os.getenv("VK_ACCESS_TOKEN", "")
    group_id_raw = os.getenv("VK_GROUP_ID", "0")
    api_version = os.getenv("VK_API_VERSION", "5.199")
    cache_ttl_s = float(os.getenv("VK_CACHE_TTL_S", "0") or "0")

    try:
        group_id = int(group_id_raw)
    except ValueError as e:
        raise ValueError("VK_GROUP_ID must be an integer") from e

    return VKWallScheduler(
        access_token=token,
        group_id=group_id,
        api_version=api_version,
        cache_ttl_s=cache_ttl_s,
    )
