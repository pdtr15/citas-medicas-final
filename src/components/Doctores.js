import React, { useState, useEffect } from 'react';
import { citasAPI } from '../services/api';

const Doctores = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDoctores();
  }, []);

  const cargarDoctores = async () => {
    try {
      setLoading(true);
      const response = await citasAPI.obtenerDoctores();
      if (response.data.success) {
        setDoctores(response.data.doctores);
      }
    } catch (error) {
      console.error('Error al cargar doctores:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section active">
      <h2>👨‍⚕️ Nuestros Doctores</h2>

      <div className="doctores-container">
        {doctores.length === 0 ? (
          <div className="mensaje mensaje-info">
            No hay doctores registrados
          </div>
        ) : (
          doctores.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <h3>{doctor.nombre}</h3>
              <p><strong>Especialidad:</strong> {doctor.especialidad}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Teléfono:</strong> {doctor.telefono}</p>
              <p><strong>Horario:</strong> {doctor.horario_inicio?.substring(0,5) || '08:00'} - {doctor.horario_fin?.substring(0,5) || '17:00'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Doctores;