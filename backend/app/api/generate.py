import os
import json
import requests
from fastapi import APIRouter, HTTPException, status
from app.schemas.faq import FAQGenerationRequest, FAQGenerationResponse
from dotenv import load_dotenv

# Инициализируем роутер
router = APIRouter(prefix="/v1/generate", tags=["Генерация FAQ"])

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") 

@router.post("/", response_model=FAQGenerationResponse, status_code=status.HTTP_200_OK)
async def generate_faq_by_description(payload: FAQGenerationRequest):
    """
    Генерация структурированного FAQ на основе описания проекта/компании с помощью LLM.
    В случае перегрузки Gemma, автоматически переключается на резервный бесплатный пул.
    """
    if not OPENROUTER_API_KEY or "ТВОЙ_КЛЮЧ" in OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key is not configured.")

    # Динамический системный промпт с интеграцией payload.count
    # Двойные фигурные скобки {{ }} нужны, чтобы Python не путал их с переменными f-строки
    system_prompt = (
        f"Ты — профессиональный технический писатель и аналитик поддержки пользователей.\n"
        f"Твоя задача — проанализировать описание компании/сервиса и составить список часто задаваемых вопросов (FAQ).\n\n"
        f"ТРЕБОВАНИЯ К КОНТЕНТУ:\n"
        f"1. Сгруппируй вопросы по логическим категориям (например: Оплата, Аккаунт, Технические вопросы, Общие вопросы).\n"
        f"2. Для каждого вопроса напиши четкий, понятный ответ.\n"
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

    # Список моделей для каскадной проверки (Gemma в приоритете, авто-роут как бэкап)
    models_to_try = [
        "google/gemma-4-26b-a4b-it:free",
        "openrouter/free"
    ]
    
    raw_content = None
    last_error_detail = ""

    # Пытаемся достучаться до моделей по очереди
    for model in models_to_try:
        body["model"] = model
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=body,
                timeout=60
            )
            
            # Если модель ответила успешно, забираем контент и выходим из цикла
            if response.status_code == 200:
                result_json = response.json()
                raw_content = result_json["choices"][0]["message"]["content"].strip()
                break
            else:
                last_error_detail = f"Модель {model} вернула статус {response.status_code}: {response.text}"
                continue # Пробуем следующую модель в списке
                
        except requests.exceptions.RequestException as e:
            last_error_detail = f"Ошибка сети для {model}: {str(e)}"
            continue

    # Если ни одна модель из списка не смогла отдать результат
    if not raw_content:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Все доступные модели OpenRouter перегружены или недоступны. Последняя ошибка: {last_error_detail}"
        )

    try:
        # На всякий случай очищаем от возможных markdown-кавычек
        if raw_content.startswith("```"):
            raw_content = raw_content.strip("```json").strip("```").strip()

        # Парсим строку в настоящий Python-словарь
        parsed_data = json.loads(raw_content)
        return parsed_data

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail="Модель вернула некорректный формат JSON. Попробуйте еще раз."
        )