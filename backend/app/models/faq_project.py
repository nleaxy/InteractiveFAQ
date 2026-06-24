from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from app.database.connection import Base

class FAQProject(Base):
    __tablename__ = "faq_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # Название (title)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    popular_queries = Column(Text, nullable=True, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())