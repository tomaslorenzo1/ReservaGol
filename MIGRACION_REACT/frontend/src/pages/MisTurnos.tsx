import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { turnosService } from '../services/turnosService';

interface Turno {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  cancha_nombre: string;
  cancha_tipo: string;
  predio_nombre: string;
  predio_direccion: string;
}

const MisTurnos: React.FC = () => {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadTurnos();
    }
  }, [user]);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await turnosService.getTurnosByUser(user!.id);
      setTurnos(data);
    } catch (error: any) {
      setError('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  const cancelarTurno = async (turnoId: number) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      try {
        await turnosService.deleteTurno(turnoId);
        await loadTurnos(); // Recargar la lista
      } catch (error: any) {
        setError('Error al cancelar el turno');
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmado': return 'var(--primary-color)';
      case 'pendiente': return '#ffa500';
      case 'cancelado': return '#ff6b6b';
      default: return 'var(--text-secondary)';
    }
  };

  if (loading) {
    return <div className="loading">Cargando turnos...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1>Mis <span className="text-neon">Turnos</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Gestiona todas tus reservas de canchas
          </p>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {turnos.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <i className="fas fa-calendar-times" style={{ 
              fontSize: '3rem', 
              color: 'var(--text-muted)', 
              marginBottom: '1rem' 
            }}></i>
            <h3 style={{ marginBottom: '1rem' }}>No tienes turnos reservados</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              ¡Reserva tu primera cancha y comienza a jugar!
            </p>
            <a href="/reservar" className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Reservar Cancha
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {turnos.map((turno) => (
              <div key={turno.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{turno.cancha_nombre}</h3>
                    <span style={{
                      background: getEstadoColor(turno.estado),
                      color: turno.estado === 'confirmado' ? 'var(--bg-dark)' : 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {turno.estado}
                    </span>
                  </div>
                  
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <i className="fas fa-building"></i> {turno.predio_nombre}
                  </div>
                  
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <i className="fas fa-map-marker-alt"></i> {turno.predio_direccion}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)' }}>
                    <span>
                      <i className="fas fa-calendar"></i> {new Date(turno.fecha).toLocaleDateString()}
                    </span>
                    <span>
                      <i className="fas fa-clock"></i> {turno.hora_inicio} - {turno.hora_fin}
                    </span>
                    <span>
                      <i className="fas fa-futbol"></i> {turno.cancha_tipo}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {turno.estado === 'pendiente' && (
                    <button
                      onClick={() => cancelarTurno(turno.id)}
                      className="btn btn-outline"
                      style={{ 
                        borderColor: '#ff6b6b', 
                        color: '#ff6b6b',
                        fontSize: '0.9rem',
                        padding: '0.5rem 1rem'
                      }}
                    >
                      <i className="fas fa-times"></i>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTurnos;