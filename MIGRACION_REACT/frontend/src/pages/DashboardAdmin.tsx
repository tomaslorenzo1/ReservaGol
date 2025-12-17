import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardAdmin: React.FC = () => {
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
            <h1>Panel de <span className="text-neon">Administración</span></h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Gestiona toda la plataforma ReservaGol
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '2rem', 
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '800', 
                color: 'var(--primary-color)', 
                marginBottom: '0.5rem' 
              }}>
                0
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Usuarios Totales
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '2rem', 
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '800', 
                color: 'var(--primary-color)', 
                marginBottom: '0.5rem' 
              }}>
                0
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Predios Registrados
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '2rem', 
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '800', 
                color: 'var(--primary-color)', 
                marginBottom: '0.5rem' 
              }}>
                0
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Reservas Totales
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '2rem', 
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: '800', 
                color: 'var(--primary-color)', 
                marginBottom: '0.5rem' 
              }}>
                98%
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Satisfacción
              </div>
            </div>
          </div>

          {/* Management Sections */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>
                <i className="fas fa-users"></i> Gestión de Usuarios
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Administra jugadores y propietarios registrados
              </p>
              <button className="btn btn-primary">
                <i className="fas fa-cog"></i>
                Gestionar Usuarios
              </button>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>
                <i className="fas fa-building"></i> Gestión de Predios
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Supervisa y aprueba nuevos predios deportivos
              </p>
              <button className="btn btn-primary">
                <i className="fas fa-cog"></i>
                Gestionar Predios
              </button>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>
                <i className="fas fa-calendar-alt"></i> Gestión de Reservas
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Monitorea todas las reservas de la plataforma
              </p>
              <button className="btn btn-primary">
                <i className="fas fa-cog"></i>
                Ver Reservas
              </button>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>
                <i className="fas fa-chart-line"></i> Reportes y Analytics
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Analiza el rendimiento de la plataforma
              </p>
              <button className="btn btn-primary">
                <i className="fas fa-chart-bar"></i>
                Ver Reportes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;