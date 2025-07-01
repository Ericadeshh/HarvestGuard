# backend/app/api/v1/endpoints/auth.py
# API endpoints for user authentication and registration.

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.db.session import get_db
from app.db.models import User
from app.schemas.user import UserCreate, User as UserSchema
from app.schemas.token import Token
from app.core.security import verify_password, get_password_hash, create_access_token

# Initialize API router for authentication endpoints
router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    Validates username and email uniqueness, hashes password, and returns a JWT token.
    """
    # Check for existing user by username or email
    db_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    # Hash the password and create a new user record
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        password_hash=hashed_password,
        email=user.email,  # Use email from UserCreate (required field)
        role="farmer"  # Default role for new users
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Generate JWT token with username and role
    access_token = create_access_token(data={"sub": user.username, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT access token.
    Validates username and password, returns token with user role.
    """
    # Find user by username
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token with username and role
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}