"""Sosyal medya hesabı modeli."""
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from src.models.database import Base
import uuid


class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    platform = Column(String, nullable=False)          # twitter, instagram, facebook, linkedin, tiktok
    username = Column(String, nullable=False)
    display_name = Column(String, default="")
    access_token = Column(String, default="")
    refresh_token = Column(String, default="")
    is_active = Column(Boolean, default=True)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    post_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "platform": self.platform,
            "username": self.username,
            "display_name": self.display_name,
            "is_active": self.is_active,
            "followers": self.followers,
            "following": self.following,
            "post_count": self.post_count,
            "created_at": str(self.created_at),
        }
