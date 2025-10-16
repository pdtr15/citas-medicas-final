import React, { useState, useEffect } from 'react';
import { citasAPI } from '../services/api';

const ConsultarCitas = () => {
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    filtrarCitas();
  }, [citas, busqueda]);

  const cargarCitas = async () => {
    try {
      setLoading(true);
      const response = await citasAPI.obtenerCitas();
      if (response.data.success) {
        setCitas(response.data.citas);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar las citas' });
    } finally {
      setLoading(false);
    }
  };

  const filtrarCitas = () => {
    if (!busqueda.trim()) {
      setCitasFiltradas(citas);
      return;
    }

    const filtradas = citas.filter(cita =>
      cita.paciente_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.doctor_nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setCitasFiltradas(filtradas);
  };

  const cancelarCita = async (citaId) => {
    if (!window.confirm('¿Está seguro de que desea cancelar esta cita?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await citasAPI.cancelarCita(citaId);
      if (response.data.success) {
        setMessage({ type: 'exito', text: 'Cita cancelada exitosamente' });
        await cargarCitas();
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al cancelar la cita' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section active">
      <h2>📋 Citas Agendadas</h2>

      {message.text && (
        <div className={`mensaje mensaje-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="filtros">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por paciente o doctor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="citas-container">
        {citasFiltradas.length === 0 ? (
          <div className="mensaje mensaje-info">
            {busqueda ? 'No se encontraron citas que coincidan con la búsqueda' : 'No hay citas agendadas'}
          </div>
        ) : (
          citasFiltradas.map(cita => (
            <div key={cita.id} className="cita-card">
              <div className="cita-header">
                <h3>Cita #{cita.id}</h3>
                <span className={`estado estado-${cita.estado}`}>
                  {cita.estado.toUpperCase()}
                </span>
              </div>
              
              <div className="cita-info">
                <p><strong>Paciente:</strong> {cita.paciente_nombre}</p>
                <p><strong>Doctor:</strong> {cita.doctor_nombre} ({cita.especialidad})</p>
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora.substring(0, 5)}</p>
                
                {cita.motivo && (
                  <p><strong>Motivo:</strong> {cita.motivo}</p>
                )}
              </div>

              <div className="cita-acciones">
                <button
                  className="btn btn-secondary"
                  onClick={() => cancelarCita(cita.id)}
                  disabled={cita.estado === 'cancelada'}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsultarCitas;