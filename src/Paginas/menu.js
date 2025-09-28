import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ⬅️ importar Link
import '../Styles/menu.css';
import {
  FaUsers,
  FaUserTie,
  FaClock,
  FaMoneyBill,
  FaClipboardList,
  FaChartBar,
  FaAppleAlt,
  FaChartLine,
  FaClipboardCheck,
  FaUserCircle,
} from 'react-icons/fa';

const Menu = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="menu-wrapper">
      {/* Menú lateral izquierdo */}
      <aside className="sidebar">
        <Link to="/clientes" className="menu-item">
          <FaUsers className="menu-icon" />
          <span>Clientes</span>
        </Link>

        <Link to="/planes" className="menu-item">
          <FaClipboardList className="menu-icon" />
          <span>Planes/Membresías</span>
        </Link>

        <Link to="/rutinas" className="menu-item">
          <FaChartBar className="menu-icon" />
          <span>Entrenamientos/Rutinas</span>
        </Link>

        <Link to="/reserva" className="menu-item">
          <FaClock className="menu-icon" />
          <span>Reservas/Turnos</span>
        </Link>

        <Link to="/pagos" className="menu-item">
          <FaMoneyBill className="menu-icon" />
          <span>Pagos</span>
        </Link>

        <Link to="/entrenadores" className="menu-item">
          <FaUserTie className="menu-icon" />
          <span>Entrenadores</span>
        </Link>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Menú superior derecho con el icono de usuario */}
        <div className="user-topbar">
          <div
            className="user-icon-container"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <FaUserCircle className="user-icon" />
          </div>
          {dropdownVisible && (
            <div className="user-dropdown">
              <button>Perfil de Usuario</button>
              <button>Configuración</button>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>

        <div className="welcome-message">
          <h1>Bienvenida 👋</h1>
          <p>Selecciona una opción del menú para comenzar</p>

          <img src="" alt="Gimnasio" className="banner-image" />

          <div className="cards-container">
            <div className="card">
              <FaClock className="card-icon" />
              <h3>Calendario</h3>
              <p>Revisa tus entrenamientos y horarios.</p>
              <Link className="btn" to="/calendario">Ver calendario</Link>
            </div>

            <div className="card">
              <FaAppleAlt className="card-icon" />
              <h3>Alimentación</h3>
              <p>Consejos y planes saludables.</p>
              <Link className="btn" to="/alimentacion">Ver guía</Link>
            </div>

            <div className="card">
              <FaChartLine className="card-icon" />
              <h3>Progreso</h3>
              <p>Monitorea tu evolución corporal.</p>
              <Link className="btn" to="/progreso">Ver progreso</Link>
            </div>

            <div className="card">
              <FaClipboardCheck className="card-icon" />
              <h3>Mi plan</h3>
              <p>Accede a tu plan personalizado.</p>
              <Link className="btn" to="/miplan">Ver plan</Link>{/* tu ruta real */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;

