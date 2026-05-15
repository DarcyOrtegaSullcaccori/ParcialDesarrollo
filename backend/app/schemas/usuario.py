from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
from app.models.usuario import RolUsuario


class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    telefono: str | None = None

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        return v


class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    telefono: str | None
    rol: RolUsuario
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioOut
