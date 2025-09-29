import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUsers, FaClipboardList, FaDumbbell, FaChartBar, FaCog } from "react-icons/fa";
import "../../Styles/admin.css";
import "../../Styles/professional-sidebar.css";
import AvatarMenu from "../../Componentes/AvatarMenu";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="professional-sidebar admin-theme">
        <div className="pro-sidebar-brand" onClick={() => navigate("/admin/usuarios-roles")}>
          <span className="pro-brand-icon">⚡</span>
          <span className="pro-brand-text">Apolo Admin</span>
        </div>

        <nav className="pro-sidebar-nav">
          <div className="pro-nav-section">Gestión</div>
          <NavLink
            to="/admin/usuarios-roles"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaUsers className="pro-nav-icon" />
            <span>Usuarios y Roles</span>
          </NavLink>
          <NavLink
            to="/admin/planes"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaClipboardList className="pro-nav-icon" />
            <span>Planes</span>
          </NavLink>
          <NavLink
            to="/admin/aforo"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaDumbbell className="pro-nav-icon" />
            <span>Control de Aforo</span>
          </NavLink>

          <div className="pro-nav-section">Informes</div>
          <NavLink
            to="/admin/reportes"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaChartBar className="pro-nav-icon" />
            <span>Reportes</span>
          </NavLink>

          <div className="pro-nav-section">Sistema</div>
          <NavLink
            to="/admin/sistema"
            className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
          >
            <FaCog className="pro-nav-icon" />
            <span>Configuración</span>
          </NavLink>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-top-title">Panel de administración</div>
          <div className="admin-top-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>

            <AvatarMenu /> {/* 👈 avatar con menú (Perfil / Configuración / Cerrar sesión) */}
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
