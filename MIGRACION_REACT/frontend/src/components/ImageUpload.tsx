import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  label: string;
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // en MB
  width?: string;
  height?: string;
  icon?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  currentImage,
  onImageChange,
  accept = "image/*",
  maxSize = 5,
  width = "100%",
  height = "200px",
  icon = "fas fa-image"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  // Actualizar preview cuando cambie currentImage
  React.useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      setError(`La imagen debe ser menor a ${maxSize}MB`);
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Notificar cambio
    onImageChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ width }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.5rem', 
        color: 'var(--text-secondary)',
        fontWeight: '600'
      }}>
        {label}
      </label>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          width: '100%',
          height,
          border: `2px dashed ${isDragging ? 'var(--primary-color)' : error ? '#dc3545' : 'var(--border-color)'}`,
          borderRadius: '12px',
          background: isDragging ? 'var(--primary-color)10' : 'var(--bg-secondary)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {preview ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            >
              <i className="fas fa-times" style={{ color: 'white', fontSize: '12px' }} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
              color: 'white',
              padding: '10px',
              fontSize: '0.8rem'
            }}>
              <i className="fas fa-edit" style={{ marginRight: '5px' }} />
              Clic para cambiar imagen
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            color: isDragging ? 'var(--primary-color)' : 'var(--text-muted)'
          }}>
            <i className={icon} style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              color: isDragging ? 'var(--primary-color)' : 'var(--text-muted)'
            }} />
            <p style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '1.1rem',
              color: 'var(--text-primary)'
            }}>
              {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              Formatos: JPG, PNG, GIF • Máximo {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p style={{
          color: '#dc3545',
          fontSize: '0.8rem',
          margin: '0.5rem 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <i className="fas fa-exclamation-triangle" />
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;