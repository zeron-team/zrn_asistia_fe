import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';  // Opcional, si deseas agregar estilos específicos

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <Link to="/admin">Inicio</Link>
        </li>
        <li>
          <Link to="/admin/users">Gestión de Usuarios</Link>
        </li>
        <li>
          <Link to="/admin/thesaurus">Thesauro</Link>
        </li>
        {/* Añadir más enlaces según sea necesario */}
      </ul>
    </aside>
  );
}

export default Sidebar;
