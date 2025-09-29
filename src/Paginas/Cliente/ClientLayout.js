import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    FaBell,
    FaClock,
    FaMoneyBill,
    FaClipboardList,
    FaDumbbell,
    FaAppleAlt,
    FaChartLine,
    FaClipboardCheck,
    FaHistory,
    FaUserTie
} from "react-icons/fa";
import "../../Styles/menu.css";
import "../../Styles/professional-sidebar.css";
import AvatarMenu from "../../Componentes/AvatarMenu";

export default function ClientLayout() {
    const navigate = useNavigate();

    return (
        <div className="menu-wrapper">
            {/* SIDEBAR (columna izquierda) */}
            <aside className="professional-sidebar client-theme">
                <div className="pro-sidebar-brand" onClick={() => navigate("/cliente")}>
                    <span className="pro-brand-icon">🏋️‍♂️</span>
                    <span className="pro-brand-text">Apolo Gym</span>
                </div>

                <nav className="pro-sidebar-nav">
                    <div className="pro-nav-section">Servicios</div>

                    <NavLink
                        to="/cliente/notificaciones"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaBell className="pro-nav-icon" />
                        <span>Notificaciones</span>
                    </NavLink>

                    <NavLink
                        to="/cliente/perfil"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaUserTie className="pro-nav-icon" />
                        <span>Mi perfil</span>
                    </NavLink>

                    <div className="pro-nav-section">Entrenamientos</div>

                    <NavLink
                        to="/cliente/calendario"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaClock className="pro-nav-icon" />
                        <span>Calendario</span>
                    </NavLink>

                    <NavLink
                        to="/cliente/rutinas"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaDumbbell className="pro-nav-icon" />
                        <span>Rutinas</span>
                    </NavLink>

                    <NavLink
                        to="/cliente/reserva"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaClipboardList className="pro-nav-icon" />
                        <span>Reservar turno</span>
                    </NavLink>

                    <div className="pro-nav-section">Salud</div>

                    <NavLink
                        to="/cliente/alimentacion"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaAppleAlt className="pro-nav-icon" />
                        <span>Alimentación</span>
                    </NavLink>

                    <NavLink
                        to="/cliente/progreso"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaChartLine className="pro-nav-icon" />
                        <span>Progreso</span>
                    </NavLink>

                    <NavLink
                        to="/cliente/miplan"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaClipboardCheck className="pro-nav-icon" />
                        <span>Mi plan</span>
                    </NavLink>

                    <div className="pro-nav-section">Gestión</div>

                    <NavLink
                        to="/cliente/planes"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaClipboardList className="pro-nav-icon" />
                        <span>Planes</span>
                    </NavLink>

                    <NavLink
                        to="/cliente/pagos"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaMoneyBill className="pro-nav-icon" />
                        <span>Pagos</span>
                    </NavLink>

                    <NavLink
                        to="/cliente/historial"
                        className={({ isActive }) => `pro-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <FaHistory className="pro-nav-icon" />
                        <span>Historial</span>
                    </NavLink>
                </nav>
            </aside>

            {/* MAIN (columna derecha) */}
            <div className="client-main">
                {/* Topbar con AvatarMenu */}
                <header className="client-topbar">
                    <div className="spacer" />
                    <AvatarMenu />
                </header>

                {/* Contenido dinámico */}
                <div className="client-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}