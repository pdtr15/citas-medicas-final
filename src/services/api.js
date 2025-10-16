import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://citas-medicas-backend-ryx0.onrender.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const citasAPI = {
  agendarCita: (citaData) => api.post('/agendar', citaData),
  obtenerCitas: () => api.get('/'),
  obtenerHorariosDisponibles: (doctorId, fecha) => 
    api.get(`/horarios-disponibles/${doctorId}/${fecha}`),
  reprogramarCita: (citaId, nuevaFecha, nuevaHora) => 
    api.put(`/reprogramar/${citaId}`, { fecha: nuevaFecha, hora: nuevaHora }),
  cancelarCita: (citaId) => api.put(`/cancelar/${citaId}`),
  obtenerDoctores: () => api.get('/doctores'),
  obtenerPacientes: () => api.get('/pacientes'),
};

export default api;