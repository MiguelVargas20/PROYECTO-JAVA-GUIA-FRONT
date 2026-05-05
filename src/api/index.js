import axios from 'axios';

// ── Instancia base ────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ath_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el token expira (401) → limpia sesión y manda al login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ─────────────────────────────────────────────────
// POST /api/auth/login → body: { username, password }
// Respuesta del back: { token, username, roles: [{ nombre }] }
export const authApi = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

// ── Usuarios ─────────────────────────────────────────────
export const usuariosApi = {
  listar:           ()           => api.get('/usuarios'),
  obtenerPorId:     (id)         => api.get(`/usuarios/${id}`),
  obtenerPorCorreo: (correo)     => api.get(`/usuarios/correo/${correo}`),
  obtenerPorDoc:    (docNum)     => api.get(`/usuarios/doc/${docNum}`),
  actualizar:       (id, data)   => api.put(`/usuarios/${id}`, data),
  eliminar:         (id)         => api.delete(`/usuarios/${id}`),
};

// ── Libros ────────────────────────────────────────────────
export const librosApi = {
  listar:           ()           => api.get('/libros'),
  obtenerPorId:     (id)         => api.get(`/libros/${id}`),
  buscarPorTitulo:  (titulo)     => api.get(`/libros/buscar?titulo=${titulo}`),
  buscarPorAutor:   (autor)      => api.get(`/libros/autor/${autor}`),
  buscarPorGenero:  (genero)     => api.get(`/libros/genero/${genero}`),
  porEstado:        (estado)     => api.get(`/libros/estado/${estado}`),
  crear:            (data)       => api.post('/libros', data),
  actualizar:       (id, data)   => api.put(`/libros/${id}`, data),
  eliminar:         (id)         => api.delete(`/libros/${id}`),
};

// ── Préstamos ─────────────────────────────────────────────
export const prestamosApi = {
  listar:             ()         => api.get('/prestamos'),
  obtenerPorId:       (id)       => api.get(`/prestamos/${id}`),
  porUsuario:         (userId)   => api.get(`/prestamos/usuario/${userId}`),
  porEstado:          (estado)   => api.get(`/prestamos/estado/${estado}`),
  crear:              (data)     => api.post('/prestamos', data),
  devolver:           (id)       => api.patch(`/prestamos/${id}/devolver`),
  actualizarVencidos: ()         => api.patch('/prestamos/vencidos'),
  eliminar:           (id)       => api.delete(`/prestamos/${id}`),
};

// ── Registro de usuario (separado del auth) ───────────────
// POST /api/usuarios/registro → body: UsuarioRegistroDto
export const registroApi = {
  registrar: (data) => api.post('/usuarios/registro', data),
};