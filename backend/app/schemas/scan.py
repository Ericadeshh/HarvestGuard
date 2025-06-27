# backend/app/schemas/scan.py
# Pydantic schemas for scan results.

from pydantic import BaseModel

class ScanBase(BaseModel):
    image_filename: str
    anomaly_score: float
    prediction: str

class ScanCreate(ScanBase):
    user_id: int

class Scan(ScanBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True