from pydantic import BaseModel
from datetime import datetime

class ScanResult(BaseModel):
    image: str
    decision: str  # "Accept" or "Flag"
    confidence: float
    reconstruction_error: float
    is_anomaly: bool
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "image": "test.jpg",
                "decision": "Accept",
                "confidence": 0.95,
                "reconstruction_error": 0.012,
                "is_anomaly": False,
                "timestamp": "2025-06-28T12:00:00Z"
            }
        }