import api from './authService';

export const prediosService = {
  // Obtener todos los predios
  async getPredios() {
    const response = await api.get('/predios');
    return response.data;
  },

  // Obtener predio por propietario
  async getPredioByPropietario(propietarioId: number) {
    const response = await api.get(`/predios/propietario/${propietarioId}`);
    return response.data;
  },

  // Crear nuevo predio
  async createPredio(predioData: any) {
    console.log('🚀 Enviando datos de creación al servidor:', predioData instanceof FormData ? 'FormData' : predioData);
    
    const response = await api.post('/predios', predioData);
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
  },

  // Actualizar predio
  async updatePredio(id: number, predioData: any) {
    console.log('🚀 Enviando datos de actualización al servidor:', predioData instanceof FormData ? 'FormData' : predioData);
    
    const response = await api.put(`/predios/${id}`, predioData);
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
  },

  // Obtener canchas de un predio
  async getCanchasByPredio(predioId: number) {
    const response = await api.get(`/canchas/predio/${predioId}`);
    return response.data;
  },

  // Obtener reservas de un predio
  async getReservasByPredio(predioId: number) {
    const response = await api.get(`/turnos/predio/${predioId}`);
    return response.data;
  },

  // Obtener estadísticas de un predio
  async getEstadisticasPredio(predioId: number) {
    const response = await api.get(`/predios/${predioId}/estadisticas`);
    return response.data;
  }
};