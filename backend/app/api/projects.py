from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.faq_project import FAQProject
from app.models.faq_item import FAQItem
from app.models.user import User
from app.schemas.auth_and_project import ProjectCreate, ProjectResponse, SettingsUpdate
from app.schemas.faq import FAQCreate, FAQResponse
from app.core.security import get_current_user

router = APIRouter()

@router.get("", response_model=List[ProjectResponse], summary="Получить проекты текущего пользователя")
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = db.query(FAQProject).filter(FAQProject.owner_id == current_user.id).all()
    
    response = []
    for p in projects:
        q_count = db.query(FAQItem).filter(FAQItem.project_id == p.id).count()
        response.append({
            "id": p.id,
            "title": p.name,
            "slug": p.slug,
            "questionsCount": q_count,
            "createdAt": p.created_at.strftime("%d.%m.%Y")
        })
    return response

@router.get("/slug/{slug}", response_model=ProjectResponse, summary="Получить проект по его Slug (Публичный)")
def get_project_by_slug(slug: str = Path(...), db: Session = Depends(get_db)):
    project = db.query(FAQProject).filter(FAQProject.slug == slug).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    
    q_count = db.query(FAQItem).filter(FAQItem.project_id == project.id).count()
    return {
        "id": project.id,
        "title": project.name,
        "slug": project.slug,
        "questionsCount": q_count,
        "createdAt": project.created_at.strftime("%d.%m.%Y")
    }

@router.post("", response_model=ProjectResponse, summary="Создать пустой проект")
def create_project(
    payload: ProjectCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(FAQProject).filter(FAQProject.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Проект с таким URL-адресом (slug) уже существует")
    
    new_project = FAQProject(
        name=payload.title,
        slug=payload.slug,
        owner_id=current_user.id
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

@router.get("/public", response_model=List[ProjectResponse], summary="Получить все проекты базы данных (Публичный каталог)")
def get_public_projects_catalog(db: Session = Depends(get_db)):
    """
    Возвращает список вообще всех проектов в системе для публичного каталога на главной странице.
    Авторизация (токен) НЕ требуется.
    """
    projects = db.query(FAQProject).all()
    
    response = []
    for p in projects:
        q_count = db.query(FAQItem).filter(FAQItem.project_id == p.id).count()
        response.append({
            "id": p.id,
            "title": p.name,
            "slug": p.slug,
            "questionsCount": q_count,
            "createdAt": p.created_at.strftime("%d.%m.%Y")
        })
    return response

@router.delete("/{projectId}", summary="Удалить проект")
def delete_project(
    projectId: int = Path(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(FAQProject).filter(FAQProject.id == projectId, FAQProject.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден или у вас нет прав на его удаление")
    db.delete(project)
    db.commit()
    return {"status": "success", "message": "Проект успешно удален"}


@router.get("/{projectId}/faqs", response_model=List[FAQResponse], summary="Получить все вопросы проекта (Публичный)")
def get_project_faqs(projectId: int = Path(...), db: Session = Depends(get_db)):
    faqs = db.query(FAQItem).filter(FAQItem.project_id == projectId).all()
    return faqs

@router.post("/{projectId}/faqs", response_model=FAQResponse, summary="Добавить вопрос вручную")
def create_faq_manual(
    payload: FAQCreate, 
    projectId: int = Path(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(FAQProject).filter(FAQProject.id == projectId, FAQProject.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден или у вас нет прав на редактирование")
    
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
def update_faq(
    payload: FAQCreate, 
    projectId: int = Path(...), 
    faqId: int = Path(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(FAQProject).filter(FAQProject.id == projectId, FAQProject.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="У вас нет прав на редактирование этого проекта")

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
def delete_faq(
    projectId: int = Path(...), 
    faqId: int = Path(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(FAQProject).filter(FAQProject.id == projectId, FAQProject.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="У вас нет прав на редактирование этого проекта")

    faq = db.query(FAQItem).filter(FAQItem.id == faqId, FAQItem.project_id == projectId).first()
    if not faq:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    db.delete(faq)
    db.commit()
    return {"status": "success", "message": "Вопрос успешно удален"}


@router.patch("/{projectId}/settings", summary="Обновить настройки проекта")
def update_project_settings(
    payload: SettingsUpdate, 
    projectId: int = Path(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(FAQProject).filter(FAQProject.id == projectId, FAQProject.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден или у вас нет к нему доступа")
    
    project.popular_queries = payload.popularQueries
    db.commit()
    return {"status": "success", "message": "Настройки успешно сохранены", "popularQueries": project.popular_queries}