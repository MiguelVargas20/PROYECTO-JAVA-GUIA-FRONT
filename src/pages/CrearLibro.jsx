import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { librosApi } from '../api';

/**
 * CREAR LIBRO — ruta protegida /admin/libros/crear
 * Solo accesible para ADMINISTRADOR
 *
 * LibroDto: { titulo, autores[], genero, editorial, anioPub,
 *             ejemplares, ejemplaresDisponibles, estado }
 */

const GENEROS = [
  'Ficción', 'Ciencia', 'Historia', 'Filosofía',
  'Tecnología', 'Negocios', 'Arte', 'Matemáticas',
  'Literatura', 'Derecho', 'Medicina', 'Educación',
];

export default function CrearLibro() {
  const navigate = useNavigate();

  const [titulo,       setTitulo]       = useState('');
  const [autores,      setAutores]      = useState(['']);   // Lista dinámica
  const [genero,       setGenero]       = useState('');
  const [editorial,    setEditorial]    = useState('');
  const [anioPub,      setAnioPub]      = useState('');
  const [ejemplares,   setEjemplares]   = useState('');
  const [disponibles,  setDisponibles]  = useState('');
  const [disponible,   setDisponible]   = useState(true);  // toggle estado

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [exito,   setExito]   = useState('');

  /* ── Manejo de autores dinámicos ────────────────────── */
  const handleAutorChange = (index, value) => {
    const nuevos = [...autores];
    nuevos[index] = value;
    setAutores(nuevos);
  };

  const agregarAutor = () => setAutores(prev => [...prev, '']);

  const eliminarAutor = (index) => {
    if (autores.length === 1) return; // mínimo 1
    setAutores(prev => prev.filter((_, i) => i !== index));
  };

  /* ── Submit ─────────────────────────────────────────── */
  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validaciones básicas
    const autoresFiltrados = autores.filter(a => a.trim() !== '');
    if (!titulo.trim())             return setError('El título es requerido.');
    if (autoresFiltrados.length === 0) return setError('Agrega al menos un autor.');
    if (!genero)                    return setError('Selecciona un género.');
    if (!ejemplares || ejemplares < 1) return setError('Ingresa el total de ejemplares.');
    if (parseInt(disponibles) > parseInt(ejemplares))
      return setError('Los disponibles no pueden superar el total.');

    setLoading(true);
    try {
      const body = {
        titulo:                titulo.trim(),
        autores:               autoresFiltrados,
        genero,
        editorial:             editorial.trim() || null,
        anioPub:               parseInt(anioPub) || null,
        ejemplares:            parseInt(ejemplares),
        ejemplaresDisponibles: parseInt(disponibles) || parseInt(ejemplares),
        estado:                disponible ? 'DISPONIBLE' : 'AGOTADO',
      };

      await librosApi.crear(body);
      setExito('¡Libro creado exitosamente!');
      setTimeout(() => navigate('/libros'), 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el libro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container className="py-5">
        <Row className="g-5 align-items-start">

          {/* ── Columna izquierda: info decorativa ─────── */}
          <Col md={4}>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: '2.5rem',
              color: 'var(--navy)',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}>
              Archive New Volume
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Expand the collection of the Athenaeum. Ensure all metadata is
              accurate to preserve the integrity of our digital sanctuary.
            </p>

            {/* Preview visual */}
            <div style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
              borderRadius: '16px',
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              color: '#94a3b8',
            }}>
              <i className="bi bi-book" style={{ fontSize: '3rem' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {titulo || 'Book Archive Visual'}
              </span>
              {autores[0] && (
                <span style={{ fontSize: '0.75rem' }}>
                  {autores.filter(a => a.trim()).join(', ')}
                </span>
              )}
            </div>
          </Col>

          {/* ── Columna derecha: formulario ─────────────── */}
          <Col md={8}>
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,.06)',
            }}>
              {/* Header */}
              <p style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px',
                color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>
                BIBLIOGRAPHIC DETAILS
              </p>
              <hr style={{ borderColor: '#e2e8f0', marginBottom: '1.75rem' }} />

              {error && <Alert variant="danger"  className="small py-2">{error}</Alert>}
              {exito && <Alert variant="success" className="small py-2">{exito}</Alert>}

              <Form onSubmit={handleGuardar} noValidate>

                {/* Título */}
                <Form.Group className="mb-4">
                  <CampoLabel label="Title" />
                  <Form.Control
                    placeholder="The Principles of Mathematical Analysis"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    className="shadow-none campo-perfil"
                  />
                </Form.Group>

                {/* Autores dinámicos */}
                <Form.Group className="mb-4">
                  <CampoLabel label="Authors" />
                  {autores.map((autor, i) => (
                    <div key={i} className="d-flex gap-2 mb-2">
                      <Form.Control
                        placeholder="Walter Rudin"
                        value={autor}
                        onChange={e => handleAutorChange(i, e.target.value)}
                        className="shadow-none campo-perfil"
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarAutor(i)}
                        disabled={autores.length === 1}
                        style={{ borderRadius: '8px', padding: '0 12px' }}
                      >
                        <i className="bi bi-trash" />
                      </Button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={agregarAutor}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#2563eb', fontSize: '0.85rem', fontWeight: 600,
                      padding: '4px 0', display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <i className="bi bi-plus-circle" /> Add Author
                  </button>
                </Form.Group>

                {/* Género + Editorial */}
                <Row className="mb-4 g-3">
                  <Col md={6}>
                    <CampoLabel label="Genre" />
                    <Form.Select
                      value={genero}
                      onChange={e => setGenero(e.target.value)}
                      className="shadow-none campo-perfil"
                    >
                      <option value="">Select genre...</option>
                      {GENEROS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <CampoLabel label="Publisher" />
                    <Form.Control
                      placeholder="McGraw-Hill Education"
                      value={editorial}
                      onChange={e => setEditorial(e.target.value)}
                      className="shadow-none campo-perfil"
                    />
                  </Col>
                </Row>

                {/* Año + Total + Disponibles */}
                <Row className="mb-4 g-3">
                  <Col md={4}>
                    <CampoLabel label="Publication Year" />
                    <Form.Control
                      type="number" placeholder="1976"
                      min="1000" max={new Date().getFullYear()}
                      value={anioPub}
                      onChange={e => setAnioPub(e.target.value)}
                      className="shadow-none campo-perfil"
                    />
                  </Col>
                  <Col md={4}>
                    <CampoLabel label="Total Copies" />
                    <Form.Control
                      type="number" placeholder="12" min="1"
                      value={ejemplares}
                      onChange={e => {
                        setEjemplares(e.target.value);
                        if (!disponibles) setDisponibles(e.target.value);
                      }}
                      className="shadow-none campo-perfil"
                    />
                  </Col>
                  <Col md={4}>
                    <CampoLabel label="Initial Availability" />
                    <Form.Control
                      type="number" placeholder="10" min="0"
                      value={disponibles}
                      onChange={e => setDisponibles(e.target.value)}
                      className="shadow-none campo-perfil"
                    />
                  </Col>
                </Row>

                {/* Toggle estado */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                }}>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-info-circle" style={{ color: '#2563eb' }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px', color: 'var(--navy)' }}>
                        Initial Status
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 0 }}>
                        Set whether the book is immediately listable.
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check
                      type="switch"
                      checked={disponible}
                      onChange={e => setDisponible(e.target.checked)}
                      style={{ transform: 'scale(1.3)' }}
                    />
                    <span style={{
                      fontWeight: 700, fontSize: '0.8rem',
                      color: disponible ? '#2563eb' : '#94a3b8',
                    }}>
                      {disponible ? 'DISPONIBLE' : 'AGOTADO'}
                    </span>
                  </div>
                </div>

                {/* Separador + Botones */}
                <hr style={{ borderColor: '#e2e8f0', marginBottom: '1.5rem' }} />

                <div className="d-flex align-items-center justify-content-between">
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: 0 }}>
                    All catalog entries are subject to editorial review.
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate('/libros')}
                      style={{ borderRadius: '10px', fontWeight: 600 }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      style={{
                        background: '#2563eb', border: 'none',
                        borderRadius: '10px', fontWeight: 700,
                        padding: '0.5rem 1.5rem',
                      }}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                      ) : (
                        'Guardar Libro'
                      )}
                    </Button>
                  </div>
                </div>

              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function CampoLabel({ label }) {
  return (
    <p style={{
      fontSize: '0.78rem', fontWeight: 600,
      color: '#475569', marginBottom: '6px',
    }}>
      {label}
    </p>
  );
}