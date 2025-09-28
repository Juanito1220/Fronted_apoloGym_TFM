import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/login.css';
import '../Styles/registro.css';
import '../Styles/recuperarPassword.css';
import { FaDumbbell } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');//puede ir aqui el correo
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'jessicamaliza19@gmail.com' && password === '1234') {
      navigate('/menu');
    } else {
      alert('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <FaDumbbell className="login-icon" />
        <h1>Apolo GYM</h1>
        <p>Inicia sesión para acceder a tu cuenta</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-links">
            <a href="/recuperar">¿Olvidaste tu contraseña?</a>

          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
        <div className="register-link">
          ¿No tienes una cuenta? <a href="#">Regístrate</a>
          <button className="register-btn" onClick={() => navigate('/registro')}>
            Regístrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
