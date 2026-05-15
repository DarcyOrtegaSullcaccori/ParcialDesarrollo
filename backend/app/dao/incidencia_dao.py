from sqlalchemy.orm import Session
from app.dao.base_dao import BaseDAO
from app.models.incidencia import Incidencia, EstadoIncidencia, TipoIncidencia
from app.models.multimedia import Multimedia
from app.models.notificacion import Notificacion


class IncidenciaDAO(BaseDAO[Incidencia]):
    def get_by_codigo(self, db: Session, codigo: str) -> Incidencia | None:
        return db.query(Incidencia).filter(Incidencia.codigo_seguimiento == codigo).first()

    def get_by_usuario(
        self,
        db: Session,
        usuario_id: int,
        estado: EstadoIncidencia | None = None,
        tipo: TipoIncidencia | None = None,
    ) -> list[Incidencia]:
        q = db.query(Incidencia).filter(Incidencia.usuario_id == usuario_id)
        if estado:
            q = q.filter(Incidencia.estado == estado)
        if tipo:
            q = q.filter(Incidencia.tipo == tipo)
        return q.order_by(Incidencia.created_at.desc()).all()

    def get_all_filtered(
        self,
        db: Session,
        estado: EstadoIncidencia | None = None,
        tipo: TipoIncidencia | None = None,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Incidencia]:
        q = db.query(Incidencia)
        if estado:
            q = q.filter(Incidencia.estado == estado)
        if tipo:
            q = q.filter(Incidencia.tipo == tipo)
        return q.order_by(Incidencia.created_at.desc()).offset(skip).limit(limit).all()


class MultimediaDAO(BaseDAO[Multimedia]):
    def get_by_incidencia(self, db: Session, incidencia_id: int) -> list[Multimedia]:
        return db.query(Multimedia).filter(Multimedia.incidencia_id == incidencia_id).all()


class NotificacionDAO(BaseDAO[Notificacion]):
    def get_por_usuario(self, db: Session, usuario_id: int) -> list[Notificacion]:
        return (
            db.query(Notificacion)
            .filter(Notificacion.usuario_id == usuario_id)
            .order_by(Notificacion.created_at.desc())
            .all()
        )

    def marcar_leida(self, db: Session, notificacion_id: int, usuario_id: int) -> bool:
        n = (
            db.query(Notificacion)
            .filter(Notificacion.id == notificacion_id, Notificacion.usuario_id == usuario_id)
            .first()
        )
        if n:
            n.leida = True
            db.commit()
            return True
        return False


incidencia_dao = IncidenciaDAO(Incidencia)
multimedia_dao = MultimediaDAO(Multimedia)
notificacion_dao = NotificacionDAO(Notificacion)
