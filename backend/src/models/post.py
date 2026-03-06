"""İçerik / gönderi modeli."""
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from src.models.database import Base
import uuid


class Post(Base):
    __tablename__ = "posts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    # draft | scheduled | published | failed
    status = Column(String, default="draft")
    content = Column(Text, nullable=False)
    media_urls = Column(JSON, default=list)             # görsel/video URL listesi
    platforms = Column(JSON, default=list)             # ["twitter", "instagram", ...]
    account_ids = Column(JSON, default=list)           # bağlı hesap id'leri
    hashtags = Column(JSON, default=list)
    scheduled_at = Column(DateTime, nullable=True)     # null = taslak
    published_at = Column(DateTime, nullable=True)
    likes = Column(String, default="0")
    comments = Column(String, default="0")
    shares = Column(String, default="0")
    impressions = Column(String, default="0")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "content": self.content,
            "media_urls": self.media_urls or [],
            "platforms": self.platforms or [],
            "account_ids": self.account_ids or [],
            "hashtags": self.hashtags or [],
            "scheduled_at": str(self.scheduled_at) if self.scheduled_at else None,
            "published_at": str(self.published_at) if self.published_at else None,
            "likes": self.likes,
            "comments": self.comments,
            "shares": self.shares,
            "impressions": self.impressions,
            "created_at": str(self.created_at),
        }
