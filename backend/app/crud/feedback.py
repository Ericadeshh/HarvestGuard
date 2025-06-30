
from sqlalchemy.orm import Session
from ..db.models.feedback import Feedback
from ..schemas.feedback import FeedbackCreate

def create_feedback(db: Session, feedback: FeedbackCreate, user_id: int):
    db_feedback = Feedback(user_id=user_id, **feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback