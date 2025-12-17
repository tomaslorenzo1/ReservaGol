import React, { useState } from 'react';

interface HorariosSemanaViewerProps {
  horarios: string | { [key: string]: string[] } | undefined;
}

const HorariosSemanaViewer: React.FC<HorariosSemanaViewerProps> = ({ horarios }) => {
  const [expandido, setExpandido] = useState(false);
  
  const horariosData = typeof horarios === 'string' ? JSON.parse(horarios) : horarios;
  
  const diasSemana = [
    { id: 'lunes', nombre: 'Lunes', abrev: 'L' },
    { id: 'martes', nombre: 'Martes', abrev: 'M' },
    { id: 'miercoles', nombre: 'Miércoles', abrev: 'X' },
    { id: 'jueves', nombre: 'Jueves', abrev: 'J' },
    { id: 'viernes', nombre: 'Viernes', abrev: 'V' },
    { id: 'sabado', nombre: 'Sábado', abrev: 'S' },
    { id: 'domingo', nombre: 'Domingo', abrev: 'D' }
  ];

  const formatearHorarios = (horariosArray: string[]) => {
    if (!horariosArray || horariosArray.length === 0) return 'Día cerrado';
    
    // Ordenar horarios
    const horariosOrdenados = horariosArray.sort();
    
    // Agrupar horarios consecutivos
    const grupos: string[][] = [];
    let grupoActual: string[] = [];
    
    horariosOrdenados.forEach((horario, index) => {
      if (grupoActual.length === 0) {
        grupoActual = [horario];
      } else {
        const ultimoHorario = grupoActual[grupoActual.length - 1];
        const horaFin = ultimoHorario.split(' - ')[1];
        const horaInicio = horario.split(' - ')[0];
        
        if (horaFin === horaInicio) {
          grupoActual.push(horario);
        } else {
          grupos.push([...grupoActual]);
          grupoActual = [horario];
        }
      }
      
      if (index === horariosOrdenados.length - 1) {
        grupos.push(grupoActual);
      }
    });
    
    // Formatear grupos
    return grupos.map(grupo => {
      if (grupo.length === 1) {
        return grupo[0];
      } else {
        const inicio = grupo[0].split(' - ')[0];
        const fin = grupo[grupo.length - 1].split(' - ')[1];
        return `${inicio} - ${fin}`;
      }
    }).join(', ');
  };

  // Verificar si hay horarios por día específico (modo personalizado)
  const tieneHorariosPorDia = diasSemana.some(dia => horariosData[dia.id] && horariosData[dia.id].length > 0);
  const esHorarioGeneral = horariosData.general !== undefined && !tieneHorariosPorDia;
  const tieneHorarios = esHorarioGeneral 
    ? horariosData.general?.length > 0
    : tieneHorariosPorDia;

  if (!tieneHorarios) return null;

  return (
    <div style={{
      background: 'transparent',
      padding: '0',
      borderRadius: '8px',
      border: 'none'
    }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: expandido ? '1rem' : '0'
        }}
        onClick={() => setExpandido(!expandido)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!expandido && (
            <span style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.9rem',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {esHorarioGeneral 
                ? formatearHorarios(horariosData.general)
                : 'Horarios personalizados'
              }
            </span>
          )}
          
          <i 
            className={`fas fa-chevron-${expandido ? 'up' : 'down'}`}
            style={{ 
              color: 'var(--primary-color)',
              transition: 'transform 0.3s ease'
            }}
          />
        </div>
      </div>

      {expandido && (
        <div style={{
          animation: 'slideDown 0.3s ease-out'
        }}>
          {esHorarioGeneral ? (
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0, 
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Todos los días: {formatearHorarios(horariosData.general)}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '0.5rem'
            }}>
              {diasSemana.map((dia) => {
                const horariosDelDia = horariosData[dia.id] || [];
                const tieneHorarios = horariosDelDia.length > 0;
                
                return (
                  <div
                    key={dia.id}
                    style={{
                      background: tieneHorarios ? 'var(--bg-secondary)' : '#ffebee',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: `2px solid ${tieneHorarios ? 'var(--primary-color)' : '#f44336'}`,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        background: tieneHorarios ? 'var(--primary-color)' : '#f44336',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {dia.abrev}
                      </div>
                      
                      <span style={{ 
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}>
                        {dia.nombre}
                      </span>
                    </div>
                    
                    <div style={{ 
                      color: tieneHorarios ? 'var(--text-primary)' : '#f44336',
                      fontSize: '0.9rem',
                      fontWeight: tieneHorarios ? '500' : '400'
                    }}>
                      {formatearHorarios(horariosDelDia)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HorariosSemanaViewer;