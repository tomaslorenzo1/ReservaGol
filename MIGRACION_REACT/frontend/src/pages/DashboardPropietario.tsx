import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { prediosService } from '../services/prediosService';
import { uploadService } from '../services/uploadService';
import PhotoUploadModal from '../components/PhotoUploadModal';
import HorarioSelector from '../components/HorarioSelector';
import FormularioPredio from '../components/FormularioPredio';
import RedesSociales from '../components/RedesSociales';
import HorariosSemanaViewer from '../components/HorariosSemanaViewer';
import api from '../services/authService';

interface Predio {
  id: number;
  propietario_id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  telefono: string;
  horario_apertura: string;
  horario_cierre: string;
  descripcion: string;
  activo: boolean;
  abierto: boolean;
  fecha_registro: string;
  fecha_actualizacion: string;
  foto_portada?: string;
  foto_perfil?: string;
  descripcion_larga?: string;
  servicios_adicionales?: string;
  redes_sociales?: string;
  horario_atencion?: string;
  politicas_cancelacion?: string;
  servicios_disponibles?: string[];
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  link_maps?: string;
  link_instagram?: string;
  link_facebook?: string;
  link_tiktok?: string;
  link_x?: string;
  link_whatsapp?: string;
  contrato_archivo?: string;
  modo_horario_personalizado?: string;
}

interface Cancha {
  id: number;
  nombre: string;
  tipo: string;
  capacidad_jugadores: number;
  precio_hora: number;
  activa: boolean;
  superficie: string;
  iluminacion: boolean;
  techada: boolean;
}

interface Reserva {
  id: number;
  cancha_nombre: string;
  usuario_nombre: string;
  fecha_reserva: string;
  hora_inicio: string;
  hora_fin: string;
  precio_total: number;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
  estado_pago: 'sin_pagar' | 'senado' | 'pagado';
}

