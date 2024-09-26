// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // No necesitamos importar BrowserRouter aquí
import SidebarMenu from './components/SidebarMenu';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <div className="App">
      {isAuthenticated() && <SidebarMenu />} {/* Muestra el menú lateral solo si el usuario está autenticado */}
      <div className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas privadas */}
          <Route
            path="/home"
            element={
              <PrivateRoute roles={['admin', 'docente', 'alumno']}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute roles={['admin', 'docente']}>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <PrivateRoute roles={['admin', 'docente']}>
                <Teachers />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <PrivateRoute roles={['admin']}>
                <UserManagement />
              </PrivateRoute>
            }
          />

          {/* Redirige a /home si el usuario está autenticado, de lo contrario, a /login */}
          <Route path="*" element={<Navigate to={isAuthenticated() ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
