import { Container, Form, Button, Card, InputGroup, Navbar, Nav, Row, Col } from 'react-bootstrap';
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
      <Navbar bg="white" expand="lg" className="border-bottom fixed-top shadow-sm px-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark" style={{ fontFamily: 'serif' }}>Athenaeum</Navbar.Brand>
        <Nav className="ms-auto flex-row gap-3">
          <Nav.Link as={Link} to="/login" className="small text-muted">Ingresar</Nav.Link>
          <Nav.Link as={Link} to="/register" className="small fw-bold text-dark border-bottom border-2 border-dark">Registro</Nav.Link>
        </Nav>
      </Navbar>

      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: '750px' }}
        >
          <Card className="ath-card shadow-lg border-0 p-4" style={{ borderRadius: '25px', background: 'var(--glass-bg)' }}>
            <Card.Body>
              <h2 className="fw-bold text-center mb-1">Únete a Athenaeum</h2>
              <p className="text-center text-muted small mb-4">Registro de membresía académica</p>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Nombre Completo</Form.Label>
                      <Form.Control name="fullName" placeholder="Juan Pérez" value={values.fullName} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.fullName && !!errors.fullName} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Correo Electrónico</Form.Label>
                      <Form.Control name="email" type="email" placeholder="usuario@athenaeum.edu" value={values.email} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.email && !!errors.email} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Contraseña</Form.Label>
                      <Form.Control name="password" type="password" placeholder="••••••••" value={values.password} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.password && !!errors.password} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Confirmar</Form.Label>
                      <Form.Control name="confirmPassword" type="password" placeholder="••••••••" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold">Número de Carnet (Opcional)</Form.Label>
                  <Form.Control name="libraryCard" placeholder="LIB-0000-0000" value={values.libraryCard} onChange={handleChange} />
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100 py-3 fw-bold" style={{ borderRadius: '12px' }} disabled={loading}>
                  {loading ? 'Procesando...' : 'Crear mi cuenta'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}