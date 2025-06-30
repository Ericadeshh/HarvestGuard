"""
Configuration settings for HarvestGuard
Loads environment variables for database and authentication
"""

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MYSQL_USER: str = "Ericadesh"
    MYSQL_PASSWORD: str = "404-found-#"
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: str = "3306"
    MYSQL_DB: str = "harvestguard"
    SECRET_KEY: str = "e8c25f837477ae1606f935d11af105f64e6400fb8b181bba04f97640b79afcac731997599e906bcd6ffa23345b23d0cf43ae92e9dde1c8d209f67ee95169cca5"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+mysqlconnector://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"

settings = Settings()