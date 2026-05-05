import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout     from './layout/MainLayout';
import AuthLayout     from './layout/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Home     from './pages/Home';
import Login    from './pages/Login';
import Register from './pages/Register';
import Libros   from './pages/Libros'; // <--- Nueva importación

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Rutas públicas con Navbar + Footer ─── */}
          <Route element={<MainLayout />}>
            <Route path="/"       element={<Home />} />
            <Route path="/libros" element={<Libros />} /> {/* <--- Ruta del catálogo */}
            {/* Opcional: Detalle del libro */}
            <Route path="/libros/:id" element={<div>Vista Detalle (Próximamente)</div>} />
          </Route>

          {/* ── Rutas de auth (sin layout global) ─── */}
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Rutas protegidas (requieren sesión) ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard"      element={<div>Dashboard</div>} />
              <Route path="/profile"        element={<div>Perfil</div>}   />
              <Route path="/mis-prestamos"  element={<div>Mis Préstamos</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}