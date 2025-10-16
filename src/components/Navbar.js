import React from 'react';

const Navbar = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'agendar', label: 'Agendar Cita', icon: '📅' },
    { id: 'consultar', label: 'Mis Citas', icon: '📋' },
    { id: 'doctores', label: 'Doctores', icon: '👨‍⚕️' },
  ];

  return (
    <nav className="nav-tabs">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => onSectionChange(section.id)}
        >
          <span>
            {section.icon} {section.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default Navbar;