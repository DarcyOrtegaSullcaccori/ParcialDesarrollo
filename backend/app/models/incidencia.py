import enum
from datetime import datetime
from sqlalchemy import String, Text, Enum, DateTime, Float, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class TipoIncidencia(str, enum.Enum):
    BACHE = "BACHE"
    ALUMBRADO = "ALUMBRADO"
    BASURA = "BASURA"
    SEGURIDAD_CIUDADANA = "SEGURIDAD_CIUDADANA"
    EMERGENCIA = "EMERGENCIA"


class EstadoIncidencia(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    EN_PROCESO = "EN_PROCESO"
    RESUELTO = "RESUELTO"
    RECHAZADO = "RECHAZADO"


class Incidencia(Base):
    __tablename__ = "incidencias"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    codigo_seguimiento: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    tipo: Mapped[TipoIncidencia] = mapped_column(Enum(TipoIncidencia), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    direccion: Mapped[str] = mapped_column(String(500), nullable=False)
    latitud: Mapped[float | None] = mapped_column(Float)
    longitud: Mapped[float | None] = mapped_column(Float)
    estado: Mapped[EstadoIncidencia] = mapped_column(
        Enum(EstadoIncidencia), default=EstadoIncidencia.PENDIENTE, nullable=False
    )
    comentario_resolucion: Mapped[str | None] = mapped_column(Text)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="incidencias")
    multimedia: Mapped[list["Multimedia"]] = relationship(
        "Multimedia", back_populates="incidencia", cascade="all, delete-orphan"
    )
    notificaciones: Mapped[list["Notificacion"]] = relationship(
        "Notificacion", back_populates="incidencia"
    )
