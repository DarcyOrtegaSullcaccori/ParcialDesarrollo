"""
PATRÓN DECORATOR
Las dependencias de FastAPI `get_current_user` y `require_admin` actúan
como decoradores que envuelven los endpoints añadiendo verificación
de autenticación y autorización sin modificar la lógica del endpoint.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.dao.base_dao import BaseDAO

bearer_scheme = HTTPBearer()
usuario_dao = BaseDAO(Usuario)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    """Decorator: verifica JWT y devuelve el usuario autenticado."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No autenticado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    usuario = usuario_dao.get_by_id(db, int(user_id))
    if usuario is None:
        raise credentials_exception
    return usuario


def require_admin(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """Decorator: exige rol ADMINISTRADOR sobre el usuario ya autenticado."""
    if current_user.rol != RolUsuario.ADMINISTRADOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requiere rol de administrador",
        )
    return current_user
