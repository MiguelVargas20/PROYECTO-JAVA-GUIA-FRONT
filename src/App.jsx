import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout     from './layout/MainLayout';
import AuthLayout     from './layout/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Rutas públicas con Navbar + Footer ─── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* ── Rutas de auth (sin layout global) ─── */}
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Rutas protegidas (requieren sesión) ── */}
          {/* <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile"   element={<Profile />}   />
            </Route>
          </Route> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}