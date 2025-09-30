import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/login.css';
import { FaDumbbell, FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Usuarios de prueba
  const testUsers = [
    { email: 'admin@apolo.com', password: 'admin123', role: 'admin' },
    { email: 'entrenador@apolo.com', password: 'entrenador123', role: 'trainer' },
    { email: 'cliente@apolo.com', password: 'cliente123', role: 'client' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticación
    setTimeout(() => {
      const user = testUsers.find(u => u.email === email && u.password === password);

      if (user) {
        // Redirigir según el rol del usuario
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'trainer':
            navigate('/entrenador');
            break;
          case 'client':
          default:
            navigate('/cliente');
            break;
        }
      } else {
        setError('Correo o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>

      <div className="auth-content">
        <div className="auth-box">
          <div className="auth-header">
            <div className="brand-logo">
              <FaDumbbell className="brand-icon" />
              <h1>Apolo <span className="brand-highlight">GYM</span></h1>
            </div>
            <div className="auth-title">
              <h2>Bienvenido de vuelta</h2>
              <p>Inicia sesión para acceder a tu cuenta</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Recordarme
              </label>
              <a href="/recuperar" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="auth-btn primary" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿No tienes una cuenta?</p>
            <button
              className="auth-btn secondary"
              onClick={() => navigate('/registro')}
            >
              Crear cuenta
            </button>
          </div>

          <div className="auth-divider">
            <span>o continúa con</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <span>G</span>
              Google
            </button>
            <button className="social-btn facebook">
              <span>f</span>
              Facebook
            </button>
          </div>
        </div>

        <div className="auth-info">
          <h3>Transforma tu vida</h3>
          <p>Únete a más de 50 miembros que ya han transformado su vida con nuestros programas de entrenamiento personalizado.</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🏋️‍♂️</span>
              <span>Entrenamientos personalizados</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👨‍🏫</span>
              <span>Entrenadores certificados</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🕐</span>
              <span>Horarios flexibles 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
