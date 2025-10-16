import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import AgendarCita from './components/AgendarCita';
import ConsultarCitas from './components/ConsultarCitas';
import Doctores from './components/Doctores';
import './styles/App.css';

function App() {
  const [activeSection, setActiveSection] = useState('inicio');

  const renderSection = () => {
    switch (activeSection) {
      case 'inicio':
        return <Inicio />;
      case 'agendar':
        return <AgendarCita />;
      case 'consultar':
        return <ConsultarCitas />;
      case 'doctores':
        return <Doctores />;
      default:
        return <Inicio />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🏥 Sistema de Citas Médicas</h1>
          <p>Gestiona tus citas médicas de forma fácil y rápida</p>
          <Navbar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>
      </header>
      
      <main>
        {renderSection()}
      </main>
    </div>
  );
}

export default App;