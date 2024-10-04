import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
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

  // Handler for editing a user
  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`); // Cambia la ruta según tu configuración
  };

  // Handler for deleting a user
  const handleDelete = (userId) => {
    // Aquí puedes implementar la lógica de eliminación
    axios.delete(`http://10.100.210.31:3355/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => {
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(error => {
        setError('Error al eliminar el usuario');
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
                <FaEye onClick={() => navigate(`/view-user/${user._id}`)} style={{ cursor: 'pointer', marginRight: '10px' }} />
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

export default AdminDashboard;
