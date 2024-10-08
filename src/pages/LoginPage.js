//frontend/sec/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import './LoginPage.css';  // Agregamos un archivo CSS para el diseño

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://10.100.210.241:3355/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.access_token);
            const userRole = jwt_decode(response.data.access_token).rol;
    
            if (userRole === 'admin') {
                navigate('/home');
            } else if (userRole === 'docente') {
                navigate('/teachers');
            } else if (userRole === 'alumno') {
                navigate('/students');
            } else {
                setError('Rol de usuario no válido');
            }
        } catch (error) {
            setError('Usuario o contraseña incorrectos');
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/images/logo.png" alt="Logo" className="login-logo" />
                <h2>Inicio de Sesión</h2>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario"
                    required
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <button onClick={handleLogin}>Iniciar Sesión</button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;
