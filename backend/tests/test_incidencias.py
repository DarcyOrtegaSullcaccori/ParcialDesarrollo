import pytest


def _register_and_login(client, email, password="Segura123!", nombre="Test"):
    client.post("/api/v1/auth/register", json={
        "nombre": nombre, "apellido": "User", "email": email, "password": password
    })
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return r.json()["access_token"]


def _headers(token):
    return {"Authorization": f"Bearer {token}"}


PAYLOAD_VALIDO = {
    "tipo": "BACHE",
    "descripcion": "Bache profundo en cruce peatonal con riesgo de accidente",
    "direccion": "Av. Principal 123",
    "latitud": -13.5170,
    "longitud": -71.9782,
}


# ── CP-02.1 ───────────────────────────────────────────────────────────────────
def test_crear_incidencia_valida(client):
    token = _register_and_login(client, "ciudadano1@test.com")
    r = client.post("/api/v1/incidencias/", json=PAYLOAD_VALIDO, headers=_headers(token))
    assert r.status_code == 201
    data = r.json()
    assert data["estado"] == "PENDIENTE"
    assert data["codigo_seguimiento"].startswith("INC-")


# ── CP-02.3 ───────────────────────────────────────────────────────────────────
def test_crear_incidencia_descripcion_corta(client):
    token = _register_and_login(client, "ciudadano2@test.com")
    payload = {**PAYLOAD_VALIDO, "descripcion": "Muy corta"}
    r = client.post("/api/v1/incidencias/", json=payload, headers=_headers(token))
    assert r.status_code == 422


# ── CP-02.4 ───────────────────────────────────────────────────────────────────
def test_crear_incidencia_sin_autenticacion(client):
    r = client.post("/api/v1/incidencias/", json=PAYLOAD_VALIDO)
    assert r.status_code == 401


# ── CP-03.1 ───────────────────────────────────────────────────────────────────
def test_listar_mis_incidencias(client):
    token = _register_and_login(client, "ciudadano3@test.com")
    client.post("/api/v1/incidencias/", json=PAYLOAD_VALIDO, headers=_headers(token))
    client.post("/api/v1/incidencias/", json={**PAYLOAD_VALIDO, "tipo": "BASURA"}, headers=_headers(token))
    r = client.get("/api/v1/incidencias/mis-incidencias", headers=_headers(token))
    assert r.status_code == 200
    assert len(r.json()) == 2


# ── CP-03.4 ───────────────────────────────────────────────────────────────────
def test_ver_incidencia_de_otro_usuario(client):
    token_a = _register_and_login(client, "ciudadano4a@test.com")
    token_b = _register_and_login(client, "ciudadano4b@test.com")
    r = client.post("/api/v1/incidencias/", json=PAYLOAD_VALIDO, headers=_headers(token_a))
    inc_id = r.json()["id"]
    r2 = client.get(f"/api/v1/incidencias/{inc_id}", headers=_headers(token_b))
    assert r2.status_code == 403


# ── CP-04.2 ───────────────────────────────────────────────────────────────────
def test_ciudadano_no_puede_acceder_panel_admin(client):
    token = _register_and_login(client, "ciudadano5@test.com")
    r = client.get("/api/v1/admin/incidencias/", headers=_headers(token))
    assert r.status_code == 403


# ── CP-04.4 ───────────────────────────────────────────────────────────────────
def test_rechazar_sin_comentario(client):
    token = _register_and_login(client, "ciudadano6@test.com")
    r = client.post("/api/v1/incidencias/", json=PAYLOAD_VALIDO, headers=_headers(token))
    inc_id = r.json()["id"]

    admin_token = _register_and_login(client, "admin6@test.com", nombre="Admin")
    # Promover a admin directamente en BD
    from app.models.usuario import Usuario, RolUsuario
    from tests.conftest import TestingSessionLocal
    db = TestingSessionLocal()
    u = db.query(Usuario).filter(Usuario.email == "admin6@test.com").first()
    u.rol = RolUsuario.ADMINISTRADOR
    db.commit()
    db.close()

    admin_token = _register_and_login(client, "admin6b@test.com", nombre="Admin2")
    db2 = TestingSessionLocal()
    u2 = db2.query(Usuario).filter(Usuario.email == "admin6b@test.com").first()
    u2.rol = RolUsuario.ADMINISTRADOR
    db2.commit()
    db2.close()

    r2 = client.patch(
        f"/api/v1/admin/incidencias/{inc_id}/estado",
        json={"estado": "RECHAZADO", "comentario_resolucion": ""},
        headers=_headers(admin_token),
    )
    assert r2.status_code in (422, 403)
