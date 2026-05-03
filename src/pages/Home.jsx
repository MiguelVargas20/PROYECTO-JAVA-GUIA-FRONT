import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap'; 
import { useAuth } from '../context/AuthContext'; 
import { booksService } from '../services/booksService';
import BookCard from '../components/BookCard';

/* ── Datos de prueba (Mocks) en español ── */
const MOCK_BOOKS = [
  { id: '1', category: 'HISTORIA',  title: 'El Paciente Silencioso',      author: 'Alex Michaelides', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80' },
  { id: '2', category: 'CLÁSICOS', title: 'Meditaciones',               author: 'Marco Aurelio',    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80' },
  { id: '3', category: 'FICCIÓN',  title: 'La Chica Salvaje',           author: 'Delia Owens',      coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&q=80' },
  { id: '4', category: 'CIENCIA',  title: 'Hábitos Atómicos',            author: 'James Clear',      coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&q=80' },
  { id: '5', category: 'NEGOCIOS', title: 'De Cero a Uno',              author: 'Peter Thiel',      coverUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&q=80' },
];

const MOCK_COLLECTIONS = [
  { id: '1', name: 'Grandes Clásicos',  description: 'Literatura eterna que transformó el mundo.', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80', featured: true },
  { id: '2', name: 'Centro de Investigación',  description: 'Revistas académicas y documentos científicos.', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&q=80', featured: false },
  { id: '3', name: 'Historia y Cartografía', description: 'Un archivo detallado del pasado.', imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&q=80', featured: false },
  { id: '4', name: 'Novedades del Mes',  description: 'Descubre las últimas adquisiciones de nuestro catálogo.', imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80', featured: false },
];

const STATS = [
  { value: '2.4M', label: 'Títulos en Catálogo' },
  { value: '12k',  label: 'Miembros Activos'   },
  { value: '85',   label: 'Aliados Globales'  },
  { value: '150+', label: 'Nuevos Ingresos Diarios' },
];

export default function Home() {
  const [search,      setSearch]      = useState('');
  const [books,       setBooks]       = useState(MOCK_BOOKS);
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  const [loadingData, setLoadingData] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      try {
        const [newArrivals, cols] = await Promise.all([
          booksService.getNewArrivals(),
          booksService.getCollections(),
        ]);
        if (newArrivals.length) setBooks(newArrivals);
        if (cols.length)        setCollections(cols);
      } catch {
        // Fallback a mock data
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  const featuredCollection = collections.find(c => c.featured) ?? collections[0];
  const smallCollections   = collections.filter(c => !c.featured).slice(0, 4);

  return (
    <>
      {/* ── HERO Dinámico por Rol ─────────────────────────── */}
      <section className="hero-section">
        <div>
          <span className="text-primary fw-bold mb-2 d-block">
            {user ? `Bienvenido, ${user.role}` : 'Bienvenido al Portal Athenaeum'}
          </span>
          
          <h1 className="hero-tagline">
            {user?.role === 'ADMIN' ? 'Gestión Total del Acervo Digital' : 'Encuentra tu próxima lectura favorita.'}
          </h1>
          
          <p className="hero-sub">
            {user?.role === 'MODERATOR' 
              ? 'Supervisa las nuevas entradas y mantén la calidad de nuestras colecciones bibliográficas.' 
              : 'Explora miles de títulos en nuestra colección académica. Desde literatura clásica hasta investigación moderna.'}
          </p>

          <div className="hero-search-wrap">
            <input
              className="hero-search-box"
              type="text"
              placeholder="Buscar por título, autor o ISBN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn-search">Buscar en Catálogo</button>
          </div>
          <div className="hero-badges">
            <span className="hero-badge">2M+ Títulos</span>
            <span className="hero-badge">Acceso 24/7</span>
            <span className="hero-badge">Recursos Académicos</span>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img
            className="hero-img"
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
            alt="Estanterías de biblioteca"
          />
          <div className="staff-pick-badge">
            <div className="sp-icon">📚</div>
            <div className="sp-label">Recomendado</div>
            <div className="sp-title">El Gran Gatsby</div>
          </div>
        </div>
      </section>

      {/* ── ACCIONES RÁPIDAS (Solo Logueados) ──────────────── */}
      {user && (
        <Container>
          <section className="my-5 py-4 border-bottom border-top">
             <h5 className="mb-3 text-muted" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>PANEL DE ACCIONES: {user.role}</h5>
             <div className="d-flex flex-wrap gap-3">
                {user.role === 'ADMIN' && (
                  <Button variant="dark" className="rounded-pill px-4">Añadir Nuevo Libro</Button>
                )}
                {user.role === 'MODERATOR' && (
                  <Button variant="outline-dark" className="rounded-pill px-4">Revisar Comentarios</Button>
                )}
                <Button variant="primary" className="rounded-pill px-4">Ver mis préstamos</Button>
                <Button variant="outline-secondary" className="rounded-pill px-4">Historial de lectura</Button>
             </div>
          </section>
        </Container>
      )}

      {/* ── NOVEDADES ──────────────────────────────────── */}
      <section className="section-arrivals">
        <div className="section-header">
          <div>
            <h2 className="section-title">Nuevas Adquisiciones</h2>
            <p className="section-sub">Los últimos títulos incorporados a nuestro catálogo curado.</p>
          </div>
          <Link to="/catalog" className="view-all-link">Ver Todo →</Link>
        </div>

        <div className="books-grid">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ── EXPLORAR COLECCIONES ───────────────────────────── */}
      <section className="section-collections">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Explorar Colecciones</h2>
        </div>

        <div className="collections-grid">
          <div className="coll-card large" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
            <img className="coll-img" src={featuredCollection.imageUrl} alt={featuredCollection.name} />
            <div className="coll-overlay d-flex flex-column justify-content-end p-4" 
                 style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', position: 'absolute', inset: 0 }}>
              <h3 className="coll-name text-white">{featuredCollection.name}</h3>
              <p className="coll-desc text-white-50">{featuredCollection.description}</p>
              <Link to="/catalog" className="btn-explore mt-2" style={{ width: 'fit-content' }}>Explorar Colección</Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
            {smallCollections.map(c => (
              <div 
                className="coll-card small" 
                key={c.id} 
                style={{ borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden' }}
              >
                <img className="coll-img" src={c.imageUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="coll-overlay d-flex flex-column justify-content-end p-3" 
                     style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', position: 'absolute', inset: 0 }}>
                  <h3 className="coll-name m-0" style={{ fontSize: '1rem', color: '#fff' }}>{c.name}</h3>
                  <p className="coll-desc small text-white-50 m-0">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESTADÍSTICAS ─────────────────────────────────────────── */}
      <section className="stats-banner">
        {STATS.map(s => (
          <div key={s.label}>
            <span className="stat-number">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>
    </>
  );
}