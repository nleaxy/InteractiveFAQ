from fastapi import APIRouter

router = APIRouter()

@router.get("/search", summary="Интеллектуальный поиск")
def search_faq(query: str):
    #здесь будет обработка запроса с учетом синонимов
    return {
        "query": query,
        "results": [
            {
                "id": 1,
                "question": "Как восстановить пароль?",
                "answer": "Нажмите на кнопку...",
                "score": 0.95  #показатель релевантности
            }
        ]
    }