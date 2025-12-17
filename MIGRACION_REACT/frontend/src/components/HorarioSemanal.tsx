import React, { useState } from 'react';

interface HorarioSemanalProps {
  horariosIniciales?: { [key: string]: string[] };
  onHorariosChange: (horarios: { [key: string]: string[] }) => void;
  modoPersonalizado: boolean;
  onModoChange: (personalizado: boolean) => void;
}

const HorarioSemanal: React.FC<HorarioSemanalProps> = ({
  horariosIniciales = {},
  onHorariosChange,
  modoPersonalizado,
  onModoChange
}) => {
  const [diaActual, setDiaActual] = useState(0);
  const [horariosSemana, setHorariosSemana] = useState<{ [key: string]: string[] }>(
    horariosIniciales
  );

  const diasSemana = [
    { id: 'lunes', nombre: 'Lunes', icono: 'fas fa-calendar-day' },
    { id: 'martes', nombre: 'Martes', icono: 'fas fa-calendar-day' },
    { id: 'miercoles', nombre: 'Miércoles', icono: 'fas fa-calendar-day' },
    { id: 'jueves', nombre: 'Jueves', icono: 'fas fa-calendar-day' },
    { id: 'viernes', nombre: 'Viernes', icono: 'fas fa-calendar-day' },
    { id: 'sabado', nombre: 'Sábado', icono: 'fas fa-calendar-week' },
    { id: 'domingo', nombre: 'Domingo', icono: 'fas fa-calendar-week' }
  ];

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

  const handleHorarioClick = (horario: string) => {
    if (!modoPersonalizado) {
      // Modo simple: aplicar a todos los días
      const nuevosHorarios = horariosSemana.general || [];
      const horariosActualizados = nuevosHorarios.includes(horario)
        ? nuevosHorarios.filter(h => h !== horario)
        : [...nuevosHorarios, horario];
      
      const nuevoEstado = { general: horariosActualizados };
      setHorariosSemana(nuevoEstado);
      onHorariosChange(nuevoEstado);
    } else {
      // Modo personalizado: aplicar solo al día actual
      const diaId = diasSemana[diaActual].id;
      const horariosDelDia = horariosSemana[diaId] || [];
      const horariosActualizados = horariosDelDia.includes(horario)
        ? horariosDelDia.filter(h => h !== horario)
        : [...horariosDelDia, horario];
      
      const nuevoEstado = {
        ...horariosSemana,
        [diaId]: horariosActualizados
      };
      setHorariosSemana(nuevoEstado);
      onHorariosChange(nuevoEstado);
    }
  };

  const getHorariosActivos = () => {
    if (!modoPersonalizado) {
      return horariosSemana.general || [];
    }
    const diaId = diasSemana[diaActual].id;
    return horariosSemana[diaId] || [];
  };

  const siguienteDia = () => {
    if (diaActual < diasSemana.length - 1) {
      setDiaActual(diaActual + 1);
    }
  };

  const diaAnterior = () => {
    if (diaActual > 0) {
      setDiaActual(diaActual - 1);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Selector de modo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <h4 style={{ margin: 0, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Horarios de Atención
          </h4>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {modoPersonalizado 
              ? 'Configurando horarios personalizados por día'
              : 'Mismo horario todos los días'
            }
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => onModoChange(!modoPersonalizado)}
          style={{
            background: modoPersonalizado ? 'var(--primary-color)' : 'var(--bg-secondary)',
            color: modoPersonalizado ? 'var(--bg-dark)' : 'var(--text-primary)',
            border: '2px solid var(--primary-color)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <i className="fas fa-calendar-week" />
          {modoPersonalizado ? 'Modo Simple' : 'Personalizar Semana'}
        </button>
      </div>

      {/* Navegación de días (solo en modo personalizado) */}
      {modoPersonalizado && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px'
        }}>
          <button
            type="button"
            onClick={diaAnterior}
            disabled={diaActual === 0}
            style={{
              background: diaActual === 0 ? 'var(--bg-card)' : 'var(--primary-color)',
              color: diaActual === 0 ? 'var(--text-muted)' : 'var(--bg-dark)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: diaActual === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-chevron-left" />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '200px',
            justifyContent: 'center'
          }}>
            <i className={diasSemana[diaActual].icono} style={{ 
              color: 'var(--primary-color)', 
              fontSize: '1.5rem' 
            }} />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                {diasSemana[diaActual].nombre}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Día {diaActual + 1} de 7
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={siguienteDia}
            disabled={diaActual === diasSemana.length - 1}
            style={{
              background: diaActual === diasSemana.length - 1 ? 'var(--bg-card)' : 'var(--primary-color)',
              color: diaActual === diasSemana.length - 1 ? 'var(--text-muted)' : 'var(--bg-dark)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: diaActual === diasSemana.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}

      {/* Grid de horarios */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '0.75rem',
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '1.5rem',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '2px solid var(--border-color)'
      }}>
        {horarios.map((horario) => {
          const isSelected = getHorariosActivos().includes(horario);

          return (
            <button
              type="button"
              key={horario}
              onClick={() => handleHorarioClick(horario)}
              style={{
                background: isSelected ? 'var(--primary-color)' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 0.5rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected 
                  ? '0 4px 12px rgba(57, 255, 20, 0.4)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {/* Efecto de brillo para horarios seleccionados */}
              {isSelected && (
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
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  fontSize: '0.7rem',
                  opacity: 0.8
                }}>
                  <i className="fas fa-check" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Resumen de horarios (solo en modo personalizado) */}
      {modoPersonalizado && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'var(--bg-card)',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <i className="fas fa-calendar-alt" style={{ color: 'var(--primary-color)' }} />
            <strong style={{ color: 'var(--text-primary)' }}>Resumen Semanal:</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {diasSemana.map((dia) => {
              const horariosDelDia = horariosSemana[dia.id] || [];
              return (
                <div key={dia.id} style={{ 
                  color: horariosDelDia.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '0.8rem'
                }}>
                  <strong>{dia.nombre}:</strong> {horariosDelDia.length > 0 ? `${horariosDelDia.length} horarios` : 'Cerrado'}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default HorarioSemanal;