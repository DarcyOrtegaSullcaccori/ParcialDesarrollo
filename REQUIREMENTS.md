# Requisitos del Software — Sistema de Registro de Incidencias en Vía Pública

**Proyecto:** Sistema de Incidencias Viales  
**Versión:** 1.0  
**Fecha:** 2026-05-15  
**Escenario:** Plataforma ciudadana para reportar baches, alumbrado deficiente, acumulacion de basura, situaciones de inseguridad ciudadana y emergencias en la via publica.

---

## 1. Introducción

### 1.1 Propósito
Proveer una plataforma web que permita a los ciudadanos reportar incidencias en la via publica adjuntando evidencia multimedia (imagen, video, audio), y que permita a los administradores gestionar y dar seguimiento a dichos reportes.

### 1.2 Alcance
- Registro y autenticación de usuarios (ciudadano y administrador).
- Reporte de incidencias con geolocalización y evidencia multimedia.
- Consulta de estado de incidencias propias.
- Gestión administrativa del ciclo de vida de cada incidencia.
- Notificaciones de cambio de estado.

### 1.3 Definiciones
| Término | Descripción |
|---------|-------------|
| Incidencia | Problema reportado en la vía pública |
| Ciudadano | Usuario que registra incidencias |
| Administrador | Funcionario municipal que gestiona incidencias |
| Estado | Ciclo de vida: PENDIENTE → EN_PROCESO → RESUELTO / RECHAZADO |

---

## 2. Requisitos Funcionales

### RF-01 — Gestión de Usuarios
- **RF-01.1** El sistema debe permitir el registro de nuevos usuarios con nombre, apellido, email, contraseña y teléfono.
- **RF-01.2** El sistema debe autenticar usuarios mediante email y contraseña, devolviendo un token JWT.
- **RF-01.3** El sistema debe soportar dos roles: CIUDADANO y ADMINISTRADOR.
- **RF-01.4** El sistema debe permitir al usuario ver y actualizar su perfil.

### RF-02 — Registro de Incidencias
- **RF-02.1** El ciudadano autenticado debe poder crear una nueva incidencia indicando tipo, descripción, dirección y coordenadas GPS.
- **RF-02.2** Los tipos de incidencia aceptados son: BACHE, ALUMBRADO, BASURA, SEGURIDAD_CIUDADANA, EMERGENCIA.
- **RF-02.3** El ciudadano debe poder adjuntar una o más imágenes (JPG, PNG), videos (MP4) o audios (MP3, WAV) como evidencia.
- **RF-02.4** Al crear la incidencia, su estado inicial debe ser PENDIENTE.
- **RF-02.5** El sistema debe registrar la fecha y hora de creación automáticamente.

### RF-03 — Consulta de Incidencias
- **RF-03.1** El ciudadano debe poder listar todas sus incidencias con filtro por estado y tipo.
- **RF-03.2** El ciudadano debe poder ver el detalle completo de cada incidencia propia, incluyendo archivos adjuntos.
- **RF-03.3** El administrador debe poder listar todas las incidencias del sistema con filtros por tipo, estado y fecha.
- **RF-03.4** Cualquier usuario autenticado debe poder descargar los archivos multimedia adjuntos.

### RF-04 — Gestión de Estado (Administrador)
- **RF-04.1** El administrador debe poder cambiar el estado de una incidencia a EN_PROCESO, RESUELTO o RECHAZADO.
- **RF-04.2** Al cambiar el estado, el sistema debe registrar automáticamente la fecha de actualización.
- **RF-04.3** El administrador puede agregar un comentario de resolución al actualizar el estado.

### RF-05 — Notificaciones
- **RF-05.1** El sistema debe notificar al ciudadano cuando el estado de su incidencia cambie.
- **RF-05.2** Las notificaciones deben quedar registradas y marcarse como leídas.

---

## 3. Requisitos No Funcionales

### RNF-01 — Seguridad
- Contraseñas almacenadas con hash bcrypt.
- Autenticación mediante JWT con expiración configurable.
- Endpoints protegidos validan el token en cada solicitud.

### RNF-02 — Rendimiento
- Las consultas de listado deben responder en menos de 2 segundos con hasta 10 000 registros.
- La subida de archivos soporta hasta 50 MB por archivo.

### RNF-03 — Disponibilidad
- El sistema debe estar disponible el 99 % del tiempo en horario hábil.

### RNF-04 — Mantenibilidad
- Código organizado en capas: routers → services → repositories/DAO → models.
- Patrones de diseño documentados y aplicados explícitamente.

### RNF-05 — Usabilidad
- La interfaz debe ser responsive y usable desde dispositivos móviles.
- Los mensajes de error deben ser claros y en español.

---

## 4. Restricciones Técnicas
| Componente | Tecnología |
|-----------|-----------|
| Frontend | React 18, Axios, React Router v6 |
| Backend | Python 3.11, FastAPI 0.110 |
| Base de datos | PostgreSQL 16 |
| ORM | SQLAlchemy 2.0 + Alembic |
| Autenticación | JWT (python-jose) + bcrypt |
| Almacenamiento multimedia | Sistema de archivos local (`/uploads`) |
| Control de versiones | Git + GitFlow |
| Contenedores | Docker + Docker Compose |

---

## 5. Patrones de Diseño Aplicados
| Patrón | Módulo | Justificación |
|--------|--------|---------------|
| **Singleton** | `database.py` | Una sola instancia del motor de BD en toda la app |
| **Repository** | `repositories/` | Abstrae el acceso a datos de la lógica de negocio |
| **DAO** | `dao/` | Operaciones CRUD atómicas sobre cada entidad |
| **Observer** | `observers/` | Notifica automáticamente al ciudadano cuando cambia el estado |
| **Decorator** | `decorators/` | Protege endpoints verificando rol y token JWT |
