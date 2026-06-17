from pydantic import BaseModel
from typing import List, Optional

class FAQBase(BaseModel):
    question: str
    answer: str
    synonyms: Optional[List[str]] = []

class FAQCreate(FAQBase):
    pass

class FAQResponse(FAQBase):
    id: int

    class Config:
        from_attributes = True