const DashboardPropietario: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [predio, setPredio] = useState<Predio | null>(null);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const sections = [
    { id: 'pagina', icon: 'fas fa-globe', label: 'Gestión de Página', color: '#3b82f6' },
    { id: 'canchas', icon: 'fas fa-futbol', label: 'Gestión de Canchas', color: '#10b981' },
    { id: 'turnos', icon: 'fas fa-calendar-alt', label: 'Gestión de Turnos', color: '#f59e0b' },
    { id: 'datos', icon: 'fas fa-chart-bar', label: 'Gestión de Datos', color: '#8b5cf6' }
  ];

  useEffect(() => {
    console.log('👤 Usuario en DashboardPropietario:', user);
    console.log('🎯 ID del usuario:', user?.id);
    loadPredioData();
  }, [user?.id]);

  const loadPredioData = async () => {
    if (!user?.id) {
      console.log('❌ No hay usuario logueado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Buscando predio para usuario ID:', user.id);
      
      // Cargar predio del propietario
      const predioData = await prediosService.getPredioByPropietario(user.id);
      console.log('✅ Predio encontrado:', predioData);
      console.log('📸 Fotos en predio:', {
        foto_perfil: predioData?.foto_perfil,
        foto_portada: predioData?.foto_portada,
        contrato_archivo: predioData?.contrato_archivo
      });
      setPredio(predioData);
      
      // Cargar canchas del predio
      if (predioData?.id) {
        try {
          const canchasData = await prediosService.getCanchasByPredio(predioData.id);
          setCanchas(canchasData);
        } catch (error) {
          setCanchas([]);
        }
        
        try {
          const reservasData = await prediosService.getReservasByPredio(predioData.id);
          setReservas(reservasData);
        } catch (error) {
          setReservas([]);
        }
      }
      
    } catch (error: any) {
      console.log('❌ Error:', error.response?.status, error.message);
      if (error.response?.status === 404) {
        console.log('ℹ️ No se encontró predio para este propietario');
        setPredio(null);
      } else {
        console.error('Error inesperado:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-dark)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
          <p>Cargando panel de propietario...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
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
      <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Header Section */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            animation: 'fadeInUp 0.6s ease-out'
          }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--text-primary), var(--primary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Vista de <span className="text-neon">Propietario</span>
            </h1>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Administra tu predio de manera profesional
            </p>
          </div>

          {/* Navigation Cards */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {sections.map((section, index) => (
              <div
                key={section.id}
                onClick={() => toggleSection(section.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: `2px solid ${activeSection === section.id ? section.color : 'var(--border-color)'}`,
                  borderRadius: '20px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: activeSection === section.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
                  boxShadow: activeSection === section.id 
                    ? `0 20px 40px rgba(${section.color === '#3b82f6' ? '59, 130, 246' : section.color === '#10b981' ? '16, 185, 129' : section.color === '#f59e0b' ? '245, 158, 11' : '139, 92, 246'}, 0.3)` 
                    : '0 4px 20px rgba(0, 0, 0, 0.1)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = section.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: activeSection === section.id ? section.color : 'transparent',
                  transition: 'all 0.3s ease'
                }} />
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: activeSection === section.id 
                      ? `linear-gradient(135deg, ${section.color}, ${section.color}dd)` 
                      : 'var(--bg-secondary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem',
                    color: activeSection === section.id ? 'white' : section.color,
                    transition: 'all 0.3s ease',
                    transform: activeSection === section.id ? 'scale(1.1)' : 'scale(1)'
                  }}>
                    <i className={section.icon}></i>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: activeSection === section.id ? section.color : 'var(--text-primary)',
                    transition: 'color 0.3s ease'
                  }}>
                    {section.label}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    <span>{activeSection === section.id ? 'Abierto' : 'Hacer clic para abrir'}</span>
                    <i className={`fas fa-chevron-${activeSection === section.id ? 'up' : 'down'}`} 
                       style={{ 
                         transition: 'transform 0.3s ease',
                         transform: activeSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)'
                       }}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Content */}
          {activeSection && (
            <div style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--primary-color)',
              borderRadius: '20px',
              padding: '0',
              overflow: 'hidden',
              animation: 'slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 20px 40px rgba(57, 255, 20, 0.2)'
            }}>
              {renderSectionContent()}
            </div>
          )}
        </div>
      </main>
      

      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );

  function renderSectionContent() {
    const sectionData = sections.find(s => s.id === activeSection);
    if (!sectionData) return null;

    return (
      <div style={{ padding: '2.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: `2px solid ${sectionData.color}20`
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${sectionData.color}, ${sectionData.color}dd)`,
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            <i className={sectionData.icon}></i>
          </div>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '2rem',
              color: sectionData.color,
              fontWeight: '700'
            }}>
              {sectionData.label}
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1.1rem'
            }}>
              {getSectionDescription(activeSection!)}
            </p>
          </div>
        </div>
        
        {getSectionComponent(activeSection!)}
      </div>
    );
  }

  function getSectionDescription(sectionId: string): string {
    switch (sectionId) {
      case 'pagina': return 'Personaliza cómo se ve tu predio para los usuarios';
      case 'canchas': return 'Administra las canchas de tu predio';
      case 'turnos': return 'Gestiona las reservas y turnos de tus canchas';
      case 'datos': return 'Estadísticas y análisis de tu predio';
      default: return '';
    }
  }

  function getSectionComponent(sectionId: string) {
    switch (sectionId) {
      case 'pagina':
        return <GestionPagina predio={predio} user={user} onPredioUpdate={loadPredioData} />;
      case 'canchas':
        return <GestionCanchas canchas={canchas} />;
      case 'turnos':
        return <GestionTurnos reservas={reservas} />;
      case 'datos':
        return <GestionDatos />;
      default:
        return null;
    }
  }
};

// Componente para Gestión de Página
const GestionPagina: React.FC<{ predio: Predio | null; user: any; onPredioUpdate: () => void }> = ({ predio, user, onPredioUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [predioData, setPredioData] = useState<Predio | null>(predio);
  const [showFormulario, setShowFormulario] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPredioData(predio);
  }, [predio]);

  const handleFormularioSubmit = async (data: any) => {
    try {
      setSaving(true);
      
      if (predioData?.id) {
        // Actualizar predio existente
        await prediosService.updatePredio(predioData.id, data);
      } else {
        // Crear nuevo predio - agregar propietario_id
        if (data instanceof FormData) {
          data.append('propietario_id', user?.id.toString());
        } else {
          data.propietario_id = user?.id;
        }
        
        await prediosService.createPredio(data);
      }
      
      // Recargar datos desde el componente padre
      await onPredioUpdate();
      setShowFormulario(false);
      
    } catch (error) {
      console.error('Error guardando predio:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  if (!predioData) {
    return (
      <>
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '15px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <i className="fas fa-store" style={{ 
            fontSize: '4rem', 
            color: 'var(--text-muted)', 
            marginBottom: '1.5rem' 
          }}></i>
          <h3 style={{ marginBottom: '1rem' }}>No tienes un predio registrado</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Crea tu predio para comenzar a recibir reservas
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowFormulario(true)}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}
          >
            <i className="fas fa-plus"></i>
            Crear Mi Predio
          </button>
        </div>
        
        {/* Formulario de creación */}
        {showFormulario && (
          <FormularioPredio
            onSubmit={handleFormularioSubmit}
            onCancel={() => setShowFormulario(false)}
            isEditing={false}
          />
        )}
      </>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Vista Previa */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '15px',
        padding: '2rem',
        border: '2px solid var(--primary-color)20'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>
            <i className="fas fa-eye" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
            Vista Previa de tu Predio
          </h3>

        </div>

        {/* Portada */}
        <div 
          style={{
            height: '200px',
            borderRadius: '12px',
            marginBottom: '2rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--border-color)',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--bg-dark), var(--bg-card))'
          }}
        >
          {predioData?.foto_portada ? (
            <img 
              src={`http://localhost:3001/uploads/predios/${predioData.foto_portada}`}
              alt="Foto de portada"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px'
              }}
              onLoad={() => console.log('✅ Foto portada cargada:', predioData.foto_portada)}
              onError={(e) => {
                console.log('❌ Error cargando foto portada:', `http://localhost:3001/uploads/predios/${predioData.foto_portada}`);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fas fa-image" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
              <p style={{ margin: '0' }}>Foto de Portada</p>
            </div>
          )}
        </div>

        {/* Información del Predio */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Foto de Perfil */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px'
          }}>
            <div 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '4px solid var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                background: 'var(--bg-card)',
                position: 'relative'
              }}
            >
              {predioData?.foto_perfil ? (
                <img 
                  src={`http://localhost:3001/uploads/predios/${predioData.foto_perfil}`}
                  alt="Foto de perfil"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onLoad={() => console.log('✅ Foto perfil cargada:', predioData.foto_perfil)}
                  onError={(e) => {
                    console.log('❌ Error cargando foto perfil:', `http://localhost:3001/uploads/predios/${predioData.foto_perfil}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <i className="fas fa-store" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
              )}
            </div>
          </div>

          {/* Datos del Predio */}
          <div>
            <h2 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '2rem',
              color: 'var(--text-primary)'
            }}>
              {predioData?.nombre}
            </h2>
            
            {/* Información básica */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-color)' }}></i>
                  <strong style={{ color: 'var(--text-primary)' }}>Ubicación</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                  {predioData?.direccion}<br/>
                  {predioData?.ciudad}, {predioData?.provincia}
                </p>
              </div>
              
              <div style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-phone" style={{ color: 'var(--primary-color)' }}></i>
                  <strong style={{ color: 'var(--text-primary)' }}>Contacto</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                  {predioData?.telefono || 'No especificado'}
                </p>
              </div>
              
              <div style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-clock" style={{ color: 'var(--primary-color)' }}></i>
                  <strong style={{ color: 'var(--text-primary)' }}>Horarios de Atención</strong>
                </div>
                {(predioData?.horario_atencion || predioData?.modo_horario_personalizado) ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <HorariosSemanaViewer 
                      horarios={predioData.modo_horario_personalizado || predioData.horario_atencion || ''} 
                    />
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
                    {predioData?.horario_apertura && predioData?.horario_cierre 
                      ? `Horario general: ${predioData.horario_apertura.slice(0, 5)} - ${predioData.horario_cierre.slice(0, 5)}`
                      : 'No especificado'
                    }
                  </p>
                )}
              </div>
            </div>
            
            {/* Descripción */}
            {predioData?.descripcion && (
              <div style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }}></i>
                  <strong style={{ color: 'var(--text-primary)' }}>Descripción</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {predioData.descripcion}
                </p>
              </div>
            )}
            
            {/* Descripción larga */}
            {predioData?.descripcion_larga && (
              <div style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-align-left" style={{ color: 'var(--primary-color)' }}></i>
                  <strong style={{ color: 'var(--text-primary)' }}>Información Detallada</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {predioData.descripcion_larga}
                </p>
              </div>
            )}
            
            {/* Servicios disponibles */}
            {(() => {
              let servicios: string[] = [];
              
              if (typeof predioData?.servicios_disponibles === 'string') {
                try {
                  servicios = JSON.parse(predioData.servicios_disponibles);
                } catch {
                  servicios = [];
                }
              } else if (predioData && Array.isArray(predioData.servicios_disponibles)) {
                servicios = predioData.servicios_disponibles;
              }
              
              if (servicios.length === 0) return null;
              
              return (
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <i className="fas fa-concierge-bell" style={{ color: 'var(--primary-color)' }}></i>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Servicios Disponibles</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    {servicios.map((servicio: string, index: number) => (
                      <span key={index} style={{
                        background: 'linear-gradient(135deg, var(--primary-color)20, var(--primary-color)10)',
                        color: 'var(--primary-color)',
                        padding: '0.5rem 1rem',
                        borderRadius: '25px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        border: '2px solid var(--primary-color)30',
                        transition: 'all 0.3s ease',
                        cursor: 'default',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 8px rgba(57, 255, 20, 0.15)'
                      }}>
                        <i className="fas fa-check-circle" style={{ fontSize: '0.7rem' }}></i>
                        {servicio.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
            
            {/* Políticas de cancelación */}
            {predioData?.politicas_cancelacion && (
              <div style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-file-contract" style={{ color: 'var(--primary-color)' }}></i>
                  <strong style={{ color: 'var(--text-primary)' }}>Políticas de Cancelación</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {predioData.politicas_cancelacion}
                </p>
                {predioData?.contrato_archivo && (
                  <div style={{ marginTop: '1rem' }}>
                    <a 
                      href={`http://localhost:3001/uploads/predios/${predioData.contrato_archivo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#dc3545',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="fas fa-file-pdf"></i>
                      Ver Contrato
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {/* Redes sociales */}
            {(() => {
              const redes = {
                instagram: predioData?.link_instagram,
                facebook: predioData?.link_facebook,
                tiktok: predioData?.link_tiktok,
                twitter: predioData?.link_x,
                whatsapp: predioData?.link_whatsapp
              };
              
              const redesConUrl = Object.entries(redes).filter(([key, value]) => value && value.toString().trim());
              
              if (redesConUrl.length === 0) return null;
              
              return (
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <i className="fas fa-share-alt" style={{ color: 'var(--primary-color)' }}></i>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Síguenos en Redes</strong>
                  </div>
                  <RedesSociales redes={redes} />
                </div>
              );
            })()}
            
            {/* Ubicación en mapa */}
            {((predioData?.coordenadas_lat && predioData?.coordenadas_lng) || predioData?.link_maps) && (
              <div style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <i className="fas fa-map" style={{ color: 'var(--primary-color)' }}></i>
                  <strong style={{ color: 'var(--text-primary)' }}>Ubicación en Mapa</strong>
                </div>
                {predioData?.coordenadas_lat && predioData?.coordenadas_lng && (
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    Coordenadas: {predioData.coordenadas_lat}, {predioData.coordenadas_lng}
                  </p>
                )}
                {predioData?.link_maps && (
                  <a 
                    href={predioData.link_maps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'var(--primary-color)',
                      color: 'var(--bg-dark)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Ver en Google Maps
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        <div 
          onClick={() => setShowFormulario(true)}
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-edit" style={{ 
            fontSize: '2rem', 
            color: '#3b82f6', 
            marginBottom: '1rem' 
          }}></i>
          <h4 style={{ marginBottom: '0.5rem' }}>Editar Información</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Actualiza los datos de tu predio
          </p>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <i className="fas fa-qrcode" style={{ 
            fontSize: '2rem', 
            color: '#10b981', 
            marginBottom: '1rem' 
          }}></i>
          <h4 style={{ marginBottom: '0.5rem' }}>Código QR</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Genera un QR para tu predio
          </p>
        </div>

        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <i className="fas fa-external-link-alt" style={{ 
            fontSize: '2rem', 
            color: '#f59e0b', 
            marginBottom: '1rem' 
          }}></i>
          <h4 style={{ marginBottom: '0.5rem' }}>Ver Página Pública</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ve cómo ven tu predio los jugadores
          </p>
        </div>
      </div>
      
      {/* Formulario de edición */}
      {showFormulario && (
        <FormularioPredio
          predio={predioData}
          onSubmit={handleFormularioSubmit}
          onCancel={() => setShowFormulario(false)}
          isEditing={true}
        />
      )}
    </div>
  );
};

// Componente para Gestión de Canchas
const GestionCanchas: React.FC<{ canchas: Cancha[] }> = ({ canchas }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Mis Canchas</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {canchas.length} canchas registradas
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
          style={{
            background: 'var(--gradient)',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}
        >
          <i className="fas fa-plus"></i>
          Agregar Cancha
        </button>
      </div>
      
      {canchas.length === 0 ? (
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '15px',
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <i className="fas fa-futbol" style={{ 
            fontSize: '4rem', 
            color: 'var(--text-muted)', 
            marginBottom: '1.5rem' 
          }}></i>
          <h3 style={{ marginBottom: '1rem' }}>No tienes canchas registradas</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Agrega tu primera cancha para comenzar a recibir reservas
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus"></i>
            Crear Primera Cancha
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {canchas.map((cancha) => (
            <div key={cancha.id} style={{
              background: 'var(--bg-secondary)',
              borderRadius: '15px',
              padding: '1.5rem',
              border: `2px solid ${cancha.activa ? 'var(--primary-color)20' : '#ff6b6b20'}`,
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: 0, fontSize: '1.3rem' }}>{cancha.nombre}</h4>
                <span style={{
                  background: cancha.activa ? 'var(--primary-color)20' : '#ff6b6b20',
                  color: cancha.activa ? 'var(--primary-color)' : '#ff6b6b',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {cancha.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <i className="fas fa-futbol" style={{ marginRight: '0.5rem' }}></i>
                  {cancha.tipo} - {cancha.superficie}
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
                  Capacidad: {cancha.capacidad_jugadores} jugadores
                </p>
                <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                  <i className="fas fa-dollar-sign" style={{ marginRight: '0.5rem' }}></i>
                  ${cancha.precio_hora}/hora
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {cancha.iluminacion && (
                  <span style={{
                    background: 'var(--bg-card)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <i className="fas fa-lightbulb"></i> Iluminación
                  </span>
                )}
                {cancha.techada && (
                  <span style={{
                    background: 'var(--bg-card)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <i className="fas fa-home"></i> Techada
                  </span>
                )}
              </div>
              
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem'
              }}>
                <button className="btn btn-outline" style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <i className="fas fa-edit"></i>
                  Editar
                </button>
                <button className="btn btn-outline" style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                  borderColor: cancha.activa ? '#ff6b6b' : 'var(--primary-color)',
                  color: cancha.activa ? '#ff6b6b' : 'var(--primary-color)'
                }}>
                  <i className={`fas fa-${cancha.activa ? 'pause' : 'play'}`}></i>
                  {cancha.activa ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal para agregar cancha */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Agregar Nueva Cancha</h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)'
            }}>
              <i className="fas fa-cog" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
              <p>Formulario de cancha en desarrollo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para Gestión de Turnos
const GestionTurnos: React.FC<{ reservas: Reserva[] }> = ({ reservas }) => {
  const [activeTab, setActiveTab] = useState<'curso' | 'terminadas'>('curso');
  const [reservasEnCurso] = useState(reservas.filter(r => r.estado !== 'cancelado' && r.estado_pago !== 'pagado'));
  const [reservasTerminadas] = useState(reservas.filter(r => r.estado_pago === 'pagado'));
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Gestión de Reservas</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Administra todas las reservas de tus canchas
          </p>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Agregar Reserva
        </button>
      </div>
      
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('curso')}
          style={{
            background: activeTab === 'curso' ? 'var(--primary-color)' : 'var(--bg-secondary)',
            color: activeTab === 'curso' ? 'var(--bg-dark)' : 'var(--text-primary)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
          En Curso ({reservasEnCurso.length})
        </button>
        <button
          onClick={() => setActiveTab('terminadas')}
          style={{
            background: activeTab === 'terminadas' ? 'var(--primary-color)' : 'var(--bg-secondary)',
            color: activeTab === 'terminadas' ? 'var(--bg-dark)' : 'var(--text-primary)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
          Terminadas ({reservasTerminadas.length})
        </button>
      </div>
      
      {/* Contenido de las tabs */}
      {(activeTab === 'curso' ? reservasEnCurso : reservasTerminadas).length === 0 ? (
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '15px',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <i className="fas fa-calendar-times" style={{ 
            fontSize: '3rem', 
            color: 'var(--text-muted)', 
            marginBottom: '1rem' 
          }}></i>
          <h3>No hay reservas {activeTab === 'curso' ? 'en curso' : 'terminadas'}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {activeTab === 'curso' 
              ? 'Las nuevas reservas aparecerán aquí' 
              : 'Las reservas completadas aparecerán aquí'
            }
          </p>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '15px',
          overflow: 'hidden'
        }}>
          {/* Tabla de reservas */}
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: 'var(--bg-card)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)' }}>Cliente</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)' }}>Cancha</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)' }}>Fecha/Hora</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-primary)' }}>Precio</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)' }}>Estado</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)' }}>Pago</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-primary)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'curso' ? reservasEnCurso : reservasTerminadas).map((reserva) => (
                  <tr key={reserva.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {reserva.usuario_nombre}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          DNI: 12.345.678
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {reserva.cancha_nombre}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      <div>{new Date(reserva.fecha_reserva).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.9rem' }}>
                        {reserva.hora_inicio} - {reserva.hora_fin}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                        ${reserva.precio_total}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        ($2.500 c/u)
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        background: reserva.estado === 'confirmado' ? 'var(--primary-color)20' : 
                                   reserva.estado === 'pendiente' ? '#f59e0b20' : '#ff6b6b20',
                        color: reserva.estado === 'confirmado' ? 'var(--primary-color)' : 
                               reserva.estado === 'pendiente' ? '#f59e0b' : '#ff6b6b',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        background: reserva.estado_pago === 'pagado' ? 'var(--primary-color)20' : 
                                   reserva.estado_pago === 'senado' ? '#f59e0b20' : '#ff6b6b20',
                        color: reserva.estado_pago === 'pagado' ? 'var(--primary-color)' : 
                               reserva.estado_pago === 'senado' ? '#f59e0b' : '#ff6b6b',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {reserva.estado_pago.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                        <button style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '0.5rem',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '0.5rem',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}>
                          <i className="fas fa-trash"></i>
                        </button>
                        <button style={{
                          background: 'var(--primary-color)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem',
                          color: 'var(--bg-dark)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}>
                          <i className="fas fa-save"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para Gestión de Datos
const GestionDatos: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  
  const stats = [
    { label: 'Canchas Activas', value: '0', icon: 'fas fa-futbol', color: '#10b981', change: '+0%' },
    { label: 'Reservas Este Mes', value: '0', icon: 'fas fa-calendar-check', color: '#3b82f6', change: '+0%' },
    { label: 'Ingresos Este Mes', value: '$0', icon: 'fas fa-dollar-sign', color: '#f59e0b', change: '+0%' },
    { label: 'Tasa de Ocupación', value: '0%', icon: 'fas fa-percentage', color: '#8b5cf6', change: '+0%' }
  ];
  
  const periods = [
    { id: 'dia', label: 'Hoy', icon: 'fas fa-calendar-day' },
    { id: 'semana', label: 'Esta Semana', icon: 'fas fa-calendar-week' },
    { id: 'mes', label: 'Este Mes', icon: 'fas fa-calendar-alt' },
    { id: 'ano', label: 'Este Año', icon: 'fas fa-calendar' }
  ];

  return (
    <div>
      {/* Selector de Período */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id as any)}
            style={{
              background: selectedPeriod === period.id ? 'var(--primary-color)' : 'var(--bg-secondary)',
              color: selectedPeriod === period.id ? 'var(--bg-dark)' : 'var(--text-primary)',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className={period.icon}></i>
            {period.label}
          </button>
        ))}
      </div>
      
      {/* Estadísticas Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: 'var(--bg-secondary)',
            borderRadius: '15px',
            padding: '2rem',
            border: `2px solid ${stat.color}20`,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: `${stat.color}10`,
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: 'white'
              }}>
                <i className={stat.icon}></i>
              </div>
              
              <span style={{
                background: stat.change.startsWith('+') ? 'var(--primary-color)20' : '#ff6b6b20',
                color: stat.change.startsWith('+') ? 'var(--primary-color)' : '#ff6b6b',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {stat.change}
              </span>
            </div>
            
            <div style={{
              fontSize: '2.2rem',
              fontWeight: '800',
              color: stat.color,
              marginBottom: '0.5rem'
            }}>
              {stat.value}
            </div>
            
            <div style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      
      {/* Gráficos y Análisis */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem'
      }}>
        {/* Gráfico de Ingresos */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '15px',
          padding: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-chart-line" style={{ color: '#f59e0b' }}></i>
            Evolución de Ingresos
          </h3>
          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            border: '2px dashed var(--border-color)',
            borderRadius: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-chart-area" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
              <p>Gráfico de ingresos</p>
              <p style={{ fontSize: '0.8rem' }}>Próximamente disponible</p>
            </div>
          </div>
        </div>
        
        {/* Horarios Más Populares */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '15px',
          padding: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-clock" style={{ color: '#3b82f6' }}></i>
            Horarios Más Populares
          </h3>
          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            border: '2px dashed var(--border-color)',
            borderRadius: '10px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <i className="fas fa-chart-bar" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
              <p>Análisis de horarios</p>
              <p style={{ fontSize: '0.8rem' }}>Próximamente disponible</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumen Rápido */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '15px',
        padding: '2rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-tachometer-alt" style={{ color: 'var(--primary-color)' }}></i>
          Resumen de Rendimiento
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>0</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Reservas Hoy</div>
          </div>
          
          <div style={{
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>0%</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ocupación Promedio</div>
          </div>
          
          <div style={{
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>$0</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ingreso Promedio/Día</div>
          </div>
          
          <div style={{
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>0</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Clientes Únicos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPropietario;