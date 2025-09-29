// src/Paginas/principal.js
import React from 'react';
import Inicio from '../../Componentes/inicio';
import Nosotros from '../nosotros';
import Servicios from '../servicios';
import Contactos from '../contactos';
import '../../Styles/principal.css'

const PaginaPrincipal = () => {
  return (
    <div className="pagina-principal">
      <Inicio />
      <Nosotros />
      <Servicios />
      <Contactos />
    </div>
  );
};

export default PaginaPrincipal;
