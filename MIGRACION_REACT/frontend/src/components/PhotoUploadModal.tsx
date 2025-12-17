import React, { useState, useRef, useCallback } from 'react';
import { uploadService } from '../services/uploadService';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  predioId: number;
  tipo: 'portada' | 'perfil';
  currentPhoto?: string;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  predioId,
  tipo,
  currentPhoto
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    console.log('Archivo seleccionado:', file.name, file.type, file.size);
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no puede ser mayor a 5MB');
      return;
    }

    setError('');
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('Preview creado exitosamente');
      setPreview(e.target?.result as string);
    };
    reader.onerror = () => {
      console.error('Error creando preview');
      setError('Error al procesar la imagen');
    };
    reader.readAsDataURL(file);

    // Subir archivo
    try {
      setIsUploading(true);
      console.log('Iniciando subida de archivo...');
      const result = await uploadService.subirFotoPredio(file, predioId, tipo);
      console.log('Resultado de subida:', result);
      onSuccess(result.url);
      // No cerrar automáticamente para permitir más cambios
      // onClose();
    } catch (error: any) {
      console.error('Error subiendo archivo:', error);
      setError(error.response?.data?.error || error.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  }, [predioId, tipo, onSuccess, onClose]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhoto) return;
    
    try {
      setIsUploading(true);
      console.log('Eliminando foto:', currentPhoto);
      await uploadService.eliminarFotoPredio(predioId, tipo);
      console.log('Foto eliminada exitosamente');
      onSuccess('');
      // No cerrar automáticamente para permitir más cambios
      // onClose();
    } catch (error: any) {
      console.error('Error eliminando foto:', error);
      setError(error.response?.data?.error || error.message || 'Error al eliminar la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

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
      padding: '2rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '2px solid var(--primary-color)',
        boxShadow: '0 20px 40px rgba(57, 255, 20, 0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-camera" style={{ color: 'var(--primary-color)' }}></i>
            {tipo === 'portada' ? 'Foto de Portada' : 'Foto de Perfil'}
          </h3>
          <button 
            onClick={onClose}
            disabled={isUploading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            color: '#ff6b6b',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        {/* Preview de imagen actual */}
        {currentPhoto && !preview && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              Imagen actual:
            </p>
            <div style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid var(--border-color)'
            }}>
              <img 
                src={uploadService.getImageUrl(currentPhoto) || ''} 
                alt="Imagen actual"
                style={{
                  width: '100%',
                  height: tipo === 'portada' ? '150px' : '200px',
                  objectFit: 'cover'
                }}
                onLoad={() => console.log('Imagen cargada exitosamente:', currentPhoto)}
                onError={(e) => {
                  console.error('Error cargando imagen:', currentPhoto, 'URL completa:', uploadService.getImageUrl(currentPhoto));
                  e.currentTarget.style.display = 'none';
                }}
              />
              <button
                onClick={handleRemovePhoto}
                disabled={isUploading}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 107, 107, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff6b6b';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 107, 107, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        )}

        {/* Preview de nueva imagen */}
        {preview && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              Vista previa:
            </p>
            <img 
              src={preview} 
              alt="Vista previa"
              style={{
                width: '100%',
                height: tipo === 'portada' ? '150px' : '200px',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '2px solid var(--primary-color)'
              }}
              onLoad={() => console.log('Preview mostrado exitosamente')}
              onError={() => console.error('Error mostrando preview')}
            />
          </div>
        )}

        {/* Zona de drag & drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `3px dashed ${isDragging ? 'var(--primary-color)' : 'var(--border-color)'}`,
            borderRadius: '15px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: isDragging ? 'rgba(57, 255, 20, 0.1)' : 'var(--bg-secondary)',
            transform: isDragging ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          {isUploading ? (
            <div>
              <i className="fas fa-spinner fa-spin" style={{ 
                fontSize: '3rem', 
                color: 'var(--primary-color)', 
                marginBottom: '1rem' 
              }}></i>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Subiendo imagen...
              </h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Por favor espera
              </p>
            </div>
          ) : (
            <div>
              <i className="fas fa-cloud-upload-alt" style={{ 
                fontSize: '3rem', 
                color: isDragging ? 'var(--primary-color)' : 'var(--text-muted)', 
                marginBottom: '1rem',
                transition: 'color 0.3s ease'
              }}></i>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: 'var(--text-primary)',
                fontSize: '1.2rem'
              }}>
                {isDragging ? '¡Suelta la imagen aquí!' : 'Arrastra tu imagen aquí'}
              </h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
                o haz clic para seleccionar desde tu dispositivo
              </p>
              <div style={{
                background: 'var(--gradient)',
                color: 'var(--bg-dark)',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                transition: 'transform 0.3s ease'
              }}>
                <i className="fas fa-folder-open"></i>
                Seleccionar Archivo
              </div>
            </div>
          )}
        </div>

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={isUploading}
        />

        {/* Información adicional */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: '10px',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }}></i>
            <strong>Información:</strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>Formatos soportados: JPG, PNG, GIF, WebP</li>
            <li>Tamaño máximo: 5MB</li>
            <li>Resolución recomendada: {tipo === 'portada' ? '1200x400px' : '400x400px'}</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoUploadModal;