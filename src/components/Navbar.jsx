import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleClass = (role) => {
    if (role === 'ADMIN') return 'role-admin';
    if (role === 'MODERATOR') return 'role-moderator';
    return 'role-reader';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar-light bg-white border-bottom ath-navbar py-3 sticky-top">
      <Container>
        {/* Logo con el estilo exacto que pediste */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="me-2">📚</span>
          <span className="fw-bold text-navy" style={{ letterSpacing: '-0.5px' }}>
            ATHENAEUM
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarNav" />

        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="px-3">Inicio</Nav.Link>

            {user ? (
              <>
                {/* Badge de Rol Dinámico */}
                <span className={`role-badge ${getRoleClass(user.role)} me-3`}>
                  {user.role || 'LECTOR'}
                </span>
                
                <Nav.Link as={Link} to="/perfil" className="px-3">Mi Perfil</Nav.Link>
                
                {user.role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/admin" className="text-danger fw-bold px-3">
                    Panel Admin
                  </Nav.Link>
                )}

                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="ms-3 rounded-pill px-3"
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                {/* Opciones para visitantes: Estilo exacto solicitado */}
                <Nav.Link as={Link} to="/login" className="px-3">
                  Entrar
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  className="btn-navy text-white px-4 ms-lg-2 rounded-pill shadow-sm"
                >
                  Unirse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;