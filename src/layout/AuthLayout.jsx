import { Outlet } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AuthLayout = () => {
  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} className="auth-card-container">
            <Card className="shadow-lg border-0 overflow-hidden">
              <Row className="g-0">
                {/* Aquí puedes poner una imagen lateral o simplemente el contenido */}
                <Col md={12}>
                  <Card.Body className="p-4 p-md-5">
                    {/* El Outlet renderiza el Login o el Register según la URL */}
                    <Outlet />
                  </Card.Body>
                </Col>
              </Row>
            </Card>
            <div className="text-center mt-4">
              <small className="text-muted">Athenaeum Project &copy; 2026</small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;