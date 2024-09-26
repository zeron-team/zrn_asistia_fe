// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Asegúrate de usar 'react-dom/client' en React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Crear el root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación con un único BrowserRouter
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
