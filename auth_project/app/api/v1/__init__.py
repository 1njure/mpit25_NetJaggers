from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.social_tokens import router as social_tokens_router
from app.api.v1.endpoints.vk_posting import router as vk_posting_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(social_tokens_router)
api_router.include_router(vk_posting_router)
