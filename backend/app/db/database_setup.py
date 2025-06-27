"""
Database setup utility for HarvestGuard.
Automatically creates the database and tables if they don't exist.
"""

# backend/app/db/database_setup.py
import sys
import logging
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError

# Ensure the backend directory is in path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    from app.db.models import Base
    from app.core.config import settings
except ImportError:
    # Fallback for direct execution
    from .models import Base
    from ..core.config import settings
    
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_database_exists(engine, db_name):
    """
    Check if the database exists on the MySQL server.
    
    Args:
        engine: SQLAlchemy engine instance
        db_name: Name of the database to check
        
    Returns:
        bool: True if database exists, False otherwise
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text(f"SHOW DATABASES LIKE '{db_name}'"))
            return result.rowcount > 0
    except OperationalError as e:
        logger.error(f"Error checking database existence: {e}")
        return False

def create_database(engine, db_name):
    """
    Create a new database on the MySQL server.
    
    Args:
        engine: SQLAlchemy engine instance
        db_name: Name of the database to create
    """
    try:
        with engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE {db_name}"))
            conn.execute(text(f"USE {db_name}"))
            conn.commit()
        logger.info(f"Database '{db_name}' created successfully")
    except OperationalError as e:
        logger.error(f"Error creating database: {e}")
        raise

def setup_database():
    """
    Main function to set up the HarvestGuard database.
    Handles both database and table creation if they don't exist.
    """
    # First create an engine without specifying the database
    root_engine = create_engine(
        f"mysql+mysqlconnector://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}/",
        pool_pre_ping=True
    )
    
    # Check if database exists
    if not check_database_exists(root_engine, settings.MYSQL_DB):
        logger.info(f"Database '{settings.MYSQL_DB}' not found. Creating...")
        create_database(root_engine, settings.MYSQL_DB)
    else:
        logger.info(f"Database '{settings.MYSQL_DB}' already exists")
    
    # Now connect to the specific database
    db_engine = create_engine(
        f"mysql+mysqlconnector://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}/{settings.MYSQL_DB}",
        pool_pre_ping=True
    )
    
    # Create tables if they don't exist
    try:
        logger.info("Creating tables if they don't exist...")
        Base.metadata.create_all(bind=db_engine)
        logger.info("Table setup completed successfully")
    except OperationalError as e:
        logger.error(f"Error creating tables: {e}")
        raise
    finally:
        db_engine.dispose()
        root_engine.dispose()

if __name__ == "__main__":
    setup_database()