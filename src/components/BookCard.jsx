import { Card, Button } from 'react-bootstrap';

const BookCard = ({ book }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={book.imageUrl || 'https://via.placeholder.com/150'} />
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Text>{book.author}</Card.Text>
        <Button variant="primary">Ver más</Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;