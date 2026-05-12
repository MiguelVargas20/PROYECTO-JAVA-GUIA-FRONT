import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, InputGroup, Spinner, Row, Col } from 'react-bootstrap';
import { librosApi } from '../api';

/* ── Configuración Visual ──────────────────────────────── */
const GENRE_ICON = {
  Fiction: '📖', Ficción: '📖',
  Science: '🔬', Ciencia: '🔬',
  History: '🏛️', Historia: '🏛️',
  Philosophy: '🧠', Filosofía: '🧠',
  Business: '💼', Negocios: '💼',
  Technology: '💻', Tecnología: '💻'
};

export default function Libros() {
  const navigate = useNavigate();

  // Estados
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [generoActivo, setGeneroActivo] = useState('Todos');
  const [estadoFiltro, setEstadoFiltro] = useState(''); // '' | 'DISPONIBLE' | 'AGOTADO'
  const [generos, setGeneros] = useState(['Todos']);

  /* ── Carga de Datos y Géneros Dinámicos ────────────────── */
  const cargarTodo = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await librosApi.listar();
      setLibros(data);
      const generosUnicos = [...new Set(data.map(l => l.genero).filter(Boolean))];
      setGeneros(['Todos', ...generosUnicos]);
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarTodo(); }, [cargarTodo]);

  /* ── Búsqueda con Debounce (Título) ───────────────────── */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!busqueda.trim()) {
        if (generoActivo === 'Todos') cargarTodo();
        return;
      }
      try {
        const { data } = await librosApi.buscarPorTitulo(busqueda.trim());
        setLibros(data);
      } catch (err) { console.error("Error en búsqueda"); }
    }, 400);
    return () => clearTimeout(timer);
  }, [busqueda, generoActivo, cargarTodo]);

  /* ── Filtros de Género (API) ─────────────────────────── */
  const handleGenero = async (g) => {
    setGeneroActivo(g);
    setLoading(true);
    try {
      const { data } = g === 'Todos' ? await librosApi.listar() : await librosApi.buscarPorGenero(g);
      setLibros(data);
    } catch (err) { setError('Error al filtrar por género.'); }
    finally { setLoading(false); }
  };

  /* ── Filtro de Estado (Local para rapidez) ────────────── */
  const librosAMostrar = estadoFiltro 
    ? libros.filter(l => l.estado === estadoFiltro) 
    : libros;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* ── Navbar Superior (Búsqueda) ──────────────────── */}
      <div className="bg-white border-bottom sticky-top py-3 px-4 shadow-sm">
        <Container>
          <InputGroup className="mx-auto" style={{ maxWidth: '800px' }}>
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-search text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por títulos, autores o géneros..."
              className="border-start-0 shadow-none"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </InputGroup>
        </Container>
      </div>

      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0" style={{ color: '#1e293b' }}>Explorar Catálogo</h4>
          <span className="text-primary small fw-bold" style={{ cursor: 'pointer' }}>
            <i className="bi bi-funnel me-1" /> REFINAR
          </span>
        </div>

        {/* ── Chips de Géneros ─────────────────────────── */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {generos.map(g => (
            <GenreChip 
              key={g} 
              label={g === 'Todos' ? 'Todos los géneros' : g} 
              active={generoActivo === g} 
              onClick={() => handleGenero(g)}
            />
          ))}
        </div>

        {/* ── Filtros de Disponibilidad ─────────────────── */}
        <div className="d-flex gap-2 mb-4">
          <StatusToggle 
            label="DISPONIBLE" color="#10b981" bg="#ecfdf5" 
            active={estadoFiltro === 'DISPONIBLE'}
            onClick={() => setEstadoFiltro(prev => prev === 'DISPONIBLE' ? '' : 'DISPONIBLE')}
          />
          <StatusToggle 
            label="AGOTADO" color="#ef4444" bg="#fef2f2" 
            active={estadoFiltro === 'AGOTADO'}
            onClick={() => setEstadoFiltro(prev => prev === 'AGOTADO' ? '' : 'AGOTADO')}
          />
        </div>

        {/* ── Grid de Libros ────────────────────────────── */}
        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {librosAMostrar.map(libro => (
              <Col key={libro.id}>
                <LibroCard libro={libro} onClick={() => navigate(`/libros/${libro.id}`)} />
              </Col>
            ))}
          </Row>
        )}

        {!loading && librosAMostrar.length === 0 && (
          <div className="text-center py-5 text-muted">No se encontraron resultados.</div>
        )}
      </Container>
    </div>
  );
}

/* ══ Componentes Secundarios ══════════════════════════════ */

function LibroCard({ libro, onClick }) {
  const disponible = libro.estado === 'DISPONIBLE';
  const icon = GENRE_ICON[libro.genero] || '📚';

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.06)';
      }}
    >
      {/* Portada */}
      <div style={{
        position: 'relative',
        height: '160px', // Ajustado un poco para el grid
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
      }}>
        {icon}
        <span style={{
          position: 'absolute', top: '10px', right: '10px',
          background: disponible ? '#dcfce7' : '#fee2e2',
          color: disponible ? '#16a34a' : '#dc2626',
          fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.8px', padding: '3px 10px',
          borderRadius: '20px', textTransform: 'uppercase',
        }}>
          {disponible ? 'DISPONIBLE' : 'AGOTADO'}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '0.85rem 1rem' }}>
        <p style={{
          fontWeight: 700,
          fontSize: '0.95rem', 
          color: '#1e293b',
          marginBottom: '0.25rem', 
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {libro.titulo}
        </p>
        <p style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginBottom: '0.4rem' }}>
          {Array.isArray(libro.autores) ? libro.autores.join(', ') : libro.autores}
        </p>
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 0 }}>
          {libro.ejemplaresDisponibles}/{libro.ejemplares} disponibles
        </p>
      </div>
    </div>
  );
}

function GenreChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 20px',
        borderRadius: '25px',
        border: active ? 'none' : '1px solid #e2e8f0',
        background: active ? '#0056b3' : '#fff',
        color: active ? '#fff' : '#64748b',
        fontSize: '0.85rem',
        fontWeight: '500',
        transition: '0.2s'
      }}
    >
      {label}
    </button>
  );
}

function StatusToggle({ label, color, bg, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        borderRadius: '8px',
        border: `1px solid ${active ? color : '#e2e8f0'}`,
        background: active ? bg : '#fff',
        color: color,
        fontSize: '0.7rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {label}
    </button>
  );
}