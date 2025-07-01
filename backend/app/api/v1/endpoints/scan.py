from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
import tempfile
import os
import logging

from app.db.session import get_db
from app.services.prediction import predict_image, process_image_scan
from app.schemas.scan import ScanResult
from app.db.models import User, Scan
from app.core.security import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/predict", response_model=ScanResult)
async def predict(
    file: UploadFile = File(...),
    threshold: Optional[float] = None
):
    """
    Lightweight AI prediction endpoint (no DB logging).
    Accepts a single image, returns model decision.
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp:
            content = await file.read()
            temp.write(content)
            temp_path = temp.name

        result = predict_image(temp_path, custom_threshold=threshold)

        os.unlink(temp_path)

        return ScanResult(
            image=file.filename,
            decision=result["decision"],
            confidence=result["confidence"],
            reconstruction_error=result["reconstruction_error"],
            is_anomaly=result["is_anomaly"],
            timestamp=datetime.utcnow()
        )

    except Exception as e:
        logger.error(f"Prediction failed for {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post("/upload-image", response_model=ScanResult)
async def upload_image_for_scan(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Uploads and scans a single image, with DB logging.
    Used for authenticated scans from web or CLI.
    """
    try:
        content = await file.read()
        user_id = current_user.id if current_user else None

        result = process_image_scan(
            file_bytes=content,
            image_path=file.filename,
            user_id=user_id,
            db=db
        )

        # Ensure result matches ScanResult schema
        return ScanResult(
            image=result["image"],
            decision=result["decision"],
            confidence=result["confidence"],
            reconstruction_error=result["reconstruction_error"],
            is_anomaly=result["is_anomaly"],
            timestamp=result["timestamp"]
        )

    except Exception as e:
        logger.error(f"Scan failed for {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

@router.post("/batch", response_model=List[ScanResult])
async def batch_upload_images_for_scan(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Batch image upload endpoint.
    Accepts multiple images, runs AI scan on each, logs to DB, and returns all results.
    Used by CLI and bulk ZIP uploads.
    """
    results = []
    errors = []
    user_id = current_user.id if current_user else None

    for file in files:
        try:
            content = await file.read()

            result = process_image_scan(
                file_bytes=content,
                image_path=file.filename,
                user_id=user_id,
                db=db
            )

            results.append(ScanResult(
                image=file.filename,
                decision=result["decision"],
                confidence=result["confidence"],
                reconstruction_error=result["reconstruction_error"],
                is_anomaly=result["is_anomaly"],
                timestamp=result["timestamp"]
            ))

        except Exception as e:
            logger.error(f"Scan failed for {file.filename}: {str(e)}")
            errors.append(file.filename)
            results.append(ScanResult(
                image=file.filename,
                decision="ERROR",
                confidence=0.0,
                reconstruction_error=0.0,
                is_anomaly=False,
                timestamp=datetime.utcnow()
            ))

    if errors:
        raise HTTPException(status_code=500, detail=f"Some images failed to scan: {', '.join(errors)}")

    return results