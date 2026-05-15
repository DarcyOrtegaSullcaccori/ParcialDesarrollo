import api from "./axiosConfig";

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const incidenciasAPI = {
  crear: (data) => api.post("/incidencias/", data),
  misIncidencias: (params) => api.get("/incidencias/mis-incidencias", { params }),
  detalle: (id) => api.get(`/incidencias/${id}`),
  subirMultimedia: (id, file) => {
    const form = new FormData();
    form.append("archivo", file);
    return api.post(`/incidencias/${id}/multimedia`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  misNotificaciones: () => api.get("/incidencias/notificaciones/mis"),
  marcarLeida: (id) => api.patch(`/incidencias/notificaciones/${id}/leer`),
};

export const adminAPI = {
  listarTodas: (params) => api.get("/admin/incidencias/", { params }),
  actualizarEstado: (id, data) => api.patch(`/admin/incidencias/${id}/estado`, data),
};
