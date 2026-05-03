import { Container, Form, Button, Card, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from "../hooks/useForm"; 
import { registerSchema } from '../schemas/authSchemas';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { fullName: '', email: '', password: '', confirmPassword: '', libraryCard: '', terms: false },
    registerSchema
  );

  const onSubmit = async (vals) => {
    const result = await registerUser(vals);
    if (result?.success) navigate('/login');
  };

  return (
    <div className="auth-page-bg">
      {/* 1. Navbar con efecto blur para no tapar bruscamente el fondo */}
      <Navbar 
        expand="lg" 
        className="fixed-top shadow-sm px-4"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)' }}
      >
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark" style={{ fontFamily: 'serif' }}>
          Athenaeum
        </Navbar.Brand>
        <Nav className="ms-auto flex-row gap-3">
          <Nav.Link as={Link} to="/login" className="small text-muted">Ingresar</Nav.Link>
          <Nav.Link as={Link} to="/register" className="small fw-bold text-dark border-bottom border-2 border-dark">Registro</Nav.Link>
        </Nav>
      </Navbar>

      {/* 2. Contenedor centrado con minHeight: 100vh */}
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '750px', zIndex: 1 }}
        >
          {/* 3. Card con la clase 'ath-card' y el fondo de cristal definido en tu CSS */}
          <Card className="ath-card shadow-lg border-0 p-2" style={{ borderRadius: '25px', background: 'var(--glass-bg)' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark" style={{ letterSpacing: '-1px' }}>Únete a Athenaeum</h2>
                <p className="text-muted small">Registro de membresía académica</p>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">Nombre Completo</Form.Label>
                      <Form.Control 
                        name="fullName" 
                        className="py-2 shadow-none"
                        placeholder="Juan Pérez" 
                        value={values.fullName} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        isInvalid={touched.fullName && !!errors.fullName} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">Correo Electrónico</Form.Label>
                      <Form.Control 
                        name="email" 
                        type="email" 
                        className="py-2 shadow-none"
                        placeholder="usuario@athenaeum.edu" 
                        value={values.email} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        isInvalid={touched.email && !!errors.email} 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">Contraseña</Form.Label>
                      <Form.Control 
                        name="password" 
                        type="password" 
                        className="py-2 shadow-none"
                        placeholder="••••••••" 
                        value={values.password} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        isInvalid={touched.password && !!errors.password} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">Confirmar</Form.Label>
                      <Form.Control 
                        name="confirmPassword" 
                        type="password" 
                        className="py-2 shadow-none"
                        placeholder="••••••••" 
                        value={values.confirmPassword} 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-secondary">Número de Carnet (Opcional)</Form.Label>
                  <Form.Control 
                    name="libraryCard" 
                    className="py-2 shadow-none"
                    placeholder="LIB-0000-0000" 
                    value={values.libraryCard} 
                    onChange={handleChange} 
                  />
                </Form.Group>

                {/* Usamos la clase btn-dark-ath para que sea azul marino */}
                <Button 
                  type="submit" 
                  className="w-100 py-3 fw-bold btn-dark-ath" 
                  style={{ borderRadius: '12px' }} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : 'Crear mi cuenta'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="small text-muted">
                  ¿Ya tienes cuenta? <Link to="/login" className="text-dark fw-bold text-decoration-none">Inicia sesión</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}