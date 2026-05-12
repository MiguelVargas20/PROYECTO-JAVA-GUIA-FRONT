import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { usuariosApi } from '../api';

/**
 * PERFIL PAGE — ruta protegida /perfil
 *
 * Flujo:
 *  1. Toma el userId del AuthContext (extraído del JWT al hacer login)
 *  2. Llama GET /api/usuarios/{id} para obtener el UsuarioDto completo
 *  3. Muestra los datos y permite editarlos
 *  4. Guarda con PUT /api/usuarios/{id}
 */
export default function Perfil() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const [perfil,    setPerfil]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error,     setError]     = useState('');
  const [exito,     setExito]     = useState('');
  const [showPass,  setShowPass]  = useState(false);

  const [form, setForm] = useState({
    nombre: '', apellido: '',
    telefono: '', correo: '',
    ciudad: '', direccion: '',
    username: '', password: '',
    fechaNacimiento: '',
  });

  /* ── Cargar perfil usando el ID del JWT ───────────────── */
  useEffect(() => {
    const cargar = async () => {
      // Si no hay sesión → login
      if (!user?.userId) {
        navigate('/login');
        return;
      }
      try {
        // Usa GET /api/usuarios/{id} con el id del JWT
        const { data } = await usuariosApi.obtenerPorId(user.userId);
        setPerfil(data);
        setForm({
          nombre:          data.nombre              || '',
          apellido:        data.apellido             || '',
          telefono:        data.telefono             || '',
          correo:          data.correo               || '',
          ciudad:          data.direccion?.ciudad    || '',
          direccion:       data.direccion?.direccion || '',
          username:        user.username,
          password:        '',
          fechaNacimiento: data.fechaNacimiento      || '',
        });
      } catch (err) {
        setError('No se pudo cargar el perfil. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ── Guardar cambios ──────────────────────────────────── */
  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    setExito('');
    try {
      const body = {
        nombre:   form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        correo:   form.correo,
        direccion: {
          ciudad:    form.ciudad,
          direccion: form.direccion,
        },
        fechaNacimiento: form.fechaNacimiento || null,
        docId:  perfil.docId,
        estado: perfil.estado,
      };
      await usuariosApi.actualizar(user.userId, body);
      setExito('¡Perfil actualizado correctamente!');
      setTimeout(() => setExito(''), 3000);
    } catch {
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  /* ── Cerrar sesión ────────────────────────────────────── */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* ── Loading ──────────────────────────────────────────── */
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Spinner animation="border" style={{ color: 'var(--navy)' }} />
    </div>
  );

  /* ── Error al cargar ──────────────────────────────────── */
  if (!perfil && error) return (
    <Container className="py-5 text-center">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  const docTexto = perfil?.docId
    ? `${perfil.docId.tipo} — ${perfil.docId.numero}`
    : '—';

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>

      {/* ── Hero banner ────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
        padding: '2.5rem 2rem 3.5rem',
        marginBottom: '-2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=60")',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 700,
            color: '#fff', fontSize: '2rem', marginBottom: 0,
          }}>
            Mi Perfil
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {user?.username}
          </p>
        </Container>
      </div>

      <Container style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>

        {exito && <Alert variant="success" className="mt-4 text-center small py-2">{exito}</Alert>}
        {error  && <Alert variant="danger"  className="mt-4 text-center small py-2">{error}</Alert>}

        <Form onSubmit={handleGuardar}>

          {/* ══ Información Personal ══════════════════════ */}
          <SeccionCard icon="bi-person-badge" titulo="Información Personal" className="mt-4">
            <Row className="g-3">
              <Col md={6}>
                <CampoLabel label="NOMBRE" />
                <Form.Control
                  name="nombre" value={form.nombre}
                  onChange={handleChange}
                  className="shadow-none campo-perfil"
                />
              </Col>
              <Col md={6}>
                <CampoLabel label="APELLIDO" />
                <Form.Control
                  name="apellido" value={form.apellido}
                  onChange={handleChange}
                  className="shadow-none campo-perfil"
                />
              </Col>
              <Col md={6}>
                <CampoLabel label="DOCUMENTO DE IDENTIDAD" />
                <Form.Control
                  value={docTexto} readOnly
                  className="shadow-none campo-perfil"
                  style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </Col>
              <Col md={6}>
                <CampoLabel label="FECHA DE NACIMIENTO" />
                <Form.Control
                  type="date" name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className="shadow-none campo-perfil"
                />
              </Col>
            </Row>
          </SeccionCard>

          {/* ══ Información de Contacto ═══════════════════ */}
          <SeccionCard icon="bi-telephone" titulo="Información de Contacto">
            <Row className="g-3">
              <Col md={6}>
                <CampoLabel label="TELÉFONO" />
                <Form.Control
                  name="telefono" value={form.telefono}
                  onChange={handleChange}
                  placeholder="300 000 0000"
                  className="shadow-none campo-perfil"
                />
              </Col>
              <Col md={6}>
                <CampoLabel label="CORREO ELECTRÓNICO" />
                <Form.Control
                  name="correo" type="email" value={form.correo}
                  onChange={handleChange}
                  className="shadow-none campo-perfil"
                />
              </Col>
              <Col md={4}>
                <CampoLabel label="CIUDAD" />
                <Form.Control
                  name="ciudad" value={form.ciudad}
                  onChange={handleChange}
                  placeholder="Bogotá"
                  className="shadow-none campo-perfil"
                />
              </Col>
              <Col md={8}>
                <CampoLabel label="DIRECCIÓN" />
                <Form.Control
                  name="direccion" value={form.direccion}
                  onChange={handleChange}
                  placeholder="Calle 123 # 45-67"
                  className="shadow-none campo-perfil"
                />
              </Col>
            </Row>
          </SeccionCard>

          {/* ══ Credenciales de Cuenta ════════════════════ */}
          <SeccionCard icon="bi-shield-lock" titulo="Credenciales de Cuenta">
            <Row className="g-3">
              <Col md={6}>
                <CampoLabel label="NOMBRE DE USUARIO" />
                <Form.Control
                  value={form.username} readOnly
                  className="shadow-none campo-perfil"
                  style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </Col>
              <Col md={6}>
                <CampoLabel label="CONTRASEÑA" />
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Nueva contraseña (opcional)"
                    className="shadow-none campo-perfil"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <span
                    onClick={() => setShowPass(p => !p)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%',
                      transform: 'translateY(-50%)', cursor: 'pointer',
                      color: '#64748b', fontSize: '1rem',
                    }}
                  >
                    <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                  </span>
                </div>
              </Col>
            </Row>
          </SeccionCard>

          {/* ══ Botones ════════════════════════════════════ */}
          <Row className="mt-4 g-3">
            <Col md={8}>
              <Button
                type="submit"
                className="w-100 py-3 fw-bold border-0"
                disabled={guardando}
                style={{
                  background: 'var(--navy)', borderRadius: '12px',
                  fontSize: '0.95rem',
                }}
              >
                {guardando ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                ) : (
                  <><i className="bi bi-floppy me-2" />Guardar Cambios</>
                )}
              </Button>
            </Col>
            <Col md={4}>
              <Button
                type="button" variant="outline-danger"
                className="w-100 py-3 fw-bold"
                onClick={handleLogout}
                style={{ borderRadius: '12px', fontSize: '0.95rem' }}
              >
                <i className="bi bi-box-arrow-right me-2" />Cerrar Sesión
              </Button>
            </Col>
          </Row>

        </Form>
      </Container>
    </div>
  );
}

/* ══ Subcomponentes ════════════════════════════════════════ */
function SeccionCard({ icon, titulo, children, className = 'mt-3' }) {
  return (
    <div className={className} style={{
      background: '#fff', borderRadius: '16px',
      padding: '1.75rem', border: '1px solid #e2e8f0',
      boxShadow: '0 1px 4px rgba(0,0,0,.05)',
    }}>
      <div className="d-flex align-items-center gap-2 mb-4">
        <i className={`bi ${icon}`} style={{ fontSize: '1.2rem', color: '#2563eb' }} />
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>
          {titulo}
        </span>
      </div>
      {children}
    </div>
  );
}

function CampoLabel({ label }) {
  return (
    <p style={{
      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px',
      color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px',
    }}>
      {label}
    </p>
  );
}