import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('API URL configurada:', API_URL); // Debug

const api = axios.create({
  baseURL: API_URL,
  // No establecer Content-Type por defecto para permitir FormData
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Solo establecer Content-Type para JSON si no es FormData
  if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: {
    nombre: string;
    email: string;
    password: string;
    tipo: string;
    telefono?: string;
    direccion?: string;
  }) {
    const response = await api.post('/usuarios', userData);
    return response.data;
  }
};

export default api;