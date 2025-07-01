# backend/app/db/crud.py

from app.db.models import Scan
from sqlalchemy.orm import Session
from datetime import datetime

def log_scan_result(
    db: Session,
    image_path: str,
    decision: str,
    confidence: float,
    reconstruction_error: float,
    is_anomaly: bool,
    user_id: int
):
    scan = Scan(
        image_path=image_path,
        decision=decision,
        confidence=confidence,
        reconstruction_error=reconstruction_error,
        is_anomaly=is_anomaly,
        user_id=user_id,
        timestamp=datetime.utcnow()
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan