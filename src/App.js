import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "./Componentes/header";
import Footer from "./Componentes/footer";
import "./App.css";
import { AuthProvider } from "./Auth/AuthContext";
import PrivateRoute from "./Auth/PrivateRoute";
import RequireRole from "./Auth/RequiereRol";

// Páginas públicas
import Nosotros from "./Paginas/Principal/nosotros";
import Servicios from "./Paginas/Principal/servicios";
import Contactos from "./Paginas/Principal/contactos";
import PaginaPrincipal from "./Paginas/Principal/principal";
import Login from "./Paginas/Principal/login";
import Registro from "./Paginas/Principal/registro";
import RecuperarContraseña from "./Paginas/Principal/recuperarPassword";

// Cliente
import ClientLayout from "./Paginas/Cliente/ClientLayout";
import ClienteDashboard from "./Paginas/Cliente/cliente_dashboard";
import Calendario from "./Paginas/Cliente/calendario";
import Alimentacion from "./Paginas/Cliente/alimentacion";
import Progreso from "./Paginas/Cliente/progreso";
import MiPlan from "./Paginas/Cliente/miplan";
import Planes from "./Paginas/Cliente/planes_menbresias";
import Rutinas from "./Paginas/Cliente/rutinas";
import Reservacion from "./Paginas/Cliente/reserva_turno";
import Pago from "./Paginas/Cliente/pagos";
import Notificaciones from "./Paginas/Cliente/notificaciones";
import Historial from "./Paginas/Cliente/historial";
import Perfil from "./Paginas/Cliente/perfil";

// Admin
import AdminLayout from "./Paginas/Admin/AdminLayout";
import UsuariosRoles from "./Paginas/Admin/usuarios_roles";
import PlanesConfig from "./Paginas/Admin/planes_config";
import Reportes from "./Paginas/Admin/reportes";
import Aforo from "./Paginas/Admin/aforo";
import SistemaConfig from "./Paginas/Admin/sistema_config";

// Entrenador
import TrainerLayout from "./Paginas/Entrenador/trainerLayout"; // ojo al casing
import TrainerDashboard from "./Paginas/Entrenador/entrenador_dashboard";
import AsignarRutina from "./Paginas/Entrenador/asignar_rutina";
import RegistrarProgreso from "./Paginas/Entrenador/registrar_progreso";
import MarcarAsistencia from "./Paginas/Entrenador/marcar_asistencia";



function AppContent() {
  const location = useLocation();

  // Ocultar header/footer en vistas internas (cliente menú, admin, entrenador)
  const path = location.pathname;
  const ocultarHeaderYFooter =
    path === "/menu" || path.startsWith("/admin") || path.startsWith("/entrenador") || path.startsWith("/cliente");

  return (
    <>
      {!ocultarHeaderYFooter && <Header />}

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<PaginaPrincipal />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contactos" element={<Contactos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarContraseña />} />

        {/* Cliente (anidadas con layout) */}
        <Route path="/cliente" element={<ClientLayout />}>
          <Route index element={<ClienteDashboard />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="progreso" element={<Progreso />} />
          <Route path="miplan" element={<MiPlan />} />
          <Route path="alimentacion" element={<Alimentacion />} />
          <Route path="planes" element={<Planes />} />
          <Route path="rutinas" element={<Rutinas />} />
          <Route path="reserva" element={<Reservacion />} />
          <Route path="pagos" element={<Pago />} />
          <Route path="notificaciones" element={<Notificaciones />} />
          <Route path="historial" element={<Historial />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        {/* Rutas legacy para compatibilidad (redirigen al nuevo layout) */}
        <Route path="/menu" element={<Navigate to="/cliente" replace />} />
        <Route path="/calendario" element={<Navigate to="/cliente/calendario" replace />} />
        <Route path="/progreso" element={<Navigate to="/cliente/progreso" replace />} />
        <Route path="/miplan" element={<Navigate to="/cliente/miplan" replace />} />
        <Route path="/alimentacion" element={<Navigate to="/cliente/alimentacion" replace />} />
        <Route path="/planes" element={<Navigate to="/cliente/planes" replace />} />
        <Route path="/rutinas" element={<Navigate to="/cliente/rutinas" replace />} />
        <Route path="/reserva" element={<Navigate to="/cliente/reserva" replace />} />
        <Route path="/pagos" element={<Navigate to="/cliente/pagos" replace />} />
        <Route path="/notificaciones" element={<Navigate to="/cliente/notificaciones" replace />} />
        <Route path="/historial" element={<Navigate to="/cliente/historial" replace />} />
        <Route path="/perfil" element={<Navigate to="/cliente/perfil" replace />} />

        {/* Admin (anidadas) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/usuarios-roles" replace />} />
          <Route path="usuarios-roles" element={<UsuariosRoles />} />
          <Route path="planes" element={<PlanesConfig />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="aforo" element={<Aforo />} />
          <Route path="sistema" element={<SistemaConfig />} />
        </Route>

        {/* Entrenador (anidadas) */}
        <Route path="/entrenador" element={<TrainerLayout />}>
          <Route index element={<TrainerDashboard />} />
          <Route path="asignar-rutina" element={<AsignarRutina />} />
          <Route path="registrar-progreso" element={<RegistrarProgreso />} />
          <Route path="asistencia" element={<MarcarAsistencia />} />
        </Route>
      </Routes>

      {!ocultarHeaderYFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid #10b981',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
        }}
      />
    </Router>
  );
}
