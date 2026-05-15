# Historias de Usuario — Sistema de Incidencias Viales

**Version:** 2.0 | **Fecha:** 2026-05-15

---

## HU-01 — Reportar una Incidencia con Evidencia Multimedia

**Como** ciudadano registrado,
**quiero** reportar una incidencia en la via publica adjuntando fotos, videos o audios,
**para que** las autoridades cuenten con evidencia suficiente para atenderla.

### Criterios de Aceptacion

| ID | Criterio |
|----|---------|
| CA-01.1 | El formulario requiere tipo, descripcion (min. 20 caracteres) y direccion. |
| CA-01.2 | El ciudadano puede seleccionar el tipo mediante botones visuales: BACHE, ALUMBRADO, BASURA, SEGURIDAD_CIUDADANA, EMERGENCIA. |
| CA-01.3 | Se puede adjuntar multiples archivos (JPG/PNG <= 10 MB, MP4 <= 50 MB, MP3/WAV <= 20 MB). |
| CA-01.4 | El boton "Obtener GPS automaticamente" captura las coordenadas del dispositivo. |
| CA-01.5 | Al enviar exitosamente se muestra pantalla de confirmacion con el codigo de seguimiento. |
| CA-01.6 | El codigo de seguimiento tiene formato INC-XXXXXXXX. |
| CA-01.7 | El ciudadano no autenticado es redirigido al login. |
| CA-01.8 | Si un archivo supera el limite, el servidor responde HTTP 413 con mensaje claro. |

### Flujo Principal
1. Ciudadano inicia sesion.
2. Navega a "Reportar" en la barra de navegacion.
3. Selecciona el tipo de incidencia (botones visuales con color por categoria).
4. Completa descripcion y direccion; opcionalmente usa GPS automatico.
5. Selecciona archivos de evidencia desde el area de carga.
6. Pulsa "Enviar Reporte".
7. Sistema valida, guarda en BD, almacena archivos y muestra confirmacion con codigo.

### Flujo Alternativo
- **4a.** El navegador deniega geolocalización → mensaje de error, el ciudadano ingresa la direccion manualmente.
- **5a.** Archivo supera limite → HTTP 413, el resto del formulario no se pierde.

### Prioridad: Alta | Estimacion: 5 SP | Sprint: 1

---

## HU-02 — Consultar el Estado de Mis Reportes y Notificaciones

**Como** ciudadano registrado,
**quiero** ver el estado actualizado de mis incidencias y recibir notificaciones cuando cambien,
**para** saber si estan siendo atendidas o han sido resueltas.

### Criterios de Aceptacion

| ID | Criterio |
|----|---------|
| CA-02.1 | El ciudadano ve unicamente sus propias incidencias. |
| CA-02.2 | La lista muestra tipo, descripcion resumida, direccion, fecha y estado con color distintivo. |
| CA-02.3 | Se puede filtrar por estado (PENDIENTE, EN_PROCESO, RESUELTO, RECHAZADO) y por tipo. |
| CA-02.4 | Las tarjetas de estado en la parte superior actuan como filtros rapidos al hacer clic. |
| CA-02.5 | Al hacer clic en una incidencia se abre un modal con todos los detalles. |
| CA-02.6 | El modal muestra los archivos multimedia adjuntos (imagenes, video, audio reproducibles). |
| CA-02.7 | La campana de notificaciones en el Navbar muestra un badge rojo con el numero de no leidas. |
| CA-02.8 | Al abrir el dropdown de notificaciones, todas se marcan como leidas automaticamente. |
| CA-02.9 | Si no hay reportes, se muestra estado vacio con enlace directo a "Reportar". |

### Flujo Principal
1. Ciudadano inicia sesion → el Navbar carga sus notificaciones desde la API.
2. Accede a "Mis Reportes".
3. Ve las tarjetas de conteo por estado (PENDIENTE, EN_PROCESO, RESUELTO, RECHAZADO).
4. Filtra por estado o tipo usando los selectores.
5. Hace clic en una incidencia para ver el detalle completo en un modal.
6. Desde el modal puede ver imagenes, reproducir videos y audios.

### Flujo Alternativo
- **1a.** El Navbar tiene error de red al cargar notificaciones → falla silenciosa, no bloquea la app.
- **3a.** Sin incidencias → pantalla de estado vacio con boton "Crear mi primer reporte".

### Prioridad: Alta | Estimacion: 3 SP | Sprint: 1

---

## HU-03 — Gestionar y Actualizar el Estado de las Incidencias (Administrador)

**Como** administrador,
**quiero** ver todas las incidencias, filtrarlas y cambiar su estado con un comentario,
**para** coordinar la atencion y cerrar el ciclo con el ciudadano.

### Criterios de Aceptacion

| ID | Criterio |
|----|---------|
| CA-03.1 | El panel admin esta protegido; usuarios con rol CIUDADANO reciben HTTP 403. |
| CA-03.2 | Las tarjetas de estadisticas muestran conteo por estado con barra de proporcion visual. |
| CA-03.3 | Hacer clic en una tarjeta de estadistica filtra la lista por ese estado. |
| CA-03.4 | El administrador puede filtrar por tipo y estado mediante selectores. |
| CA-03.5 | Al hacer clic en una incidencia se abre un modal con descripcion y selector de nuevo estado. |
| CA-03.6 | El nuevo estado se elige entre: EN_PROCESO, RESUELTO, RECHAZADO (botones visuales con color). |
| CA-03.7 | El campo comentario es obligatorio al seleccionar RECHAZADO. |
| CA-03.8 | Al guardar, el sistema actualiza el estado, registra la fecha y dispara el Observer de notificaciones. |
| CA-03.9 | El ciudadano recibe una notificacion en su campana del Navbar con el cambio de estado. |

### Flujo Principal
1. Administrador inicia sesion → el Navbar muestra el enlace "Panel Admin".
2. Accede al Panel Administrativo.
3. Revisa las estadisticas por estado en las tarjetas superiores.
4. Filtra por tipo o estado segun necesidad.
5. Hace clic en una incidencia para abrir el modal de actualizacion.
6. Selecciona nuevo estado (botones EN_PROCESO / RESUELTO / RECHAZADO).
7. Ingresa comentario opcional (obligatorio si RECHAZADO).
8. Pulsa "Guardar cambio".
9. El Observer crea la notificacion para el ciudadano automaticamente.

### Flujo Alternativo
- **7a.** RECHAZADO sin comentario → HTTP 422, mensaje de error en el modal.
- **8a.** Error de red → mensaje de error en el modal, sin cerrar.

### Prioridad: Alta | Estimacion: 5 SP | Sprint: 2

---

## Resumen del Backlog

| ID | Historia | Prioridad | SP | Sprint |
|----|---------|----------|----|--------|
| HU-01 | Reportar incidencia con multimedia | Alta | 5 | 1 |
| HU-02 | Consultar estado y notificaciones | Alta | 3 | 1 |
| HU-03 | Gestionar incidencias (Admin) | Alta | 5 | 2 |

**Velocidad del equipo:** 8 SP / sprint | **Duracion del sprint:** 2 semanas
