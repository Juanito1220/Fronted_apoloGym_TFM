import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/recuperarPassword.css';

const RecuperarContraseña = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Instrucciones enviadas a: ${email}`);
    setMensaje('📧 Revisa tu correo para continuar.');

    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleSalir = () => {
    navigate('/');
  };

  return (
    <div className="recuperar-fondo">
      <div className="recuperar-card">
        <h2>Recuperar Contraseña</h2>
        <p>Te enviaremos instrucciones a tu correo</p>
        <form onSubmit={handleSubmit} className="form-recuperar">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-enviar">
            Enviar Instrucciones
          </button>
          <button type="button" className="btn-salir" onClick={handleSalir}>
            Salir
          </button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default RecuperarContraseña;
