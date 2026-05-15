import { useCallback, useEffect, useState } from "react";
import { adminAPI } from "../api/incidencias";
import IncidenciaCard from "../components/IncidenciaCard";

const ESTADOS_CAMBIO = ["EN_PROCESO", "RESUELTO", "RECHAZADO"];

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

export default function AdminPanel() {
  const [incidencias, setIncidencias] = useState([]);
  const [filtros, setFiltros]         = useState({ estado: "", tipo: "" });
  const [seleccionada, setSeleccionada] = useState(null);
  const [form, setForm]               = useState({ estado: "EN_PROCESO", comentario_resolucion: "" });
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (filtros.estado) params.estado = filtros.estado;
    if (filtros.tipo)   params.tipo   = filtros.tipo;
    const { data } = await adminAPI.listarTodas(params);
    setIncidencias(data);
    setLoading(false);
  }, [filtros]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleActualizar = async () => {
    setError(""); setSaving(true);
    try {
      await adminAPI.actualizarEstado(seleccionada.id, form);
      setSeleccionada(null);
      cargar();
    } catch (err) {
      setError(err.response?.data?.detail || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const contarPor = (estado) => incidencias.filter((i) => i.estado === estado).length;

  return (
    <div style={{ maxWidth: 900, margin: "36px auto", padding: "0 20px" }}>
      {/* Encabezado */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Panel Administrativo</h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>Gestion y seguimiento de todas las incidencias del sistema</p>
          </div>
          <div style={{
            background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 9,
            padding: "8px 16px", fontSize: 13, color: "#475569", fontWeight: 500,
          }}>
            {incidencias.length} incidencias
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28,
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
                  borderRadius: 10, padding: "16px 18px", cursor: "pointer",
                  transition: "all .15s",
                  boxShadow: filtros.estado === e ? "none" : "0 1px 4px rgba(0,0,0,.05)",
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, color: m.color, lineHeight: 1 }}>{count}</div>
                <div style={{
                  fontSize: 11, color: "#64748b", fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: ".4px", marginTop: 4,
                }}>
                  {e.replace("_", " ")}
                </div>
                <div style={{
                  width: "100%", height: 3, borderRadius: 2, background: m.bg,
                  marginTop: 10, position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, height: "100%",
                    width: incidencias.length > 0 ? `${(count / incidencias.length) * 100}%` : "0%",
                    background: m.dot, borderRadius: 2,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select style={selectStyle} value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
            {["", "PENDIENTE", "EN_PROCESO", "RESUELTO", "RECHAZADO"].map((e) => (
              <option key={e} value={e}>{e ? e.replace("_", " ") : "Todos los estados"}</option>
            ))}
          </select>
          <select style={selectStyle} value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}>
            {["", "BACHE", "ALUMBRADO", "BASURA", "SEGURIDAD_CIUDADANA", "EMERGENCIA"].map((t) => (
              <option key={t} value={t}>{t ? t.replace("_", " ") : "Todos los tipos"}</option>
            ))}
          </select>
          {(filtros.estado || filtros.tipo) && (
            <button
              onClick={() => setFiltros({ estado: "", tipo: "" })}
              style={{
                background: "none", border: "1px solid #e2e8f0", color: "#64748b",
                borderRadius: 7, padding: "7px 12px", fontSize: 12, cursor: "pointer",
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 14 }}>Cargando incidencias...</div>
      ) : incidencias.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: 12, padding: 48, textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,.06)", color: "#94a3b8", fontSize: 14,
        }}>
          No hay incidencias con los filtros seleccionados.
        </div>
      ) : (
        incidencias.map((inc) => (
          <IncidenciaCard
            key={inc.id}
            incidencia={inc}
            onClick={(i) => {
              setSeleccionada(i);
              setForm({ estado: "EN_PROCESO", comentario_resolucion: "" });
              setError("");
            }}
          />
        ))
      )}

      {/* Modal actualizar estado */}
      {seleccionada && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 20, backdropFilter: "blur(2px)",
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 14, padding: "28px",
            width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 3px" }}>
                  Actualizar estado
                </h3>
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

            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Descripcion</div>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.5, margin: 0 }}>{seleccionada.descripcion}</p>
            </div>

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Nuevo estado
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
              {ESTADOS_CAMBIO.map((e) => {
                const m = ESTADO_META[e];
                return (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setForm({ ...form, estado: e })}
                    style={{
                      border: form.estado === e ? `2px solid ${m.dot}` : "2px solid #e2e8f0",
                      background: form.estado === e ? m.bg : "#f8fafc",
                      borderRadius: 8, padding: "8px 4px", cursor: "pointer",
                      fontSize: 12, fontWeight: 700, color: form.estado === e ? m.color : "#64748b",
                      transition: "all .15s",
                    }}
                  >
                    {e.replace("_", " ")}
                  </button>
                );
              })}
            </div>

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Comentario{form.estado === "RECHAZADO" && <span style={{ color: "#ef4444" }}> *</span>}
              {form.estado !== "RECHAZADO" && <span style={{ color: "#94a3b8", fontWeight: 400 }}> (opcional)</span>}
            </label>
            <textarea
              style={{
                width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                fontSize: 14, height: 88, resize: "vertical", outline: "none", marginBottom: 6,
              }}
              value={form.comentario_resolucion}
              onChange={(e) => setForm({ ...form, comentario_resolucion: e.target.value })}
              onFocus={(e) => { e.target.style.borderColor = "#2563eb"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
              placeholder={form.estado === "RECHAZADO" ? "Explica el motivo del rechazo..." : "Agrega una nota de seguimiento..."}
            />

            {error && (
              <div style={{
                background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c",
                borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 12,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={handleActualizar}
                disabled={saving}
                style={{
                  flex: 1, padding: "11px 0",
                  background: saving ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
                  color: "#fff", border: "none", borderRadius: 9,
                  fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Guardando..." : "Guardar cambio"}
              </button>
              <button
                onClick={() => setSeleccionada(null)}
                style={{
                  padding: "11px 18px", background: "#f1f5f9", color: "#475569",
                  border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
