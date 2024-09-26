import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="notfound-container">
      <h2>404 - Página No Encontrada</h2>
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
}

export default NotFoundPage;
