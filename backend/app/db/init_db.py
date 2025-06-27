
"""
Initialize the MySQL database and tables for HarvestGuard.
Ensures the 'harvestguard' database and required tables exist on server startup.
"""

import mysql.connector
from mysql.connector import errorcode
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv
import os
import sys
from pathlib import Path

# Add project root to sys.path for absolute imports
project_root = Path(__file__).resolve().parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

# Import models with error handling
try:
    from backend.app.db.models.base import Base
    from backend.app.db.models.user import User
    from backend.app.db.models.scan import Scan
    from backend.app.db.models.feedback import Feedback
except ModuleNotFoundError as e:
    print(f"Import error: {e}")
    print(f"Current sys.path: {sys.path}")
    raise

# Load environment variables from backend/.env
env_path = project_root / 'backend' / '.env'
load_dotenv(dotenv_path=env_path)
DATABASE_URL = os.getenv("DATABASE_URL")
DB_NAME = "harvestguard"


def create_database():
    """
    Check if the 'harvestguard' database exists; create it if it doesn't.

    Raises:
        ValueError: If DATABASE_URL is missing or invalid.
        mysql.connector.Error: If MySQL connection fails.
    """
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not found in .env file")

    # Extract connection details from DATABASE_URL
    try:
        db_user = DATABASE_URL.split("://")[1].split(":")[0]
        db_password = DATABASE_URL.split(":")[2].split("@")[0]
        db_host_port = DATABASE_URL.split("@")[1].split("/")[0]
        db_host = db_host_port.split(":")[0]
        db_port = db_host_port.split(":")[1] if ":" in db_host_port else "3306"
    except IndexError:
        raise ValueError("Invalid DATABASE_URL format in .env file")

    try:
        # Connect to MySQL server without specifying a database
        cnx = mysql.connector.connect(
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        cursor = cnx.cursor()

        # Check if database exists
        cursor.execute(f"SHOW DATABASES LIKE '{DB_NAME}'")
        result = cursor.fetchone()

        if not result:
            print(f"Creating database: {DB_NAME}")
            cursor.execute(f"CREATE DATABASE {DB_NAME}")
        else:
            print(f"Database {DB_NAME} already exists")

        cursor.close()
        cnx.close()
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Error: Invalid username or password")
        else:
            print(f"Error: {err}")
        raise


def initialize_tables():
    """
    Check if required tables exist; create them if they don't.
    Tables: users, scans, feedback.

    Uses SQLAlchemy to create tables based on model definitions.
    """
    try:
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)

        required_tables = ["users", "scans", "feedback"]
        existing_tables = inspector.get_table_names()

        if all(table in existing_tables for table in required_tables):
            print("All required tables exist")
        else:
            print("Creating missing tables")
            Base.metadata.create_all(engine)
    except Exception as e:
        print(f"Error initializing tables: {e}")
        raise


def init_db():
    """
    Initialize the database and tables.
    Called on server startup to ensure the database is ready.
    """
    create_database()
    initialize_tables()


if __name__ == "__main__":
    init_db()
