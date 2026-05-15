from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.decorators.auth import get_current_user, require_admin
from app.models.usuario import Usuario
from app.models.incidencia import EstadoIncidencia, TipoIncidencia
from app.repositories.incidencia_repository import incidencia_repository
from app.observers.notificacion_observer import NotificacionObserver, IncidenciaSubject
from app.services.storage_service import guardar_archivo
from app.schemas.incidencia import (
    IncidenciaCreate,
    IncidenciaOut,
    EstadoUpdate,
    NotificacionOut,
)

router = APIRouter(prefix="/incidencias", tags=["Incidencias"])
admin_router = APIRouter(prefix="/admin/incidencias", tags=["Admin"])


# ── Ciudadano ──────────────────────────────────────────────────────────────────

@router.post("/", response_model=IncidenciaOut, status_code=201)
def crear_incidencia(
    datos: IncidenciaCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return incidencia_repository.crear(db, datos, current_user.id)


@router.get("/mis-incidencias", response_model=list[IncidenciaOut])
def mis_incidencias(
    estado: EstadoIncidencia | None = Query(None),
    tipo: TipoIncidencia | None = Query(None),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return incidencia_repository.listar_por_usuario(db, current_user.id, estado, tipo)


@router.get("/{id}", response_model=IncidenciaOut)
def detalle_incidencia(
    id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    inc = incidencia_repository.obtener_por_id(db, id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incidencia no encontrada")
    from app.models.usuario import RolUsuario
    if inc.usuario_id != current_user.id and current_user.rol != RolUsuario.ADMINISTRADOR:
        raise HTTPException(status_code=403, detail="Sin autorización")
    return inc


@router.post("/{id}/multimedia", status_code=201)
async def subir_multimedia(
    id: int,
    archivo: UploadFile = File(...),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Endpoint de subida de imagen, video o audio. (RF-02.3)"""
    inc = incidencia_repository.obtener_por_id(db, id)
    if not inc or inc.usuario_id != current_user.id:
        raise HTTPException(status_code=404, detail="Incidencia no encontrada")

    info = await guardar_archivo(archivo, id)
    multimedia = incidencia_repository.agregar_multimedia(
        db,
        incidencia_id=id,
        tipo_archivo=info["tipo_archivo"],
        nombre_original=info["nombre_original"],
        nombre_guardado=info["nombre_guardado"],
        url=info["url"],
        tamanio_bytes=info["tamanio_bytes"],
    )
    return {"id": multimedia.id, "url": multimedia.url, "tipo_archivo": multimedia.tipo_archivo}


@router.get("/notificaciones/mis", response_model=list[NotificacionOut])
def mis_notificaciones(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return incidencia_repository.listar_notificaciones(db, current_user.id)


@router.patch("/notificaciones/{notif_id}/leer")
def marcar_leida(
    notif_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ok = incidencia_repository.marcar_notificacion_leida(db, notif_id, current_user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    return {"mensaje": "Notificación marcada como leída"}


# ── Administrador ──────────────────────────────────────────────────────────────

@admin_router.get("/", response_model=list[IncidenciaOut])
def listar_todas(
    estado: EstadoIncidencia | None = Query(None),
    tipo: TipoIncidencia | None = Query(None),
    skip: int = 0,
    limit: int = 50,
    _admin: Usuario = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return incidencia_repository.listar_todas(db, estado, tipo, skip, limit)


@admin_router.patch("/{id}/estado", response_model=IncidenciaOut)
def actualizar_estado(
    id: int,
    datos: EstadoUpdate,
    _admin: Usuario = Depends(require_admin),
    db: Session = Depends(get_db),
):
    inc = incidencia_repository.obtener_por_id(db, id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incidencia no encontrada")

    inc_actualizada = incidencia_repository.actualizar_estado(db, inc, datos)

    # Observer: notifica al ciudadano del cambio de estado
    subject = IncidenciaSubject()
    subject.attach(NotificacionObserver(db))
    subject.estado_cambiado({
        "usuario_id": inc.usuario_id,
        "incidencia_id": inc.id,
        "estado": datos.estado.value,
        "codigo_seguimiento": inc.codigo_seguimiento,
    })

    return inc_actualizada
