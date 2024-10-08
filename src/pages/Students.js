// frontend/src/pages/Students.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Students.css';
import thesaurusData from '../data/thesauro_ps.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faSpinner } from '@fortawesome/free-solid-svg-icons';

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

  // Estados de carga para cada acción
  const [loading500, setLoading500] = useState(false);
  const [loading2000, setLoading2000] = useState(false);
  const [loading4000, setLoading4000] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const handleLevelSelection = (level) => {
    setSelectedLevel(level);
    setNivel(level);
    resetForm();
  };

  const resetForm = () => {
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
      const areasFiltradas = Object.keys(areasDisponibles).filter((areaKey) => {
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

  const registrarActividad = async (accion, tokens = null) => {
    try {
      console.log('Registrando actividad:', { action: accion, nivel, grado, area, disciplina, tema, tokens });
      await axios.post(
        'http://10.100.210.241:3355/api/users/log_activity',
        {
          action: accion,
          nivel,
          grado,
          area,
          disciplina,
          tema,
          tokens, // Registrar los tokens si existen
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
    } catch (error) {
      console.error('Error al registrar actividad:', error);
    }
  };

  const obtenerExplicacion = async (tokens, setLoading) => {
    if (tema && area && disciplina && nivel && grado) {
      try {
        setLoading(true);
        const response = await axios.post(
          'http://10.100.210.241:3355/api/openai/explicacion',
          { nivel, grado, area, disciplina, tema, tokens },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const formattedExplicacion = formatText(response.data.explicacion);
        setExplicacion(formattedExplicacion);

        await registrarActividad('buscar_explicacion', tokens);
      } catch (error) {
        console.error('Error al obtener explicación:', error);
        setExplicacion('No se pudo generar la explicación en este momento.');
      } finally {
        setLoading(false);
      }
    }
  };

  const generarCuestionario = async () => {
    if (tema && area && disciplina && nivel && grado) {
      try {
        setLoadingQuiz(true);
        const response = await axios.post(
          'http://10.100.210.241:3355/api/openai/cuestionario',
          { nivel, grado, area, disciplina, tema },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const formattedCuestionario = formatCuestionario(response.data.cuestionario);
        const respuestas = extraerRespuestas(response.data.cuestionario);
        setCuestionario(formattedCuestionario);
        setRespuestas(respuestas);

        await registrarActividad('generar_cuestionario');
      } catch (error) {
        console.error('Error al generar cuestionario:', error);
        setCuestionario('No se pudo generar el cuestionario en este momento.');
        setRespuestas('');
      } finally {
        setLoadingQuiz(false);
      }
    }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\d+\.\s)/g, '<br/><br/>$1')
      .replace(/(\s-\s)/g, '<br/>- ')
      .replace(/Por ejemplo:/g, '<br/><strong>Por ejemplo:</strong>')
      .replace(/\.\s/g, '.<br/><br/>')
      .replace('¿Tienes alguna otra pregunta sobre este tema?', '');
  };

  const formatCuestionario = (cuestionario) => {
    return cuestionario
      .replace(/(\d+\.\s)/g, '<br/><strong>$1</strong>')
      .replace(/\s([abcd])\)/g, '<br/>$1)')
      .replace(/\bRespuesta correcta:.*\n?/g, '')
      .replace(/\.\s/g, '.<br/>')
      .replace(/.*Espero que estas preguntas ayuden.*|.*¡Déjame saber si necesitas.*|.*Si necesitas más ayuda, no dudes en decírmelo.*/g, '')
      .trim();
  };

  const extraerRespuestas = (cuestionario) => {
    const regexRespuestas = /Respuesta correcta:\s([abcd])/g;
    let match;
    const respuestasExtraidas = [];
    let contador = 1;

    while ((match = regexRespuestas.exec(cuestionario)) !== null) {
      respuestasExtraidas.push(`${contador}.- ${match[1]}`);
      contador++;
    }

    return respuestasExtraidas.join('<br/>');
  };

  return (
    <div className="students-container">
      <header className="students-header">
        <h1>
          <FontAwesomeIcon icon={faUserGraduate} /> Asistente del alumno
        </h1>
      </header>

      <div className="level-selection">
        <button className="level-button" onClick={() => handleLevelSelection('primaria')}>
          Primaria
        </button>
        <button className="level-button" onClick={() => handleLevelSelection('secundaria')}>
          Secundaria
        </button>
      </div>

      {selectedLevel && (
        <form className="assistant-form">
          <div className="form-group full-width">
            {nivel && (
              <div className="field-row">
                <div className="form-group">
                  <label htmlFor="grado">Grado/Año</label>
                  <select id="grado" value={grado} onChange={(e) => setGrado(e.target.value)}>
                    <option value="">Seleccione el grado/año</option>
                    {nivel === 'primaria' && ['1', '2', '3', '4', '5', '6', '7'].map((g) => <option key={g} value={g}>{g}</option>)}
                    {nivel === 'secundaria' && ['1', '2', '3', '4', '5', '6'].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                {grado && (
                  <div className="form-group">
                    <label htmlFor="area">Área</label>
                    <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                      <option value="">Seleccione el área</option>
                      {areas.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {area && (
                  <div className="form-group">
                    <label htmlFor="disciplina">Disciplina</label>
                    <select id="disciplina" value={disciplina} onChange={(e) => setDisciplina(e.target.value)}>
                      <option value="">Seleccione la disciplina</option>
                      {disciplinas.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {disciplina && (
                  <div className="form-group">
                    <label htmlFor="tema">Tema</label>
                    <select id="tema" value={tema} onChange={(e) => setTema(e.target.value)}>
                      <option value="">Seleccione el tema</option>
                      {temas.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botones de Explicaciones */}
          {tema && (
            <div className="explanation-buttons">
              <button type="button" onClick={() => obtenerExplicacion(500, setLoading500)}>
                {loading500 ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Explicación Concisa (500 tokens)'}
              </button>
              <button type="button" onClick={() => obtenerExplicacion(2000, setLoading2000)}>
                {loading2000 ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Explicación Media (2000 tokens)'}
              </button>
              <button type="button" onClick={() => obtenerExplicacion(4000, setLoading4000)}>
                {loading4000 ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Explicación Larga (4000 tokens)'}
              </button>
            </div>
          )}

          {/* Cuadro de Explicación */}
          {explicacion && (
            <div className="explanation-fullwidth">
              <h3>Explicación</h3>
              <p dangerouslySetInnerHTML={{ __html: explicacion }} />
            </div>
          )}

          {/* Botón de Comprobar mis conocimientos */}
          {explicacion && (
            <div className="quiz-fullwidth">
              <button type="button" onClick={generarCuestionario}>
                {loadingQuiz ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Comprobar mis conocimientos'}
              </button>

              {/* Cuadro de Quiz */}
              {cuestionario && (
                <div className="quiz">
                  <h3>Cuestionario</h3>
                  <p className="quiz" dangerouslySetInnerHTML={{ __html: cuestionario }} />
                </div>
              )}
              {respuestas && (
                <div className="answers-fullwidth">
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
