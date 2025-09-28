import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import "../../Styles/trainer.css";
import BackToMenu from "../../Componentes/backtoMenu";
import AvatarMenu from "../../Componentes/AvatarMenu";

export default function TrainerLayout(){
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="trainer-shell">
      {/* SIDEBAR (columna izquierda) */}
      <aside className="trainer-aside">
        <div className="trainer-brand" onClick={()=>navigate("/entrenador")}>
          <span>🏋️</span> Entrenador
        </div>

        <nav className="trainer-nav">
          <div className="trainer-section">Gestión</div>

          <NavLink
            end
            to="/entrenador"
            className={({isActive}) => "trainer-link" + (isActive ? " active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/entrenador/asignar-rutina"
            className={({isActive}) => "trainer-link" + (isActive ? " active" : "")}
          >
            Asignar rutina
          </NavLink>

          <NavLink
            to="/entrenador/registrar-progreso"
            className={({isActive}) => "trainer-link" + (isActive ? " active" : "")}
          >
            Registrar progreso
          </NavLink>

          <NavLink
            to="/entrenador/asistencia"
            className={({isActive}) => "trainer-link" + (isActive ? " active" : "")}
          >
            Marcar asistencia
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
