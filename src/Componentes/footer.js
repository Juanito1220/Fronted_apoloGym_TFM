import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaSpotify, FaTiktok } from 'react-icons/fa';
import '../Styles/footer.css'; // Asegúrate de tener este archivo CSS

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">Síguenos</p>
      <div className="footer-icons">
        <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook size={24} /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram size={24} /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter size={24} /></a>
        <a href="https://spotify.com" target="_blank" rel="noreferrer"><FaSpotify size={24} /></a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer"><FaTiktok size={24} /></a>
      </div>
      <p className="footer-copy">© 2025 Apolo GYM - Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
