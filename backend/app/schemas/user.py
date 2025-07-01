# backend/app/schemas/user.py
# Pydantic schemas for user-related data validation and serialization.

from pydantic import BaseModel
from typing import Optional

# Base schema for shared user attributes
class UserBase(BaseModel):
    username: str
    email: str  # Added to support email field in UserCreate and User

# Schema for creating new users (e.g., during registration)
class UserCreate(UserBase):
    password: str

# Schema for user data returned in responses
class User(UserBase):
    id: int
    role: Optional[str] = "farmer"  # Default role for users

    class Config:
        from_attributes = True  # Enable ORM compatibility for SQLAlchemy