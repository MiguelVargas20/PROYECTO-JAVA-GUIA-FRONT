import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Asegúrate de que este archivo exista
import Footer from '../components/Footer'; // Asegúrate de que este archivo exista
import { Container } from 'react-bootstrap';

const MainLayout = () => {
  return (
    <div className="main-layout d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1">
        {/* Aquí se renderiza el Home */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;