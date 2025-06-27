# backend/app/api/feedback.py
# Endpoint for submitting feedback on scan results.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Feedback, Scan
from app.schemas.feedback import FeedbackCreate, Feedback
from .scan import get_current_user

router = APIRouter()

@router.post("/", response_model=Feedback)
async def submit_feedback(feedback: FeedbackCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Submit feedback for a scan result."""
    # Verify scan exists and belongs to user
    scan = db.query(Scan).filter(Scan.id == feedback.scan_id, Scan.user_id == user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found or not authorized")
    
    db_feedback = Feedback(
        scan_id=feedback.scan_id,
        user_id=user.id,
        feedback=feedback.feedback
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback