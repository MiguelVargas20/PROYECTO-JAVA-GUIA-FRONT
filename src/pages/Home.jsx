import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Spinner, Badge } from 'react-bootstrap'; 
import { useAuth } from '../context/AuthContext'; 
import { booksService } from '../services/booksService';
import LibroCard from '../components/LibroCard';

/* ── Mocks para colecciones y estadísticas (se mantienen para diseño) ── */
const MOCK_COLLECTIONS = [
  { id: '1', name: 'Grandes Clásicos', description: 'Literatura eterna que transformó el mundo.', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80', featured: true },
  { id: '2', name: 'Investigación', description: 'Documentos científicos y revistas académicas.', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&q=80', featured: false },
  { id: '3', name: 'Historia Viva', description: 'Un archivo detallado de los sucesos del pasado.', imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&q=80', featured: false },
  { id: '4', name: 'Arte y Diseño', description: 'Explora la creatividad a través de las eras.', imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80', featured: false },
];

const STATS = [
  { value: '2.4M', label: 'Libros' },
  { value: '12k',  label: 'Lectores' },
  { value: '24/7', label: 'Disponibilidad' },
  { value: '150+', label: 'Nuevos hoy' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]); // Iniciamos vacío para cargar de API
  const [collections] = useState(MOCK_COLLECTIONS);
  const [loading, setLoading] = useState(true);

  // Carga de datos reales desde el backend
  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        // Obtenemos los últimos libros agregados
        const data = await booksService.getNewArrivals();
        setBooks(data);
      } catch (err) {
        console.error("Error cargando adquisiciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const featuredCollection = collections.find(c => c.featured) ?? collections[0];
  const smallCollections   = collections.filter(c => !c.featured).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#fcfcfd' }}>
      {/* ── HERO: Enfoque en el usuario ─────────────────────────── */}
      <section className="hero-section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="pe-lg-5">
                <Badge bg="soft-primary" className="text-primary mb-3 px-3 py-2 rounded-pill">
                  {user ? `Panel de ${user.role}` : 'Portal Bibliotecario Digital'}
                </Badge>
                
                <h1 className="display-3 fw-bold mb-3" style={{ color: '#0f172a', letterSpacing: '-1px' }}>
                  {user?.role === 'ADMIN' 
                    ? 'Gestión y Control del Acervo' 
                    : 'Tu puerta al conocimiento infinito.'}
                </h1>
                
                <p className="lead text-muted mb-4" style={{ fontSize: '1.2rem' }}>
                  {user?.role === 'MODERATOR' 
                    ? 'Supervisa la calidad del catálogo y gestiona las interacciones de la comunidad.' 
                    : 'Explora una colección curada de millones de títulos, desde clásicos inmortales hasta la vanguardia de la investigación.'}
                </p>

                <div className="hero-search-wrap shadow-lg p-2 bg-white rounded-pill d-flex align-items-center mb-4">
                  <i className="bi bi-search ms-3 text-muted"></i>
                  <input
                    className="form-control border-0 shadow-none bg-transparent"
                    type="text"
                    placeholder="¿Qué deseas leer hoy? (Título, autor o ISBN...)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <Button 
                    className="rounded-pill px-4 py-2" 
                    variant="primary"
                    onClick={() => navigate(`/catalog?q=${search}`)}
                  >
                    Buscar
                  </Button>
                </div>
                
                <div className="d-flex gap-4 opacity-75">
                  {STATS.slice(0,3).map(s => (
                    <div key={s.label}>
                      <div className="fw-bold h4 m-0">{s.value}</div>
                      <small className="text-uppercase ls-1" style={{fontSize: '0.7rem'}}>{s.label}</small>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className="position-relative">
                <img
                  className="img-fluid rounded-4 shadow-2xl"
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80"
                  alt="Biblioteca Moderna"
                  style={{ transform: 'rotate(2deg)' }}
                />
                <div className="position-absolute bottom-0 start-0 m-4 bg-white p-3 rounded-3 shadow-lg d-flex align-items-center gap-3">
                  <div className="bg-primary-soft p-2 rounded-circle">📚</div>
                  <div>
                    <div className="fw-bold small">Libro del mes</div>
                    <div className="text-muted small">Cien años de soledad</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── ACCIONES RÁPIDAS (Estilo Dashboard) ──────────────── */}
      {user && (
        <Container className="mb-5">
          <div className="p-4 rounded-4 shadow-sm border bg-white">
            <h6 className="text-uppercase text-primary fw-bold mb-4" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>
              Herramientas de {user.role}
            </h6>
            <div className="d-flex flex-wrap gap-3">
              {user.role === 'ADMIN' && (
                <Button variant="dark" className="rounded-3 py-2 px-4 shadow-sm" onClick={() => navigate('/admin/libros/crear')}>
                  <i className="bi bi-plus-circle me-2"></i> Registrar Nuevo Libro
                </Button>
              )}
              {user.role === 'MODERATOR' && (
                <Button variant="outline-dark" className="rounded-3 py-2 px-4">
                  <i className="bi bi-chat-left-dots me-2"></i> Moderar Comentarios
                </Button>
              )}
              <Button variant="outline-primary" className="rounded-3 py-2 px-4">
                <i className="bi bi-journal-bookmark me-2"></i> Mis Préstamos
              </Button>
              <Button variant="light" className="rounded-3 py-2 px-4 border">
                <i className="bi bi-clock-history me-2"></i> Historial
              </Button>
            </div>
          </div>
        </Container>
      )}

      {/* ── NOVEDADES: Datos Reales de Libros ──────────────────────── */}
      <section className="py-5" style={{ backgroundColor: '#fff' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold m-0" style={{ color: '#0f172a' }}>Nuevas Adquisiciones</h2>
              <p className="text-muted m-0">Los últimos títulos agregados físicamente a nuestra biblioteca.</p>
            </div>
            <Link to="/catalog" className="btn btn-link text-decoration-none fw-bold">Ver catálogo completo →</Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Consultando estanterías...</p>
            </div>
          ) : (
            <div className="books-grid">
              {books.length > 0 ? (
                books.map(book => (
                  <LibroCard key={book.id} book={book} />
                ))
              ) : (
                <div className="col-12 text-center py-5 border rounded-4 bg-light">
                  <p className="m-0 text-muted">No hay libros recientes disponibles.</p>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* ── SECCIÓN DE ESTADÍSTICAS REFINADA ─────────────────────── */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="text-center g-4">
            {STATS.map(s => (
              <Col key={s.label} xs={6} md={3}>
                <div className="display-5 fw-bold text-primary">{s.value}</div>
                <div className="text-white-50 text-uppercase small" style={{ letterSpacing: '1px' }}>{s.label}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}