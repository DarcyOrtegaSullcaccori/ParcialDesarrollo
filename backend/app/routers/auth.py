from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioOut, LoginRequest, Token
from app.services.auth_service import registrar_usuario, autenticar_usuario, create_access_token

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/register", response_model=UsuarioOut, status_code=201)
def register(datos: UsuarioCreate, db: Session = Depends(get_db)):
    return registrar_usuario(db, datos)


@router.post("/login", response_model=Token)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    usuario = autenticar_usuario(db, datos.email, datos.password)
    token = create_access_token(usuario.id)
    return Token(access_token=token, usuario=UsuarioOut.model_validate(usuario))
