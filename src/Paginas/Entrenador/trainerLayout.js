import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { FaTachometerAlt, FaClipboardList, FaChartLine, FaCheckCircle } from "react-icons/fa";
import "../../Styles/trainer.css";
import "../../Styles/professional-sidebar.css";
import BackToMenu from "../../Componentes/backtoMenu";
import AvatarMenu from "../../Componentes/AvatarMenu";

export default function TrainerLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="trainer-shell">
      {/* SIDEBAR (columna izquierda) */}
      <aside className="professional-sidebar trainer-theme">
        <div className="pro-sidebar-brand" onClick={() => navigate("/entrenador")}>
          <span className="pro-brand-icon">🏋️</span>
          <span className="pro-brand-text">Entrenador</span>
        </div>

        <nav className="pro-sidebar-nav">
          <div className="pro-nav-section">Panel de Control</div>

          <NavLink
            end
            to="/entrenador"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaTachometerAlt className="pro-nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <div className="pro-nav-section">Gestión de Clientes</div>

          <NavLink
            to="/entrenador/asignar-rutina"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaClipboardList className="pro-nav-icon" />
            <span>Asignar Rutina</span>
          </NavLink>

          <NavLink
            to="/entrenador/registrar-progreso"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaChartLine className="pro-nav-icon" />
            <span>Registrar Progreso</span>
          </NavLink>

          <NavLink
            to="/entrenador/asistencia"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaCheckCircle className="pro-nav-icon" />
            <span>Marcar Asistencia</span>
          </NavLink>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="trainer-main">
        <header className="trainer-topbar">
          <div className="trainer-top-title">Panel del entrenador</div>

          <div className="trainer-top-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Botones que ya usabas */}
            <BackToMenu to="/" label="← Ir al inicio" />


            {/* Avatar con menú (Perfil / Configuración / Cerrar sesión) */}
            <AvatarMenu title={user?.email} />
          </div>
        </header>

        <div className="trainer-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
