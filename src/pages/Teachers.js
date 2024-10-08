// frontend/src/pages/Teachers.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Teachers.css';
import thesaurusData from '../data/thesauro_ps.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faSpinner, faDownload } from '@fortawesome/free-solid-svg-icons'; // Icono para descargar
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import logo from '../assets/logo.png'; // Asegúrate de que la ruta al logo sea correcta

const Teachers = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [nivel, setNivel] = useState('');
  const [grado, setGrado] = useState('');
  const [area, setArea] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tema, setTema] = useState('');
  const [duracion, setDuracion] = useState('');
  const [areas, setAreas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [temas, setTemas] = useState([]);
  const [contenidoGenerado, setContenidoGenerado] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionSelection = (option) => {
    setSelectedOption(option);
    resetForm();
  };

  const resetForm = () => {
    setNivel('');
    setGrado('');
    setArea('');
    setDisciplina('');
    setTema('');
    setDuracion('');
    setAreas([]);
    setDisciplinas([]);
    setTemas([]);
    setContenidoGenerado('');
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

  const generarContenido = async () => {
    if (tema && area && disciplina && nivel && grado && duracion) {
      try {
        setLoading(true);
        const response = await axios.post(
          'http://10.100.210.241:3355/api/openai/planificacion',
          { 
            nivel, 
            grado, 
            area, 
            disciplina, 
            tema, 
            selectedOption,
            duracion
          }, 
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        setContenidoGenerado(response.data.planificacion);
      } catch (error) {
        console.error('Error al generar el contenido:', error);
        setContenidoGenerado('No se pudo generar el contenido en este momento.');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatContenido = (texto) => {
    return texto
      .replace(/(Título de la Actividad:)/g, '<br/><strong>$1</strong><br/>')
      .replace(/(Objetivos de Aprendizaje:)/g, '<br/><strong>$1</strong><br/>')
      .replace(/(Duración Total:)/g, '<br/><strong>$1</strong><br/>')
      .replace(/(Recursos necesarios:)/g, '<br/><strong>$1</strong><br/>')
      .replace(/(Momento\s+\d+:)/g, '<br/><strong>$1</strong><br/>')
      .replace(/(-\s)/g, '')  
      .replace(/(--\s)/g, '')  
      .replace(/(-)/g, '')
      .replace(/(##)/g, '')
      .replace(/(#)/g, '')
      .replace(/(- Inicio:)/g, '<br/><strong>$1</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(- Discusión:)/g, '<br/><strong>$1</strong>')
      .replace(/(- Explicación:)/g, '<br/><strong>$1</strong>')
      .replace(/(- Desarrollo:)/g, '<br/><strong>$1</strong>')
      .replace(/(- Presentación:)/g, '<br/><strong>$1</strong>')
      .replace(/(- Reflexión:)/g, '<br/><strong>$1</strong>')
      .replace(/(- Cierre:)/g, '<br/><strong>$1</strong>')
      .replace(/(Evaluación:)/g, '<br/><strong>$1</strong><br/>')
      .replace(/\n/g, '<br/>');
  };

  // Función para descargar el PDF usando html2pdf.js
  const descargarPDF = () => {
    const fechaActual = new Date().toLocaleDateString();

    const content = document.querySelector('.generated-content');

    const opt = {
      margin: [50, 10, 50, 10], // Margen de 50px para acomodar el header y footer
      filename: 'actividad.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf().from(content).set(opt).toPdf().get('pdf').then((pdf) => {
      const pageCount = pdf.internal.getNumberOfPages();

      // Logo y fecha en la parte superior de cada página
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        // Header: Logo a la izquierda y fecha
        pdf.setFontSize(10);
        pdf.text(`Fecha: ${fechaActual}`, 40, 30); // Fecha en la parte izquierda superior
        pdf.addImage(logo, 'PNG', pdf.internal.pageSize.getWidth() - 60, 10, 40, 15); // Logo en la parte derecha superior

        // Footer: Logo a la derecha y paginación al centro
        pdf.addImage(logo, 'PNG', pdf.internal.pageSize.getWidth() - 60, pdf.internal.pageSize.getHeight() - 40, 40, 15); // Logo en la parte derecha inferior
        pdf.text(`Página ${i} de ${pageCount}`, pdf.internal.pageSize.getWidth() / 2 - 20, pdf.internal.pageSize.getHeight() - 30); // Paginación en el centro
      }

      pdf.save('actividad.pdf');
    });
  };

  return (
    <div className="teachers-container">
      <header className="teachers-header">
        <h1>
          <FontAwesomeIcon icon={faChalkboardTeacher} /> Asistente para Docentes
        </h1>
      </header>

      {/* Selección de opciones (Actividades, Planificación, Actos Escolares) */}
      <div className="option-selection">
        <button className="option-button" onClick={() => handleOptionSelection('actividades')}>Actividades</button>
        <button className="option-button" onClick={() => handleOptionSelection('planificacion')}>Planificación</button>
        <button className="option-button" onClick={() => handleOptionSelection('actos_escolares')}>Actos Escolares</button>
      </div>

      {/* Formulario de selección */}
      {selectedOption && (
        <form className="assistant-form">
          <div className="form-group">
            <label htmlFor="nivel">Nivel</label>
            <select id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option value="">Seleccione el nivel</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </select>
          </div>
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
            <div className="form-group">
              <label htmlFor="duracion">Duración (minutos)</label>
              <select id="duracion" value={duracion} onChange={(e) => setDuracion(e.target.value)}>
                <option value="">Seleccione la duración</option>
                {[10, 20, 30, 45, 60, 90, 120].map((d) => (
                  <option key={d} value={d}>{d} minutos</option>
                ))}
              </select>
            </div>
          )}
        </form>
      )}

      {/* Botón para generar el contenido */}
      {duracion && (
        <div className="content-generation">
          <button onClick={generarContenido}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Generar Contenido'}
          </button>
        </div>
      )}

      {/* Contenido generado - Fuera del formulario */}
      {contenidoGenerado && (
        <div className="generated-content">
          <h3>Contenido Generado:</h3>
          <p dangerouslySetInnerHTML={{ __html: formatContenido(contenidoGenerado) }} />

          {/* Botón para descargar el contenido en PDF */}
          <button onClick={descargarPDF}>
            <FontAwesomeIcon icon={faDownload} /> Descargar en PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Teachers;
