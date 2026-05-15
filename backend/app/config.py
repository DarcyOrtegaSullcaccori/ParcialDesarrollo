from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/incidencias_db"
    SECRET_KEY: str = "dev_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 50

    class Config:
        env_file = ".env"


settings = Settings()
