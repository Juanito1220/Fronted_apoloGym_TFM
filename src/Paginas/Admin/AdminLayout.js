import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../Styles/admin.css";
import AvatarMenu from "../../Componentes/AvatarMenu"; // 👈 import

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-aside">
        <div className="admin-brand" onClick={() => navigate("/admin")}>
          <span>⚡</span> Apolo Admin
        </div>

        <nav className="admin-nav">
          <div className="admin-section">Gestión</div>
          <NavLink to="/admin/usuarios-roles" className="admin-link">Usuarios y roles</NavLink>
          <NavLink to="/admin/planes" className="admin-link">Planes</NavLink>
          <NavLink to="/admin/aforo" className="admin-link">Aforo</NavLink>

          <div className="admin-section">Informes</div>
          <NavLink to="/admin/reportes" className="admin-link">Reportes</NavLink>

          <div className="admin-section">Sistema</div>
          <NavLink to="/admin/sistema" className="admin-link">Configuración</NavLink>
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
