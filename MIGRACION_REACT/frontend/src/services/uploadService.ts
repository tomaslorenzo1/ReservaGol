import api from './authService';

export const uploadService = {
  // Subir foto de predio
  async subirFotoPredio(file: File, predioId: number, tipo: 'portada' | 'perfil') {
    const formData = new FormData();
    formData.append('foto', file);
    formData.append('predio_id', predioId.toString());
    formData.append('tipo', tipo);

    const response = await api.post('/upload/predio-foto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Eliminar foto de predio
  async eliminarFotoPredio(predioId: number, tipo: 'portada' | 'perfil') {
    const response = await api.delete('/upload/eliminar-foto', {
      data: {
        predio_id: predioId,
        tipo: tipo
      }
    });

    return response.data;
  },

  // Obtener URL completa de la imagen
  getImageUrl(relativePath: string) {
    if (!relativePath) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Construir URL completa
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';
    
    // Asegurar que la ruta comience con /
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    
    return `${baseUrl}${cleanPath}`;
  }
};