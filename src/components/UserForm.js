import React, { useState } from 'react';

function UserForm({ onSubmit, initialData }) {
  const [username, setUsername] = useState(initialData ? initialData.username : '');
  const [password, setPassword] = useState(initialData ? initialData.password : '');
  const [role, setRole] = useState(initialData ? initialData.role : 'Alumno');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
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
      <button type="submit">Guardar</button>
    </form>
  );
}

export default UserForm;
