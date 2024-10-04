import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // Font icons for actions
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

  const handleView = (userId) => {
    navigate(`/view-user/${userId}`); // Ensure this route is defined
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`); // Ensure this route is defined
  };

  const handleDelete = (userId) => {
    axios.delete(`http://10.100.210.31:3355/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(() => {
        setError('Error al borrar el usuario');
      });
  };

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
            <th>Acciones</th> {/* Nueva columna para acciones */}
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
                <FaEye onClick={() => handleView(user._id)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                <FaEdit onClick={() => handleEdit(user._id)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                <FaTrash onClick={() => handleDelete(user._id)} style={{ cursor: 'pointer', color: 'red' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard; // Ensure the export is correct
