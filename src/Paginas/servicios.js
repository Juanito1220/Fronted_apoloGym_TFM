import React from 'react';
import '../Styles/servicios.css';
import entrenamiento from '../assets/entrenamiento.jpg';
import grupales from '../assets/grupal.jpg';
import nutricion from '../assets/alimentacion.jpg';
import suplementos from '../assets/Suplementos.png';
import membresia from '../assets/menbresia.jpg';

const servicios = [
  {
    titulo: 'Entrenamiento Personalizado',
    descripcion: 'Rutinas adaptadas a tus objetivos con seguimiento profesional.',
    imagen: entrenamiento,
  },
  {
    titulo: 'Clases Grupales',
    descripcion: 'Disfruta clases de Zumba, Yoga, CrossFit y más.',
    imagen: grupales,
  },
  {
    titulo: 'Asesoría Nutricional',
    descripcion: 'Planes alimenticios personalizados por expertos.',
    imagen: nutricion,
  },
  {
    titulo: 'Suplementos y Productos',
    descripcion: 'Variedad de suplementos de alta calidad en nuestra tienda.',
    imagen: suplementos,
  },
  {
    titulo: 'Planes de Membresía',
    descripcion: 'Opciones flexibles mensuales y anuales para ti.',
    imagen: membresia,
  },
];

const Servicios = () => {
  return (
    <section className="servicios-section" id="servicios">
      <h2 className="servicios-title">Nuestros Servicios</h2>
      <div className="servicios-grid">
        {servicios.map((servicio, index) => (
          <div key={index} className="servicio-card">
            <img src={servicio.imagen} alt={servicio.titulo} />
            <div className="servicio-info">
              <h3>{servicio.titulo}</h3>
              <p>{servicio.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Servicios;
