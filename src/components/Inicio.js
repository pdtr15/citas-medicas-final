import React, { useState, useEffect } from 'react';
import { citasAPI } from '../services/api';

const Inicio = () => {
  const [stats, setStats] = useState({
    citasTotales: 0,
    doctoresDisponibles: 0,
    citasHoy: 0,
    pacientesActivos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [citasRes, doctoresRes, pacientesRes] = await Promise.all([
        citasAPI.obtenerCitas(),
        citasAPI.obtenerDoctores(),
        citasAPI.obtenerPacientes()
      ]);

      const citas = citasRes.data.citas || [];
      const doctores = doctoresRes.data.doctores || [];
      const pacientes = pacientesRes.data.pacientes || [];
      
      const hoy = new Date().toISOString().split('T')[0];
      const citasHoy = citas.filter(cita => cita.fecha === hoy && cita.estado !== 'cancelada').length;

      setStats({
        citasTotales: citas.length,
        doctoresDisponibles: doctores.filter(d => d.estado === 'activo').length,
        citasHoy,
        pacientesActivos: pacientes.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section active">
      <div style={{ textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: '20px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5em', color: 'var(--secondary)', marginBottom: '20px' }}>
          Bienvenido al Sistema de Citas Médicas
        </h2>
        <p style={{ fontSize: '1.2em', color: 'var(--gray)', maxWidth: '600px', margin: '0 auto' }}>
          Gestiona tus citas médicas de forma fácil y rápida
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.citasTotales}</span>
          <span className="stat-label">Citas Totales</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{stats.doctoresDisponibles}</span>
          <span className="stat-label">Doctores Disponibles</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{stats.citasHoy}</span>
          <span className="stat-label">Citas Hoy</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{stats.pacientesActivos}</span>
          <span className="stat-label">Pacientes Activos</span>
        </div>
      </div>
    </div>
  );
};

export default Inicio;