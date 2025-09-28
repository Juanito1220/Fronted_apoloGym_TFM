// src/components/Inicio.js
import React from 'react';
import '../Styles/inicio.css';
import { Element } from 'react-scroll';

const Inicio = () => {
  return (
    <Element name="inicio" className="inicio-section">
      <div className="inicio-overlay">
        <div className="inicio-content">
          <div className="text-box">
            <h1>¡Bienvenidos a <span>Apolo GYM</span>!</h1>
            <p>
              Donde la disciplina se convierte en fuerza. Disfruta de un ambiente motivador,
              con entrenadores profesionales, equipos de alta tecnología y programas
              personalizados que te ayudarán a alcanzar tus metas.
            </p>
            <p className="cta-text">
              💪 ¡Transforma tu cuerpo, mejora tu vida!
            </p>
          </div>
        </div>
      </div>
    </Element>
  );
};

export default Inicio;
