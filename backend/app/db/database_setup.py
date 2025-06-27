#!/usr/bin/env python3
"""
Database Initialization Script for HarvestGuard

Features:
- Automatic database creation (if not exists)
- Table schema verification
- Comprehensive error handling
- Clean terminal output formatting
"""

import logging
import sys
from pathlib import Path
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import SQLAlchemyError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    from app.core.config import settings
    from app.db.models import Base
except ImportError as e:
    logger.error(f"Import error: {e}")
    sys.exit(1)

def print_header():
    """Display script header with version info"""
    print("\n" + "=" * 60)
    print("HARVESTGUARD DATABASE SETUP".center(60))
    print(f"Environment: {settings.MYSQL_DB}".center(60))
    print("=" * 60 + "\n")

def create_database(engine, db_name):
    """Create database if it doesn't exist"""
    try:
        with engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
            conn.execute(text(f"USE {db_name}"))
            conn.commit()
        logger.info(f"✅ Database '{db_name}' created/verified")
        return True
    except SQLAlchemyError as e:
        logger.error(f"❌ Database creation failed: {e}")
        return False

def verify_tables(engine):
    """Verify all required tables exist"""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    required_tables = ['users', 'scans', 'feedback']
    
    print("\n" + "-" * 60)
    print("TABLE VERIFICATION".center(60))
    print("-" * 60)
    
    for table in required_tables:
        status = "✅ FOUND" if table in existing_tables else "❌ MISSING"
        print(f"{table.upper():<15} {status:>10}")
    
    return all(table in existing_tables for table in required_tables)

def setup_database():
    """Main database setup routine"""
    print_header()
    
    try:
        # Verify we have all required settings
        if not all([settings.MYSQL_USER, settings.MYSQL_PASSWORD, settings.MYSQL_HOST]):
            raise ValueError("Missing required database configuration")
            
        logger.info(f"Using database URL: {settings.DATABASE_URL}")
        
        # Create root engine (no database specified)
        root_engine = create_engine(
            f"mysql+mysqlconnector://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}/",
            pool_pre_ping=True,
            echo=False
        )
    except AttributeError as e:
        logger.error(f"Configuration error: {e}")
        logger.error("Please ensure DATABASE_URL is properly configured in config.py")
        sys.exit(1)
        
    # Create database if needed
    if not create_database(root_engine, settings.MYSQL_DB):
        sys.exit(1)
    
    # Create tables engine
    db_engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=False
    )
    
    try:
        logger.info("🔨 Creating tables...")
        Base.metadata.create_all(bind=db_engine)
        logger.info("🎉 Table creation completed successfully")
        
        # Verify tables
        if not verify_tables(db_engine):
            logger.warning("⚠️  Some tables are missing")
            sys.exit(1)
            
    except SQLAlchemyError as e:
        logger.error(f"Table creation failed: {e}")
        sys.exit(1)
    finally:
        db_engine.dispose()
        root_engine.dispose()

if __name__ == "__main__":
    setup_database()
    print("\n" + "=" * 60)
    print("DATABASE SETUP COMPLETE".center(60))
    print("=" * 60 + "\n")