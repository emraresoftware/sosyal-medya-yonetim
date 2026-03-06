# Sosyal Medya Yönetim Aracı — API v1 Router

from fastapi import APIRouter
from src.api.v1.accounts import router as accounts_router
from src.api.v1.posts import router as posts_router
from src.api.v1.analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(accounts_router)
api_router.include_router(posts_router)
api_router.include_router(analytics_router)


@api_router.get("/")
async def root():
    return {"message": "Sosyal Medya Yönetim Aracı API v1", "status": "active"}


@api_router.get("/info")
async def info():
    return {
        "app": "Sosyal Medya Yönetim Aracı",
        "version": "0.1.0",
        "endpoints": ["/accounts", "/posts", "/analytics"],
    }
