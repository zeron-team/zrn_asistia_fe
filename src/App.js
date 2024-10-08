// src/App.js

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {isAuthenticated && window.location.pathname !== '/login' && <SidebarMenu />}
      {isAuthenticated && window.location.pathname !== '/login' && <Header />}
      <div className={`main-content ${!isAuthenticated ? 'centered-content' : ''}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={
            <PrivateRoute roles={['admin', 'docente', 'alumno']}>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/students" element={
            <PrivateRoute roles={['admin', 'docente', 'alumno']}>
              <Students />
            </PrivateRoute>
          } />
          <Route path="/teachers" element={
            <PrivateRoute roles={['admin', 'docente']}>
              <Teachers />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute roles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/user-management" element={
            <PrivateRoute roles={['admin']}>
              <UserManagement />
            </PrivateRoute>
          } />
          <Route path="/admin-dashboard" element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        {isAuthenticated && window.location.pathname !== '/login' && <Footer />}
      </div>
    </div>
  );
}

export default App;
