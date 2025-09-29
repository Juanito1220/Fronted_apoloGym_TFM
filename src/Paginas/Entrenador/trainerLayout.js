import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { FaDumbbell } from "react-icons/fa";
import "../../Styles/trainer.css";
import "../../Styles/professional-sidebar.css";
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
          <div className="pro-nav-section">Panel Principal</div>

          <NavLink
            to="/entrenador"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <FaDumbbell className="pro-nav-icon" />
            <span>Panel del Entrenador</span>
          </NavLink>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="trainer-main">
        <header className="trainer-topbar">
          <div className="trainer-top-title">Panel del entrenador</div>

          <div className="trainer-top-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
