import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const Landing: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <img src="/assets/logo.png" alt="ReservaGol" className="logo" />
          </div>
          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
            <Link to="/registro" className="btn btn-primary">Registrarse</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Reserva tu cancha <span className="text-neon">al instante</span>
            </h1>
            <p className="hero-subtitle">
              La plataforma más moderna para reservar canchas deportivas. 
              Encuentra predios cercanos, compara precios y reserva en segundos.
            </p>
            <div className="hero-buttons">
              <Link to="/registro" className="btn btn-primary btn-large">
                <i className="fas fa-play"></i>
                Comenzar ahora
              </Link>
              <a href="#features" className="btn btn-outline btn-large">
                <i className="fas fa-info-circle"></i>
                Conocer más
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/cancha1.png" alt="Cancha de fútbol" className="hero-img" />
            <div className="floating-card">
              <i className="fas fa-map-marker-alt"></i>
              <span>Predios cercanos a ti</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">¿Por qué elegir <span className="text-neon">ReservaGol</span>?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-search-location"></i>
              </div>
              <h3>Encuentra predios cercanos</h3>
              <p>Localiza automáticamente los mejores predios deportivos cerca de tu ubicación</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Reserva en tiempo real</h3>
              <p>Ve la disponibilidad al instante y reserva tu horario favorito sin esperas</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Gestión simple</h3>
              <p>Administra todas tus reservas desde una interfaz moderna y fácil de usar</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Users Section */}
      <section className="for-users">
        <div className="container">
          <div className="section-content">
            <div className="section-text">
              <h2>Para <span className="text-neon">Jugadores</span></h2>
              <h3>Tu cancha perfecta te está esperando</h3>
              <ul className="benefits-list">
                <li><i className="fas fa-check"></i> Busca predios por ubicación y distancia</li>
                <li><i className="fas fa-check"></i> Compara precios y servicios disponibles</li>
                <li><i className="fas fa-check"></i> Ve fotos reales de las canchas</li>
                <li><i className="fas fa-check"></i> Reserva múltiples horarios</li>
                <li><i className="fas fa-check"></i> Historial completo de tus reservas</li>
              </ul>
              <Link to="/registro-jugador" className="btn btn-primary">
                Empezar a reservar
              </Link>
            </div>
            <div className="section-image">
              <img src="/assets/cancha2.png" alt="Jugadores en cancha" className="section-img" />
            </div>
          </div>
        </div>
      </section>

      {/* For Owners Section */}
      <section className="for-owners">
        <div className="container">
          <div className="section-content reverse">
            <div className="section-text">
              <h2>Para <span className="text-neon">Propietarios</span></h2>
              <h3>Lleva tu predio al siguiente nivel</h3>
              <ul className="benefits-list">
                <li><i className="fas fa-check"></i> Panel de administración completo</li>
                <li><i className="fas fa-check"></i> Gestiona horarios y disponibilidad</li>
                <li><i className="fas fa-check"></i> Estadísticas de reservas y ganancias</li>
                <li><i className="fas fa-check"></i> Aprueba o rechaza reservas</li>
                <li><i className="fas fa-check"></i> Llega a más clientes automáticamente</li>
              </ul>
              <Link to="/registro-propietario" className="btn btn-primary">
                Registrar mi predio
              </Link>
            </div>
            <div className="section-image">
              <img src="/assets/cancha3.png" alt="Predio deportivo" className="section-img" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para comenzar?</h2>
            <p>Únete a la revolución deportiva y reserva tu próxima cancha en segundos</p>
            <div className="cta-buttons">
              <Link to="/registro" className="btn btn-primary btn-large">
                Crear cuenta gratis
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/assets/logo.png" alt="ReservaGol" className="logo" />
              <p>La plataforma más moderna para reservar canchas deportivas</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Producto</h4>
                <a href="#features">Características</a>
                <a href="#pricing">Precios</a>
                <a href="#support">Soporte</a>
              </div>
              <div className="footer-section">
                <h4>Empresa</h4>
                <a href="#about">Acerca de</a>
                <a href="#contact">Contacto</a>
                <a href="#careers">Carreras</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 ReservaGol. Proyecto estudiantil - Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;