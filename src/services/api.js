import axios from 'axios';

// URL base de tu backend en Render
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://citas-medicas-backend-ryx0.onrender.com/api/citas';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // clave para que Express lea req.body
  },
  withCredentials: true, // si luego usas cookies/sesiones
});

// Funciones para interactuar con tu backend
export const citasAPI = {
  // Agendar nueva cita
  agendarCita: async (citaData) => {
    // citaData debe tener: paciente_id, doctor_id, fecha, hora, motivo
    return await api.post('/agendar', citaData);
  },

  // Obtener todas las citas
  obtenerCitas: async () => {
    return await api.get('/');
  },

  // Obtener horarios disponibles de un doctor en una fecha
  obtenerHorariosDisponibles: async (doctorId, fecha) => {
    return await api.get(`/horarios-disponibles/${doctorId}/${fecha}`);
  },

  // Reprogramar cita
  reprogramarCita: async (citaId, nuevaFecha, nuevaHora) => {
    return await api.put(`/reprogramar/${citaId}`, { fecha: nuevaFecha, hora: nuevaHora });
  },

  // Cancelar cita
  cancelarCita: async (citaId) => {
    return await api.put(`/cancelar/${citaId}`);
  },

  // Obtener doctores
  obtenerDoctores: async () => {
    return await api.get('/doctores');
  },

  // Obtener pacientes
  obtenerPacientes: async () => {
    return await api.get('/pacientes');
  },
};

export default api;
