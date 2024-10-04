// src/components/SidebarMenu.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faChalkboardTeacher, faChartLine, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './SidebarMenu.css';

const SidebarMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirigir al login después de salir
  };

  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/home">
            <FontAwesomeIcon icon={faHome} /> <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to="/students">
            <FontAwesomeIcon icon={faUser} /> <span>Estudiantes</span>
          </Link>
        </li>
        <li>
          <Link to="/teachers">
            <FontAwesomeIcon icon={faChalkboardTeacher} /> <span>Docentes</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <FontAwesomeIcon icon={faChartLine} /> <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> <span>Salir</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
