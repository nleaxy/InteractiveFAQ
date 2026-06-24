from sqlalchemy import Column, Integer, String, Text, ForeignKey, ARRAY
from app.database.connection import Base

class FAQItem(Base):
    __tablename__ = "faq_items"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("faq_projects.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), default="Общее", nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    
    synonyms = Column(ARRAY(String), nullable=True)