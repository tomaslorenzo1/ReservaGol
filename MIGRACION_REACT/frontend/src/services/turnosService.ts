import api from './authService';

export const turnosService = {
  // GET /turnos – Listar turnos disponibles
  async getTurnos() {
    const response = await api.get('/turnos');
    return response.data;
  },

  // POST /turnos – Crear nuevo turno
  async createTurno(turnoData: {
    cancha_id: number;
    usuario_id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
  }) {
    const response = await api.post('/turnos', turnoData);
    return response.data;
  },

  // PUT /turnos/:id – Modificar turno
  async updateTurno(id: number, turnoData: {
    estado?: string;
    fecha?: string;
    hora_inicio?: string;
    hora_fin?: string;
  }) {
    const response = await api.put(`/turnos/${id}`, turnoData);
    return response.data;
  },

  // DELETE /turnos/:id – Cancelar turno
  async deleteTurno(id: number) {
    const response = await api.delete(`/turnos/${id}`);
    return response.data;
  },

  // GET /mis-turnos/:usuario_id – Mostrar turnos de un usuario específico
  async getTurnosByUser(usuarioId: number) {
    const response = await api.get(`/turnos/usuario/${usuarioId}`);
    return response.data;
  }
};