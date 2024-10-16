//frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Importa correctamente jwt-decode
import './LoginPage.css';  // Agregamos un archivo CSS para el diseño

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://10.100.210.241:3355/api/auth/login', 
                { username, password },
                { withCredentials: true }  // Envío de credenciales (cookies)
            );

            // Guarda el token en localStorage
            const token = response.data.access_token;
            localStorage.setItem('token', token);

            // Decodifica el token para obtener el rol del usuario
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.rol;
    
            // Redirige según el rol del usuario
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
            // Muestra un mensaje de error si hay un problema con la autenticación
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
