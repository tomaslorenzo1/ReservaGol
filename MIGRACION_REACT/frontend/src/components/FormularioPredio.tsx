import React, { useState } from 'react';
import HorarioSemanal from './HorarioSemanal';
import MapaInteractivo from './MapaInteractivo';
import ImageUpload from './ImageUpload';

interface FormularioPredioProps {
  predio?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const FormularioPredio: React.FC<FormularioPredioProps> = ({
  predio,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [formData, setFormData] = useState(() => ({
    nombre: predio?.nombre || '',
    direccion: predio?.direccion || '',
    ciudad: predio?.ciudad || '',
    provincia: predio?.provincia || '',
    telefono: predio?.telefono || '',
    descripcion: predio?.descripcion || '',
    descripcion_larga: predio?.descripcion_larga || '',
    horario_apertura: predio?.horario_apertura || '08:00',
    horario_cierre: predio?.horario_cierre || '23:00',
    servicios_adicionales: predio?.servicios_adicionales || '',
    redes_sociales: predio?.redes_sociales || '',
    politicas_cancelacion: predio?.politicas_cancelacion || '',
    coordenadas_lat: predio?.coordenadas_lat || '',
    coordenadas_lng: predio?.coordenadas_lng || '',
    link_maps: predio?.link_maps || '',
    servicios_disponibles: (() => {
      if (Array.isArray(predio?.servicios_disponibles)) {
        return predio.servicios_disponibles;
      }
      if (typeof predio?.servicios_disponibles === 'string') {
        try {
          return JSON.parse(predio.servicios_disponibles);
        } catch {
          return [];
        }
      }
      return [];
    })(),
    instagram: predio?.link_instagram || '',
    facebook: predio?.link_facebook || '',
    tiktok: predio?.link_tiktok || '',
    twitter: predio?.link_x || '',
    whatsapp: predio?.link_whatsapp || predio?.telefono || ''
  }));

  // Actualizar formData cuando cambie el predio
  React.useEffect(() => {
    if (predio) {
      setFormData({
        nombre: predio.nombre || '',
        direccion: predio.direccion || '',
        ciudad: predio.ciudad || '',
        provincia: predio.provincia || '',
        telefono: predio.telefono || '',
        descripcion: predio.descripcion || '',
        descripcion_larga: predio.descripcion_larga || '',
        horario_apertura: predio.horario_apertura || '08:00',
        horario_cierre: predio.horario_cierre || '23:00',
        servicios_adicionales: predio.servicios_adicionales || '',
        redes_sociales: predio.redes_sociales || '',
        politicas_cancelacion: predio.politicas_cancelacion || '',
        coordenadas_lat: predio.coordenadas_lat?.toString() || '',
        coordenadas_lng: predio.coordenadas_lng?.toString() || '',
        link_maps: predio.link_maps || '',
        servicios_disponibles: (() => {
          if (Array.isArray(predio.servicios_disponibles)) {
            return predio.servicios_disponibles;
          }
          if (typeof predio.servicios_disponibles === 'string') {
            try {
              return JSON.parse(predio.servicios_disponibles);
            } catch {
              return [];
            }
          }
          return [];
        })(),
        instagram: predio.link_instagram || '',
        facebook: predio.link_facebook || '',
        tiktok: predio.link_tiktok || '',
        twitter: predio.link_x || '',
        whatsapp: predio.link_whatsapp || predio.telefono || ''
      });
      
      // Actualizar horarios si existen
      if (predio.horario_atencion) {
        try {
          const horarios = JSON.parse(predio.horario_atencion);
          setHorariosDisponibles(horarios);
        } catch (error) {
          console.error('Error parsing horarios:', error);
        }
      }
      
      // Resetear archivos cuando cambie el predio
      setFotoPerfil(null);
      setFotoPortada(null);
      setContratoArchivo(null);
      setEliminarFotoPerfil(false);
      setEliminarFotoPortada(false);
    }
  }, [predio]);

  const [horariosDisponibles, setHorariosDisponibles] = useState<{ [key: string]: string[] }>(
    predio?.horario_atencion ? JSON.parse(predio.horario_atencion) : {}
  );
  const [modoPersonalizado, setModoPersonalizado] = useState(false);

  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPortada, setFotoPortada] = useState<File | null>(null);
  const [contratoArchivo, setContratoArchivo] = useState<File | null>(null);
  const [eliminarFotoPerfil, setEliminarFotoPerfil] = useState(false);
  const [eliminarFotoPortada, setEliminarFotoPortada] = useState(false);
  
  // Ref para el contenedor del formulario
  const formContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Detectar scroll para mostrar/ocultar botón
  React.useEffect(() => {
    const handleScroll = () => {
      if (formContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = formContainerRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
        setShowScrollButton(scrollTop > 200 && !isNearBottom);
      }
    };
    
    const container = formContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Función para hacer scroll hacia abajo
  const scrollToBottom = () => {
    if (formContainerRef.current) {
      formContainerRef.current.scrollTo({
        top: formContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const serviciosOptions = [
    'futbol5', 'futbol7', 'futbol11', 'tennis', 'padel', 'basquet', 
    'voley', 'hockey', 'vestuarios', 'duchas', 'estacionamiento', 
    'buffet', 'iluminacion', 'techado', 'parrilla', 'wifi', 
    'aire_acondicionado', 'calefaccion', 'quincho', 'estacionamiento_techado'
  ];

  const provinciasArgentinas = [
    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
    'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
    'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
    'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiciosChange = (servicio: string) => {
    const serviciosActuales = Array.isArray(formData.servicios_disponibles) ? formData.servicios_disponibles : [];
    const nuevosServicios = serviciosActuales.includes(servicio)
      ? serviciosActuales.filter((s: string) => s !== servicio)
      : [...serviciosActuales, servicio];
    
    handleInputChange('servicios_disponibles', nuevosServicios);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus('loading');
    
    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      console.log('📦 Creando FormData...');
      
      // Agregar datos básicos
      const basicData = {
        nombre: formData.nombre,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        provincia: formData.provincia,
        telefono: formData.telefono,
        descripcion: formData.descripcion,
        descripcion_larga: formData.descripcion_larga,
        horario_apertura: formData.horario_apertura,
        horario_cierre: formData.horario_cierre,
        servicios_adicionales: formData.servicios_adicionales,
        politicas_cancelacion: formData.politicas_cancelacion,
        coordenadas_lat: parseFloat(formData.coordenadas_lat) || null,
        coordenadas_lng: parseFloat(formData.coordenadas_lng) || null,
        link_maps: formData.link_maps,
        // Guardar en campos separados según el modo
        horario_atencion: !modoPersonalizado && Object.keys(horariosDisponibles).length > 0 
          ? JSON.stringify(horariosDisponibles) 
          : null,
        modo_horario_personalizado: modoPersonalizado && Object.keys(horariosDisponibles).length > 0 
          ? JSON.stringify(horariosDisponibles) 
          : null,
        servicios_disponibles: Array.isArray(formData.servicios_disponibles) 
          ? JSON.stringify(formData.servicios_disponibles)
          : formData.servicios_disponibles || null,
        // Campos individuales de redes sociales que ya existen en la BD
        link_instagram: formData.instagram || null,
        link_facebook: formData.facebook || null,
        link_tiktok: formData.tiktok || null,
        link_x: formData.twitter || null,
        link_whatsapp: formData.whatsapp || null,
        // Campos especiales para eliminar imágenes
        // Campos de eliminación como strings
        eliminar_foto_perfil: eliminarFotoPerfil ? 'true' : 'false',
        eliminar_foto_portada: eliminarFotoPortada ? 'true' : 'false'
      };
      
      // Los flags de eliminación ya están en basicData
      
      // Agregar datos básicos al FormData
      Object.entries(basicData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      
      // Agregar archivos si existen
      if (fotoPerfil) {
        console.log('📸 Agregando foto_perfil:', fotoPerfil.name, fotoPerfil.size, 'bytes');
        formDataToSend.append('foto_perfil', fotoPerfil);
        console.log('✅ foto_perfil agregado al FormData');
      }
      if (fotoPortada) {
        console.log('📸 Agregando foto_portada:', fotoPortada.name, fotoPortada.size, 'bytes');
        formDataToSend.append('foto_portada', fotoPortada);
        console.log('✅ foto_portada agregado al FormData');
      }
      if (contratoArchivo) {
        console.log('📸 Agregando contrato_archivo:', contratoArchivo.name, contratoArchivo.size, 'bytes');
        formDataToSend.append('contrato_archivo', contratoArchivo);
        console.log('✅ contrato_archivo agregado al FormData');
      }
      
      console.log('📦 FormData construido. Total de entries:', Array.from(formDataToSend.entries()).length);

      
      console.log('📦 Datos a enviar:', basicData);
      console.log('🕰️ Horarios a guardar:', horariosDisponibles);
      console.log('📸 Archivos detectados:', {
        fotoPerfil: fotoPerfil ? `${fotoPerfil.name} (${fotoPerfil.size} bytes)` : 'No seleccionado',
        fotoPortada: fotoPortada ? `${fotoPortada.name} (${fotoPortada.size} bytes)` : 'No seleccionado',
        contratoArchivo: contratoArchivo ? `${contratoArchivo.name} (${contratoArchivo.size} bytes)` : 'No seleccionado'
      });
      
      // Debug: Mostrar contenido del FormData
      console.log('📦 FormData entries:');
      const entries = Array.from(formDataToSend.entries());
      entries.forEach(([key, value]) => {
        if (value instanceof File) {
          console.log(`  📸 ${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  📝 ${key}: ${value}`);
        }
      });
      
      console.log('🚀 Enviando FormData al servidor...');
      console.log('URL destino:', isEditing ? `PUT /api/predios/${predio?.id}` : 'POST /api/predios');
      
      try {
        await onSubmit(formDataToSend);
        console.log('✅ FormData enviado exitosamente');
      } catch (error) {
        console.error('❌ Error enviando FormData:', error);
        throw error;
      }
      
      setSubmitStatus('success');
      
      // Mostrar éxito por 2 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
        setIsSubmitting(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error completo al guardar:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('URL llamada:', error.config?.url);
      console.error('Método:', error.config?.method);
      setSubmitStatus('error');
      
      // Mostrar el error específico al usuario
      alert(`Error al guardar: ${error.response?.data?.message || error.message || 'Error desconocido'}`);
      
      setTimeout(() => {
        setSubmitStatus('idle');
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
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
      <div 
        ref={formContainerRef}
        style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid var(--primary-color)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid var(--border-color)'
        }}>
          <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)' }}>
            <i className="fas fa-store" style={{ marginRight: '0.5rem' }} />
            {isEditing ? 'Editar Predio' : 'Crear Nuevo Predio'}
          </h2>
          <button 
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%'
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Imágenes del Predio */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-images" style={{ color: 'var(--primary-color)' }} />
              Imágenes del Predio
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <ImageUpload
                label="Foto de Perfil"
                currentImage={predio?.foto_perfil && !eliminarFotoPerfil ? `http://localhost:3001/uploads/predios/${predio.foto_perfil}` : undefined}
                onImageChange={(file) => {
                  setFotoPerfil(file);
                  if (file === null && predio?.foto_perfil) {
                    setEliminarFotoPerfil(true);
                  } else {
                    setEliminarFotoPerfil(false);
                  }
                }}
                height="250px"
                icon="fas fa-user-circle"
                maxSize={3}
              />
              
              <ImageUpload
                label="Foto de Portada"
                currentImage={predio?.foto_portada && !eliminarFotoPortada ? `http://localhost:3001/uploads/predios/${predio.foto_portada}` : undefined}
                onImageChange={(file) => {
                  setFotoPortada(file);
                  if (file === null && predio?.foto_portada) {
                    setEliminarFotoPortada(true);
                  } else {
                    setEliminarFotoPortada(false);
                  }
                }}
                height="250px"
                icon="fas fa-image"
                maxSize={5}
              />
            </div>
            
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }} />
                <strong>Foto de Perfil:</strong> Se mostrará como avatar del predio (recomendado: cuadrada, 400x400px)
              </p>
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }} />
                <strong>Foto de Portada:</strong> Se mostrará como banner principal (recomendado: 1200x400px)
              </p>
            </div>
          </div>

          {/* Información Básica */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }} />
              Información Básica
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Nombre del Predio *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Ej: Complejo Deportivo San Martín"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Ej: +54 11 1234-5678"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-color)' }} />
              Ubicación
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Dirección *
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Ej: Av. San Martín 1234"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => handleInputChange('ciudad', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Ej: Buenos Aires"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Provincia *
                </label>
                <select
                  value={formData.provincia}
                  onChange={(e) => handleInputChange('provincia', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Seleccionar provincia</option>
                  {provinciasArgentinas.map(provincia => (
                    <option key={provincia} value={provincia}>{provincia}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mapa Interactivo */}
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' }}>
                <i className="fas fa-map-marked-alt" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
                Ubicación en el Mapa
              </label>
              <MapaInteractivo
                lat={parseFloat(formData.coordenadas_lat) || -34.6037}
                lng={parseFloat(formData.coordenadas_lng) || -58.3816}
                onLocationChange={(lat, lng, address) => {
                  handleInputChange('coordenadas_lat', lat.toString());
                  handleInputChange('coordenadas_lng', lng.toString());
                  if (address && !formData.direccion) {
                    const addressParts = address.split(',');
                    if (addressParts.length > 0) {
                      handleInputChange('direccion', addressParts[0].trim());
                    }
                  }
                }}
                onMapLinkGenerated={(link) => handleInputChange('link_maps', link)}
              />
            </div>

            {/* Coordenadas y Maps */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Latitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordenadas_lat}
                  onChange={(e) => handleInputChange('coordenadas_lat', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="-34.6037"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Longitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordenadas_lng}
                  onChange={(e) => handleInputChange('coordenadas_lng', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="-58.3816"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Link de Google Maps
                </label>
                <input
                  type="url"
                  value={formData.link_maps}
                  onChange={(e) => handleInputChange('link_maps', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div style={{ marginBottom: '2rem' }}>
            <HorarioSemanal
              horariosIniciales={horariosDisponibles}
              onHorariosChange={(horarios) => {
                setHorariosDisponibles(horarios);
                handleInputChange('horario_atencion', JSON.stringify(horarios));
              }}
              modoPersonalizado={modoPersonalizado}
              onModoChange={setModoPersonalizado}
            />
          </div>

          {/* Servicios Disponibles */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-concierge-bell" style={{ color: 'var(--primary-color)' }} />
              Servicios Disponibles
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              {serviciosOptions.map(servicio => (
                <label
                  key={servicio}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: (Array.isArray(formData.servicios_disponibles) && formData.servicios_disponibles.includes(servicio))
                      ? 'var(--primary-color)20' 
                      : 'var(--bg-secondary)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `2px solid ${(Array.isArray(formData.servicios_disponibles) && formData.servicios_disponibles.includes(servicio))
                      ? 'var(--primary-color)' 
                      : 'var(--border-color)'}`
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Array.isArray(formData.servicios_disponibles) && formData.servicios_disponibles.includes(servicio)}
                    onChange={() => handleServiciosChange(servicio)}
                    style={{ display: 'none' }}
                  />
                  <i className={`fas fa-${(Array.isArray(formData.servicios_disponibles) && formData.servicios_disponibles.includes(servicio)) ? 'check-square' : 'square'}`} 
                     style={{ color: 'var(--primary-color)' }} />
                  <span style={{ 
                    color: 'var(--text-primary)',
                    textTransform: 'capitalize'
                  }}>
                    {servicio.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Descripciones */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-align-left" style={{ color: 'var(--primary-color)' }} />
              Descripciones
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Descripción Corta *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  required
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                  placeholder="Descripción breve que aparecerá en las búsquedas"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Descripción Detallada
                </label>
                <textarea
                  value={formData.descripcion_larga}
                  onChange={(e) => handleInputChange('descripcion_larga', e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                  placeholder="Descripción completa con todos los detalles del predio"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-share-alt" style={{ color: 'var(--primary-color)' }} />
              Redes Sociales
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <i className="fab fa-instagram" style={{ color: '#E4405F' }} />
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/tu_predio"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <i className="fab fa-facebook" style={{ color: '#1877F2' }} />
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/tu_predio"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <i className="fab fa-tiktok" style={{ color: '#000000' }} />
                  TikTok
                </label>
                <input
                  type="url"
                  value={formData.tiktok}
                  onChange={(e) => handleInputChange('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@tu_predio"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: '#000000',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  X (Twitter)
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="https://x.com/tu_predio"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <i className="fab fa-whatsapp" style={{ color: '#25D366' }} />
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    handleInputChange('whatsapp', e.target.value);
                    handleInputChange('telefono', e.target.value);
                  }}
                  placeholder="+54 9 11 1234-5678"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  Se generará automáticamente el link de WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Políticas de Cancelación */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-file-contract" style={{ color: 'var(--primary-color)' }} />
              Políticas de Cancelación
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Descripción de Políticas
                </label>
                <textarea
                  value={formData.politicas_cancelacion}
                  onChange={(e) => handleInputChange('politicas_cancelacion', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                  placeholder="Ej: Cancelación gratuita hasta 2 horas antes del turno"
                />
              </div>

              {/* Carga de archivo de contrato */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <i className="fas fa-file-contract" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
                  Archivo de Contrato (PDF)
                </label>
                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'var(--bg-card)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.background = 'var(--primary-color)10';
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                  const files = e.dataTransfer.files;
                  if (files.length > 0 && files[0].type === 'application/pdf') {
                    setContratoArchivo(files[0]);
                  } else {
                    alert('Solo se permiten archivos PDF');
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.pdf';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file && file.type === 'application/pdf') {
                      setContratoArchivo(file);
                    } else {
                      alert('Solo se permiten archivos PDF');
                    }
                  };
                  input.click();
                }}
                >
                  {contratoArchivo ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#dc3545' }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)' }}>
                          {contratoArchivo.name}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {(contratoArchivo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setContratoArchivo(null);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
                      <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '600' }}>
                        Arrastra tu archivo PDF aquí
                      </p>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        o haz clic para seleccionar
                      </p>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Máximo 10MB - Solo archivos PDF
                      </p>
                    </div>
                  )}
                </div>
                {predio?.contrato_archivo && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-file-pdf" style={{ color: '#dc3545' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Archivo actual: {predio.contrato_archivo}
                    </span>
                    <a 
                      href={`http://localhost:3001/uploads/predios/${predio.contrato_archivo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        marginLeft: 'auto'
                      }}
                    >
                      <i className="fas fa-external-link-alt" /> Ver
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Debug info */}
          {(fotoPerfil || fotoPortada || contratoArchivo || eliminarFotoPerfil || eliminarFotoPortada) && (
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              fontSize: '0.8rem',
              fontFamily: 'monospace'
            }}>
              <div style={{ color: '#00ff00', marginBottom: '0.5rem' }}>DEBUG - Estado de archivos:</div>
              {fotoPerfil && (
                <div style={{ color: '#ffff00' }}>📸 Foto Perfil: {fotoPerfil.name} ({(fotoPerfil.size / 1024).toFixed(1)} KB)</div>
              )}
              {fotoPortada && (
                <div style={{ color: '#ffff00' }}>🖼️ Foto Portada: {fotoPortada.name} ({(fotoPortada.size / 1024).toFixed(1)} KB)</div>
              )}
              {contratoArchivo && (
                <div style={{ color: '#ff6b6b' }}>📄 Contrato: {contratoArchivo.name} ({(contratoArchivo.size / 1024).toFixed(1)} KB)</div>
              )}
              {eliminarFotoPerfil && (
                <div style={{ color: '#ff0000' }}>🗑️ ELIMINAR Foto Perfil</div>
              )}
              {eliminarFotoPortada && (
                <div style={{ color: '#ff0000' }}>🗑️ ELIMINAR Foto Portada</div>
              )}
            </div>
          )}

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            paddingTop: '2rem',
            borderTop: '2px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '2px solid var(--border-color)',
                padding: '1rem 2rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="fas fa-times" style={{ marginRight: '0.5rem' }} />
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: submitStatus === 'success' ? '#28a745' : submitStatus === 'error' ? '#dc3545' : 'var(--gradient)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.8 : 1,
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {submitStatus === 'loading' && (
                <i className="fas fa-spinner fa-spin" />
              )}
              {submitStatus === 'success' && (
                <i className="fas fa-check" />
              )}
              {submitStatus === 'error' && (
                <i className="fas fa-exclamation-triangle" />
              )}
              {submitStatus === 'idle' && (
                <i className="fas fa-save" />
              )}
              
              {submitStatus === 'loading' && 'Guardando...'}
              {submitStatus === 'success' && '¡Guardado!'}
              {submitStatus === 'error' && 'Error al guardar'}
              {submitStatus === 'idle' && (isEditing ? 'Guardar Cambios' : 'Crear Predio')}
            </button>
          </div>
        </form>
        
        {/* Botón de scroll hacia abajo */}
        {showScrollButton && (
          <button
            type="button"
            onClick={scrollToBottom}
            style={{
              position: 'fixed',
              bottom: 'calc(5vh + 20px)',
              right: 'calc((100vw - 900px) / 2 + 20px)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #39ff14, #32cd32)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(57, 255, 20, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              transition: 'all 0.3s ease',
              animation: 'bounceIn 0.5s ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(57, 255, 20, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(57, 255, 20, 0.4)';
            }}
          >
            <i className="fas fa-chevron-down" style={{ 
              color: '#000', 
              fontSize: '1.2rem',
              animation: 'bounce 2s infinite'
            }} />
          </button>
        )}
      </div>
      
      <style>{`
        /* Scrollbar personalizado */
        div[style*="overflow: auto"]::-webkit-scrollbar {
          width: 12px;
        }
        
        div[style*="overflow: auto"]::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 10px;
          margin: 10px 0;
          border: 2px solid transparent;
        }
        
        div[style*="overflow: auto"]::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--primary-color), #32cd32);
          border-radius: 10px;
          border: 2px solid var(--bg-card);
          transition: all 0.3s ease;
        }
        
        div[style*="overflow: auto"]::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #32cd32, var(--primary-color));
          transform: scale(1.1);
        }
        
        /* Animaciones del botón */
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-3px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
};

export default FormularioPredio;