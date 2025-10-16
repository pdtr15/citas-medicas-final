import React, { useState, useEffect } from 'react';
import { citasAPI } from '../services/api';

const AgendarCita = () => {
  const [formData, setFormData] = useState({
    paciente_id: '',
    doctor_id: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [doctores, setDoctores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [doctoresRes, pacientesRes] = await Promise.all([
        citasAPI.obtenerDoctores(),
        citasAPI.obtenerPacientes()
      ]);

      if (doctoresRes.data.success) setDoctores(doctoresRes.data.doctores);
      if (pacientesRes.data.success) setPacientes(pacientesRes.data.pacientes);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar datos iniciales' });
    }
  };

  const cargarHorariosDisponibles = async (doctorId, fecha) => {
    if (!doctorId || !fecha) return;
    
    try {
      const response = await citasAPI.obtenerHorariosDisponibles(doctorId, fecha);
      if (response.data.success) {
        setHorariosDisponibles(response.data.horariosDisponibles);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar horarios disponibles' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'doctor_id' || name === 'fecha') {
      const doctorId = name === 'doctor_id' ? value : formData.doctor_id;
      const fecha = name === 'fecha' ? value : formData.fecha;
      cargarHorariosDisponibles(doctorId, fecha);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.paciente_id || !formData.doctor_id || !formData.fecha || !formData.hora) {
      setMessage({ type: 'error', text: 'Por favor complete todos los campos obligatorios' });
      return;
    }

    try {
      setLoading(true);
      const response = await citasAPI.agendarCita(formData);
      
      if (response.data.success) {
        setMessage({ 
          type: 'exito', 
          text: '¡Cita agendada exitosamente!' 
        });
        setFormData({
          paciente_id: '',
          doctor_id: '',
          fecha: '',
          hora: '',
          motivo: ''
        });
        setHorariosDisponibles([]);
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al conectar con el servidor' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section active">
      <h2>📅 Agendar Nueva Cita</h2>
      
      {message.text && (
        <div className={`mensaje mensaje-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="paciente_id">Paciente:</label>
            <select
              id="paciente_id"
              name="paciente_id"
              className="form-control"
              value={formData.paciente_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar paciente...</option>
              {pacientes.map(paciente => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doctor_id">Doctor:</label>
            <select
              id="doctor_id"
              name="doctor_id"
              className="form-control"
              value={formData.doctor_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar doctor...</option>
              {doctores.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nombre} - {doctor.especialidad}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              className="form-control"
              value={formData.fecha}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hora">Hora disponible:</label>
            <select
              id="hora"
              name="hora"
              className="form-control"
              value={formData.hora}
              onChange={handleInputChange}
              required
              disabled={!horariosDisponibles.length}
            >
              <option value="">Seleccionar hora...</option>
              {horariosDisponibles.map(hora => (
                <option key={hora} value={hora}>
                  {hora.substring(0, 5)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="motivo">Motivo de la consulta:</label>
            <textarea
              id="motivo"
              name="motivo"
              className="form-control"
              rows="3"
              value={formData.motivo}
              onChange={handleInputChange}
              placeholder="Describa brevemente el motivo de la consulta..."
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Agendando...' : '📅 Agendar Cita'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgendarCita;