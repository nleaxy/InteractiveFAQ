from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, projects, search, generate
from app.ml.search_model import FAQSynonymizer
from app.database.connection import engine, Base 

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Проверка и создание таблиц в базе данных...")
    Base.metadata.create_all(bind=engine)
    
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
    "http://localhost",
    "http://127.0.0.1",
    "http://team9.st.ifbest.org"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1", tags=["Авторизация"])
app.include_router(projects.router, prefix="/api/projects", tags=["Проекты & FAQ CRUD"])
app.include_router(search.router, prefix="/api/projects", tags=["Умный поиск"])
app.include_router(generate.router, prefix="/api/projects", tags=["Генерация FAQ"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API работает"}