import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { turnosService } from '../services/turnosService';
import api from '../services/authService';

interface Cancha {
  id: number;
  nombre: string;
  tipo: string;
  superficie: string;
  capacidad: number;
  precio: number;
  predio_nombre: string;
  predio_direccion: string;
}

const Reservar: React.FC = () => {
  const { user } = useAuth();
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [reservaData, setReservaData] = useState({
    fecha: '',
    hora_inicio: '',
    hora_fin: ''
  });

  useEffect(() => {
    loadCanchas();
  }, []);

  const loadCanchas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/canchas');
      setCanchas(response.data);
    } catch (error: any) {
      setError('Error al cargar las canchas');
    } finally {
      setLoading(false);
    }
  };

  const handleReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCancha || !user) return;

    try {
      await turnosService.createTurno({
        cancha_id: selectedCancha.id,
        usuario_id: user.id,
        fecha: reservaData.fecha,
        hora_inicio: reservaData.hora_inicio,
        hora_fin: reservaData.hora_fin
      });

      alert('Reserva creada exitosamente');
      setSelectedCancha(null);
      setReservaData({ fecha: '', hora_inicio: '', hora_fin: '' });
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al crear la reserva');
    }
  };

  if (loading) {
    return <div className="loading">Cargando canchas...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1>Reservar <span className="text-neon">Cancha</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Encuentra y reserva la cancha perfecta para tu próximo partido
          </p>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {selectedCancha ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>
              Reservar: {selectedCancha.nombre}
            </h2>
            
            <div style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              <p><i className="fas fa-building"></i> {selectedCancha.predio_nombre}</p>
              <p><i className="fas fa-map-marker-alt"></i> {selectedCancha.predio_direccion}</p>
              <p><i className="fas fa-futbol"></i> {selectedCancha.tipo} - {selectedCancha.superficie}</p>
              <p><i className="fas fa-users"></i> Capacidad: {selectedCancha.capacidad} jugadores</p>
              <p><i className="fas fa-dollar-sign"></i> ${selectedCancha.precio} por hora</p>
            </div>

            <form onSubmit={handleReserva}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label htmlFor="fecha">Fecha</label>
                  <input
                    type="date"
                    id="fecha"
                    value={reservaData.fecha}
                    onChange={(e) => setReservaData({...reservaData, fecha: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="hora_inicio">Hora de Inicio</label>
                  <input
                    type="time"
                    id="hora_inicio"
                    value={reservaData.hora_inicio}
                    onChange={(e) => setReservaData({...reservaData, hora_inicio: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="hora_fin">Hora de Fin</label>
                  <input
                    type="time"
                    id="hora_fin"
                    value={reservaData.hora_fin}
                    onChange={(e) => setReservaData({...reservaData, hora_fin: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check"></i>
                  Confirmar Reserva
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedCancha(null)}
                  className="btn btn-outline"
                >
                  <i className="fas fa-arrow-left"></i>
                  Volver
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {canchas.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
              }}>
                <i className="fas fa-futbol" style={{ 
                  fontSize: '3rem', 
                  color: 'var(--text-muted)', 
                  marginBottom: '1rem' 
                }}></i>
                <h3>No hay canchas disponibles</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Vuelve más tarde para ver nuevas opciones
                </p>
              </div>
            ) : (
              canchas.map((cancha) => (
                <div key={cancha.id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.3s ease'
                }}>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>{cancha.nombre}</h3>
                    
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <i className="fas fa-building"></i> {cancha.predio_nombre}
                    </div>
                    
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <i className="fas fa-map-marker-alt"></i> {cancha.predio_direccion}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)' }}>
                      <span>
                        <i className="fas fa-futbol"></i> {cancha.tipo}
                      </span>
                      <span>
                        <i className="fas fa-layer-group"></i> {cancha.superficie}
                      </span>
                      <span>
                        <i className="fas fa-users"></i> {cancha.capacidad} jugadores
                      </span>
                      <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                        <i className="fas fa-dollar-sign"></i> ${cancha.precio}/hora
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedCancha(cancha)}
                    className="btn btn-primary"
                  >
                    <i className="fas fa-calendar-plus"></i>
                    Reservar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservar;