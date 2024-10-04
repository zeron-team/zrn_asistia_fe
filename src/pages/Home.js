import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <img src="/images/logo.png" alt="Logo" className="home-logo" />  {/* Ajuste de la ruta del logo */}
        <h1>Bienvenido a la Educación con IA</h1>
      </header>
      <div className="content">
        <div className="block">
          <h2>Transformación Educativa</h2>
          <p>
            En la era digital, la inteligencia artificial (IA) se ha convertido en una herramienta transformadora en múltiples sectores, y la educación no es una excepción. La implementación de la IA en el ámbito educativo ofrece un sinfín de posibilidades que mejoran tanto la experiencia de aprendizaje de los estudiantes como la labor de los docentes.
          </p>
        </div>
        <div className="block">
          <h2>Tutores Personalizados</h2>
          <p>
            Para los alumnos, la IA actúa como un tutor personalizado, adaptando el contenido y el ritmo de aprendizaje a las necesidades individuales. Esto permite que los estudiantes puedan abordar sus áreas de dificultad de manera más efectiva, promoviendo un aprendizaje más profundo y significativo.
          </p>
        </div>
        <div className="block">
          <h2>Beneficios para Docentes</h2>
          <p>
            Por otro lado, los docentes se benefician de la IA al contar con herramientas que automatizan tareas administrativas, como la calificación de exámenes y la gestión de asistencia, permitiéndoles dedicar más tiempo a la enseñanza y a la interacción con sus estudiantes.
          </p>
        </div>
        <div className="block">
          <h2>Futuro Educativo</h2>
          <p>
            En resumen, la integración de la inteligencia artificial en la educación no solo mejora la eficiencia en la enseñanza y el aprendizaje, sino que también promueve un entorno más inclusivo y accesible para todos los estudiantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
