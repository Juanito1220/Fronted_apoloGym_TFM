// src/Paginas/principal.js
import React from 'react';
import Slider from '../../Componentes/slider';
import Inicio from '../../Componentes/inicio';
//mport Nosotros from '../Componentes/nosotros'; // Solo si lo necesitas dentro de esta página
import Nosotros from '../nosotros';
import Servicios from '../servicios';
import Contactos from '../contactos';
//import Servicios from '../Componentes/servicios';
//import Contacto from '../Componentes/contactos';
//import '../Styles/principal.css';
import '../../Styles/principal.css'

const PaginaPrincipal = () => {
  return (
    <div>
      <Inicio />
      <Slider />
      <Nosotros/>
      <Servicios />
      <Contactos />
    </div>
  );
};

export default PaginaPrincipal;
