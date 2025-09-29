import React, { useState } from 'react';
import '../../Styles/contactos.css';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaClock,
  FaRoute,
  FaStar,
  FaCheckCircle,
  FaPaperPlane,
  FaUser,
  FaComments
} from 'react-icons/fa';

const Contactos = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="contactos-page">
      {/* Hero Section */}
      <section className="contactos-hero">
        <div className="hero-background"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="hero-container">
          <div className="hero-badge">
            <FaMapMarkerAlt className="badge-icon" />
            <span>Visítanos</span>
          </div>
          <h1 className="hero-title">
            ¡Estamos aquí para <span className="title-highlight">ayudarte</span>!
          </h1>
          <div className="title-decoration"></div>
          <p className="hero-subtitle">
            Encuentra toda la información de contacto y ubicación. Estamos listos para resolver tus dudas y acompañarte en tu journey fitness.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Contact Cards */}
            <div className="contact-cards">
              <div className="section-header">
                <span className="section-badge">
                  <FaComments />
                  Contáctanos
                </span>
                <h2 className="section-title">
                  Múltiples formas de <span className="title-accent">conectar</span>
                </h2>
                <p className="section-description">
                  Elige el canal que más te convenga. Estamos disponibles para ayudarte en cualquier momento.
                </p>
              </div>

              <div className="cards-grid">
                <div className="contact-card">
                  <div className="card-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Ubicación</h3>
                    <p className="card-description">Calle 1b # 181, Ciudad Soacha, Cundinamarca</p>
                    <div className="card-action">
                      <button className="action-btn">
                        <FaRoute />
                        Ver Ruta
                      </button>
                    </div>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="card-icon">
                    <FaPhoneAlt />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Teléfono</h3>
                    <p className="card-description">(+57) 3204937514</p>
                    <div className="card-action">
                      <button className="action-btn">
                        <FaPhoneAlt />
                        Llamar Ahora
                      </button>
                    </div>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="card-icon">
                    <FaEnvelope />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Email</h3>
                    <p className="card-description">apologym@hotmail.com</p>
                    <div className="card-action">
                      <button className="action-btn">
                        <FaEnvelope />
                        Enviar Email
                      </button>
                    </div>
                  </div>
                </div>

                <div className="contact-card whatsapp-card">
                  <div className="card-icon">
                    <FaWhatsapp />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">WhatsApp</h3>
                    <p className="card-description">Chat directo y respuesta inmediata</p>
                    <div className="card-action">
                      <a href="https://wa.me/593999999999" target="_blank" rel="noopener noreferrer" className="action-btn whatsapp-btn">
                        <FaWhatsapp />
                        Chatear Ahora
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="card-icon">
                    <FaClock />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Horarios</h3>
                    <div className="hours-list">
                      <div className="hour-item">
                        <span>Lun - Vie:</span>
                        <span>5:00 AM - 11:00 PM</span>
                      </div>
                      <div className="hour-item">
                        <span>Sáb - Dom:</span>
                        <span>6:00 AM - 10:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-card social-card">
                  <div className="card-icon">
                    <FaStar />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Síguenos</h3>
                    <p className="card-description">Mantente al día con nuestras novedades</p>
                    <div className="social-links">
                      <a href="https://facebook.com/apologym" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                        <FaFacebook />
                      </a>
                      <a href="https://instagram.com/apologym" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                        <FaInstagram />
                      </a>
                      <a href="https://tiktok.com/@apologym" target="_blank" rel="noopener noreferrer" className="social-link tiktok">
                        <FaTiktok />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-header">
                <h3 className="form-title">Envíanos un mensaje</h3>
                <p className="form-description">
                  ¿Tienes alguna pregunta específica? Completa el formulario y te responderemos pronto.
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Tu nombre completo"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FaPhoneAlt className="input-icon" />
                    <input
                      type="tel"
                      name="telefono"
                      placeholder="Tu número de teléfono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper textarea-wrapper">
                    <FaComments className="input-icon" />
                    <textarea
                      name="mensaje"
                      placeholder="Escribe tu mensaje aquí..."
                      rows="5"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className={`submit-btn ${isSubmitted ? 'submitted' : ''}`}>
                  {isSubmitted ? (
                    <>
                      <FaCheckCircle />
                      ¡Mensaje Enviado!
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Enviar Mensaje
                      <span className="btn-shine"></span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <div className="map-overlay">
            <div className="map-info">
              <h3>Apolo Gym Soacha</h3>
              <p>Calle 1b # 181, Ciudad Soacha</p>
              <div className="map-features">
                <span className="feature-tag">Parqueadero Gratuito</span>
                <span className="feature-tag">Acceso Fácil</span>
                <span className="feature-tag">Transporte Público</span>
              </div>
            </div>
          </div>
          {/* Aquí iría el componente del mapa */}
          <div className="map-placeholder">
            <FaMapMarkerAlt className="map-icon" />
            <p>Mapa Interactivo</p>
            <span>Haz clic para ver la ubicación</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contactos;
