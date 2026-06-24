from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database.connection import get_db
from app.models.faq_item import FAQItem
from app.models.faq_project import FAQProject

router = APIRouter()

@router.get("/search", summary="Интеллектуальный поиск по FAQ")
def search_faq(
    request: Request,
    project_id: int = Query(..., description="ID проекта, в котором ищем"),
    query: str = Query(..., description="Поисковый запрос пользователя"),
    threshold: float = Query(0.40, description="Порог уверенности модели (0.0 - 1.0)"),
    db: Session = Depends(get_db)
):
    project = db.query(FAQProject).filter(FAQProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    faq_db_items = db.query(FAQItem).filter(FAQItem.project_id == project_id).all()
    if not faq_db_items:
        return {"query": query, "matched": False, "result": None, "score": 0.0}

    flatten_questions = []
    faq_mapping = {}

    for item in faq_db_items:
        all_variants = [item.question] + (item.synonyms or [])
        for variant in all_variants:
            flatten_questions.append(variant)
            faq_mapping[variant] = item

    synonymizer = request.app.state.synonymizer

    synonymizer.update_database(flatten_questions)

    matched_text, score = synonymizer.find_closest_faq(query, threshold=threshold)

    if matched_text:
        original_faq = faq_mapping[matched_text]
        return {
            "query": query,
            "matched": True,
            "score": round(score, 4),
            "matched_by_text": matched_text,
            "result": {
                "id": original_faq.id,
                "question": original_faq.question,
                "answer": original_faq.answer,
                "category": original_faq.category
            }
        }
    else:
        return {
            "query": query,
            "matched": False,
            "score": round(score, 4),
            "result": None,
            "message": "Совпадений не найдено (запрос не по теме)"
        }