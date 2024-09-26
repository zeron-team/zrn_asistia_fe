// frontend/src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import moment from 'moment'; // Asegúrate de tener instalado moment

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token de autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Obtener todos los usuarios
    axios.get('http://10.100.210.31:3355/api/users/all_users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        setError('Error al obtener los usuarios');
      });
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administración</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Fecha de Alta</th>
            <th>Último Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}> {/* Asegúrate de que el _id sea único */}
              <td>{user.usuario}</td>
              <td>{user.rol}</td>
              <td>{user.fecha_alta ? moment(user.fecha_alta).format('YYYY-MM-DD HH:mm:ss') : 'No disponible'}</td>
              <td>{user.ultimo_ingreso ? moment(user.ultimo_ingreso).format('YYYY-MM-DD HH:mm:ss') : 'No disponible'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
