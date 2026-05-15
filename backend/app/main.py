from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import db_manager
from app.models import Usuario, Incidencia, Multimedia, Notificacion  # noqa: F401 — registra tablas
from app.routers.auth import router as auth_router
from app.routers.incidencias import router as incidencias_router, admin_router
from app.routers.multimedia import router as multimedia_router

app = FastAPI(
    title="Sistema de Incidencias Viales",
    description="API REST para registro y gestion de incidencias en via publica",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api/v1"
app.include_router(auth_router, prefix=PREFIX)
app.include_router(incidencias_router, prefix=PREFIX)
app.include_router(admin_router, prefix=PREFIX)
app.include_router(multimedia_router, prefix=PREFIX)


@app.on_event("startup")
def startup():
    db_manager.create_tables()


@app.get("/", tags=["Root"])
def root():
    return {"mensaje": "Incidencias Viales API v1.0", "docs": "/docs"}
