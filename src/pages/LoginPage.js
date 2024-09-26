// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Incluir credenciales solo para esta solicitud
    axios.defaults.withCredentials = true;

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.access_token);
            const userRole = jwt_decode(response.data.access_token).rol; // Cambiar a 'rol'
            
            if (userRole === 'admin') {
                navigate('/admin');
            } else if (userRole === 'docente') {
                navigate('/teacher');
            } else if (userRole === 'alumno') {
                navigate('/student');
            } else {
                setError('Rol de usuario no válido');
            }
        } catch (error) {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container">
            <h2>Inicio de Sesión</h2>
            <input
                type="text"
                id="username"
                name="username"
                placeholder="Usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
            />
            <input
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
            />
            <button onClick={handleLogin}>Iniciar Sesión</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default LoginPage;
