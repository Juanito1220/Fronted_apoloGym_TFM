// src/Paginas/nosotros.js
import React from 'react';
import '../Styles/nosotros.css'; // Asegúrate de crear este archivo

const Nosotros = () => {
  return (
    <div className="nosotros-page">
      <div className="banner-nosotros">
        <h1>Sobre Nosotros</h1>
        <p>Conoce quiénes somos en Apolo GYM</p>
      </div>

      <div className="contenido-nosotros">
        <div className="texto-nosotros">
          <h2>Pasión por tu bienestar</h2>
          <p>
            En Apolo GYM, nos tomamos el fitness en serio. Con más de 10 años de experiencia, hemos acompañado a cientos de personas a alcanzar sus metas físicas y emocionales.
          </p>
          <p>
            Nos especializamos en brindar planes personalizados para todo tipo de cliente: desde principiantes hasta atletas experimentados. Aquí encontrarás un ambiente inclusivo, motivador y profesional.
          </p>
          <p>
            Contamos con instructores certificados, tecnología moderna, áreas de recuperación, asesoría nutricional y una comunidad que te impulsa a crecer.
          </p>
          <p>
            Apolo GYM no es solo un lugar para entrenar: es un espacio donde transformas tu estilo de vida.
          </p>
        </div>
        <div className="imagen-nosotros">
          <img src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74" alt="Gimnasio moderno" />
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
