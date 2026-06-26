import os
import json
import io
import requests
from fastapi import APIRouter, HTTPException, status, Depends, Query, File, UploadFile, Form
from sqlalchemy.orm import Session
from app.schemas.faq import FAQGenerationRequest, FAQGenerationResponse
from app.database.connection import get_db
from app.models.faq_project import FAQProject
from app.models.faq_item import FAQItem
from dotenv import load_dotenv
from pypdf import PdfReader
import docx

router = APIRouter(prefix="/v1/generate", tags=["Генерация FAQ"])

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") 


async def extract_text_from_file(file: UploadFile) -> str:
    """Определяет тип файла и извлекает из него 'голый' текст"""
    filename = file.filename.lower()
    contents = await file.read()
    
    if filename.endswith(".txt"):
        try:
            return contents.decode("utf-8")
        except UnicodeDecodeError:
            return contents.decode("cp1251", errors="ignore")
            
    elif filename.endswith(".pdf"):
        try:
            pdf_file = io.BytesIO(contents)
            reader = PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Ошибка чтения PDF-файла: {str(e)}")
            
    elif filename.endswith((".docx", ".doc")):
        try:
            import io as io_module
            file_stream = io.BytesIO(contents)
            raise NotImplementedError
        except Exception:
            try:
                docx_file = io.BytesIO(contents)
                doc = docx.Document(docx_file)
                text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
                return text
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Ошибка чтения DOCX-файла: {str(e)}")
    else:
        raise HTTPException(
            status_code=400, 
            detail="Неподдерживаемый формат файла. Загрузите .txt, .pdf или .docx"
        )


def process_generation_and_save(text_content: str, count: int, project_id: int, db: Session) -> dict:
    """Отправляет текст в OpenRouter, парсит JSON и сохраняет в PostgreSQL"""
    
    if not text_content.strip():
        raise HTTPException(status_code=400, detail="Предоставленный текст пуст.")

    system_prompt = (
        f"Ты — профессиональный технический писатель и аналитик поддержки пользователей.\n"
        f"Твоя задача — проанализировать предоставленный текст (описание компании, документ, регламент или ТЗ) и составить список часто задаваемых вопросов (FAQ).\n\n"
        f"ТРЕБОВАНИЯ К КОНТЕНТУ:\n"
        f"1. Сгруппируй вопросы по логическим категориям (например: Оплата, Аккаунт, Технические вопросы, Общие вопросы).\n"
        f"2. Для каждого вопроса напиши краткий, понятный ответ.\n"
        f"3. К каждому вопросу придумай 3-4 абсолютно разных по формулировке синонима (сленг, короткие запросы, поисковые фразы) для обучения ML-модели умного поиска.\n"
        f"4. КРИТИЧЕСКОЕ ТРЕБОВАНИЕ: Суммарно во всех категориях вместе взятых должно быть СТРОГО {count} вопросов. Не больше и не меньше.\n\n"
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

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "google/gemma-4-26b-a4b-it:free",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Вот текст для генерации FAQ:\n\n{text_content[:8000]}"}
        ],
        "temperature": 0.7
    }

    models_to_try = ["google/gemma-4-26b-a4b-it:free", "openrouter/free"]
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
        except Exception as e:
            last_error_detail = f"Ошибка подключения к {model}: {str(e)}"

    if not raw_content:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Не удалось сгенерировать FAQ. Ошибка ИИ: {last_error_detail}"
        )

    try:
        if raw_content.startswith("```"):
            raw_content = raw_content.strip("```json").strip("```").strip()

        parsed_data = json.loads(raw_content)

        # Сохранение в базу данных
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
        return parsed_data

    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="ИИ вернул неверный формат JSON.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка сохранения результатов в базу: {str(e)}")


@router.post("/", response_model=FAQGenerationResponse, status_code=status.HTTP_200_OK)
async def generate_faq_by_description(
    payload: FAQGenerationRequest,
    project_id: int = Query(..., description="ID проекта"),
    db: Session = Depends(get_db)
):
    """Генерация FAQ на основе текстового описания"""
    project = db.query(FAQProject).filter(FAQProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
        
    return process_generation_and_save(payload.description, payload.count, project_id, db)


@router.post("/file", response_model=FAQGenerationResponse, status_code=status.HTTP_200_OK)
async def generate_faq_by_file(
    file: UploadFile = File(..., description="Документ в формате .txt, .pdf или .docx"),
    count: int = Form(5, ge=5, le=20, description="Количество вопросов для генерации"),
    project_id: int = Query(..., description="ID проекта"),
    db: Session = Depends(get_db)
):
    """Генерация FAQ на основе загруженного файла документации (PDF, DOCX, TXT)"""
    project = db.query(FAQProject).filter(FAQProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")

    extracted_text = await extract_text_from_file(file)
    
    return process_generation_and_save(extracted_text, count, project_id, db)