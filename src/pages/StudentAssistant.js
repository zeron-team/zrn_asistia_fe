import React, { useState } from 'react';
import axios from 'axios';

function StudentAssistant() {
  const [nivel, setNivel] = useState('');
  const [ciclo, setCiclo] = useState('');
  const [grado, setGrado] = useState('');
  const [area, setArea] = useState('');
  const [tema, setTema] = useState('');
  const [explicacion, setExplicacion] = useState('');

  const getExplanation = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/api/assistant/explain', 
        { nivel, ciclo, grado, area, tema }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExplicacion(response.data.explicacion);
    } catch (error) {
      console.error('Error al obtener explicación', error);
    }
  };

  return (
    <div className="assistant-container">
      <h2>Asistente de Alumno</h2>
      <select onChange={e => setNivel(e.target.value)}>
        <option value="">Seleccione Nivel</option>
        <option value="primaria">Primaria</option>
        <option value="secundaria">Secundaria</option>
      </select>
      <select onChange={e => setCiclo(e.target.value)}>
        <option value="">Seleccione Ciclo</option>
        <option value="primer_ciclo">Primer Ciclo</option>
        <option value="segundo_ciclo">Segundo Ciclo</option>
      </select>
      <select onChange={e => setGrado(e.target.value)}>
        <option value="">Seleccione Grado</option>
        {/* Opciones de grado */}
      </select>
      <select onChange={e => setArea(e.target.value)}>
        <option value="">Seleccione Área</option>
        {/* Opciones de áreas */}
      </select>
      <input type="text" placeholder="Tema" value={tema} onChange={e => setTema(e.target.value)} />
      <button onClick={getExplanation}>Obtener Explicación</button>
      <p>{explicacion}</p>
    </div>
  );
}

export default StudentAssistant;
