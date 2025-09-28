import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Apolo GYM</div>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/servicios">Servicios</Link></li>
          <li><Link to="/contactos">Contactos</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button onClick={() => window.location.href = '/login'}>Iniciar sesión</button>
        <button onClick={() => window.location.href = '/registro'}>Registrarse</button>
      </div>
    </header>
  );
};

export default Header;
