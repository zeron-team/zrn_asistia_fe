// src/axiosConfig.js
import axios from 'axios';

axios.defaults.withCredentials = true;

// Configuración adicional de axios si es necesario
axios.defaults.baseURL = 'http://10.100.210.31:3355';

// Exportar la instancia de axios configurada
export default axios;
