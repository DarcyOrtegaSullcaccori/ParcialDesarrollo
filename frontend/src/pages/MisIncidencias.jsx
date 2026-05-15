import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { incidenciasAPI } from "../api/incidencias";
import IncidenciaCard from "../components/IncidenciaCard";

const ESTADOS = ["", "PENDIENTE", "EN_PROCESO", "RESUELTO", "RECHAZADO"];
const TIPOS   = ["", "BACHE", "ALUMBRADO", "BASURA", "SEGURIDAD_CIUDADANA", "EMERGENCIA"];

const ESTADO_META = {
  PENDIENTE:  { color: "#92400e", bg: "#fef9c3", dot: "#f59e0b" },
  EN_PROCESO: { color: "#1e40af", bg: "#eff6ff", dot: "#3b82f6" },
  RESUELTO:   { color: "#065f46", bg: "#f0fdf4", dot: "#22c55e" },
  RECHAZADO:  { color: "#991b1b", bg: "#fff1f2", dot: "#ef4444" },
};

const selectStyle = {
  padding: "8px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, color: "#334155", background: "#fff", outline: "none", cursor: "pointer",
};

export default function MisIncidencias() {
  const [incidencias, setIncidencias] = useState([]);
  const [filtros, setFiltros]         = useState({ estado: "", tipo: "" });
  const [seleccionada, setSeleccionada] = useState(null);
  const [loading, setLoading]         = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (filtros.estado) params.estado = filtros.estado;
    if (filtros.tipo)   params.tipo   = filtros.tipo;
    const { data } = await incidenciasAPI.misIncidencias(params);
    setIncidencias(data);
    setLoading(false);
  }, [filtros]);

  useEffect(() => { cargar(); }, [cargar]);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

  const contarPor = (estado) => incidencias.filter((i) => i.estado === estado).length;

  return (
    <div style={{ maxWidth: 780, margin: "36px auto", padding: "0 20px" }}>
      {/* Encabezado */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Mis Reportes</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>Seguimiento de todas tus incidencias registradas</p>
      </div>

      {/* Stats rápidas */}
      {!loading && incidencias.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24,
        }}>
          {["PENDIENTE", "EN_PROCESO", "RESUELTO", "RECHAZADO"].map((e) => {
            const m = ESTADO_META[e];
            const count = contarPor(e);
            return (
              <div
                key={e}
                onClick={() => setFiltros((f) => ({ ...f, estado: f.estado === e ? "" : e }))}
                style={{
                  background: filtros.estado === e ? m.bg : "#fff",
                  border: `1.5px solid ${filtros.estado === e ? m.dot : "#e2e8f0"}`,
                  borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                  textAlign: "center", transition: "all .15s",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{count}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginTop: 2 }}>
                  {e.replace("_", " ")}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      <div style={{
        display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={selectStyle} value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
            {ESTADOS.map((e) => <option key={e} value={e}>{e ? e.replace("_", " ") : "Todos los estados"}</option>)}
          </select>
          <select style={selectStyle} value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}>
            {TIPOS.map((t) => <option key={t} value={t}>{t ? t.replace("_", " ") : "Todos los tipos"}</option>)}
          </select>
        </div>
        {(filtros.estado || filtros.tipo) && (
          <button
            onClick={() => setFiltros({ estado: "", tipo: "" })}
            style={{
              background: "none", border: "1px solid #e2e8f0", color: "#64748b",
              borderRadius: 7, padding: "7px 12px", fontSize: 12, cursor: "pointer",
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <div style={{ fontSize: 14 }}>Cargando reportes...</div>
        </div>
      ) : incidencias.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: 12, padding: "60px 24px", textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,.06)",
        }}>
          <div style={{
            width: 56, height: 56, background: "#f1f5f9", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
            {filtros.estado || filtros.tipo ? "Sin resultados" : "Aun no tienes reportes"}
          </h3>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
            {filtros.estado || filtros.tipo
              ? "Prueba cambiando los filtros."
              : "Sé el primero en reportar una incidencia en tu zona."}
          </p>
          {!filtros.estado && !filtros.tipo && (
            <Link to="/reportar" style={{
              display: "inline-block", background: "#2563eb", color: "#fff",
              padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none",
            }}>
              Crear mi primer reporte
            </Link>
          )}
        </div>
      ) : (
        incidencias.map((inc) => (
          <IncidenciaCard key={inc.id} incidencia={inc} onClick={setSeleccionada} />
        ))
      )}

      {/* Modal detalle */}
      {seleccionada && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 20, backdropFilter: "blur(2px)",
          }}
          onClick={() => setSeleccionada(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 14, padding: "28px 28px 24px",
              width: "100%", maxWidth: 540, maxHeight: "85vh", overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                  {seleccionada.tipo.replace("_", " ")}
                </h2>
                <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>
                  #{seleccionada.codigo_seguimiento}
                </span>
              </div>
              <button
                onClick={() => setSeleccionada(null)}
                style={{
                  background: "#f1f5f9", border: "none", width: 32, height: 32,
                  borderRadius: 8, fontSize: 18, color: "#64748b", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Estado",    value: seleccionada.estado.replace("_", " ") },
                { label: "Tipo",      value: seleccionada.tipo.replace("_", " ") },
                { label: "Direccion", value: seleccionada.direccion },
                { label: "Fecha",     value: new Date(seleccionada.created_at).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Descripcion</div>
              <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, margin: 0 }}>{seleccionada.descripcion}</p>
            </div>

            {seleccionada.comentario_resolucion && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Comentario de resolucion</div>
                <p style={{ fontSize: 14, color: "#15803d", lineHeight: 1.6, margin: 0 }}>{seleccionada.comentario_resolucion}</p>
              </div>
            )}

            {seleccionada.multimedia?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>
                  Archivos adjuntos
                </div>
                {seleccionada.multimedia.map((m) => (
                  <div key={m.id} style={{ marginBottom: 10 }}>
                    {m.tipo_archivo === "IMAGEN" && (
                      <img
                        src={`${API_BASE.replace("/api/v1", "")}${m.url}`}
                        alt={m.nombre_original}
                        style={{ maxWidth: "100%", borderRadius: 8, display: "block" }}
                      />
                    )}
                    {m.tipo_archivo === "VIDEO" && (
                      <video controls style={{ maxWidth: "100%", borderRadius: 8 }} src={`${API_BASE.replace("/api/v1", "")}${m.url}`} />
                    )}
                    {m.tipo_archivo === "AUDIO" && (
                      <div style={{ background: "#f1f5f9", borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{m.nombre_original}</div>
                        <audio controls src={`${API_BASE.replace("/api/v1", "")}${m.url}`} style={{ width: "100%" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
