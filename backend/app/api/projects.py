from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database.connection import get_db
from app.models.faq_project import FAQProject
from app.models.faq_item import FAQItem
from app.schemas.auth_and_project import ProjectCreate, ProjectResponse, SettingsUpdate
from app.schemas.faq import FAQCreate, FAQResponse

router = APIRouter()

@router.get("", response_model=List[ProjectResponse], summary="Получить все проекты")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(FAQProject).all()
    response = []
    for p in projects:
        # Считаем количество вопросов в проекте через подзапрос
        q_count = db.query(FAQItem).filter(FAQItem.project_id == p.id).count()
        response.append({
            "id": p.id,
            "title": p.name,
            "slug": p.slug,
            "questionsCount": q_count,
            "createdAt": p.created_at.strftime("%d.%m.%Y")
        })
    return response

@router.post("", response_model=ProjectResponse, summary="Создать пустой проект")
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.query(FAQProject).filter(FAQProject.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Проект с таким URL-адресом (slug) уже существует")
    
    new_project = FAQProject(
        name=payload.title,
        slug=payload.slug,
        owner_id=1
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return {
        "id": new_project.id,
        "title": new_project.name,
        "slug": new_project.slug,
        "questionsCount": 0,
        "createdAt": new_project.created_at.strftime("%d.%m.%Y")
    }

@router.delete("/{projectId}", summary="Удалить проект")
def delete_project(projectId: int = Path(...), db: Session = Depends(get_db)):
    project = db.query(FAQProject).filter(FAQProject.id == projectId).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    db.delete(project)
    db.commit()
    return {"status": "success", "message": "Проект успешно удален"}



@router.get("/{projectId}/faqs", response_model=List[FAQResponse], summary="Получить все вопросы проекта")
def get_project_faqs(projectId: int = Path(...), db: Session = Depends(get_db)):
    faqs = db.query(FAQItem).filter(FAQItem.project_id == projectId).all()
    return faqs

@router.post("/{projectId}/faqs", response_model=FAQResponse, summary="Добавить вопрос вручную")
def create_faq_manual(payload: FAQCreate, projectId: int = Path(...), db: Session = Depends(get_db)):
    project = db.query(FAQProject).filter(FAQProject.id == projectId).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    
    new_faq = FAQItem(
        project_id=projectId,
        question=payload.question,
        answer=payload.answer,
        category=payload.category,
        synonyms=payload.synonyms
    )
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq

@router.put("/{projectId}/faqs/{faqId}", response_model=FAQResponse, summary="Редактировать вопрос")
def update_faq(payload: FAQCreate, projectId: int = Path(...), faqId: int = Path(...), db: Session = Depends(get_db)):
    faq = db.query(FAQItem).filter(FAQItem.id == faqId, FAQItem.project_id == projectId).first()
    if not faq:
        raise HTTPException(status_code=404, detail="Вопрос не найден в данном проекте")
    
    faq.question = payload.question
    faq.answer = payload.answer
    faq.category = payload.category
    faq.synonyms = payload.synonyms
    
    db.commit()
    db.refresh(faq)
    return faq

@router.delete("/{projectId}/faqs/{faqId}", summary="Удалить вопрос")
def delete_faq(projectId: int = Path(...), faqId: int = Path(...), db: Session = Depends(get_db)):
    faq = db.query(FAQItem).filter(FAQItem.id == faqId, FAQItem.project_id == projectId).first()
    if not faq:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    db.delete(faq)
    db.commit()
    return {"status": "success", "message": "Вопрос успешно удален"}



@router.patch("/{projectId}/settings", summary="Обновить настройки проекта")
def update_project_settings(payload: SettingsUpdate, projectId: int = Path(...), db: Session = Depends(get_db)):
    project = db.query(FAQProject).filter(FAQProject.id == projectId).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    
    project.popular_queries = payload.popularQueries
    db.commit()
    return {"status": "success", "message": "Настройки успешно сохранены", "popularQueries": project.popular_queries}