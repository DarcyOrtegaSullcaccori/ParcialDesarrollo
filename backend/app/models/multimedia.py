import enum
from datetime import datetime
from sqlalchemy import String, Integer, Enum, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class TipoArchivo(str, enum.Enum):
    IMAGEN = "IMAGEN"
    VIDEO = "VIDEO"
    AUDIO = "AUDIO"


class Multimedia(Base):
    __tablename__ = "multimedia"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incidencia_id: Mapped[int] = mapped_column(ForeignKey("incidencias.id"), nullable=False)
    tipo_archivo: Mapped[TipoArchivo] = mapped_column(Enum(TipoArchivo), nullable=False)
    nombre_original: Mapped[str] = mapped_column(String(255), nullable=False)
    nombre_guardado: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    tamanio_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    incidencia: Mapped["Incidencia"] = relationship("Incidencia", back_populates="multimedia")
