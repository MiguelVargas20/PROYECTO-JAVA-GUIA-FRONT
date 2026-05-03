import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <Container>
        <Row>
          {/* Columna 1: Info de la Marca */}
          <Col md={4} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-4 text-primary">Athenaeum</h5>
            <p className="text-muted">
              Tu biblioteca digital conectada a Java Spring y MongoDB. 
              Explora, aprende y gestiona tus lecturas favoritas.
            </p>
          </Col>

          {/* Columna 2: Enlaces Rápidos */}
          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-4">Explorar</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none">Inicio</Link></li>
              <li className="mb-2"><Link to="/login" className="text-muted text-decoration-none">Login</Link></li>
              <li className="mb-2"><Link to="/register" className="text-muted text-decoration-none">Registro</Link></li>
            </ul>
          </Col>

          {/* Columna 3: Soporte */}
          <Col md={3} className="mb-4">
            <h6 className="fw-bold mb-4">Soporte</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><span className="text-muted">FAQ</span></li>
              <li className="mb-2"><span className="text-muted">Ayuda</span></li>
              <li className="mb-2"><span className="text-muted">Términos de servicio</span></li>
            </ul>
          </Col>

          {/* Columna 4: Contacto */}
          <Col md={3} className="mb-4">
            <h6 className="fw-bold mb-4">Contacto</h6>
            <p className="text-muted mb-2 small">📍 Funza, Cundinamarca, Colombia</p>
            <p className="text-muted mb-2 small">📧 soporte@athenaeum.com</p>
            <p className="text-muted mb-0 small">📞 +57 123 456 7890</p>
          </Col>
        </Row>
        
        <hr className="bg-secondary" />
        
        <Row className="pt-2">
          <Col className="text-center">
            <p className="text-muted small">
              © {new Date().getFullYear()} ATHENAEUM Project. Desarrollado con React + Vite.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;