import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { librosApi } from '../api';
import { useAuth } from '../context/AuthContext';

/* ── Icono por género (mismo mapa que Libros.jsx) ───────── */
const GENRE_ICON = {
  Fiction: '📖', Ficción: '📖',
  Science: '🔬', Ciencia: '🔬',
  History: '🏛️', Historia: '🏛️',
  Philosophy: '🧠', Filosofía: '🧠',
  Business: '💼', Negocios: '💼',
  Technology: '💻', Tecnología: '💻',
};

export default function LibroDetalle() {
  const { id }              = useParams();
  const navigate            = useNavigate();
  const { isAuthenticated } = useAuth();

  const [libro,   setLibro]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  /* ── Cargar libro por ID ────────────────────────────── */
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const { data } = await librosApi.obtenerPorId(id);
        setLibro(data);
      } catch {
        setError('No se encontró el libro.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  const handleSolicitarPrestamo = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // TODO: navegar a crear préstamo con este libro preseleccionado
    navigate('/mis-prestamos');
  };

  /* ── Loading ────────────────────────────────────────── */
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Spinner animation="border" style={{ color: 'var(--navy)' }} />
    </div>
  );

  /* ── Error ──────────────────────────────────────────── */
  if (error || !libro) return (
    <div className="text-center py-5">
      <p className="text-muted">{error || 'Libro no encontrado.'}</p>
      <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => navigate('/libros')}>
        ← Volver al catálogo
      </button>
    </div>
  );

  const disponible   = libro.estado === 'DISPONIBLE';
  const pctDisponible = libro.ejemplares > 0
    ? Math.round((libro.ejemplaresDisponibles / libro.ejemplares) * 100)
    : 0;
  const autores = Array.isArray(libro.autores)
    ? libro.autores.join(', ')
    : libro.autores;
  const icon = GENRE_ICON[libro.genero] || '📚';

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Navbar superior ──────────────────────────── */}
      <div
        className="bg-white border-bottom sticky-top shadow-sm"
        style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <button
          onClick={() => navigate('/libros')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--navy)' }}
        >
          ← <span className="fw-bold ms-1" style={{ fontFamily: 'var(--font-serif)' }}>Athenaeum</span>
        </button>
        <div className="d-flex gap-3">
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b' }}>
            <i className="bi bi-share" />
          </button>
        </div>
      </div>

      <Container className="py-5">
        <Row className="g-5 align-items-start">

          {/* ── Columna izquierda: portada ──────────── */}
          <Col md={5} lg={4}>
            <div style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
              borderRadius: '20px',
              aspectRatio: '3/4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5rem',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,.10)',
            }}>
              {icon}

              {/* Badge disponibilidad */}
              <span style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: disponible ? '#dcfce7' : '#fee2e2',
                color: disponible ? '#16a34a' : '#dc2626',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.8px',
                padding: '4px 12px',
                borderRadius: '20px',
                textTransform: 'uppercase',
              }}>
                {disponible ? 'DISPONIBLE' : 'AGOTADO'}
              </span>
            </div>
          </Col>

          {/* ── Columna derecha: info ───────────────── */}
          <Col md={7} lg={8}>

            {/* Título y autores */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              color: 'var(--navy)',
              marginBottom: '0.5rem',
              lineHeight: 1.2,
            }}>
              {libro.titulo}
            </h1>
            <p style={{
              color: '#2563eb',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-serif)',
            }}>
              {autores}
            </p>

            {/* Separador */}
            <hr style={{ borderColor: '#e2e8f0', marginBottom: '1.5rem' }} />

            {/* Metadata: género / editorial / año */}
            <Row className="mb-4 g-3">
              {[
                { label: 'GÉNERO',    value: libro.genero    || '—' },
                { label: 'EDITORIAL', value: libro.editorial || '—' },
                { label: 'AÑO',       value: libro.anioPub   || '—' },
              ].map(({ label, value }) => (
                <Col key={label} xs={4}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {label}
                  </p>
                  <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', marginBottom: 0 }}>
                    {value}
                  </p>
                </Col>
              ))}
            </Row>

            {/* ── Sinopsis (campo extra — no está en el DTO aún) ──
                NOTA: agrega `sinopsis` al LibroDto del back para mostrarlo aquí.
                Por ahora se muestra un placeholder si no viene. */}
            {libro.sinopsis && (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #e2e8f0',
              }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  SINOPSIS
                </p>
                <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '0.9rem', marginBottom: 0 }}>
                  {libro.sinopsis}
                </p>
              </div>
            )}

            {/* ── Disponibilidad + Botón préstamo ─────── */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}>
              {/* Disponibilidad */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-bookmark-check" style={{ color: '#16a34a', fontSize: '1.1rem' }} />
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                    {libro.ejemplaresDisponibles} de {libro.ejemplares} ejemplares disponibles
                  </span>
                </div>
                {/* Barra de progreso */}
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pctDisponible}%`,
                    background: disponible ? '#16a34a' : '#ef4444',
                    borderRadius: '999px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* Botón solicitar */}
              <Button
                onClick={handleSolicitarPrestamo}
                disabled={!disponible}
                style={{
                  background: disponible ? '#2563eb' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.7rem 1.75rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  cursor: disponible ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                }}
              >
                <i className="bi bi-journal-plus me-2" />
                {disponible ? 'Solicitar Préstamo' : 'Sin disponibilidad'}
              </Button>
            </div>

            {/* ── Stats inferiores ─────────────────────
                Campos que NO tiene el DTO actualmente.
                Para activarlos: agrega al LibroDto: paginas, idioma, premio, pasillo */}
            <Row className="mt-4 text-center g-2">
              {[
                { icon: 'bi-book',       label: libro.paginas  ? `${libro.paginas} PÁGINAS`  : `${libro.ejemplares} EJEMPLARES` },
                { icon: 'bi-globe',      label: libro.idioma   ? libro.idioma.toUpperCase()  : libro.genero?.toUpperCase() || '—' },
                { icon: 'bi-award',      label: libro.premio   ? libro.premio.toUpperCase()  : `AÑO ${libro.anioPub || '—'}` },
                { icon: 'bi-geo-alt',    label: libro.pasillo  ? `PASILLO ${libro.pasillo}`  : `${libro.ejemplaresDisponibles} DISP.` },
              ].map(({ icon, label }) => (
                <Col key={label} xs={3}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '0.85rem 0.5rem',
                    border: '1px solid #e2e8f0',
                  }}>
                    <i className={`bi ${icon}`} style={{ fontSize: '1.3rem', color: '#64748b', display: 'block', marginBottom: '4px' }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                      {label}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>

          </Col>
        </Row>
      </Container>
    </div>
  );
}