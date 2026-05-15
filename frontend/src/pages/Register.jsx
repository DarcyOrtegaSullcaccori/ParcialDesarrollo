import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api/incidencias";

const field = {
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 5 },
  input: {
    width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 8,
    fontSize: 14, color: "#1e293b", background: "#fff", outline: "none", transition: "border .15s",
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", telefono: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const focus = (e) => { e.target.style.borderColor = "#2563eb"; };
  const blur  = (e) => { e.target.style.borderColor = "#e2e8f0"; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await authAPI.register(form);
      setOk(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
            borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(37,99,235,.3)", marginBottom: 14,
          }}>
            <div style={{ width: 22, height: 22, background: "#fff", borderRadius: 5 }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>Crear cuenta</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Es gratis y solo toma un minuto</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff", borderRadius: 14, padding: "32px 28px",
            boxShadow: "0 4px 24px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.04)",
          }}
        >
          {ok && (
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d",
              borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 20, fontWeight: 500,
            }}>
              Cuenta creada exitosamente. Redirigiendo...
            </div>
          )}
          {error && (
            <div style={{
              background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c",
              borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            <div>
              <label style={field.label}>Nombre</label>
              <input style={field.input} value={form.nombre} onChange={set("nombre")} onFocus={focus} onBlur={blur} required placeholder="Juan" />
            </div>
            <div>
              <label style={field.label}>Apellido</label>
              <input style={field.input} value={form.apellido} onChange={set("apellido")} onFocus={focus} onBlur={blur} required placeholder="Perez" />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={field.label}>Correo electronico</label>
            <input style={field.input} type="email" value={form.email} onChange={set("email")} onFocus={focus} onBlur={blur} required placeholder="tu@email.com" />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={field.label}>Contrasena <span style={{ color: "#94a3b8", fontWeight: 400 }}>(minimo 8 caracteres)</span></label>
            <input style={field.input} type="password" value={form.password} onChange={set("password")} onFocus={focus} onBlur={blur} required placeholder="••••••••" minLength={8} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={field.label}>Telefono <span style={{ color: "#94a3b8", fontWeight: 400 }}>(opcional)</span></label>
            <input style={field.input} value={form.telefono} onChange={set("telefono")} onFocus={focus} onBlur={blur} placeholder="+51 999 000 000" />
          </div>

          <button
            type="submit"
            disabled={loading || ok}
            style={{
              width: "100%", padding: "11px 0",
              background: loading || ok ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "#fff", border: "none", borderRadius: 9,
              fontSize: 15, fontWeight: 700, cursor: loading || ok ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,.3)",
            }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748b" }}>
            Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>Inicia sesion</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
