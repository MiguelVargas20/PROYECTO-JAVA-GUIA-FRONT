import { useState } from 'react';
import {
  Container, Form, Button, Card,
  InputGroup, Navbar, Nav, Alert
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { loginSchema } from '../schemas/authSchemas';

/**
 * LOGIN PAGE
 *
 * Flujo:
 *  1. Yup valida los campos ANTES de llamar al back (evita peticiones innecesarias)
 *  2. Si pasa Yup → llama a login() del AuthContext
 *  3. AuthContext → POST /api/auth/login → { username, password }
 *  4. Back responde { token, username, roles }
 *  5. Se guarda en localStorage y redirige al home
 */
export default function Login() {
  const navigate           = useNavigate();
  const { login, loading } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  // useForm con schema Yup → valida antes de enviar
  const {
    values, errors, touched,
    handleChange, handleBlur, handleSubmit,
  } = useForm(
    { username: '', password: '' },
    loginSchema
  );

  // onSubmit solo se ejecuta si Yup no encontró errores
  const onSubmit = async (vals) => {
    setApiError('');
    const result = await login(vals.username.trim(), vals.password);
    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="auth-page-bg">

      {/* ── Navbar ─────────────────────────────────────── */}
      <Navbar
        expand="lg"
        className="fixed-top shadow-sm px-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <Navbar.Brand
          as={Link} to="/"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: 'var(--navy)',
          }}
        >
          Athenaeum
        </Navbar.Brand>
        <Nav className="ms-auto flex-row gap-3 align-items-center">
          <Nav.Link
            as={Link} to="/login"
            className="small fw-bold"
            style={{ color: 'var(--navy)', borderBottom: '2px solid var(--navy)', paddingBottom: '2px' }}
          >
            Ingresar
          </Nav.Link>
          <Nav.Link as={Link} to="/register" className="small text-muted">
            Registro
          </Nav.Link>
        </Nav>
      </Navbar>

      {/* ── Card centrada ──────────────────────────────── */}
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh', paddingTop: '62px' }}
      >
        <div style={{ width: '100%', maxWidth: '430px' }}>
          <Card
            className="border-0 shadow-lg"
            style={{ borderRadius: '24px', background: 'rgba(255,255,255,0.97)' }}
          >
            <Card.Body className="p-5">

              {/* Título */}
              <div className="text-center mb-4">
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  color: 'var(--navy)',
                }}>
                  Bienvenido
                </h2>
                <p className="text-muted small mb-0">Accede al repositorio académico</p>
              </div>

              {/* Error del back */}
              {apiError && (
                <Alert
                  variant="danger"
                  className="py-2 text-center small"
                  onClose={() => setApiError('')}
                  dismissible
                >
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* ── Usuario ──────────────────────────── */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold" style={{ color: 'var(--text-mid)' }}>
                    Correo Electrónico / Usuario
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0 text-muted">
                      <i className="bi bi-person" />
                    </InputGroup.Text>
                    <Form.Control
                      name="username"
                      className="border-start-0 py-2 shadow-none"
                      placeholder="usuario@athenaeum.edu"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.username && !!errors.username}
                      autoComplete="username"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* ── Contraseña ────────────────────────── */}
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold" style={{ color: 'var(--text-mid)' }}>
                    Contraseña
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0 text-muted">
                      <i className="bi bi-lock" />
                    </InputGroup.Text>
                    <Form.Control
                      name="password"
                      className="border-start-0 py-2 shadow-none"
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                      autoComplete="current-password"
                    />
                    {/* Toggle mostrar/ocultar — sin borde izquierdo */}
                    <InputGroup.Text
                      className="bg-white text-muted"
                      style={{ cursor: 'pointer', borderLeft: 0 }}
                      onClick={() => setShowPass(p => !p)}
                      title={showPass ? 'Ocultar' : 'Mostrar'}
                    >
                      <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* ── Submit ────────────────────────────── */}
                <Button
                  type="submit"
                  className="w-100 py-2 fw-bold border-0"
                  disabled={loading}
                  style={{
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    background: loading ? '#6c757d' : 'var(--navy)',
                    transition: 'background 0.2s',
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Cargando...
                    </>
                  ) : 'Iniciar Sesión'}
                </Button>

              </Form>

              {/* Link al registro */}
              <div className="text-center mt-4">
                <p className="small text-muted mb-0">
                  ¿Nuevo aquí?{' '}
                  <Link
                    to="/register"
                    className="fw-bold text-decoration-none"
                    style={{ color: 'var(--navy)' }}
                  >
                    Crea una cuenta
                  </Link>
                </p>
              </div>

            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}