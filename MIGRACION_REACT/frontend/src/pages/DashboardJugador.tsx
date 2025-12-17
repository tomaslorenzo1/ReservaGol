import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardJugador: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">
            <img src="/assets/logo.png" alt="ReservaGol" className="logo" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Bienvenido, <span style={{ color: 'var(--text-primary)' }}>{user?.nombre}</span>
            </span>
            <button onClick={logout} className="btn btn-outline">
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1>Panel de <span className="text-neon">Jugador</span></h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gestiona tus reservas y encuentra nuevas canchas
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <Link 
              to="/reservar" 
              style={{ 
                textDecoration: 'none',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                color: 'var(--bg-dark)'
              }}>
                <i className="fas fa-calendar-plus"></i>
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Reservar Cancha
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Encuentra y reserva la cancha perfecta para tu próximo partido
              </p>
            </Link>

            <Link 
              to="/mis-turnos" 
              style={{ 
                textDecoration: 'none',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '2rem',
                color: 'var(--bg-dark)'
              }}>
                <i className="fas fa-list"></i>
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Mis Turnos
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Ve y gestiona todas tus reservas actuales y pasadas
              </p>
            </Link>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h2 style={{ marginBottom: '1.5rem' }}>
              <i className="fas fa-clock"></i> Actividad Reciente
            </h2>
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              <i className="fas fa-history" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
              <p>No hay actividad reciente</p>
              <p style={{ fontSize: '0.9rem' }}>
                Tus reservas y actividades aparecerán aquí
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardJugador;