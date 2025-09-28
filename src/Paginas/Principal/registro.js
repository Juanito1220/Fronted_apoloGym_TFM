import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir al login
import '../../Styles/registro.css';

const Register = () => {
  const navigate = useNavigate(); // Redirección

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

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleVolver = () => {
    navigate('/'); // Redirige al login
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      setMensaje('⚠️ Las contraseñas no coinciden');
      return;
    }

    // Aquí podrías enviar los datos al backend
    console.log('Datos registrados:', formData);
    setMensaje('✅ ¡Usuario registrado exitosamente!');

    // Limpiar formulario
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      direccion: '',
      email: '',
      password: '',
      confirmarPassword: '',
    });

    // Opcional: redirigir al login tras unos segundos
    setTimeout(() => {
      navigate('/');
    }, 2000); // Redirige después de 2 segundos
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="form-registro">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cedula"
          placeholder="Cédula"
          value={formData.cedula}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmarPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmarPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrar</button>

        <button type="button" className="btn-volver" onClick={handleVolver}>
          Salir
        </button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default Register;
