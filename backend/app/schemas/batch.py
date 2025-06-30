from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class ImageScanResult(BaseModel):
    filename: str
    reconstruction_error: float
    is_anomaly: bool
    action: str
    confidence: float
    scanned_at: datetime

class BatchScanResponse(BaseModel):
    total_scanned: int = Field(..., example=10)
    results: List[ImageScanResult]