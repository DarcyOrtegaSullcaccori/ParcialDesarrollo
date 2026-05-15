import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { incidenciasAPI } from "../api/incidencias";

const TIPOS = [
  { value: "BACHE",               label: "Bache",     color: "#92400e", bg: "#fef3c7", desc: "Deterioro del pavimento" },
  { value: "ALUMBRADO",           label: "Alumbrado", color: "#1e40af", bg: "#dbeafe", desc: "Luminaria deficiente" },
  { value: "BASURA",              label: "Basura",    color: "#065f46", bg: "#d1fae5", desc: "Acumulacion de residuos" },
  { value: "SEGURIDAD_CIUDADANA", label: "Seguridad", color: "#6b21a8", bg: "#f3e8ff", desc: "Riesgo a la seguridad" },
  { value: "EMERGENCIA",          label: "Emergencia",color: "#991b1b", bg: "#fee2e2", desc: "Atencion urgente" },
];

const inputStyle = {
  width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0",
  borderRadius: 8, fontSize: 14, color: "#1e293b", outline: "none",
  transition: "border .15s", background: "#fff",
};

export default function ReportarIncidencia() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("BACHE");
  const [form, setForm] = useState({ descripcion: "", direccion: "", latitud: "", longitud: "" });
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const focus = (e) => { e.target.style.borderColor = "#2563eb"; };
  const blur  = (e) => { e.target.style.borderColor = "#e2e8f0"; };

  const obtenerGPS = () => {
    if (!navigator.geolocation) return setError("Tu navegador no soporta geolocalización");
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, latitud: pos.coords.latitude.toFixed(6), longitud: pos.coords.longitude.toFixed(6) })),
      () => setError("No se pudo obtener la ubicacion GPS. Ingresala manualmente.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const payload = {
        tipo,
        descripcion: form.descripcion,
        direccion: form.direccion,
        latitud: form.latitud ? parseFloat(form.latitud) : null,
        longitud: form.longitud ? parseFloat(form.longitud) : null,
      };
      const { data: inc } = await incidenciasAPI.crear(payload);
      for (const archivo of archivos) {
        await incidenciasAPI.subirMultimedia(inc.id, archivo);
      }
      setOk(inc.codigo_seguimiento);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al crear el reporte");
    } finally {
      setLoading(false);
    }
  };

  if (ok) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 420, width: "100%",
          textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,.08)",
        }}>
          <div style={{
            width: 60, height: 60, background: "#f0fdf4", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Reporte enviado</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
            Tu incidencia fue registrada exitosamente.
          </p>
          <div style={{
            background: "#f1f5f9", borderRadius: 8, padding: "10px 16px", marginBottom: 28,
            fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: "#1e293b",
          }}>
            {ok}
          </div>
          <button
            onClick={() => navigate("/mis-incidencias")}
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#fff",
              border: "none", borderRadius: 9, padding: "11px 28px",
              fontSize: 14, fontWeight: 700, cursor: "pointer", marginRight: 10,
            }}
          >
            Ver mis reportes
          </button>
          <button
            onClick={() => { setOk(""); setForm({ descripcion: "", direccion: "", latitud: "", longitud: "" }); setArchivos([]); }}
            style={{
              background: "#f1f5f9", color: "#475569", border: "none",
              borderRadius: 9, padding: "11px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            Nuevo reporte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "36px auto", padding: "0 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Reportar Incidencia</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Completa el formulario para registrar un problema en la via publica</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c",
            borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        {/* Tipo */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "22px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,.06)", marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 14px" }}>Tipo de incidencia</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
            {TIPOS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTipo(t.value)}
                style={{
                  border: tipo === t.value ? `2px solid ${t.color}` : "2px solid #e2e8f0",
                  background: tipo === t.value ? t.bg : "#f8fafc",
                  borderRadius: 9, padding: "10px 8px", cursor: "pointer",
                  transition: "all .15s", textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: tipo === t.value ? t.color : "#475569" }}>
                  {t.label}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Descripcion y Ubicacion */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "22px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,.06)", marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Descripcion y ubicacion</h3>

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 5 }}>
            Descripcion <span style={{ color: "#94a3b8", fontWeight: 400 }}>(minimo 20 caracteres)</span>
          </label>
          <textarea
            style={{ ...inputStyle, height: 96, resize: "vertical", marginBottom: 18 }}
            value={form.descripcion}
            onChange={set("descripcion")}
            onFocus={focus} onBlur={blur}
            placeholder="Describe el problema con el mayor detalle posible..."
            required minLength={20}
          />

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 5 }}>
            Direccion
          </label>
          <input
            style={{ ...inputStyle, marginBottom: 16 }}
            value={form.direccion}
            onChange={set("direccion")}
            onFocus={focus} onBlur={blur}
            placeholder="Av. Principal 123, interseccion con Calle Sur"
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Latitud</label>
              <input style={inputStyle} value={form.latitud} onChange={set("latitud")} onFocus={focus} onBlur={blur} placeholder="-12.046374" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Longitud</label>
              <input style={inputStyle} value={form.longitud} onChange={set("longitud")} onFocus={focus} onBlur={blur} placeholder="-77.042793" />
            </div>
          </div>
          <button
            type="button"
            onClick={obtenerGPS}
            style={{
              background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0",
              borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            Obtener GPS automaticamente
          </button>
        </div>

        {/* Archivos */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "22px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,.06)", marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>Evidencia multimedia</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
            Adjunta imagenes (JPG, PNG), videos (MP4) o audios (MP3, WAV). Maximo 50 MB por archivo.
          </p>
          <label style={{
            display: "block", border: "2px dashed #cbd5e1", borderRadius: 10,
            padding: "24px 20px", textAlign: "center", cursor: "pointer",
            background: archivos.length > 0 ? "#f0fdf4" : "#f8fafc",
            transition: "all .15s",
          }}>
            <input
              type="file"
              accept="image/*,video/mp4,audio/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => setArchivos(Array.from(e.target.files))}
            />
            {archivos.length > 0 ? (
              <div>
                <div style={{ fontWeight: 600, color: "#16a34a", fontSize: 14 }}>
                  {archivos.length} archivo(s) seleccionado(s)
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {archivos.map((f) => f.name).join(", ")}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Haz clic para seleccionar archivos</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>JPG, PNG, MP4, MP3, WAV</div>
              </div>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", padding: "13px 0",
            background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
            color: "#fff", border: "none", borderRadius: 10,
            fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 14px rgba(37,99,235,.3)",
          }}
        >
          {loading ? "Enviando reporte..." : "Enviar Reporte"}
        </button>
      </form>
    </div>
  );
}
