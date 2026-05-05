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
      // Extraer géneros únicos del backend para los chips
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
              placeholder="Search for titles, authors, or genres..."
              className="border-start-0 shadow-none"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </InputGroup>
        </Container>
      </div>

      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0" style={{ color: '#1e293b' }}>Catalog Explore</h4>
          <span className="text-primary small fw-bold" style={{ cursor: 'pointer' }}>
            <i className="bi bi-funnel me-1" /> REFINE
          </span>
        </div>

        {/* ── Chips de Géneros ─────────────────────────── */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {generos.map(g => (
            <GenreChip 
              key={g} 
              label={g === 'Todos' ? 'All Genres' : g} 
              active={generoActivo === g} 
              onClick={() => handleGenero(g)}
            />
          ))}
        </div>

        {/* ── Filtros de Disponibilidad ─────────────────── */}
        <div className="d-flex gap-2 mb-4">
          <StatusToggle 
            label="AVAILABLE" color="#10b981" bg="#ecfdf5" 
            active={estadoFiltro === 'DISPONIBLE'}
            onClick={() => setEstadoFiltro(prev => prev === 'DISPONIBLE' ? '' : 'DISPONIBLE')}
          />
          <StatusToggle 
            label="OUT OF STOCK" color="#ef4444" bg="#fef2f2" 
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

      {/* <BottomNav active="catalog" onNavigate={navigate} /> */}
    </div>
  );
}

/* ══ Componentes Pequeños (Styled) ════════════════════════ */

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