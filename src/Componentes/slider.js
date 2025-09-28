// 📁 src/components/Slider.js
import React from 'react';
import '../Styles/slider.css';
import gimnasio1 from '../assets/imagen1.jpg';
import gimnasio2 from '../assets/cuatro.jpg';
import gimnasio3 from '../assets/cinco.jpg';

const HeroSlider = () => {
  return (
    <div className="hero-slider" id="hero">
      <div className="slide-track">
        <img src={gimnasio1} alt="Gimnasio 1" />
        <img src={gimnasio2} alt="Gimnasio 2" />
        <img src={gimnasio3} alt="Gimnasio 3" />
      </div>
    </div>
  );
};
export default HeroSlider;