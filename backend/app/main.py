from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import faqs, search
from app.ml.search_model import FAQSynonymizer

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Инициализация ML модели поиска...")
    app.state.synonymizer = FAQSynonymizer()
    print("ML модель успешно загружена в память.")
    yield
    print("Очистка ресурсов...")

app = FastAPI(
    title="Interactive FAQ API",
    description="Бэкенд для конструктора FAQ с интеллектуальным поиском",
    version="0.1.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(faqs.router, prefix="/api/v1", tags=["FAQs"])
app.include_router(search.router, prefix="/api/v1", tags=["Search"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API работает"}