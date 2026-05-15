"""
PATRÓN SINGLETON
DatabaseManager garantiza una única instancia del engine SQLAlchemy
durante todo el ciclo de vida de la aplicación.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings


class Base(DeclarativeBase):
    pass


class DatabaseManager:
    """Singleton — una sola conexión al motor de base de datos."""

    _instance: "DatabaseManager | None" = None

    def __new__(cls) -> "DatabaseManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self) -> None:
        self._engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )
        self._SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self._engine,
        )

    @property
    def engine(self):
        return self._engine

    def get_session(self):
        db = self._SessionLocal()
        try:
            yield db
        finally:
            db.close()

    def create_tables(self) -> None:
        Base.metadata.create_all(bind=self._engine)


db_manager = DatabaseManager()


def get_db():
    yield from db_manager.get_session()
