import React from 'react';
import '../../Styles/servicios.css';
import entrenamiento from '../../assets/entrenamiento.jpg';
import grupales from '../../assets/grupal.jpg';
import nutricion from '../../assets/alimentacion.jpg';
import suplementos from '../../assets/Suplementos.png';
import membresia from '../../assets/menbresia.jpg';

const servicios = [
  {
    titulo: 'Entrenamiento Personalizado',
    descripcion: 'Rutinas adaptadas a tus objetivos específicos con seguimiento profesional continuo y ajustes personalizados.',
    imagen: entrenamiento,
    icono: '🎯',
    caracteristicas: ['Plan personalizado', 'Seguimiento 24/7', 'Entrenador dedicado'],
    precio: 'Desde $150.000/mes'
  },
  {
    titulo: 'Clases Grupales',
    descripcion: 'Disfruta de clases dinámicas de Zumba, Yoga, CrossFit, Spinning y más en un ambiente motivador.',
    imagen: grupales,
    icono: '👥',
    caracteristicas: ['20+ disciplinas', 'Horarios flexibles', 'Instructores certificados'],
    precio: 'Incluido en membresía'
  },
  {
    titulo: 'Asesoría Nutricional',
    descripcion: 'Planes alimenticios personalizados diseñados por nutricionistas expertos para optimizar tus resultados.',
    imagen: nutricion,
    icono: '🍎',
    caracteristicas: ['Plan nutricional', 'Recetas saludables', 'Seguimiento semanal'],
    precio: 'Desde $80.000/mes'
  },
  {
    titulo: 'Suplementos y Productos',
    descripcion: 'Amplia variedad de suplementos premium y productos fitness de las mejores marcas internacionales.',
    imagen: suplementos,
    icono: '💊',
    caracteristicas: ['Marcas premium', 'Asesoría especializada', 'Descuentos exclusivos'],
    precio: 'Precios competitivos'
  },
  {
    titulo: 'Planes de Membresía',
    descripcion: 'Opciones flexibles mensuales, trimestrales y anuales diseñadas para adaptarse a tu estilo de vida.',
    imagen: membresia,
    icono: '⭐',
    caracteristicas: ['Acceso 24/7', 'Sin permanencia', 'Beneficios exclusivos'],
    precio: 'Desde $120.000/mes'
  },
];

const Servicios = () => {
  return (
    <div className="servicios-page">
      {/* Hero Section */}
      <section className="servicios-hero">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-icon">💪</span>
            <span className="badge-text">SERVICIOS PREMIUM</span>
          </div>

          <h1 className="hero-title">
            Nuestros
            <span className="title-highlight"> Servicios</span>
            <div className="title-decoration"></div>
          </h1>

          <p className="hero-subtitle">
            Descubre la gama completa de servicios diseñados para transformar
            tu experiencia fitness y maximizar tus resultados
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="services-container">
          <div className="services-header">
            <div className="section-badge">
              <span className="badge-icon">🏆</span>
              <span className="badge-text">SERVICIOS DESTACADOS</span>
            </div>

            <h2 className="section-title">
              Todo lo que
              <span className="title-accent"> Necesitas</span>
            </h2>

            <p className="section-description">
              Desde entrenamientos personalizados hasta asesoría nutricional,
              tenemos todo cubierto para tu journey fitness
            </p>
          </div>

          <div className="services-grid">
            {servicios.map((servicio, index) => (
              <div key={index} className="service-card" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card-header">
                  <div className="service-image">
                    <img src={servicio.imagen} alt={servicio.titulo} />
                    <div className="image-overlay">
                      <div className="service-icon">{servicio.icono}</div>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="service-title">{servicio.titulo}</h3>
                  <p className="service-description">{servicio.descripcion}</p>

                  <div className="service-features">
                    {servicio.caracteristicas.map((caracteristica, idx) => (
                      <div key={idx} className="feature-item">
                        <span className="feature-check">✓</span>
                        <span>{caracteristica}</span>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div className="service-price">{servicio.precio}</div>
                    <button className="service-btn">
                      <span>Más Info</span>
                      <div className="btn-shine"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>¿Necesitas ayuda para elegir?</h2>
            <p>Nuestros expertos te ayudarán a encontrar el plan perfecto para ti</p>
            {/* <div className="cta-buttons">
              <button className="cta-primary">
                <span>Consulta Gratuita</span>
                <div className="btn-effect"></div>
              </button>
              <button className="cta-secondary">
                <span>Ver Planes</span>
              </button>
            </div> */}
          </div>

          <div className="cta-features">
            <div className="cta-feature">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">
                <h4>Asesoría Personalizada</h4>
                <p>Evaluamos tus objetivos</p>
              </div>
            </div>
            <div className="cta-feature">
              <div className="feature-icon">💡</div>
              <div className="feature-text">
                <h4>Plan Recomendado</h4>
                <p>Te sugerimos lo mejor</p>
              </div>
            </div>
            <div className="cta-feature">
              <div className="feature-icon">🚀</div>
              <div className="feature-text">
                <h4>Resultados Garantizados</h4>
                <p>Alcanza tus metas</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Servicios;
