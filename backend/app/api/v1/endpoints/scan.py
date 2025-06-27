from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.prediction import predict_image
from typing import Optional
import logging
import os
import tempfile
from datetime import datetime
from app.schemas.scan import ScanResult

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/predict", response_model=ScanResult)
async def predict(
    file: UploadFile = File(...),
    threshold: Optional[float] = None
):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp:
            content = await file.read()
            temp.write(content)
            temp_path = temp.name

        result = predict_image(temp_path, custom_threshold=threshold)

        os.unlink(temp_path)

        return {
            "image": file.filename,
            "decision": result["decision"],
            "confidence": result["confidence"],
            "reconstruction_error": result["reconstruction_error"],
            "is_anomaly": result["is_anomaly"],
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
