from datetime import datetime
from pydantic import BaseModel, field_validator
from app.models.incidencia import TipoIncidencia, EstadoIncidencia
from app.models.multimedia import TipoArchivo


class MultimediaOut(BaseModel):
    id: int
    tipo_archivo: TipoArchivo
    nombre_original: str
    url: str
    tamanio_bytes: int
    created_at: datetime

    model_config = {"from_attributes": True}


class IncidenciaCreate(BaseModel):
    tipo: TipoIncidencia
    descripcion: str
    direccion: str
    latitud: float | None = None
    longitud: float | None = None

    @field_validator("descripcion")
    @classmethod
    def descripcion_minima(cls, v: str) -> str:
        if len(v.strip()) < 20:
            raise ValueError("La descripción debe tener al menos 20 caracteres")
        return v


class IncidenciaOut(BaseModel):
    id: int
    codigo_seguimiento: str
    tipo: TipoIncidencia
    descripcion: str
    direccion: str
    latitud: float | None
    longitud: float | None
    estado: EstadoIncidencia
    comentario_resolucion: str | None
    usuario_id: int
    created_at: datetime
    updated_at: datetime
    multimedia: list[MultimediaOut] = []

    model_config = {"from_attributes": True}


class EstadoUpdate(BaseModel):
    estado: EstadoIncidencia
    comentario_resolucion: str | None = None

    @field_validator("comentario_resolucion")
    @classmethod
    def comentario_requerido_al_rechazar(cls, v, info):
        if info.data.get("estado") == EstadoIncidencia.RECHAZADO and not v:
            raise ValueError("El comentario es obligatorio al rechazar una incidencia")
        return v


class NotificacionOut(BaseModel):
    id: int
    mensaje: str
    leida: bool
    incidencia_id: int
    created_at: datetime

    model_config = {"from_attributes": True}
