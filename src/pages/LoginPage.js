// src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Importar contexto de autenticación

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();  // Traer la función login del AuthContext

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3355/api/auth/login', { username, password });
            const token = response.data.access_token;

            // Guardar el token en el contexto y en localStorage
            login(token);
            navigate('/home');  // Redirigir al home después del login
        } catch (error) {
            setError('Usuario o contraseña incorrectos');
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Inicio de Sesión</h2>
            <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario"
            />
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
            />
            <button onClick={handleLogin}>Iniciar Sesión</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default LoginPage;
