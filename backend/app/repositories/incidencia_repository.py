"""
PATRÓN REPOSITORY
Abstrae la lógica de consulta compleja detrás de una interfaz de dominio,
separando completamente la capa de negocio del DAO y del ORM.
"""
from sqlalchemy.orm import Session
from app.dao.incidencia_dao import incidencia_dao, multimedia_dao, notificacion_dao
from app.models.incidencia import Incidencia, EstadoIncidencia, TipoIncidencia
from app.models.multimedia import Multimedia, TipoArchivo
from app.models.notificacion import Notificacion
from app.schemas.incidencia import IncidenciaCreate, EstadoUpdate
import uuid


def _generar_codigo() -> str:
    return f"INC-{uuid.uuid4().hex[:8].upper()}"


class IncidenciaRepository:
    def crear(self, db: Session, datos: IncidenciaCreate, usuario_id: int) -> Incidencia:
        incidencia = Incidencia(
            codigo_seguimiento=_generar_codigo(),
            tipo=datos.tipo,
            descripcion=datos.descripcion,
            direccion=datos.direccion,
            latitud=datos.latitud,
            longitud=datos.longitud,
            usuario_id=usuario_id,
        )
        return incidencia_dao.create(db, incidencia)

    def obtener_por_id(self, db: Session, id: int) -> Incidencia | None:
        return incidencia_dao.get_by_id(db, id)

    def listar_por_usuario(
        self,
        db: Session,
        usuario_id: int,
        estado: EstadoIncidencia | None = None,
        tipo: TipoIncidencia | None = None,
    ) -> list[Incidencia]:
        return incidencia_dao.get_by_usuario(db, usuario_id, estado, tipo)

    def listar_todas(
        self,
        db: Session,
        estado: EstadoIncidencia | None = None,
        tipo: TipoIncidencia | None = None,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Incidencia]:
        return incidencia_dao.get_all_filtered(db, estado, tipo, skip, limit)

    def actualizar_estado(
        self, db: Session, incidencia: Incidencia, datos: EstadoUpdate
    ) -> Incidencia:
        incidencia.estado = datos.estado
        if datos.comentario_resolucion:
            incidencia.comentario_resolucion = datos.comentario_resolucion
        return incidencia_dao.update(db, incidencia)

    def agregar_multimedia(
        self,
        db: Session,
        incidencia_id: int,
        tipo_archivo: TipoArchivo,
        nombre_original: str,
        nombre_guardado: str,
        url: str,
        tamanio_bytes: int,
    ) -> Multimedia:
        multimedia = Multimedia(
            incidencia_id=incidencia_id,
            tipo_archivo=tipo_archivo,
            nombre_original=nombre_original,
            nombre_guardado=nombre_guardado,
            url=url,
            tamanio_bytes=tamanio_bytes,
        )
        return multimedia_dao.create(db, multimedia)

    def crear_notificacion(
        self, db: Session, usuario_id: int, incidencia_id: int, mensaje: str
    ) -> Notificacion:
        notificacion = Notificacion(
            usuario_id=usuario_id,
            incidencia_id=incidencia_id,
            mensaje=mensaje,
        )
        return notificacion_dao.create(db, notificacion)

    def listar_notificaciones(self, db: Session, usuario_id: int) -> list[Notificacion]:
        return notificacion_dao.get_por_usuario(db, usuario_id)

    def marcar_notificacion_leida(
        self, db: Session, notificacion_id: int, usuario_id: int
    ) -> bool:
        return notificacion_dao.marcar_leida(db, notificacion_id, usuario_id)


incidencia_repository = IncidenciaRepository()
