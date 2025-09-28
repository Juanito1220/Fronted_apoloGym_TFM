import React from "react";
import { Link } from "react-router-dom";
import { listUsers } from "../../Data/Stores/usuario.store.js";
import { listPayments } from "../../Data/Stores/pagos.store.js";
import { listBookings } from "../../Data/Stores/reservas.store.js";
import { listAttendance } from "../../Data/Stores/aforo.store.js";

export default function AdminDashboard(){
  const users = listUsers();
  const pagos = listPayments();
  const reservas = listBookings();
  const asist = listAttendance();

  const clientes = users.filter(u => u.role === "cliente").length;
  const entrenadores = users.filter(u => u.role === "entrenador").length;
  const ingresos = pagos.reduce((acc,p)=> acc + (Number(p.total)||0), 0);

  return (
    <div className="container page" style={{padding:20}}>
      <h1>Panel de administración</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:12}}>
        <div className="card"><b>Clientes</b><div>{clientes}</div></div>
        <div className="card"><b>Entrenadores</b><div>{entrenadores}</div></div>
        <div className="card"><b>Reservas</b><div>{reservas.length}</div></div>
        <div className="card"><b>Ingresos (USD)</b><div>{ingresos.toFixed(2)}</div></div>
      </div>

      <h3 style={{marginTop:18}}>Gestión rápida</h3>
      <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
        <Link className="btn" to="/admin/usuarios-roles">Usuarios & Roles</Link>
        <Link className="btn" to="/admin/planes">Planes</Link>
        <Link className="btn" to="/admin/reportes">Reportes</Link>
        <Link className="btn" to="/admin/aforo">Control de aforo</Link>
        <Link className="btn" to="/admin/sistema">Configuración del sistema</Link>
      </div>
    </div>
  );
}
