import React, { useState } from 'react';

interface HorarioSelectorProps {
  horariosSeleccionados: string[];
  onHorariosChange: (horarios: string[]) => void;
  horariosOcupados?: string[];
  modo: 'propietario' | 'cliente';
  disabled?: boolean;
}

const HorarioSelector: React.FC<HorarioSelectorProps> = ({
  horariosSeleccionados,
  onHorariosChange,
  horariosOcupados = [],
  modo,
  disabled = false
}) => {
  // Generar horarios de 00:00 a 23:00
  const generarHorarios = () => {
    const horarios = [];
    for (let i = 0; i < 24; i++) {
      const horaInicio = i.toString().padStart(2, '0') + ':00';
      const horaFin = ((i + 1) % 24).toString().padStart(2, '0') + ':00';
      horarios.push(`${horaInicio} - ${horaFin}`);
    }
    return horarios;
  };

  const horarios = generarHorarios();

  const getEstadoHorario = (horario: string) => {
    if (horariosOcupados.includes(horario)) return 'ocupado';
    if (horariosSeleccionados.includes(horario)) return 'seleccionado';
    return 'disponible';
  };

  const getColorHorario = (estado: string) => {
    switch (estado) {
      case 'ocupado': return '#ff6b6b';
      case 'seleccionado': return 'var(--primary-color)';
      case 'disponible': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const handleHorarioClick = (horario: string) => {
    if (disabled || horariosOcupados.includes(horario)) return;

    if (modo === 'propietario') {
      // Propietario puede seleccionar múltiples horarios
      const nuevosHorarios = horariosSeleccionados.includes(horario)
        ? horariosSeleccionados.filter(h => h !== horario)
        : [...horariosSeleccionados, horario];
      onHorariosChange(nuevosHorarios);
    } else {
      // Cliente solo puede seleccionar un horario
      const nuevosHorarios = horariosSeleccionados.includes(horario) ? [] : [horario];
      onHorariosChange(nuevosHorarios);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
          {modo === 'propietario' ? 'Horarios Disponibles' : 'Seleccionar Horario'}
        </h4>
        
        {/* Leyenda */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              background: '#6c757d'
            }} />
            <span style={{ color: 'var(--text-secondary)' }}>Disponible</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              background: 'var(--primary-color)'
            }} />
            <span style={{ color: 'var(--text-secondary)' }}>Seleccionado</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              background: '#ff6b6b'
            }} />
            <span style={{ color: 'var(--text-secondary)' }}>Ocupado</span>
          </div>
        </div>
      </div>

      {/* Grid de horarios */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '0.75rem',
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '2px solid var(--border-color)'
      }}>
        {horarios.map((horario) => {
          const estado = getEstadoHorario(horario);
          const color = getColorHorario(estado);
          const isClickable = !disabled && estado !== 'ocupado';

          return (
            <button
              key={horario}
              onClick={() => handleHorarioClick(horario)}
              disabled={!isClickable}
              style={{
                background: color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 0.5rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: isClickable ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: estado === 'ocupado' ? 0.6 : 1,
                transform: estado === 'seleccionado' ? 'scale(1.05)' : 'scale(1)',
                boxShadow: estado === 'seleccionado' 
                  ? `0 4px 12px ${color}40` 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (isClickable && estado !== 'seleccionado') {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (estado !== 'seleccionado') {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {/* Efecto de brillo para horarios seleccionados */}
              {estado === 'seleccionado' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shine 2s infinite'
                }} />
              )}
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {horario}
              </div>
              
              {/* Icono de estado */}
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                fontSize: '0.7rem',
                opacity: 0.8
              }}>
                {estado === 'ocupado' && <i className="fas fa-lock" />}
                {estado === 'seleccionado' && <i className="fas fa-check" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'var(--bg-card)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }} />
          <strong>Información:</strong>
        </div>
        {modo === 'propietario' ? (
          <p style={{ margin: 0 }}>
            Selecciona los horarios en los que tu cancha estará disponible para reservas. 
            Puedes seleccionar múltiples horarios manteniendo presionado Ctrl.
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            Selecciona el horario que deseas reservar. Los horarios en rojo ya están ocupados.
            Horarios seleccionados: {horariosSeleccionados.length}
          </p>
        )}
      </div>

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default HorarioSelector;