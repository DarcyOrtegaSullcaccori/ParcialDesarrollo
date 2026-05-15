import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
from app.config import settings
from app.models.multimedia import TipoArchivo

ALLOWED_EXTENSIONS = {
    TipoArchivo.IMAGEN: {".jpg", ".jpeg", ".png", ".webp"},
    TipoArchivo.VIDEO: {".mp4", ".avi", ".mov"},
    TipoArchivo.AUDIO: {".mp3", ".wav", ".ogg"},
}

MAX_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024


def detectar_tipo(filename: str) -> TipoArchivo:
    ext = Path(filename).suffix.lower()
    for tipo, extensiones in ALLOWED_EXTENSIONS.items():
        if ext in extensiones:
            return tipo
    raise HTTPException(
        status_code=400,
        detail=f"Extensión '{ext}' no permitida. Use imágenes (jpg, png), videos (mp4) o audios (mp3, wav).",
    )


async def guardar_archivo(archivo: UploadFile, incidencia_id: int) -> dict:
    contenido = await archivo.read()

    if len(contenido) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"El archivo supera el límite de {settings.MAX_FILE_SIZE_MB} MB",
        )

    tipo = detectar_tipo(archivo.filename)
    ext = Path(archivo.filename).suffix.lower()
    nombre_guardado = f"{incidencia_id}_{uuid.uuid4().hex}{ext}"

    upload_path = Path(settings.UPLOAD_DIR) / str(incidencia_id)
    upload_path.mkdir(parents=True, exist_ok=True)

    ruta_completa = upload_path / nombre_guardado
    with open(ruta_completa, "wb") as f:
        f.write(contenido)

    return {
        "tipo_archivo": tipo,
        "nombre_original": archivo.filename,
        "nombre_guardado": nombre_guardado,
        "url": f"/api/v1/multimedia/{incidencia_id}/{nombre_guardado}",
        "tamanio_bytes": len(contenido),
    }
