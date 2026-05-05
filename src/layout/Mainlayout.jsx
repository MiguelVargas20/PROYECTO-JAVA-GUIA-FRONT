// src/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* <--- AQUÍ se renderizará Libros.jsx */}
      </main>
      <Footer />
    </>
  );
}