"""
SQLAlchemy models for HarvestGuard database tables.
Defines the schema for users, scans, and feedback tables.
"""

from sqlalchemy import Column, Integer, String, Float, Enum, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    """
    Represents a user in the system (farmers or admins).
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('farmer', 'admin', name='user_roles'), default='farmer')
    created_at = Column(TIMESTAMP, server_default=func.now())

class Scan(Base):
    """
    Stores image scan results from the RL agent.
    """
    __tablename__ = 'scans'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    image_path = Column(String(255), nullable=False)
    reconstruction_error = Column(Float, nullable=False)
    decision = Column(Enum('Accept', 'Flag', name='scan_decisions'), nullable=False)
    confidence = Column(Float, nullable=False)
    timestamp = Column(TIMESTAMP, server_default=func.now())

class Feedback(Base):
    """
    Stores user corrections to scan results.
    """
    __tablename__ = 'feedback'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scan_id = Column(Integer, ForeignKey('scans.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    correction = Column(Enum('Accept', 'Flag', name='feedback_decisions'), nullable=False)
    notes = Column(Text)
    timestamp = Column(TIMESTAMP, server_default=func.now())