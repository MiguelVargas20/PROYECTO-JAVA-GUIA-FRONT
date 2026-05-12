import { createContext, useContext, useState } from 'react';
import { authApi } from '../api';

export const AuthContext = createContext();

/**
 * SESIÓN EN LOCALSTORAGE:
 *   ath_token    → JWT string
 *   ath_username → username del usuario
 *   ath_roles    → JSON.stringify(["LECTOR"])
 *   ath_userid   → id del usuario (extraído del JWT)
 *
 * RESPUESTA DEL BACK en /api/auth/login:
 *   { token, username, roles: ["LECTOR"] }
 *
 * El JWT contiene: { sub: username, roles, nombre, apellido, id }
 * Extraemos el id decodificando el payload del JWT en el front.
 */

/** Decodifica el payload del JWT sin librerías externas */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const token    = localStorage.getItem('ath_token');
      const username = localStorage.getItem('ath_username');
      const roles    = JSON.parse(localStorage.getItem('ath_roles') || '[]');
      const userId   = localStorage.getItem('ath_userid');
      if (token && username) return { token, username, roles, userId };
    } catch { }
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
      // data = { token, username, roles: ["LECTOR"] }

      // Decodificar JWT para extraer el id del usuario
      const payload = decodeJwtPayload(data.token);
      const userId  = payload?.id || null;

      const sessionUser = {
        token:    data.token,
        username: data.username,
        roles:    data.roles,
        userId,               // ← id del usuario desde el JWT
      };

      localStorage.setItem('ath_token',    data.token);
      localStorage.setItem('ath_username', data.username);
      localStorage.setItem('ath_roles',    JSON.stringify(data.roles));
      if (userId) localStorage.setItem('ath_userid', userId);

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
    localStorage.removeItem('ath_userid');
    setUser(null);
  };

  // ── HELPERS DE ROL ───────────────────────────────────────
  const hasRole = (roleName) =>
    user?.roles?.some(r => (r?.nombre ?? r) === roleName) ?? false;

  const isAdmin = () => hasRole('ADMINISTRADOR');

  return (
    <AuthContext.Provider value={{
      user,               // { token, username, roles, userId }
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