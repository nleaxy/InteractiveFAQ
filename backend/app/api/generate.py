import os
import json
import requests
from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from app.schemas.faq import FAQGenerationRequest, FAQGenerationResponse
from app.database.connection import get_db
from app.models.faq_project import FAQProject
from app.models.faq_item import FAQItem
from dotenv import load_dotenv

router = APIRouter(prefix="/v1/generate", tags=["Генерация FAQ"])

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") 

@router.post("/", response_model=FAQGenerationResponse, status_code=status.HTTP_200_OK)
async def generate_faq_by_description(
    payload: FAQGenerationRequest,
    project_id: int = Query(..., description="ID проекта (бизнеса), для которого генерируется FAQ"),
    db: Session = Depends(get_db)
):
    """
    Генерация структурированного FAQ на основе описания проекта/компании с помощью LLM
    и автоматическое сохранение сгенерированных вопросов в базу данных PostgreSQL.
    """
    project = db.query(FAQProject).filter(FAQProject.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Проект с ID {project_id} не найден в базе данных."
        )

    if not OPENROUTER_API_KEY in OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key is not configured.")

    system_prompt = (
        f"Ты — профессиональный технический писатель и аналитик поддержки пользователей.\n"
        f"Твоя задача — проанализировать описание компании/сервиса и составить список часто задаваемых вопросов (FAQ).\n\n"
        f"ТРЕБОВАНИЯ К КОНТЕНТУ:\n"
        f"1. Сгруппируй вопросы по логическим категориям (например: Оплата, Аккаунт, Технические вопросы, Общие вопросы).\n"
        f"2. Для каждого вопроса напиши краткий, понятный ответ.\n"
        f"3. К каждому вопросу придумай 3-4 абсолютно разных по формулировке синонима (сленг, короткие запросы, поисковые фразы) для обучения ML-модели умного поиска.\n"
        f"4. КРИТИЧЕСКОЕ ТРЕБОВАНИЕ: Суммарно во всех категориях вместе взятых должно быть СТРОГО {payload.count} вопросов. Не больше и не меньше.\n\n"
        f"КРИТИЧЕСКОЕ ТРЕБОВАНИЕ К ФОРМАТУ:\n"
        f"Верни ответ СТРОГО в формате JSON. Не пиши никаких вступлений, пояснений и мыслей. Не оборачивай JSON в маркдаун разметку ```json.\n"
        f"Структура JSON должна быть СТРОГО следующей:\n"
        f"{{\n"
        f'  "categories": [\n'
        f"    {{\n"
        f'      "category_name": "Название категории",\n'
        f'      "items": [\n'
        f"        {{\n"
        f'          "question": "Каноничный вопрос?",\n'
        f'          "answer": "Подробный ответ.",\n'
        f'          "synonyms": ["синоним 1", "синоним 2", "синоним 3"]\n'
        f"        }}\n"
        f"      ]\n"
        f"    }}\n"
        f"  ]\n"
        f"}}"
    )

    user_content = f"Вот описание проекта для генерации FAQ:\n\n{payload.description}"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        "temperature": 0.7
    }

    models_to_try = [
        "google/gemma-4-26b-a4b-it:free",
        "openrouter/free"
    ]
    
    raw_content = None
    last_error_detail = ""

    for model in models_to_try:
        body["model"] = model
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=body,
                timeout=60
            )
            
            if response.status_code == 200:
                result_json = response.json()
                raw_content = result_json["choices"][0]["message"]["content"].strip()
                break
            else:
                last_error_detail = f"Модель {model} вернула статус {response.status_code}: {response.text}"
                continue
                
        except requests.exceptions.RequestException as e:
            last_error_detail = f"Ошибка сети для {model}: {str(e)}"
            continue

    if not raw_content:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Все доступные модели OpenRouter перегружены или недоступны. Последняя ошибка: {last_error_detail}"
        )

    try:
        if raw_content.startswith("```"):
            raw_content = raw_content.strip("```json").strip("```").strip()

        parsed_data = json.loads(raw_content)

        print(f"Начало сохранения сгенерированного FAQ для проекта {project_id}...")

        for category_data in parsed_data.get("categories", []):
            category_name = category_data.get("category_name", "Общее")

            for item in category_data.get("items", []):
                faq_item = FAQItem(
                    project_id=project_id,
                    category=category_name,
                    question=item.get("question"),
                    answer=item.get("answer"),
                    synonyms=item.get("synonyms", [])
                )
                db.add(faq_item)

        db.commit()
        print("Сгенерированный FAQ успешно сохранен в базу данных!")

        return parsed_data

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail="Модель вернула некорректный формат JSON. Попробуйте еще раз."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"FAQ был успешно сгенерирован, но произошла ошибка при сохранении в базу данных: {str(e)}"
        )