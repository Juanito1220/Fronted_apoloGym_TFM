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

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
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
        navigate('/login');
      }, 2000);

      setIsLoading(false);
    }, 1500);
  };

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

          <div className="steps-indicator">
            <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <span>Información Personal</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span>Cuenta y Contraseña</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {mensaje && (
              <div className={mensaje.includes('exitosamente') ? 'success-message' : 'error-message'}>
                <span>{mensaje}</span>
              </div>
            )}

            {currentStep === 1 && (
              <div className="form-step active">
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
                  {errors.nombre && <div className="error-message">{errors.nombre}</div>}
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
                  {errors.apellido && <div className="error-message">{errors.apellido}</div>}
                </div>

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
                  {errors.cedula && <div className="error-message">{errors.cedula}</div>}
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
                  {errors.telefono && <div className="error-message">{errors.telefono}</div>}
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="register-btn primary"
                    onClick={handleNextStep}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step active">
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
                  {errors.direccion && <div className="error-message">{errors.direccion}</div>}
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
                  {errors.email && <div className="error-message">{errors.email}</div>}
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
                  {errors.password && <div className="error-message">{errors.password}</div>}
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
                  {errors.confirmarPassword && <div className="error-message">{errors.confirmarPassword}</div>}
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="register-btn secondary"
                    onClick={handlePreviousStep}
                  >
                    Anterior
                  </button>
                  <button
                    type="submit"
                    className="register-btn primary"
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

          <div className="register-footer">
            <p>¿Ya tienes una cuenta?</p>
            <button
              className="login-link"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        <div className="register-info">
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
            {/* <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>App móvil incluida</span>
            </div> */}
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

export default Register;