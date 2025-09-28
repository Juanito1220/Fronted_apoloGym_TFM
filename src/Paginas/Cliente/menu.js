import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/menu.css";
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
} from "react-icons/fa";
import AvatarMenu from "../../Componentes/AvatarMenu"; // ⬅️ menú de perfil reutilizable

const Menu = () => {
  return (
    <div className="menu-wrapper">
      {/* Sidebar izquierdo */}
      <aside className="sidebar">
        <Link to="/notificaciones" className="menu-item">
          <FaUsers className="menu-icon" />
          <span>Notificaciones</span>
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

         <Link to="/historial" className="menu-item">
          <FaUserTie className="menu-icon" />
          <span>Historial</span>
        </Link>

         
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
