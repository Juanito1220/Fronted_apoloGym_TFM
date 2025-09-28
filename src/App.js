/*import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

//export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./Componentes/header";
import Footer from "./Componentes/footer";
import "./App.css";
import { AuthProvider } from "./Auth/AuthContext";
import PrivateRoute from "./Auth/PrivateRoute";
import RequireRole from "./Auth/RequiereRol";

// Páginas públicas
import PaginaPrincipal from "./Paginas/Principal/principal";
import Nosotros from "./Paginas/nosotros";
import Servicios from "./Paginas/servicios";
import Contactos from "./Paginas/contactos";
import Login from "./Paginas/Principal/login";
import Registro from "./Paginas/Principal/registro";
import RecuperarContraseña from "./Paginas/Principal/recuperarPassword";

// Cliente
import Menu from "./Paginas/Cliente/menu";
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
import AdminMenu from "./Paginas/Admin/dashboard";
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
    path === "/menu" || path.startsWith("/admin") || path.startsWith("/entrenador");

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

        {/* Cliente */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/miplan" element={<MiPlan />} />
        <Route path="/alimentacion" element={<Alimentacion />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/rutinas" element={<Rutinas />} />
        <Route path="/reserva" element={<Reservacion />} />
        <Route path="/pagos" element={<Pago />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Admin (anidadas) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminMenu />} />
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
    </Router>
  );
}
