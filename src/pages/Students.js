import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Students.css';
import thesaurusData from '../data/thesauro_ps.js';

const Students = () => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [nivel, setNivel] = useState('');
  const [grado, setGrado] = useState('');
  const [area, setArea] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tema, setTema] = useState('');
  const [areas, setAreas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [temas, setTemas] = useState([]);
  const [explicacion, setExplicacion] = useState('');
  const [cuestionario, setCuestionario] = useState('');
  const [respuestas, setRespuestas] = useState('');

  const handleLevelSelection = (level) => {
    setSelectedLevel(level);
    setNivel(level);
    setGrado('');
    setArea('');
    setDisciplina('');
    setTema('');
    setAreas([]);
    setDisciplinas([]);
    setTemas([]);
    setExplicacion('');
    setCuestionario('');
    setRespuestas('');
  };

  useEffect(() => {
    if (nivel && grado) {
      const areasDisponibles = thesaurusData[nivel]?.areas || {};
      const areasFiltradas = Object.keys(areasDisponibles).filter(areaKey => {
        return areasDisponibles[areaKey].grados[grado];
      });
      setAreas(areasFiltradas);
    }
  }, [nivel, grado]);

  useEffect(() => {
    if (area && nivel && grado) {
      const disciplinasDisponibles = thesaurusData[nivel]?.areas[area]?.grados[grado]?.disciplinas || [];
      setDisciplinas(disciplinasDisponibles);
    }
  }, [area, nivel, grado]);

  useEffect(() => {
    if (disciplina && area && nivel && grado) {
      const temasDisponibles = thesaurusData[nivel]?.areas[area]?.grados[grado]?.temas[disciplina.toLowerCase()] || [];
      setTemas(temasDisponibles);
    }
  }, [disciplina, area, nivel, grado]);

  const obtenerExplicacion = async (tokens) => {
    if (tema && area && disciplina && nivel && grado) {
      try {
        const response = await axios.post(
          'http://localhost:3355/api/openai/explicacion',
          { nivel, grado, area, disciplina, tema, tokens },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const formattedExplicacion = response.data.explicacion
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Convertir texto en negrita
          .replace(/(\d+\.\s)/g, '<br/><br/>$1')  // Saltos de línea antes de los números
          .replace(/(\s-\s)/g, '<br/>- ')  // Saltos de línea antes de cada guion
          .replace(/Por ejemplo:/g, '<br/><strong>Por ejemplo:</strong>')  // Formatear ejemplos
          .replace(/\.\s/g, '.<br/><br/>')  // Saltos de línea después de cada punto
          .replace('¿Tienes alguna otra pregunta sobre este tema?', '');  // Eliminar frase final innecesaria

        setExplicacion(formattedExplicacion);
      } catch (error) {
        console.error('Error al obtener explicación:', error);
        setExplicacion('No se pudo generar la explicación en este momento.');
      }
    }
  };

  const generarCuestionario = async () => {
    if (tema && area && disciplina && nivel && grado) {
      try {
        const response = await axios.post(
          'http://localhost:3355/api/openai/cuestionario',
          { nivel, grado, area, disciplina, tema },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const formattedCuestionario = formatCuestionario(response.data.cuestionario);  // Aplicamos formato al cuestionario
        const respuestas = extraerRespuestas(response.data.cuestionario);  // Extraemos las respuestas correctas
        setCuestionario(formattedCuestionario);
        setRespuestas(respuestas);  // Guardamos las respuestas correctas
      } catch (error) {
        console.error('Error al generar cuestionario:', error);
        setCuestionario('No se pudo generar el cuestionario en este momento.');
        setRespuestas('');
      }
    }
  };

  // Función para formatear el cuestionario
  const formatCuestionario = (cuestionario) => {
    return cuestionario
      .replace(/(\d+\.\s)/g, '<br/><strong>$1</strong>')  // Colocar el número de pregunta en negrita y con salto de línea
      .replace(/\s([abcd])\)/g, '<br/>$1)')  // Saltos de línea antes de las opciones
      .replace(/\bRespuesta correcta:.*\n?/g, '')  // Eliminar las respuestas correctas adicionales
      .replace(/\.\s/g, '.<br/>')  // Saltos de línea después de cada punto final
      .replace(/.*Espero que estas preguntas ayuden.*|.*¡Déjame saber si necesitas.*|.*Si necesitas más ayuda, no dudes en decírmelo.*/g, '')  // Eliminar todo texto final adicional
      .trim();  // Eliminar cualquier espacio extra al final
  };

  // Función para extraer las respuestas correctas del cuestionario
  const extraerRespuestas = (cuestionario) => {
    const regexRespuestas = /Respuesta correcta:\s([abcd])/g;
    let match;
    const respuestasExtraidas = [];
    let contador = 1;

    while ((match = regexRespuestas.exec(cuestionario)) !== null) {
      respuestasExtraidas.push(`${contador}.- ${match[1]}`);
      contador++;
    }

    return respuestasExtraidas.join('<br/>');  // Formateamos las respuestas con saltos de línea
  };

  return (
    <div className="students-container">
      <h2>Asistente Educativo</h2>
      <div className="level-selection">
        <button onClick={() => handleLevelSelection('primaria')}>Primaria</button>
        <button onClick={() => handleLevelSelection('secundaria')}>Secundaria</button>
      </div>

      {selectedLevel && (
        <form className="assistant-form">
          {nivel && (
            <div className="form-group">
              <label htmlFor="grado">Grado/Año</label>
              <select id="grado" value={grado} onChange={(e) => setGrado(e.target.value)}>
                <option value="">Seleccione el grado/año</option>
                {nivel === 'primaria' && ['1', '2', '3', '4', '5', '6', '7'].map((g) => <option key={g} value={g}>{g}</option>)}
                {nivel === 'secundaria' && ['1', '2', '3', '4', '5', '6'].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          )}
          {grado && (
            <div className="form-group">
              <label htmlFor="area">Área</label>
              <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="">Seleccione el área</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}
          {area && (
            <div className="form-group">
              <label htmlFor="disciplina">Disciplina</label>
              <select id="disciplina" value={disciplina} onChange={(e) => setDisciplina(e.target.value)}>
                <option value="">Seleccione la disciplina</option>
                {disciplinas.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
          {disciplina && (
            <div className="form-group">
              <label htmlFor="tema">Tema</label>
              <select id="tema" value={tema} onChange={(e) => setTema(e.target.value)}>
                <option value="">Seleccione el tema</option>
                {temas.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          {tema && (
            <div className="explanation-buttons">
              <button type="button" onClick={() => obtenerExplicacion(500)}>Explicación Concisa (500 tokens)</button>
              <button type="button" onClick={() => obtenerExplicacion(2000)}>Explicación Media (2000 tokens)</button>
              <button type="button" onClick={() => obtenerExplicacion(4000)}>Explicación Larga (4000 tokens)</button>
            </div>
          )}
          {explicacion && (
            <div className="explanation">
              <h3>Explicación</h3>
              <p dangerouslySetInnerHTML={{ __html: explicacion }} />
            </div>
          )}

          {/* Botón para generar el cuestionario */}
          {explicacion && (
            <div className="quiz-section">
              <button type="button" onClick={generarCuestionario}>
                Comprobar mis conocimientos
              </button>
              {cuestionario && (
                <div className="quiz">
                  <h3>Cuestionario</h3>
                  <p className="quiz" dangerouslySetInnerHTML={{ __html: cuestionario }} />
                </div>
              )}
              {/* Botón y sección para mostrar las respuestas */}
              {respuestas && (
                <div className="answers-section">
                  <h3>Respuestas Correctas</h3>
                  <p dangerouslySetInnerHTML={{ __html: respuestas }} />
                </div>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Students;
