import { useState } from 'react';
import { Container, Form, Button, Card, InputGroup, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setApiError("Credenciales incorrectas. Verifica tu acceso.");
    }
  };

  return (
    // 1. Contenedor con la clase que definimos en index.css
    <div className="auth-page-bg">
      
      {/* 2. Navbar: bg="transparent" y un inline style para un desenfoque sutil */}
      <Navbar 
        expand="lg" 
        className="fixed-top shadow-sm px-4" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)' }}
      >
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark" style={{ fontFamily: 'serif' }}>
          Athenaeum
        </Navbar.Brand>
        <Nav className="ms-auto flex-row gap-3">
          <Nav.Link as={Link} to="/login" className="small fw-bold text-dark border-bottom border-2 border-dark">Ingresar</Nav.Link>
          <Nav.Link as={Link} to="/register" className="small text-muted">Registro</Nav.Link>
        </Nav>
      </Navbar>

      {/* 3. Contenedor Centrado: Eliminamos paddingTop excesivo para centrar mejor */}
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '420px', zIndex: 1 }}
        >
          {/* 4. La Card: 'ath-card' da el efecto hover y 'var(--glass-bg)' la transparencia blanca */}
          <Card className="ath-card shadow-lg border-0 p-2" style={{ borderRadius: '25px', background: 'var(--glass-bg)' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark" style={{ letterSpacing: '-1px' }}>Bienvenido</h2>
                <p className="text-muted small">Accede al repositorio académico</p>
              </div>

              {apiError && <div className="alert alert-danger py-2 small text-center">{apiError}</div>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-secondary">Correo Electrónico</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control 
                      className="border-start-0 py-2 shadow-none" 
                      type="email" 
                      placeholder="usuario@athenaeum.edu" 
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-secondary">Contraseña</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0 text-muted">
                      <i className="bi bi-lock"></i>
                    </InputGroup.Text>
                    <Form.Control 
                      className="border-start-0 py-2 shadow-none" 
                      type="password" 
                      placeholder="••••••••" 
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </InputGroup>
                </Form.Group>

                <Button 
                  variant="dark" 
                  type="submit" 
                  className="w-100 py-2 fw-bold btn-dark-ath" // Usamos la clase que creamos en CSS
                  style={{ borderRadius: '12px', fontSize: '0.9rem' }} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Cargando...
                    </>
                  ) : 'Iniciar Sesión'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="small text-muted">
                  ¿Nuevo aquí? <Link to="/register" className="text-dark fw-bold text-decoration-none">Crea una cuenta</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}