// src/components/SidebarMenu.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faHome, faUser, faChalkboardTeacher, faChartLine, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" className="sidebar-logo" />
      </div>
      <h2>Menú</h2>
      <ul>
        <li>
          <Link to="/home">
            <FontAwesomeIcon icon={faHome} /> <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to="/students">
            <FontAwesomeIcon icon={faUserGraduate} /> <span>Estudiantes</span>
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
          <Link to="/user-management">
            <FontAwesomeIcon icon={faUser} /> <span>Usuarios</span>
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
