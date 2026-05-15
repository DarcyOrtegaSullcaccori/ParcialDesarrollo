"""
PATRÓN OBSERVER
Define la interfaz Subject/Observer para notificar eventos de cambio de estado.
Cuando un administrador actualiza el estado de una incidencia, el Subject
notifica automáticamente a todos los Observer registrados.
"""
from abc import ABC, abstractmethod


class Observer(ABC):
    @abstractmethod
    def update(self, evento: dict) -> None:
        """Recibe la notificación del Subject."""


class Subject:
    def __init__(self):
        self._observers: list[Observer] = []

    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)

    def detach(self, observer: Observer) -> None:
        self._observers.remove(observer)

    def notify(self, evento: dict) -> None:
        for observer in self._observers:
            observer.update(evento)
