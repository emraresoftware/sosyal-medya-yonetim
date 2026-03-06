"""Analitik API — platform ve içerik istatistikleri."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from src.models.database import get_db
from src.models.post import Post
from src.models.account import SocialAccount

router = APIRouter(prefix="/analytics", tags=["Analitik"])


@router.get("/overview")
async def get_overview(db: AsyncSession = Depends(get_db)):
    """Genel istatistik özeti."""
    accounts_result = await db.execute(
        select(func.count(SocialAccount.id)).where(SocialAccount.is_active == True)
    )
    total_accounts = accounts_result.scalar() or 0

    posts_result = await db.execute(select(func.count(Post.id)))
    total_posts = posts_result.scalar() or 0

    published_result = await db.execute(
        select(func.count(Post.id)).where(Post.status == "published")
    )
    total_published = published_result.scalar() or 0

    scheduled_result = await db.execute(
        select(func.count(Post.id)).where(Post.status == "scheduled")
    )
    total_scheduled = scheduled_result.scalar() or 0

    draft_result = await db.execute(
        select(func.count(Post.id)).where(Post.status == "draft")
    )
    total_draft = draft_result.scalar() or 0

    followers_result = await db.execute(
        select(func.sum(SocialAccount.followers)).where(SocialAccount.is_active == True)
    )
    total_followers = followers_result.scalar() or 0

    return {
        "accounts": total_accounts,
        "total_posts": total_posts,
        "published": total_published,
        "scheduled": total_scheduled,
        "drafts": total_draft,
        "total_followers": total_followers,
        "engagement_rate": "3.8%",   # TODO: gerçek hesaplama
        "reach_this_week": 0,
    }


@router.get("/platforms")
async def get_platform_stats(db: AsyncSession = Depends(get_db)):
    """Platform bazlı istatistikler."""
    result = await db.execute(
        select(SocialAccount).where(SocialAccount.is_active == True)
    )
    accounts = result.scalars().all()
    stats = {}
    for a in accounts:
        if a.platform not in stats:
            stats[a.platform] = {"accounts": 0, "followers": 0}
        stats[a.platform]["accounts"] += 1
        stats[a.platform]["followers"] += a.followers
    return {"platforms": stats}
