# backend/app/schemas/feedback.py
# Pydantic schemas for feedback.

from pydantic import BaseModel

class FeedbackBase(BaseModel):
    feedback: str

class FeedbackCreate(FeedbackBase):
    scan_id: int
    user_id: int

class Feedback(FeedbackBase):
    id: int
    scan_id: int
    user_id: int

    class Config:
        from_attributes = True