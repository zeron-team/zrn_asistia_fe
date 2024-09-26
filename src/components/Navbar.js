import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';  // Opcional, si deseas agregar estilos específicos

function Navbar() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Asistente Educativo</Link>
      </div>
      <div className="navbar-links">
        <Link to="/admin">Admin</Link>
        <Link to="/teacher">Docente</Link>
        <Link to="/student">Alumno</Link>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;
