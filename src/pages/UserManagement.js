//frontend/src/pages/UserManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import './AdminDashboard.css';
import moment from 'moment';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    axios.get('http://10.100.210.241:3355/api/users/all_users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        setError('Error al obtener los usuarios');
      });
  }, [navigate]);

  // Handler para cerrar sesión
  const handleLogout = () => {
    const token = localStorage.getItem('token');
    axios.post('http://10.100.210.241:3355/api/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      localStorage.removeItem('token');
      navigate('/login');
    })
    .catch(error => {
      setError('Error al cerrar sesión');
    });
  };

  // Handler para eliminar usuario
  const handleDelete = (userId) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://10.100.210.241:3355/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      // Filtrar el usuario eliminado del estado
      setUsers(users.filter(user => user._id !== userId));
    })
    .catch(error => {
      setError('Error al eliminar el usuario');
    });
  };

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administración</h2>
      { /*<button onClick={handleLogout}>Cerrar Sesión</button>
      {error && <p className="error">{error}</p>}*/}
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Fecha de Alta</th>
            <th>Último Ingreso</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.usuario}</td>
              <td>{user.rol}</td>
              <td>{user.fecha_alta ? moment(user.fecha_alta).format('YYYY-MM-DD HH:mm:ss') : 'No disponible'}</td>
              <td>{user.ultimo_ingreso ? moment(user.ultimo_ingreso).format('YYYY-MM-DD HH:mm:ss') : 'No disponible'}</td>
              <td>
                {user.ultimo_ingreso ? (
                  <span style={{color: 'green'}}>🟢</span>
                ) : (
                  <span style={{color: 'red'}}>🔴</span>
                )}
              </td>
              <td>
                <FaEye onClick={() => navigate(`/view-user/${user._id}`)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                <FaEdit onClick={() => navigate(`/edit-user/${user._id}`)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                <FaTrash onClick={() => handleDelete(user._id)} style={{ cursor: 'pointer', color: 'red' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
