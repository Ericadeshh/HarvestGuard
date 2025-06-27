"""
Database connection and session management.
Handles the connection to MySQL and provides a session factory.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from ..core.config import settings

# Construct database URL from configuration
DATABASE_URL = f"mysql+mysqlconnector://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}/{settings.MYSQL_DB}"

# Create SQLAlchemy engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    pool_recycle=3600,
    pool_pre_ping=True
)

# Session factory to be used in endpoints
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    Generator function that yields database sessions.
    Ensures sessions are properly closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()