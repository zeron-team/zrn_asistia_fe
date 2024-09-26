import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Alumno');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        '/api/users/create',
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers([...users, response.data.user]);
      setUsername('');
      setPassword('');
      setRole('Alumno');
    } catch (error) {
      console.error('Error al crear usuario', error);
    }
  };

  return (
    <div className="user-management-container">
      <h2>Gestión de Usuarios</h2>
      <input
        type="text"
        placeholder="Nombre de Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="Admin">Admin</option>
        <option value="Docente">Docente</option>
        <option value="Alumno">Alumno</option>
      </select>
      <button onClick={handleCreateUser}>Crear Usuario</button>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagementPage;
