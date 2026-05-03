import { Card, Button } from 'react-bootstrap';

const BookCard = ({ book }) => {
  return (
    <Card className="h-100 border-0 shadow-sm hover-up" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div className="img-container" style={{ height: '250px', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={book.coverUrl || 'https://via.placeholder.com/300x400'} 
          style={{ objectFit: 'cover', height: '100%', transition: 'transform 0.3s' }}
          className="book-card-img"
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <small className="text-uppercase tracking-wider text-muted mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
          {book.category}
        </small>
        <Card.Title className="fw-bold mb-2" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
          {book.title}
        </Card.Title>
        <Card.Text className="text-muted small mb-3">
          {book.author}
        </Card.Text>
        <Button 
          variant="outline-primary" 
          className="mt-auto rounded-pill w-100 btn-sm"
          style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
        >
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;