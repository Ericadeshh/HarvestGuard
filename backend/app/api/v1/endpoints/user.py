
from fastapi import APIRouter, Depends, HTTPException  # Add HTTPException import
from sqlalchemy.orm import Session
from .....db.session import get_db
from .....crud.user import get_user_by_username
from .....schemas.user import UserOut
from .....core.config import settings

router = APIRouter()

@router.get("/me", response_model=UserOut)
def read_user_me(username: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user