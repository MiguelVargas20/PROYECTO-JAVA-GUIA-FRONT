import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
          📚 ATHENAEUM
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="mx-2">Inicio</Nav.Link>
            
            {user ? (
              <>
                <Nav.Link as={Link} to="/perfil" className="mx-2">Mi Perfil</Nav.Link>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2 text-dark">
                  Iniciar Sesión
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="ms-lg-3 px-4 rounded-pill"
                >
                  Registrarse
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