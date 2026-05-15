from datetime import datetime, timedelta
from jose import jwt
import bcrypt
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.config import settings
from app.models.usuario import Usuario
from app.dao.base_dao import BaseDAO
from app.schemas.usuario import UsuarioCreate

usuario_dao = BaseDAO(Usuario)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def registrar_usuario(db: Session, datos: UsuarioCreate) -> Usuario:
    existente = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    usuario = Usuario(
        nombre=datos.nombre,
        apellido=datos.apellido,
        email=datos.email,
        password_hash=hash_password(datos.password),
        telefono=datos.telefono,
    )
    return usuario_dao.create(db, usuario)


def autenticar_usuario(db: Session, email: str, password: str) -> Usuario:
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario or not verify_password(password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )
    return usuario
