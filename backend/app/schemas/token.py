# backend/app/schemas/token.py
# Pydantic schema for JWT tokens.

from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str