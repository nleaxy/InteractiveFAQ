from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.faq import FAQCreate, FAQResponse

router = APIRouter()

# временная имитация бд для тестов фронта
TEMP_DB = [
    {"id": 1, "question": "Как восстановить пароль?", "answer": "Нажмите на кнопку...", "synonyms": ["забыл пароль", "сбросить пароль"]}
]

@router.get("/faqs", response_model=List[FAQResponse], summary="Получить все FAQ")
def get_all_faqs():
    return TEMP_DB

@router.post("/faqs", response_model=FAQResponse, summary="Создать новый FAQ")
def create_faq(payload: FAQCreate):
    new_faq = {
        "id": len(TEMP_DB) + 1,
        "question": payload.question,
        "answer": payload.answer,
        "synonyms": payload.synonyms
    }
    TEMP_DB.append(new_faq)
    return new_faq