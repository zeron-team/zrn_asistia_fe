// frontend/src/components/SidebarMenu.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SidebarMenu.css';
import { FaHome, FaUser, FaChalkboardTeacher, FaUsers, FaChartPie, FaUserCog, FaSignOutAlt } from 'react-icons/fa';

const SidebarMenu = () => {
  const [openMenu, setOpenMenu] = useState({});

  const handleToggle = (menu) => {
    setOpenMenu((prevOpenMenu) => ({
      ...prevOpenMenu,
      [menu]: !prevOpenMenu[menu]
    }));
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/home">
            <FaHome className="icon" /> Inicio
          </Link>
        </li>
        <li>
          <button onClick={() => handleToggle('asistentes')}>
            <FaUsers className="icon" /> Asistentes
            <span className="toggle-icon">{openMenu.asistentes ? '▲' : '▼'}</span>
          </button>
          <ul className={`submenu ${openMenu.asistentes ? 'open' : ''}`}>
            <li>
              <Link to="/students">
                <FaUser className="icon" /> Alumnos
              </Link>
            </li>
            <li>
              <Link to="/teachers">
                <FaChalkboardTeacher className="icon" /> Docentes
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/dashboard">
            <FaChartPie className="icon" /> Dashboard
          </Link>
        </li>
        <li>
          <button onClick={() => handleToggle('administracion')}>
            <FaUserCog className="icon" /> Administración
            <span className="toggle-icon">{openMenu.administracion ? '▲' : '▼'}</span>
          </button>
          <ul className={`submenu ${openMenu.administracion ? 'open' : ''}`}>
            <li>
              <Link to="/user-management">
                <FaUser className="icon" /> ABM Usuarios
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/login">
            <FaSignOutAlt className="icon" /> Cerrar Sesión
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
