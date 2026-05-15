def test_register_success(client):
    r = client.post("/api/v1/auth/register", json={
        "nombre": "Juan", "apellido": "Quispe",
        "email": "juan@test.com", "password": "Segura123!", "telefono": "984000001"
    })
    assert r.status_code == 201
    assert r.json()["email"] == "juan@test.com"
    assert r.json()["rol"] == "CIUDADANO"


def test_register_duplicate_email(client):
    payload = {"nombre": "A", "apellido": "B", "email": "dup@test.com", "password": "Segura123!"}
    client.post("/api/v1/auth/register", json=payload)
    r = client.post("/api/v1/auth/register", json=payload)
    assert r.status_code == 400
    assert "ya está registrado" in r.json()["detail"]


def test_login_success(client):
    client.post("/api/v1/auth/register", json={
        "nombre": "Maria", "apellido": "Flores",
        "email": "maria@test.com", "password": "Segura123!"
    })
    r = client.post("/api/v1/auth/login", json={"email": "maria@test.com", "password": "Segura123!"})
    assert r.status_code == 200
    assert "access_token" in r.json()


def test_login_wrong_password(client):
    client.post("/api/v1/auth/register", json={
        "nombre": "Pedro", "apellido": "Lima",
        "email": "pedro@test.com", "password": "Segura123!"
    })
    r = client.post("/api/v1/auth/login", json={"email": "pedro@test.com", "password": "Incorrecta"})
    assert r.status_code == 401
    assert "Credenciales inválidas" in r.json()["detail"]
