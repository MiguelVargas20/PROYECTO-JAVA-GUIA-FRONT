import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="ath-footer py-5 mt-auto">
      <Container>
        <Row>
          {/* Columna 1: Info de la Marca - Ocupa 4 espacios en pantallas grandes */}
          <Col lg={4} mb={4} className="mb-lg-0">
            <h5 className="fw-bold mb-3 text-white">Athenaeum</h5>
            <p className="text-white-50" style={{ maxWidth: '300px' }}>
              Gestión profesional de bibliotecas con Java Spring y MongoDB. 
              Explora, aprende y gestiona tus lecturas favoritas en nuestro ecosistema digital.
            </p>
          </Col>

          {/* Columna 3: Soporte - 2 espacios */}
          <Col xs={6} lg={2} className="mb-4 mb-lg-0">
            <h6 className="fw-bold text-uppercase small mb-3">Soporte</h6>
            <ul className="list-unstyled">
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/ayuda" className="footer-link">Ayuda</Link></li>
              <li><Link to="/terminos" className="footer-link">Términos de servicio</Link></li>
            </ul>
          </Col>

          {/* Columna 4: Contacto - 4 espacios */}
          <Col lg={4}>
            <h6 className="fw-bold text-uppercase small mb-3">Contacto</h6>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">📍 Funza, Cundinamarca, Colombia</li>
              <li className="mb-2">✉️ soporte@athenaeum.com</li>
              <li>📞 +57 123 456 7890</li>
            </ul>
          </Col>
        </Row>

        {/* Separador sutil */}
        <hr className="my-4 opacity-10" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <Row>
          <Col className="text-center">
            <p className="text-white-50 small mb-0">
              © {new Date().getFullYear()} ATHENAEUM Project. Desarrollado con React + Vite.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;