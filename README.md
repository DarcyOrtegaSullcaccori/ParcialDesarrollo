# Sistema de Incidencias Viales

Plataforma web para registrar y gestionar incidencias en la via publica: baches, alumbrado, basura, seguridad ciudadana y emergencias.

## Tecnologias

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 18 + React Router v6 + Axios |
| Backend | Python 3.11 + FastAPI 0.110 |
| Base de datos | PostgreSQL 16 + SQLAlchemy 2.0 + Alembic |
| Autenticacion | JWT (python-jose) + bcrypt |
| Tests | Pytest + httpx |

---

## Requisitos previos

- Python 3.11 o superior
- Node.js 18 o superior
- PostgreSQL instalado y corriendo

---

## 1. Crear la base de datos

Abre psql o pgAdmin y ejecuta:

```sql
CREATE DATABASE incidencias_db;
```

---

## 2. Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
source venv/bin/activate          # Mac / Linux
venv\Scripts\activate             # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
```

Edita el archivo `.env` con tus datos de PostgreSQL:

```
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/incidencias_db
SECRET_KEY=una_clave_secreta_larga
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=50
```

```bash
# Iniciar el servidor (las tablas se crean automaticamente)
uvicorn app.main:app --reload
```

- API: http://localhost:8000
- Documentacion Swagger: http://localhost:8000/docs
- Documentacion Redoc: http://localhost:8000/redoc

---

## 3. Frontend

Abre una segunda terminal:

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

- App: http://localhost:3000

---

## 4. Ejecutar tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

---

## Estructura del proyecto

```
ParcialDesarrollo/
├── backend/
│   ├── app/
│   │   ├── main.py              # Entry point FastAPI
│   │   ├── config.py            # Variables de entorno
│   │   ├── database.py          # Singleton — conexion a BD
│   │   ├── models/              # Tablas SQLAlchemy
│   │   │   ├── usuario.py
│   │   │   ├── incidencia.py
│   │   │   ├── multimedia.py
│   │   │   └── notificacion.py
│   │   ├── schemas/             # Validacion Pydantic
│   │   ├── dao/                 # Data Access Objects
│   │   ├── repositories/        # Patron Repository
│   │   ├── observers/           # Patron Observer
│   │   ├── decorators/          # Patron Decorator (auth)
│   │   ├── services/            # Logica de negocio
│   │   └── routers/             # Endpoints REST
│   ├── alembic/                 # Migraciones de BD
│   ├── tests/                   # Pruebas con pytest
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api/                 # Axios + endpoints
│       ├── context/             # AuthContext (estado global)
│       ├── components/          # Navbar, IncidenciaCard
│       └── pages/               # Home, Login, Register,
│                                # ReportarIncidencia,
│                                # MisIncidencias, AdminPanel
├── docs/
│   ├── historias_usuario.md
│   ├── casos_prueba.md
│   └── gitflow.md
└── REQUIREMENTS.md
```

---

## Patrones de diseno aplicados

| Patron | Archivo | Descripcion |
|--------|---------|-------------|
| **Singleton** | `app/database.py` | Una sola instancia del engine de BD |
| **Repository** | `app/repositories/incidencia_repository.py` | Abstrae consultas del dominio |
| **DAO** | `app/dao/base_dao.py` + `incidencia_dao.py` | CRUD atomico por entidad |
| **Observer** | `app/observers/` | Notifica al ciudadano al cambiar estado |
| **Decorator** | `app/decorators/auth.py` | Protege endpoints por rol JWT |

---

## Endpoints principales

| Metodo | Ruta | Rol | Descripcion |
|--------|------|-----|-------------|
| POST | `/api/v1/auth/register` | Publico | Crear cuenta |
| POST | `/api/v1/auth/login` | Publico | Login, devuelve JWT |
| POST | `/api/v1/incidencias/` | Ciudadano | Crear incidencia |
| POST | `/api/v1/incidencias/{id}/multimedia` | Ciudadano | Subir imagen/video/audio |
| GET | `/api/v1/incidencias/mis-incidencias` | Ciudadano | Listar propias con filtros |
| GET | `/api/v1/incidencias/{id}` | Ciudadano | Detalle de incidencia |
| GET | `/api/v1/incidencias/notificaciones/mis` | Ciudadano | Ver notificaciones |
| PATCH | `/api/v1/incidencias/notificaciones/{id}/leer` | Ciudadano | Marcar notificacion leida |
| GET | `/api/v1/admin/incidencias/` | Admin | Listar todas con filtros |
| PATCH | `/api/v1/admin/incidencias/{id}/estado` | Admin | Cambiar estado |
| GET | `/api/v1/multimedia/{inc_id}/{archivo}` | Autenticado | Descargar archivo |

---

## Flujo GitFlow

```bash
# Feature nueva
git flow feature start HU-01-reporte-incidencia
git flow feature finish HU-01-reporte-incidencia

# Release
git flow release start v1.0
git flow release finish v1.0
```

Ramas: `main` → produccion | `develop` → integracion | `feature/*` → desarrollo
