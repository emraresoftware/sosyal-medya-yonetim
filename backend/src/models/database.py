"""Asenkron SQLAlchemy veritabanı kurulumu."""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import pathlib

DB_DIR = pathlib.Path(__file__).parents[4] / "data"
DB_DIR.mkdir(exist_ok=True)
DATABASE_URL = f"sqlite+aiosqlite:///{DB_DIR}/sosyal.db"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def init_db():
    """Tabloları oluştur."""
    async with engine.begin() as conn:
        from src.models.account import SocialAccount  # noqa
        from src.models.post import Post  # noqa
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
