// src/Paginas/nosotros.js
import React from 'react';
import '../Styles/nosotros.css';

const Nosotros = () => {
  return (
    <div className="nosotros-page">
      {/* Hero Section */}
      <section className="nosotros-hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="element element-1"></div>
            <div className="element element-2"></div>
            <div className="element element-3"></div>
          </div>
        </div>

        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-icon">🌟</span>
            <span className="badge-text">MÁS DE 10 AÑOS DE EXPERIENCIA</span>
          </div>

          <h1 className="hero-title">
            Sobre
            <span className="title-highlight"> Nosotros</span>
            <div className="title-decoration"></div>
          </h1>

          <p className="hero-subtitle">
            Transformamos vidas a través del fitness, creando una comunidad fuerte
            donde cada meta se convierte en logro
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <div className="section-badge">
              <span className="badge-icon">📖</span>
              <span className="badge-text">NUESTRA HISTORIA</span>
            </div>

            <h2 className="section-title">
              Pasión por tu
              <span className="title-accent"> Bienestar</span>
            </h2>

            <p className="story-intro">
              En Apolo GYM, el fitness no es solo ejercicio, es un estilo de vida.
              Comenzamos con una visión simple: crear un espacio donde cada persona
              pueda descubrir su mejor versión.
            </p>

            <div className="story-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">🎯</div>
                <div className="highlight-content">
                  <h3>Enfoque Personalizado</h3>
                  <p>Planes únicos adaptados a tus objetivos específicos y nivel de condición física.</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">👥</div>
                <div className="highlight-content">
                  <h3>Comunidad Inclusiva</h3>
                  <p>Un ambiente motivador donde principiantes y atletas entrenan juntos.</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">🚀</div>
                <div className="highlight-content">
                  <h3>Tecnología Avanzada</h3>
                  <p>Equipamiento de última generación para optimizar cada entrenamiento.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="story-visual">
            <div className="visual-grid">
              <div className="visual-card primary">
                <img src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=800" alt="Gimnasio moderno" />
                <div className="card-overlay">
                  <div className="card-badge">Instalaciones Premium</div>
                </div>
              </div>

              <div className="visual-card secondary">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600" alt="Entrenadores" />
                <div className="card-overlay">
                  <div className="card-badge">Entrenadores Certificados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <div className="values-header">
            <div className="section-badge">
              <span className="badge-icon">💎</span>
              <span className="badge-text">NUESTROS VALORES</span>
            </div>

            <h2 className="section-title">
              Lo que nos
              <span className="title-accent"> Distingue</span>
            </h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <span>💪</span>
              </div>
              <h3>Excelencia</h3>
              <p>Comprometidos con la calidad en cada servicio, instalación y experiencia que ofrecemos.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <span>🤝</span>
              </div>
              <h3>Compromiso</h3>
              <p>Acompañamos tu journey fitness con dedicación, apoyo constante y motivación genuina.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <span>🎯</span>
              </div>
              <h3>Resultados</h3>
              <p>Enfocados en logros medibles y transformaciones reales que impacten tu vida.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <span>🌟</span>
              </div>
              <h3>Innovación</h3>
              <p>Adoptamos las últimas tendencias y tecnologías para maximizar tu progreso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <div className="team-header">
            <div className="section-badge">
              <span className="badge-icon">👨‍🏫</span>
              <span className="badge-text">NUESTRO EQUIPO</span>
            </div>

            <h2 className="section-title">
              Expertos en
              <span className="title-accent"> Fitness</span>
            </h2>

            <p className="team-description">
              Contamos con profesionales certificados, especializados en diferentes
              disciplinas para brindarte la mejor experiencia de entrenamiento.
            </p>
          </div>

          <div className="expertise-cards">
            <div className="expertise-card">
              <div className="expertise-icon">🏋️‍♂️</div>
              <h3>Entrenamiento de Fuerza</h3>
              <p>Especialistas en powerlifting, culturismo y acondicionamiento funcional.</p>
              <div className="expertise-stats">
                <span className="stat">+200 clientes</span>
              </div>
            </div>

            <div className="expertise-card">
              <div className="expertise-icon">🍎</div>
              <h3>Nutrición Deportiva</h3>
              <p>Asesoría personalizada para optimizar tu rendimiento y composición corporal.</p>
              <div className="expertise-stats">
                <span className="stat">Planes personalizados</span>
              </div>
            </div>

            <div className="expertise-card">
              <div className="expertise-icon">🧘‍♀️</div>
              <h3>Bienestar Integral</h3>
              <p>Yoga, pilates, recuperación activa y técnicas de relajación y movilidad.</p>
              <div className="expertise-stats">
                <span className="stat">Mente & Cuerpo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>¿Listo para transformar tu vida?</h2>
            <p>Únete a la familia Apolo GYM y descubre todo tu potencial</p>
            {/* <div className="cta-buttons">
              <button className="cta-primary">
                <span>Comenzar Ahora</span>
                <div className="btn-effect"></div>
              </button>
              <button className="cta-secondary">
                <span>Agendar Visita</span>
              </button>
            </div> */}
          </div>

          <div className="cta-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Miembros Activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfacción</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Años de Experiencia</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
