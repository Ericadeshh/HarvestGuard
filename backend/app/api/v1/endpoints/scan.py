# backend/app/api/scan.py
# Endpoint for image scanning and anomaly detection.

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Scan, User
from app.schemas.scan import ScanCreate, Scan
from app.services.prediction import predictor
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.config import settings
import os
from pathlib import Path

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get current user from JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@router.post("/", response_model=Scan)
async def scan_image(file: UploadFile = File(...), user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Upload an image and perform anomaly detection."""
    try:
        # Save uploaded image temporarily
        upload_dir = Path(settings.PROJECT_ROOT) / "backend" / "uploads"
        upload_dir.mkdir(exist_ok=True)
        file_path = upload_dir / file.filename
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Perform prediction
        result = predictor.predict(str(file_path))
        
        # Save scan result to database
        scan = Scan(
            user_id=user.id,
            image_filename=file.filename,
            anomaly_score=result["anomaly_score"],
            prediction=result["prediction"]
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        
        # Clean up temporary file
        os.remove(file_path)
        
        return scan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")