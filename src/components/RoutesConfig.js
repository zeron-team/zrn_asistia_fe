// src/components/RoutesConfig.js
import React from 'react';
import { useRoutes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PrivateRoute from './components/PrivateRoute';

function RoutesConfig() {
  const routes = useRoutes([
    { path: '/login', element: <LoginPage /> },
    {
      path: '/admin',
      element: <PrivateRoute element={<AdminDashboard />} roles={['admin']} />,
    },
    {
      path: '/teacher',
      element: <PrivateRoute element={<TeacherDashboard />} roles={['docente']} />,
    },
    {
      path: '/student',
      element: <PrivateRoute element={<StudentDashboard />} roles={['alumno']} />,
    },
    { path: '*', element: <h1>404 - Página No Encontrada</h1> },
  ]);

  return routes;
}

export default RoutesConfig;
