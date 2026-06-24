from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

class ProjectCreate(BaseModel):
    title: str
    slug: str

class ProjectResponse(BaseModel):
    id: int
    title: str
    slug: str
    questionsCount: int
    createdAt: str

    class Config:
        from_attributes = True

class SettingsUpdate(BaseModel):
    popularQueries: str