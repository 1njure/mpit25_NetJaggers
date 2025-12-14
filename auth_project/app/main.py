from __future__ import annotations

import asyncio
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.config import settings
from app.redis_client import close_redis_client, get_redis_client

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s [%(name)s] %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(title="Auth Project", version="1.0.0")


if settings.cors_origins:
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
else:
    origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def on_startup() -> None:
    app.state.redis = get_redis_client()
    last_exc: Exception | None = None
    for _ in range(10):
        try:
            await app.state.redis.ping()
            logger.info("Redis connected")
            return
        except Exception as exc:
            last_exc = exc
            await asyncio.sleep(1)

    if last_exc is not None:
        logger.warning("Redis connection failed: %s", last_exc)


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await close_redis_client()
