// frontend/src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, PieController } from 'chart.js';
import './Home.css';

// Registrar componentes de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, PieController);

const Dashboard = () => {
  const [usuariosRegistrados, setUsuariosRegistrados] = useState(0);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  const [usuariosConectadosPorDia, setUsuariosConectadosPorDia] = useState([]);
  const [temasFrecuentes, setTemasFrecuentes] = useState([]);
  const [seleccionTokens, setSeleccionTokens] = useState([]);

  // Obtener el token JWT almacenado en localStorage o donde lo tengas almacenado
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`, // Corregido
        };

        const resUsuarios = await axios.get('http://10.100.210.241:3355/api/users/kpi/usuarios_registrados', { headers });
        const resActivos = await axios.get('http://10.100.210.241:3355/api/users/kpi/usuarios_activos', { headers });
        const resGrafico = await axios.get('http://10.100.210.241:3355/api/users/grafico/usuarios_conectados_por_dia', { headers });
        const resTemas = await axios.get('http://10.100.210.241:3355/api/users/grafico/temas_frecuentes', { headers });
        const resTokens = await axios.get('http://10.100.210.241:3355/api/users/grafico/seleccion_tokens', { headers });

        setUsuariosRegistrados(resUsuarios.data.total_usuarios);
        setUsuariosActivos(resActivos.data.usuarios_activos);
        setUsuariosConectadosPorDia(resGrafico.data);
        setTemasFrecuentes(resTemas.data);
        setSeleccionTokens(resTokens.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchKpis();
  }, [token]);

  // Datos para el gráfico de usuarios conectados por día
  const lineChartData = {
    labels: usuariosConectadosPorDia.map((item) => item.dia),
    datasets: [
      {
        label: 'Usuarios Conectados',
        data: usuariosConectadosPorDia.map((item) => item.total),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de temas más consultados
  const temasChartData = {
    labels: temasFrecuentes.map((item) => item.tema),
    datasets: [
      {
        label: 'Temas más consultados',
        data: temasFrecuentes.map((item) => item.total),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de selección de tokens
  const tokensChartData = {
    labels: seleccionTokens.map((item) => `${item.tokens} tokens`),
    datasets: [
      {
        label: 'Selección de Tokens',
        data: seleccionTokens.map((item) => item.total),
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Indicadores Clave</h1>

      <div className="kpis">
        <div className="kpi">
          <h3>Usuarios Registrados</h3>
          <p>{usuariosRegistrados}</p>
        </div>
        <div className="kpi">
          <h3>Usuarios Conectados Hoy</h3>
          <p>{usuariosActivos}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart">
          <h3>Usuarios Conectados por Día</h3>
          <Line data={lineChartData} />
        </div>
        <div className="chart">
          <h3>Temas más Consultados</h3>
          <Bar data={temasChartData} />
        </div>
        <div className="chart">
          <h3>Selección de Tokens</h3>
          <Pie data={tokensChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
