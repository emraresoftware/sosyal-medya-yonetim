"""Gönderi API — içerik oluştur, zamanla, listele."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from src.models.database import get_db
from src.models.post import Post
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/posts", tags=["Gönderiler"])


class PostCreate(BaseModel):
    content: str
    platforms: List[str] = []
    account_ids: List[str] = []
    hashtags: List[str] = []
    media_urls: List[str] = []
    scheduled_at: Optional[str] = None   # ISO format veya null


class PostUpdate(BaseModel):
    content: Optional[str] = None
    scheduled_at: Optional[str] = None
    status: Optional[str] = None


@router.get("/")
async def list_posts(status: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(Post).order_by(Post.created_at.desc())
    if status:
        query = query.where(Post.status == status)
    result = await db.execute(query)
    posts = result.scalars().all()
    return {"posts": [p.to_dict() for p in posts], "total": len(posts)}


@router.post("/")
async def create_post(body: PostCreate, db: AsyncSession = Depends(get_db)):
    scheduled = None
    status = "draft"
    if body.scheduled_at:
        try:
            scheduled = datetime.fromisoformat(body.scheduled_at)
            status = "scheduled"
        except ValueError:
            pass

    post = Post(
        content=body.content,
        platforms=body.platforms,
        account_ids=body.account_ids,
        hashtags=body.hashtags,
        media_urls=body.media_urls,
        scheduled_at=scheduled,
        status=status,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return {"success": True, "post": post.to_dict()}


@router.put("/{post_id}")
async def update_post(post_id: str, body: PostUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        return {"success": False, "error": "Gönderi bulunamadı"}
    if body.content is not None:
        post.content = body.content
    if body.status is not None:
        post.status = body.status
    if body.scheduled_at is not None:
        post.scheduled_at = datetime.fromisoformat(body.scheduled_at)
        post.status = "scheduled"
    await db.commit()
    return {"success": True, "post": post.to_dict()}


@router.delete("/{post_id}")
async def delete_post(post_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        return {"success": False, "error": "Gönderi bulunamadı"}
    await db.delete(post)
    await db.commit()
    return {"success": True}


@router.post("/{post_id}/publish")
async def publish_now(post_id: str, db: AsyncSession = Depends(get_db)):
    """Anında yayınla (simülasyon — gerçek API entegrasyonu TODO)."""
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        return {"success": False, "error": "Gönderi bulunamadı"}
    post.status = "published"
    post.published_at = datetime.utcnow()
    await db.commit()
    return {"success": True, "message": f"'{post.content[:40]}...' yayınlandı"}
