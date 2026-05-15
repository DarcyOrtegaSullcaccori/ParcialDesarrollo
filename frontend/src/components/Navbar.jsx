import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { incidenciasAPI } from "../api/incidencias";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [notifs, setNotifs]           = useState([]);
  const [abierto, setAbierto]         = useState(false);
  const dropdownRef                   = useRef(null);

  const sinLeer = notifs.filter((n) => !n.leida).length;

  useEffect(() => {
    if (!usuario) return;
    incidenciasAPI.misNotificaciones()
      .then(({ data }) => setNotifs(data))
      .catch(() => {});
  }, [usuario]);

  useEffect(() => {
    const cerrar = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  const toggleNotifs = () => {
    if (!abierto && sinLeer > 0) {
      notifs
        .filter((n) => !n.leida)
        .forEach((n) => {
          incidenciasAPI.marcarLeida(n.id).catch(() => {});
        });
      setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })));
    }
    setAbierto((v) => !v);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const linkStyle = (path) => ({
    color: pathname === path ? "#fff" : "rgba(255,255,255,.72)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: pathname === path ? 600 : 400,
    padding: "6px 12px",
    borderRadius: 6,
    background: pathname === path ? "rgba(255,255,255,.15)" : "transparent",
    transition: "all .15s",
  });

  return (
    <nav style={{
      background: "linear-gradient(90deg, #1e40af, #2563eb)",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
      boxShadow: "0 2px 8px rgba(37,99,235,.35)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{
          width: 32, height: 32, background: "#fff", borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,.15)",
        }}>
          <div style={{ width: 14, height: 14, background: "#2563eb", borderRadius: 3 }} />
        </div>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: "-.3px" }}>
          Incidencias Viales
        </span>
      </Link>

      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {usuario ? (
          <>
            <Link to="/reportar" style={linkStyle("/reportar")}>Reportar</Link>
            <Link to="/mis-incidencias" style={linkStyle("/mis-incidencias")}>Mis Reportes</Link>
            {usuario.rol === "ADMINISTRADOR" && (
              <Link to="/admin" style={linkStyle("/admin")}>Panel Admin</Link>
            )}

            {/* Campana de notificaciones */}
            <div ref={dropdownRef} style={{ position: "relative", marginLeft: 4 }}>
              <button
                onClick={toggleNotifs}
                style={{
                  background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
                  borderRadius: 7, width: 36, height: 36, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}
                title="Notificaciones"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {sinLeer > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    background: "#ef4444", color: "#fff",
                    fontSize: 10, fontWeight: 800,
                    width: 17, height: 17, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #1d4ed8",
                  }}>
                    {sinLeer > 9 ? "9+" : sinLeer}
                  </span>
                )}
              </button>

              {abierto && (
                <div style={{
                  position: "absolute", top: 44, right: 0,
                  background: "#fff", borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,.16)",
                  width: 320, maxHeight: 380, overflowY: "auto",
                  zIndex: 100, border: "1px solid #e2e8f0",
                }}>
                  <div style={{
                    padding: "14px 16px 10px",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: 13, fontWeight: 700, color: "#0f172a",
                  }}>
                    Notificaciones
                  </div>
                  {notifs.length === 0 ? (
                    <div style={{ padding: "28px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                      No tienes notificaciones
                    </div>
                  ) : (
                    notifs.map((n) => (
                      <div key={n.id} style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f8fafc",
                        background: n.leida ? "#fff" : "#eff6ff",
                      }}>
                        <div style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.5 }}>{n.mensaje}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                          {new Date(n.created_at).toLocaleDateString("es-PE", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.25)", margin: "0 8px" }} />
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,.12)",
              borderRadius: 8, padding: "5px 12px",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{usuario.nombre}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 500,
                marginLeft: 4, transition: "all .15s",
              }}
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle("/login")}>Iniciar sesion</Link>
            <Link to="/register" style={{
              background: "#fff", color: "#2563eb", borderRadius: 7,
              padding: "7px 16px", fontSize: 13, fontWeight: 700,
              textDecoration: "none", marginLeft: 4,
            }}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
