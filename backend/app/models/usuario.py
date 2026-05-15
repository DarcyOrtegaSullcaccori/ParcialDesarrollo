import enum
from datetime import datetime
from sqlalchemy import String, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class RolUsuario(str, enum.Enum):
    CIUDADANO = "CIUDADANO"
    ADMINISTRADOR = "ADMINISTRADOR"


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellido: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    telefono: Mapped[str | None] = mapped_column(String(20))
    rol: Mapped[RolUsuario] = mapped_column(
        Enum(RolUsuario), default=RolUsuario.CIUDADANO, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    incidencias: Mapped[list["Incidencia"]] = relationship(
        "Incidencia", back_populates="usuario", cascade="all, delete-orphan"
    )
    notificaciones: Mapped[list["Notificacion"]] = relationship(
        "Notificacion", back_populates="usuario"
    )
