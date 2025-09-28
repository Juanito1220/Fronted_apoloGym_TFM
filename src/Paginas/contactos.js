import React from 'react';
import '../Styles/contactos.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTiktok, FaEnvelope } from 'react-icons/fa';

const Contactos = () => {
  return (
    <section className="contacto-section" id="contacto">
      <div className="contacto-contenido">
        <h2 className="contacto-title">¿Dónde estamos?</h2>
        <p className="contacto-descripcion">
          Estamos ubicados en el corazón de Ciudad Fitness. Si tienes dudas, necesitas ayuda o quieres más información, no dudes en contactarnos.
        </p>

        <div className="contacto-items">
          <div className="contacto-item">
            <FaMapMarkerAlt className="icono" />
            <p>Calle 1b # 181, Ciudad Soacha, Cundinamarca</p>
          </div>
          <div className="contacto-item">
            <FaPhoneAlt className="icono" />
            <p>(+57) 3204937514</p>
          </div>
          <div className="contacto-item">
            <FaEnvelope className="icono" />
            <p>apologym@hotmail.com</p>
          </div>
          <div className="contacto-item">
            <FaWhatsapp className="icono" />
            <a href="https://wa.me/593999999999" target="_blank" rel="noopener noreferrer">
              Chatea con nosotros por WhatsApp
            </a>
          </div>
        </div>

        <h3 className="redes-title">Síguenos en redes</h3>
        
      </div>
    </section>
  );
};

export default Contactos;
