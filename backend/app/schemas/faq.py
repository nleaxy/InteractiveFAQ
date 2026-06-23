from pydantic import BaseModel, Field
from typing import List, Optional

class FAQBase(BaseModel):
    """ Базовая структура вопроса-ответа, общая для всех этапов """
    question: str
    answer: str
    synonyms: Optional[List[str]] = [] # По умолчанию пустой список, если синонимов нет

class FAQCreate(FAQBase):
    """ Схема для ручного создания FAQ через админку """
    pass

class FAQResponse(FAQBase):
    """ Схема ответа из БД (база докидывает ID) """
    id: int

    class Config:
        from_attributes = True # Позволяет Pydantic читать данные прямо из моделей SQLAlchemy

class FAQGenerationRequest(BaseModel):
    """ Что отправляет фронтендер, когда нажимает кнопку 'Сгенерировать по описанию' """
    description: str # Текст-описание компании или продукта
    count: int = Field(default=5, ge=5, le=20, description="Количество вопросов для генерации (от 5 до 20)") # Количество генерируемых вопросов с ответами

class GeneratedCategory(BaseModel):
    """ Структура сгенерированной ИИ категории """
    category_name: str
    items: List[FAQBase] # Переиспользуем FAQBase - тут будут question, answer и synonyms


class FAQGenerationResponse(BaseModel):
    """ Итоговый структурированный JSON, который наш API вернет фронтенду """
    categories: List[GeneratedCategory]