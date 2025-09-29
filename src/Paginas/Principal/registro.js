import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/registro.css';
import {
  FaDumbbell,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    direccion: '',
    email: '',
    password: '',
    confirmarPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
      if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
      if (!formData.cedula.trim()) newErrors.cedula = 'La cédula es requerida';
      if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    } else if (step === 2) {
      if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
      if (!formData.email.trim()) newErrors.email = 'El email es requerido';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Formato de email inválido';
      }
      if (!formData.password) newErrors.password = 'La contraseña es requerida';
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (!formData.confirmarPassword) newErrors.confirmarPassword = 'Confirma tu contraseña';
      if (formData.password !== formData.confirmarPassword) {
        newErrors.confirmarPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(2)) return;

    setIsLoading(true);
    setMensaje('');

    // Simular registro
    setTimeout(() => {
      console.log('Datos registrados:', formData);
      setMensaje('✅ ¡Usuario registrado exitosamente!');

      setTimeout(() => {
        navigate('/');
      }, 2000);

      setIsLoading(false);
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
        <span>1</span>
        <p>Información Personal</p>
      </div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
        <span>2</span>
        <p>Cuenta y Contraseña</p>
      </div>
    </div>
  );

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-overlay"></div>
      </div>

      <div className="register-content">
        <div className="register-box">
          <div className="register-header">
            <div className="brand-logo">
              <FaDumbbell className="brand-icon" />
              <h1>Apolo <span className="brand-highlight">GYM</span></h1>
            </div>
            <div className="register-title">
              <h2>Únete a la familia</h2>
              <p>Crea tu cuenta y comienza tu transformación</p>
            </div>
          </div>

          {renderStepIndicator()}

          <form onSubmit={handleSubmit} className="register-form">
            {mensaje && (
              <div className={`message ${mensaje.includes('exitosamente') ? 'success' : 'error'}`}>
                <span>{mensaje}</span>
              </div>
            )}

            {currentStep === 1 && (
              <div className="form-step">
                <h3>Información Personal</h3>

                <div className="form-row">
                  <div className="form-group">
                    <div className="input-wrapper">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`form-input ${errors.nombre ? 'error' : ''}`}
                        required
                      />
                    </div>
                    {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                  </div>

                  <div className="form-group">
                    <div className="input-wrapper">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className={`form-input ${errors.apellido ? 'error' : ''}`}
                        required
                      />
                    </div>
                    {errors.apellido && <span className="error-text">{errors.apellido}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <div className="input-wrapper">
                      <FaIdCard className="input-icon" />
                      <input
                        type="text"
                        name="cedula"
                        placeholder="Cédula"
                        value={formData.cedula}
                        onChange={handleChange}
                        className={`form-input ${errors.cedula ? 'error' : ''}`}
                        required
                      />
                    </div>
                    {errors.cedula && <span className="error-text">{errors.cedula}</span>}
                  </div>

                  <div className="form-group">
                    <div className="input-wrapper">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`form-input ${errors.telefono ? 'error' : ''}`}
                        required
                      />
                    </div>
                    {errors.telefono && <span className="error-text">{errors.telefono}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="auth-btn secondary"
                    onClick={() => navigate('/')}
                  >
                    Volver al login
                  </button>
                  <button
                    type="button"
                    className="auth-btn primary"
                    onClick={handleNextStep}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h3>Cuenta y Contraseña</h3>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      type="text"
                      name="direccion"
                      placeholder="Dirección"
                      value={formData.direccion}
                      onChange={handleChange}
                      className={`form-input ${errors.direccion ? 'error' : ''}`}
                      required
                    />
                  </div>
                  {errors.direccion && <span className="error-text">{errors.direccion}</span>}
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      required
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmarPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmarPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmarPassword ? 'error' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmarPassword && <span className="error-text">{errors.confirmarPassword}</span>}
                </div>

                <div className="password-strength">
                  <div className="strength-indicator">
                    <div className={`strength-bar ${formData.password.length >= 6 ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${formData.password.length >= 8 ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'active' : ''}`}></div>
                    <div className={`strength-bar ${/(?=.*\d)/.test(formData.password) ? 'active' : ''}`}></div>
                  </div>
                  <p>La contraseña debe tener al menos 6 caracteres</p>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="auth-btn secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="auth-btn primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      'Crear cuenta'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="register-info">
          <h3>¿Por qué elegir Apolo GYM?</h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🏋️‍♂️</span>
              <h4>Equipamiento Premium</h4>
              <p>Máquinas de última tecnología para todos los niveles</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">👨‍🏫</span>
              <h4>Entrenadores Certificados</h4>
              <p>Profesionales con experiencia en diferentes disciplinas</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📱</span>
              <h4>App Móvil</h4>
              <p>Seguimiento de rutinas y progreso desde tu smartphone</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🕐</span>
              <h4>Horarios Flexibles</h4>
              <p>Acceso 24/7 para que entrenes cuando puedas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
