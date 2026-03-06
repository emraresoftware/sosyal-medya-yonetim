"""Hesap API — sosyal medya hesapları CRUD."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.models.database import get_db
from src.models.account import SocialAccount
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/accounts", tags=["Hesaplar"])

PLATFORM_ICONS = {
    "twitter": "𝕏", "instagram": "📸", "facebook": "👤",
    "linkedin": "💼", "tiktok": "🎵", "youtube": "▶️",
}


class AccountCreate(BaseModel):
    platform: str
    username: str
    display_name: Optional[str] = ""
    access_token: Optional[str] = ""
    followers: Optional[int] = 0


@router.get("/")
async def list_accounts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SocialAccount).where(SocialAccount.is_active == True))
    accounts = result.scalars().all()
    data = [a.to_dict() for a in accounts]
    for a in data:
        a["icon"] = PLATFORM_ICONS.get(a["platform"], "🌐")
    return {"accounts": data, "total": len(data)}


@router.post("/")
async def create_account(body: AccountCreate, db: AsyncSession = Depends(get_db)):
    account = SocialAccount(
        platform=body.platform,
        username=body.username,
        display_name=body.display_name or body.username,
        access_token=body.access_token or "",
        followers=body.followers or 0,
    )
    db.add(account)
    await db.commit()
    await db.refresh(account)
    return {"success": True, "account": account.to_dict()}


@router.delete("/{account_id}")
async def delete_account(account_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SocialAccount).where(SocialAccount.id == account_id))
    account = result.scalar_one_or_none()
    if not account:
        return {"success": False, "error": "Hesap bulunamadı"}
    account.is_active = False
    await db.commit()
    return {"success": True}


@router.get("/platforms")
async def get_platforms():
    return {"platforms": [
        {"id": "twitter",   "name": "X (Twitter)",  "icon": "𝕏",  "color": "#000000"},
        {"id": "instagram", "name": "Instagram",    "icon": "📸", "color": "#E1306C"},
        {"id": "facebook",  "name": "Facebook",     "icon": "👤", "color": "#1877F2"},
        {"id": "linkedin",  "name": "LinkedIn",     "icon": "💼", "color": "#0A66C2"},
        {"id": "tiktok",    "name": "TikTok",       "icon": "🎵", "color": "#010101"},
        {"id": "youtube",   "name": "YouTube",      "icon": "▶️", "color": "#FF0000"},
    ]}
