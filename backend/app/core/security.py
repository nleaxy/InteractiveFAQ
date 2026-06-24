import os
from datetime import datetime, timedelta
from typing import Union, Any
import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "SUPER_SECRET_KEY_FOR_LOCAL_DEV_1234567890")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    """ Хеширование пароля """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """ Проверка совпадения пароля с хэшем """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(subject: Union[str, Any]) -> str:
    """ Генерация JWT токена """
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt