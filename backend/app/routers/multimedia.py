from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.config import settings

router = APIRouter(prefix="/multimedia", tags=["Multimedia"])


@router.get("/{incidencia_id}/{nombre_archivo}")
def descargar_archivo(incidencia_id: int, nombre_archivo: str):
    """Sirve archivos multimedia guardados localmente."""
    ruta = Path(settings.UPLOAD_DIR) / str(incidencia_id) / nombre_archivo
    if not ruta.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return FileResponse(str(ruta))
