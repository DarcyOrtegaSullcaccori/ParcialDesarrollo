const TIPO_META = {
  BACHE:               { color: "#92400e", bg: "#fef3c7", label: "Bache" },
  ALUMBRADO:           { color: "#1e40af", bg: "#dbeafe", label: "Alumbrado" },
  BASURA:              { color: "#065f46", bg: "#d1fae5", label: "Basura" },
  SEGURIDAD_CIUDADANA: { color: "#6b21a8", bg: "#f3e8ff", label: "Seguridad" },
  EMERGENCIA:          { color: "#991b1b", bg: "#fee2e2", label: "Emergencia" },
};

const ESTADO_META = {
  PENDIENTE:  { color: "#92400e", bg: "#fef9c3", dot: "#f59e0b" },
  EN_PROCESO: { color: "#1e40af", bg: "#eff6ff", dot: "#3b82f6" },
  RESUELTO:   { color: "#065f46", bg: "#f0fdf4", dot: "#22c55e" },
  RECHAZADO:  { color: "#991b1b", bg: "#fff1f2", dot: "#ef4444" },
};

export default function IncidenciaCard({ incidencia, onClick }) {
  const tipo  = TIPO_META[incidencia.tipo]  || { color: "#374151", bg: "#f3f4f6", label: incidencia.tipo };
  const estado = ESTADO_META[incidencia.estado] || { color: "#374151", bg: "#f3f4f6", dot: "#6b7280" };

  const fecha = new Date(incidencia.created_at).toLocaleDateString("es-PE", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div
      onClick={() => onClick && onClick(incidencia)}
      style={{
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${tipo.color}`,
        borderRadius: 10,
        padding: "16px 20px",
        marginBottom: 10,
        cursor: onClick ? "pointer" : "default",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
        transition: "box-shadow .15s, transform .1s",
      }}
      onMouseEnter={(e) => {
        if (!onClick) return;
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.05)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            background: tipo.bg, color: tipo.color,
            fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
            textTransform: "uppercase", letterSpacing: ".4px",
          }}>
            {tipo.label}
          </span>
          <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>
            #{incidencia.codigo_seguimiento}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", background: estado.dot, flexShrink: 0,
          }} />
          <span style={{
            background: estado.bg, color: estado.color,
            fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
            textTransform: "uppercase", letterSpacing: ".4px",
          }}>
            {incidencia.estado.replace("_", " ")}
          </span>
        </div>
      </div>

      <p style={{ margin: "10px 0 6px", color: "#1e293b", fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>
        {incidencia.descripcion.length > 120
          ? incidencia.descripcion.slice(0, 120) + "…"
          : incidencia.descripcion}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#64748b" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C5.2 0 3 2.2 3 5c0 3.5 5 11 5 11s5-7.5 5-11c0-2.8-2.2-5-5-5zm0 7.5C6.6 7.5 5.5 6.4 5.5 5S6.6 2.5 8 2.5 10.5 3.6 10.5 5 9.4 7.5 8 7.5z"/>
          </svg>
          {incidencia.direccion}
        </span>
        <span>{fecha}</span>
        {incidencia.multimedia?.length > 0 && (
          <span style={{
            background: "#f1f5f9", color: "#475569",
            padding: "1px 7px", borderRadius: 10, fontWeight: 500,
          }}>
            {incidencia.multimedia.length} archivo{incidencia.multimedia.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
