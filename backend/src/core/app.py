# Sosyal Medya Yönetim Aracı — Uygulama Fabrikası

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    from src.models.database import init_db
    await init_db()
    yield


def create_app() -> FastAPI:
    """Uygulama fabrikası — FastAPI uygulamasını oluşturur."""
    app = FastAPI(
        title="Sosyal Medya Yönetim Aracı",
        description="Tüm sosyal medya hesaplarının merkezi yönetimi, içerik planlama, zamanlama ve analitik paneli",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:3001"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Router'ları kaydet
    from src.api.v1.router import api_router
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health")
    async def health():
        return {"status": "ok", "app": "Sosyal Medya Yönetim Aracı"}

    return app
