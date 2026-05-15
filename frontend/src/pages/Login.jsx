import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api/incidencias";
import { useAuth } from "../context/AuthContext";

const field = {
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 5 },
  input: {
    width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 8,
    fontSize: 14, color: "#1e293b", background: "#fff", outline: "none",
    transition: "border .15s", marginBottom: 18,
  },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.access_token, data.usuario);
      navigate(data.usuario.rol === "ADMINISTRADOR" ? "/admin" : "/mis-incidencias");
    } catch (err) {
      setError(err.response?.data?.detail || "Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
            borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(37,99,235,.3)", marginBottom: 14,
          }}>
            <div style={{ width: 22, height: 22, background: "#fff", borderRadius: 5 }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>Incidencias Viales</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Accede a tu cuenta</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff", borderRadius: 14, padding: "32px 28px",
            boxShadow: "0 4px 24px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.04)",
          }}
        >
          {error && (
            <div style={{
              background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c",
              borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <label style={field.label}>Correo electronico</label>
          <input
            style={field.input}
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            required
          />

          <label style={field.label}>Contrasena</label>
          <input
            style={field.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "11px 0", marginTop: 4,
              background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "#fff", border: "none", borderRadius: 9,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,.3)",
              transition: "opacity .15s",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesion"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748b" }}>
            No tienes cuenta?{" "}
            <Link to="/register" style={{ color: "#2563eb", fontWeight: 600 }}>Registrate gratis</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
