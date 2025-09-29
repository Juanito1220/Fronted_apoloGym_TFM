import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">🏋️‍♂️</div>
          <h1 className="logo-text">
            <span className="logo-main">Apolo</span>
            <span className="logo-accent">GYM</span>
          </h1>
        </div>

        <nav className="desktop-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <span className="nav-text">Inicio</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/nosotros" className="nav-link">
                <span className="nav-text">Nosotros</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/servicios" className="nav-link">
                <span className="nav-text">Servicios</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contactos" className="nav-link">
                <span className="nav-text">Contactos</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="auth-section">
          <button
            className="auth-btn login-btn"
            onClick={() => window.location.href = '/login'}
          >
            <span>Iniciar sesión</span>
          </button>
          <button
            className="auth-btn register-btn"
            onClick={() => window.location.href = '/registro'}
          >
            <span>Registrarse</span>
            <div className="btn-glow"></div>
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      
    </header>
  );
};

export default Header;
