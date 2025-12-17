import React, { useState } from 'react';
import { uploadService } from '../services/uploadService';

const TestUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecciona un archivo primero');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      // Usar predio_id = 1 para prueba
      const response = await uploadService.subirFotoPredio(file, 1, 'portada');
      setResult(response);
      console.log('Upload exitoso:', response);
    } catch (err: any) {
      console.error('Error en upload:', err);
      setError(err.response?.data?.error || err.message || 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      padding: '20px',
      border: '2px solid #ccc',
      borderRadius: '10px',
      zIndex: 9999,
      maxWidth: '300px',
      color: 'black'
    }}>
      <h3>Test Upload</h3>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      
      {file && (
        <p style={{ fontSize: '12px', marginBottom: '10px' }}>
          Archivo: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}
      
      <button 
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          background: uploading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        {uploading ? 'Subiendo...' : 'Subir'}
      </button>
      
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          marginBottom: '10px'
        }}>
          Error: {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          background: '#e8f5e8', 
          color: '#2e7d32', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <p>¡Éxito!</p>
          <p>URL: {result.url}</p>
          {result.url && (
            <img 
              src={uploadService.getImageUrl(result.url) || ''} 
              alt="Uploaded" 
              style={{ width: '100%', marginTop: '10px', borderRadius: '5px' }}
              onError={() => console.error('Error cargando imagen de prueba')}
              onLoad={() => console.log('Imagen de prueba cargada correctamente')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TestUpload;