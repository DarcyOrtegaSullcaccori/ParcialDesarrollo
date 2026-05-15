import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TIPOS = [
  { label: "Baches",    color: "#92400e", bg: "#fef3c7", desc: "Deterioro del pavimento en calzadas y veredas" },
  { label: "Alumbrado", color: "#1e40af", bg: "#dbeafe", desc: "Postes y luminarias deficientes o sin funcionar" },
  { label: "Basura",    color: "#065f46", bg: "#d1fae5", desc: "Acumulacion de residuos en espacios publicos" },
  { label: "Seguridad", color: "#6b21a8", bg: "#f3e8ff", desc: "Situaciones de riesgo a la seguridad ciudadana" },
  { label: "Emergencia",color: "#991b1b", bg: "#fee2e2", desc: "Casos urgentes que requieren atencion inmediata" },
];

const PASOS = [
  { num: "1", title: "Registrate", desc: "Crea tu cuenta con tu email en menos de un minuto." },
  { num: "2", title: "Reporta",    desc: "Describe la incidencia, agrega la ubicacion y adjunta fotos o videos." },
  { num: "3", title: "Seguimiento", desc: "Recibe notificaciones cuando el estado de tu reporte cambie." },
];

export default function Home() {
  const { usuario } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
        padding: "80px 24px 72px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,.15)",
          borderRadius: 20, padding: "4px 14px", marginBottom: 20,
          fontSize: 13, color: "rgba(255,255,255,.9)", fontWeight: 500,
        }}>
          Plataforma ciudadana de gestion de incidencias
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "#fff",
          letterSpacing: "-1px", margin: "0 auto 16px", maxWidth: 640, lineHeight: 1.15,
        }}>
          Reporta problemas en la via publica
        </h1>
        <p style={{
          fontSize: 17, color: "rgba(255,255,255,.78)", maxWidth: 480,
          margin: "0 auto 36px", lineHeight: 1.7,
        }}>
          Registra incidencias con fotos, videos o audios y dales seguimiento en tiempo real hasta su resolucion.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to={usuario ? "/reportar" : "/register"} style={{
            background: "#fff", color: "#1d4ed8",
            padding: "13px 28px", borderRadius: 9, fontWeight: 700, fontSize: 15,
            textDecoration: "none", boxShadow: "0 4px 14px rgba(0,0,0,.15)",
          }}>
            {usuario ? "Crear reporte" : "Comenzar ahora"}
          </Link>
          {!usuario && (
            <Link to="/login" style={{
              background: "rgba(255,255,255,.15)", color: "#fff",
              padding: "13px 28px", borderRadius: 9, fontWeight: 600, fontSize: 15,
              textDecoration: "none", border: "1px solid rgba(255,255,255,.3)",
            }}>
              Ya tengo cuenta
            </Link>
          )}
        </div>
      </section>

      {/* Tipos de incidencia */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
          Tipos de incidencia
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, fontSize: 15 }}>
          Categoriza tu reporte para que sea atendido por el area correspondiente
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
        }}>
          {TIPOS.map((t) => (
            <div key={t.label} style={{
              background: "#fff", border: `1px solid ${t.bg}`,
              borderTop: `3px solid ${t.color}`,
              borderRadius: 10, padding: "20px 18px",
              boxShadow: "0 1px 4px rgba(0,0,0,.05)",
            }}>
              <div style={{
                display: "inline-block", background: t.bg, color: t.color,
                fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10,
              }}>
                {t.label}
              </div>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ background: "#f8fafc", padding: "60px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            Como funciona
          </h2>
          <p style={{ color: "#64748b", marginBottom: 48, fontSize: 15 }}>Tres pasos simples para reportar una incidencia</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {PASOS.map((p) => (
              <div key={p.num} style={{ textAlign: "center" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff", fontSize: 20, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 12px rgba(37,99,235,.35)",
                }}>
                  {p.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      {!usuario && (
        <section style={{ padding: "56px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
            Ayuda a mejorar tu ciudad
          </h2>
          <p style={{ color: "#64748b", marginBottom: 28, fontSize: 15 }}>
            Cada reporte cuenta. Registrate gratis y empieza a reportar.
          </p>
          <Link to="/register" style={{
            background: "#2563eb", color: "#fff",
            padding: "12px 32px", borderRadius: 9, fontWeight: 700, fontSize: 15,
            textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,.3)",
          }}>
            Crear cuenta gratuita
          </Link>
        </section>
      )}
    </div>
  );
}
