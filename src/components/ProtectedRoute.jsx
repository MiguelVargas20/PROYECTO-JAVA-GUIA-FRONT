import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Mientras se verifica si el usuario está logueado (opcional)
  if (loading) {
    return (
      // Cambia el spinner básico por uno con el color de tu marca
      <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem', color: 'var(--navy) !important' }} role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    );
  }

  // Si no hay usuario, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, permite el acceso a las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;