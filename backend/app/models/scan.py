# SQLAlchemy model for scan results
# Stores image scan data in the MySQL database

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from app.database import Base
from datetime import datetime

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    image = Column(String(255), index=True, nullable=False)
    filename = Column(String(255), nullable=True)
    decision = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    reconstruction_error = Column(Float, nullable=False)
    is_anomaly = Column(Boolean, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    action = Column(String(50), nullable=True)
    scanned_at = Column(DateTime, nullable=True)