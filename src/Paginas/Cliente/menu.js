import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/menu.css";
import "../../Styles/professional-sidebar.css";
import {
  FaBell,
  FaUserTie,
  FaClock,
  FaMoneyBill,
  FaClipboardList,
  FaDumbbell,
  FaAppleAlt,
  FaChartLine,
  FaClipboardCheck,
  FaHistory,
} from "react-icons/fa";
import AvatarMenu from "../../Componentes/AvatarMenu";

const Menu = () => {
  return (
    <div className="menu-wrapper">
      {/* Sidebar izquierdo */}
      <aside className="professional-sidebar client-theme">
        <div className="pro-sidebar-brand">
          <span className="pro-brand-icon">🏋️‍♂️</span>
          <span className="pro-brand-text">Apolo Gym</span>
        </div>

        <nav className="pro-sidebar-nav">
          <div className="pro-nav-section">Servicios</div>

          <Link to="/notificaciones" className="pro-nav-link">
            <FaBell className="pro-nav-icon" />
            <span>Notificaciones</span>
          </Link>

          <Link to="/planes" className="pro-nav-link">
            <FaClipboardList className="pro-nav-icon" />
            <span>Planes/Membresías</span>
          </Link>

          <Link to="/rutinas" className="pro-nav-link">
            <FaDumbbell className="pro-nav-icon" />
            <span>Entrenamientos/Rutinas</span>
          </Link>

          <Link to="/reserva" className="pro-nav-link">
            <FaClock className="pro-nav-icon" />
            <span>Reservas/Turnos</span>
          </Link>

          <Link to="/pagos" className="pro-nav-link">
            <FaMoneyBill className="pro-nav-icon" />
            <span>Pagos</span>
          </Link>

          <Link to="/entrenadores" className="pro-nav-link">
            <FaUserTie className="pro-nav-icon" />
            <span>Entrenadores</span>
          </Link>

          <Link to="/historial" className="pro-nav-link">
            <FaHistory className="pro-nav-icon" />
            <span>Historial</span>
          </Link>
        </nav>
      </aside>


      {/* Contenido principal */}
      <main className="main-content">
        {/* Topbar derecha con AvatarMenu */}
        <div className="client-topbar">
          <div className="spacer" />
          <AvatarMenu /> {/* ⬅️ aquí aparece Perfil / Configuración / Cerrar sesión */}
        </div>

        <div className="welcome-message">
          <h1>Bienvenida 👋</h1>
          <p>Selecciona una opción del menú para comenzar</p>


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
              <Link className="btn" to="/miplan">Ver plan</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
