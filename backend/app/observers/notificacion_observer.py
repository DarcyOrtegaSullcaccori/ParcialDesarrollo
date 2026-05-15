from sqlalchemy.orm import Session
from app.observers.subject import Observer
from app.repositories.incidencia_repository import incidencia_repository


class NotificacionObserver(Observer):
    """
    Observador concreto: persiste una notificación en BD cuando
    el estado de una incidencia cambia.
    """

    def __init__(self, db: Session):
        self._db = db

    def update(self, evento: dict) -> None:
        usuario_id: int = evento["usuario_id"]
        incidencia_id: int = evento["incidencia_id"]
        estado: str = evento["estado"]
        codigo: str = evento["codigo_seguimiento"]

        mensajes = {
            "EN_PROCESO": f"Tu incidencia {codigo} está siendo atendida.",
            "RESUELTO": f"Tu incidencia {codigo} ha sido resuelta. ¡Gracias por reportar!",
            "RECHAZADO": f"Tu incidencia {codigo} fue rechazada. Revisa el comentario adjunto.",
        }
        mensaje = mensajes.get(estado, f"El estado de {codigo} cambió a {estado}.")
        incidencia_repository.crear_notificacion(self._db, usuario_id, incidencia_id, mensaje)


class IncidenciaSubject:
    """Subject que gestiona cambios de estado y notifica a los observers."""

    def __init__(self):
        self._observers: list[Observer] = []

    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)

    def estado_cambiado(self, evento: dict) -> None:
        for observer in self._observers:
            observer.update(evento)
