import { createContext, useContext, useState } from 'react';
import { authApi } from '../api';

export const AuthContext = createContext();

/**
 * SESIÓN EN LOCALSTORAGE:
 *   ath_token    → JWT string
 *   ath_username → email/username del usuario
 *   ath_roles    → JSON.stringify([{ nombre: 'ADMIN' }])
 *
 * RESPUESTA DEL BACK en /api/auth/login:
 *   { token, username, roles: [{ nombre }] }
 *
 * NOTA: el perfil completo (nombre, apellido, etc.) se obtiene
 *   aparte con GET /api/usuarios/correo/{username}
 *   cuando se cargue la vista de perfil.
 */
export const AuthProvider = ({ children }) => {

  // Al montar, revisar si ya hay sesión guardada
  const [user, setUser] = useState(() => {
    try {
      const token    = localStorage.getItem('ath_token');
      const username = localStorage.getItem('ath_username');
      const roles    = JSON.parse(localStorage.getItem('ath_roles') || '[]');
      if (token && username) return { token, username, roles };
    } catch { /* si falla el parse, ignorar */ }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── LOGIN ────────────────────────────────────────────────
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login(username, password);
      // data = { token: "eyJ...", username: "juan@...", roles: [{nombre:"ADMIN"}] }

      const sessionUser = {
        token:    data.token,
        username: data.username,
        roles:    data.roles,
      };

      localStorage.setItem('ath_token',    data.token);
      localStorage.setItem('ath_username', data.username);
      localStorage.setItem('ath_roles',    JSON.stringify(data.roles));

      setUser(sessionUser);
      return { success: true };

    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales incorrectas';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── LOGOUT ───────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('ath_token');
    localStorage.removeItem('ath_username');
    localStorage.removeItem('ath_roles');
    setUser(null);
  };

  // ── HELPERS DE ROL ───────────────────────────────────────
  // Roles vienen como [{ nombre: 'ADMIN' }] o a veces como strings
  const hasRole = (roleName) =>
    user?.roles?.some(r =>
      (r?.nombre ?? r) === roleName
    ) ?? false;

  const isAdmin = () => hasRole('ADMIN');

  return (
    <AuthContext.Provider value={{
      user,               // { token, username, roles }
      loading,
      error,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
      isAdmin,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};