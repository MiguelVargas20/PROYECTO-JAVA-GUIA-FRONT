import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksService } from '../services/booksService';
import BookCard from '../components/BookCard';

/* ── Mock data (se usa mientras el backend no esté conectado) ── */
const MOCK_BOOKS = [
  { id: '1', category: 'HISTORY',  title: 'The Silent Patient',       author: 'Alex Michaelides', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80' },
  { id: '2', category: 'CLASSICS', title: 'Meditations',              author: 'Marcus Aurelius',   coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80' },
  { id: '3', category: 'FICTION',  title: 'Where the Crawdads Sing',  author: 'Delia Owens',       coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&q=80' },
  { id: '4', category: 'SCIENCE',  title: 'Atomic Habits',            author: 'James Clear',       coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&q=80' },
  { id: '5', category: 'BUSINESS', title: 'Zero to One',              author: 'Peter Thiel',       coverUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&q=80' },
];

const MOCK_COLLECTIONS = [
  { id: '1', name: 'The Classics',  description: 'Timeless literature that shaped the world.', imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80', featured: true },
  { id: '2', name: 'Research Hub',  description: 'Academic journals & papers.',                imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&q=80', featured: false },
  { id: '3', name: 'History & Maps',description: 'Archive of the past.',                       imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&q=80', featured: false },
  { id: '4', name: 'New Arrivals',  description: "Discover what's trending this month.",       imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80', featured: false },
];

const STATS = [
  { value: '2.4M', label: 'Books in Catalog' },
  { value: '12k',  label: 'Active Members'   },
  { value: '85',   label: 'Global Partners'  },
  { value: '150+', label: 'Daily New Titles' },
];

export default function Home() {
  const [search,      setSearch]      = useState('');
  const [books,       setBooks]       = useState(MOCK_BOOKS);
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  const [loadingData, setLoadingData] = useState(false);

  /* Cargar datos del backend cuando esté disponible */
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
        // Backend no disponible → usar mock data
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
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-section">
        <div>
          <h1 className="hero-tagline">Find your next favorite book.</h1>
          <p className="hero-sub">
            Explore thousands of titles in our scholarly collection. From classical literature to
            modern research, Athenaeum is your gateway to organized discovery.
          </p>
          <div className="hero-search-wrap">
            <input
              className="hero-search-box"
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn-search">Search Catalog</button>
          </div>
          <div className="hero-badges">
            <span className="hero-badge">2M+ Titles</span>
            <span className="hero-badge">24/7 Access</span>
            <span className="hero-badge">Scholarly Resources</span>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img
            className="hero-img"
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
            alt="Library shelves"
          />
          <div className="staff-pick-badge">
            <div className="sp-icon">📚</div>
            <div className="sp-label">Staff Pick</div>
            <div className="sp-title">The Great Gatsby</div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────────── */}
      <section className="section-arrivals">
        <div className="section-header">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-sub">The latest additions to our curated catalog.</p>
          </div>
          <Link to="/catalog" className="view-all-link">View All →</Link>
        </div>

        <div className="books-grid">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ── EXPLORE COLLECTIONS ───────────────────────────── */}
      <section className="section-collections">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">Explore Collections</h2>
        </div>

        <div className="collections-grid">
          {/* Card grande */}
          <div className="coll-card large">
            <img className="coll-img" src={featuredCollection.imageUrl} alt={featuredCollection.name} />
            <div className="coll-overlay">
              <h3 className="coll-name">{featuredCollection.name}</h3>
              <p className="coll-desc">{featuredCollection.description}</p>
              <Link to="/catalog" className="btn-explore">Explore Collection</Link>
            </div>
          </div>

          {/* Cards pequeñas en grid 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
            {smallCollections.map(c => (
              <div className="coll-card small" key={c.id}>
                <img className="coll-img" src={c.imageUrl} alt={c.name} />
                <div className="coll-overlay">
                  <h3 className="coll-name" style={{ fontSize: '1rem' }}>{c.name}</h3>
                  <p className="coll-desc">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
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