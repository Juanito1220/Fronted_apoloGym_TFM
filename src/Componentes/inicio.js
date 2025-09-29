import React from 'react';
import '../Styles/inicio.css';
import { Element } from 'react-scroll';

const Inicio = () => {
  return (
    <Element name="inicio" className="inicio-section">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="inicio-container">
        <div className="hero-content">

          <h1 className="hero-title">
            Bienvenidos a
            <span className="brand-highlight"> Apolo GYM</span>
            <div className="title-underline"></div>
          </h1>

          <p className="hero-description">
            Transforma tu vida con nuestro enfoque integral. Entrenadores certificados,
            equipamiento de última generación y programas personalizados diseñados
            para maximizar tu potencial físico y mental.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <span>Entrenamientos Personalizados</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <span>Seguimiento de Progreso</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <span>Comunidad Activa</span>
            </div>
          </div>

        

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Miembros Activos</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">5★</div>
              <div className="stat-label">Calificación</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Acceso</div>
            </div>
          </div>
        </div>

        <div className="hero-visual-inicio">
          <div className="visual-container">
            <div className="card-1 floating-card">
              <div className="card-icon">💪</div>
              <div className="card-content">
                <div className="card-title">Fuerza</div>
                <div className="card-progress">
                  <div className="progress-bar" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="card-2 floating-card">
              <div className="card-icon">🔥</div>
              <div className="card-content">
                <div className="card-title">Cardio</div>
                <div className="card-progress">
                  <div className="progress-bar" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>

            <div className="card-3 floating-card">
              <div className="card-icon">⚡</div>
              <div className="card-content">
                <div className="card-title">Energía</div>
                <div className="card-progress">
                  <div className="progress-bar" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>

            <div className="central-visual">
              <div className="pulse-ring"></div>
              <div className="main-icon">🏆</div>
            </div>
          </div>
        </div>
      </div>

    </Element>
  );
};

export default Inicio;
