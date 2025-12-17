import React from 'react';
import { Link } from 'react-router-dom';

const Registro: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '3rem' }}>
            <img 
              src="/assets/logo.png" 
              alt="ReservaGol" 
              style={{ 
                height: '160px', 
                marginBottom: '0.5rem',
                filter: 'drop-shadow(0 0 10px var(--primary-color))'
              }} 
            />
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem' 
            }}>
              Únete a <span className="text-neon">ReservaGol</span>
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-secondary)' 
            }}>
              Elige el tipo de cuenta que mejor se adapte a tus necesidades
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <Link 
              to="/registro-jugador" 
              style={{
                textDecoration: 'none',
                background: 'var(--bg-card)',
                border: '2px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
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
                <i className="fas fa-futbol"></i>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                Soy Jugador
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                Quiero reservar canchas deportivas
              </p>
              <ul style={{
                listStyle: 'none',
                textAlign: 'left',
                marginBottom: '2rem'
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-check" style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}></i>
                  Buscar predios cercanos
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-check" style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}></i>
                  Reservar al instante
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-check" style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}></i>
                  Gestionar mis turnos
                </li>
              </ul>
              <div style={{
                background: 'var(--gradient)',
                color: 'var(--bg-dark)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}>
                Comenzar ahora
              </div>
            </Link>
            
            <Link 
              to="/registro-propietario" 
              style={{
                textDecoration: 'none',
                background: 'var(--bg-card)',
                border: '2px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
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
                <i className="fas fa-building"></i>
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                Soy Propietario
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                Tengo un predio deportivo
              </p>
              <ul style={{
                listStyle: 'none',
                textAlign: 'left',
                marginBottom: '2rem'
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-check" style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}></i>
                  Panel de administración
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-check" style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}></i>
                  Gestionar reservas
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-check" style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}></i>
                  Estadísticas y reportes
                </li>
              </ul>
              <div style={{
                background: 'var(--gradient)',
                color: 'var(--bg-dark)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}>
                Registrar predio
              </div>
            </Link>
          </div>

          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--primary-color)', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow = '0 0 10px var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;