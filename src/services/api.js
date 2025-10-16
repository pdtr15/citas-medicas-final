import axios from 'axios';

// URL base de tu backend en Render, usando variable de entorno de Netlify
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://citas-medicas-backend-ryx0.onrender.com/api/citas';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // si luego usas cookies/sesiones
});

// Funciones para interactuar con tu backend
export const citasAPI = {
  // Agendar nueva cita
  agendarCita: (citaData) => api.post('/agendar', citaData),

  // Obtener todas las citas
  obtenerCitas: () => api.get('/'),

  // Obtener horarios disponibles de un doctor en una fecha
  obtenerHorariosDisponibles: (doctorId, fecha) => 
    api.get(`/horarios-disponibles/${doctorId}/${fecha}`),

  // Reprogramar cita
  reprogramarCita: (citaId, nuevaFecha, nuevaHora) => 
    api.put(`/reprogramar/${citaId}`, { fecha: nuevaFecha, hora: nuevaHora }),

  // Cancelar cita
  cancelarCita: (citaId) => api.put(`/cancelar/${citaId}`),

  // Obtener doctores
  obtenerDoctores: () => api.get('/doctores'),

  // Obtener pacientes
  obtenerPacientes: () => api.get('/pacientes'),
};

export default api;
