import { useState } from 'react';
import {
  Container, Form, Button, Card,
  Navbar, Nav, Row, Col, Alert
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registroApi } from '../api';
import { useForm } from '../hooks/useForm';
import { registerSchema } from '../schemas/authSchemas';

/**
 * REGISTER PAGE
 *
 * Envía a: POST /api/usuarios/registro
 * Body (UsuarioRegistroDto):
 * {
 *   nombre, apellido,
 *   docId: { tipo, numero },
 *   telefono, correo,
 *   direccion: { ciudad, direccion },
 *   fechaNacimiento,
 *   username, password
 *   // estado y roles los asigna el back automáticamente
 * }
 *
 * confirmPassword solo es validación del front, NO se envía al back.
 */
export default function Register() {
  const navigate = useNavigate();
  const [apiError,  setApiError]  = useState('');
  const [loading,   setLoading]   = useState(false);

  const INITIAL = {
    nombre: '', apellido: '',
    correo: '', username: '',
    password: '', confirmPassword: '',
    docTipo: 'CC', docNumero: '',
    telefono: '',
    ciudad: '', direccionTexto: '',
    fechaNacimiento: '',
  };

  const {
    values, errors, touched,
    handleChange, handleBlur, handleSubmit,
  } = useForm(INITIAL, registerSchema);

  // ── Submit: armar el body exacto que espera el back ────────
  const onSubmit = async (vals) => {
    setApiError('');
    setLoading(true);
    try {
      // Construimos el DTO exacto del back
      const body = {
        nombre:   vals.nombre,
        apellido: vals.apellido,
        correo:   vals.correo,
        username: vals.username,
        password: vals.password,
        docId: {
          tipo:   vals.docTipo,    // CC | TI | CE | PA
          numero: vals.docNumero,
        },
        telefono: vals.telefono || null,
        direccion: {
          ciudad:    vals.ciudad         || null,
          direccion: vals.direccionTexto || null,
        },
        fechaNacimiento: vals.fechaNacimiento || null,
        // estado y roles → el back los asigna por defecto
      };

      await registroApi.registrar(body);

      navigate('/login');

    } catch (err) {
      setApiError(err.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
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
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.5px' }}
        >
          Athenaeum
        </Navbar.Brand>
        <Nav className="ms-auto flex-row gap-3 align-items-center">
          <Nav.Link as={Link} to="/login" className="small text-muted">Ingresar</Nav.Link>
          <Nav.Link
            as={Link} to="/register"
            className="small fw-bold"
            style={{ color: 'var(--navy)', borderBottom: '2px solid var(--navy)', paddingBottom: '2px' }}
          >
            Registro
          </Nav.Link>
        </Nav>
      </Navbar>

      {/* ── Card centrada ──────────────────────────────── */}
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}
      >
        <div style={{ width: '100%', maxWidth: '780px', zIndex: 1 }}>
          <Card
            className="border-0 shadow-lg"
            style={{ borderRadius: '24px', background: 'rgba(255,255,255,0.97)' }}
          >
            <Card.Body className="p-5">

              {/* Título */}
              <div className="text-center mb-4">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--navy)' }}>
                  Únete a Athenaeum
                </h2>
                <p className="text-muted small mb-0">Registro de membresía académica</p>
              </div>

              {/* Error del back */}
              {apiError && (
                <Alert variant="danger" className="py-2 small text-center" onClose={() => setApiError('')} dismissible>
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* ── Fila 1: Nombre + Apellido ─────────── */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">Nombre</Form.Label>
                      <Form.Control
                        name="nombre" placeholder="Juan"
                        className="py-2 shadow-none"
                        value={values.nombre}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.nombre && !!errors.nombre}
                      />
                      <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">Apellido</Form.Label>
                      <Form.Control
                        name="apellido" placeholder="Pérez"
                        className="py-2 shadow-none"
                        value={values.apellido}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.apellido && !!errors.apellido}
                      />
                      <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── Fila 2: Tipo doc + Número doc ────────── */}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">Tipo Documento</Form.Label>
                      <Form.Select
                        name="docTipo"
                        className="py-2 shadow-none"
                        value={values.docTipo}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.docTipo && !!errors.docTipo}
                      >
                        <option value="CC">CC — Cédula de Ciudadanía</option>
                        <option value="TI">TI — Tarjeta de Identidad</option>
                        <option value="CE">CE — Cédula de Extranjería</option>
                        <option value="PA">PA — Pasaporte</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.docTipo}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">Número de Documento</Form.Label>
                      <Form.Control
                        name="docNumero" placeholder="1234567890"
                        className="py-2 shadow-none"
                        value={values.docNumero}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.docNumero && !!errors.docNumero}
                      />
                      <Form.Control.Feedback type="invalid">{errors.docNumero}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── Fila 3: Correo + Teléfono ─────────── */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">Correo Electrónico</Form.Label>
                      <Form.Control
                        name="correo" type="email" placeholder="usuario@athenaeum.edu"
                        className="py-2 shadow-none"
                        value={values.correo}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.correo && !!errors.correo}
                      />
                      <Form.Control.Feedback type="invalid">{errors.correo}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">
                        Teléfono <span className="text-muted fw-normal">(Opcional)</span>
                      </Form.Label>
                      <Form.Control
                        name="telefono" placeholder="300 000 0000"
                        className="py-2 shadow-none"
                        value={values.telefono}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── Fila 4: Usuario + Fecha nacimiento ─── */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">
                        Usuario <span className="text-muted fw-normal">(para iniciar sesión)</span>
                      </Form.Label>
                      <Form.Control
                        name="username" placeholder="juan.perez"
                        className="py-2 shadow-none"
                        value={values.username}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.username && !!errors.username}
                      />
                      <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">
                        Fecha de Nacimiento <span className="text-muted fw-normal">(Opcional)</span>
                      </Form.Label>
                      <Form.Control
                        name="fechaNacimiento" type="date"
                        className="py-2 shadow-none"
                        value={values.fechaNacimiento}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── Fila 5: Ciudad + Dirección ────────── */}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">
                        Ciudad <span className="text-muted fw-normal">(Opcional)</span>
                      </Form.Label>
                      <Form.Control
                        name="ciudad" placeholder="Bogotá"
                        className="py-2 shadow-none"
                        value={values.ciudad}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-secondary">
                        Dirección <span className="text-muted fw-normal">(Opcional)</span>
                      </Form.Label>
                      <Form.Control
                        name="direccionTexto" placeholder="Calle 123 # 45-67"
                        className="py-2 shadow-none"
                        value={values.direccionTexto}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── Fila 6: Contraseña + Confirmar ────── */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-semibold text-secondary">Contraseña</Form.Label>
                      <Form.Control
                        name="password" type="password" placeholder="••••••••"
                        className="py-2 shadow-none"
                        value={values.password}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.password && !!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-semibold text-secondary">Confirmar contraseña</Form.Label>
                      <Form.Control
                        name="confirmPassword" type="password" placeholder="••••••••"
                        className="py-2 shadow-none"
                        value={values.confirmPassword}
                        onChange={handleChange} onBlur={handleBlur}
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

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
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Procesando...
                    </>
                  ) : 'Crear mi cuenta'}
                </Button>

              </Form>

              {/* Link al login */}
              <div className="text-center mt-4">
                <p className="small text-muted mb-0">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="fw-bold text-decoration-none" style={{ color: 'var(--navy)' }}>
                    Inicia sesión
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