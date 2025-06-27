"""
Configuration settings for HarvestGuard backend.
Uses pydantic-settings for environment variable management.
"""

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database configuration
    MYSQL_USER: str = "Ericadesh"
    MYSQL_PASSWORD: str = "404-found-#"
    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_DB: str = "harvestguard"
    
    # Security configuration
    SECRET_KEY: str = "e8c25f837477ae1606f935d11af105f64e6400fb8b181bba04f97640b79afcac731997599e906bcd6ffa23345b23d0cf43ae92e9dde1c8d209f67ee95169cca5"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create settings instance
settings = Settings()