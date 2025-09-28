import React from "react";
import { totalsByMonth, listPayments } from "../../Data/Stores/pagos.store";
import { listBookings } from "../../Data/Stores/reservas.store";
import { listAttendance } from "../../Data/Stores/aforo.store";
import { useNavigate } from "react-router-dom";
import BackToMenu from "../../Componentes/backtoMenu.js";

export default function Reportes(){
  const pays = listPayments();
  const book = listBookings();
  const att  = listAttendance();

  const porMes = totalsByMonth();
   const navigate = useNavigate();   // ← agrega esta línea

  return (
    <div className="container page" style={{padding:20}}>
      <h2>Reportes</h2>
        <div className="back-line">
        <button className="btn-back-menu" onClick={() => navigate("/dashboard")}>
            ← Regresar al menú
        </button>
        </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        <Card title="Pagos registrados" value={pays.length} />
        <Card title="Reservas" value={book.length} />
        <Card title="Eventos de aforo" value={att.length} />
      </div>

      <div style={{marginTop:16}}>
        <h3>Ingresos por mes</h3>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead><tr><th style={th}>Mes</th><th style={th}>Total</th></tr></thead>
          <tbody>
            {Object.entries(porMes).map(([m, t])=>(
              <tr key={m}><td style={td}>{m}</td><td style={td}>$ {t.toFixed(2)}</td></tr>
            ))}
            {!Object.keys(porMes).length && <tr><td style={td} colSpan={2}>Sin datos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Card({title, value}){
  return (
    <div style={{background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:14}}>
      <div style={{color:"#6b7280", fontSize:12, fontWeight:800}}>{title}</div>
      <div style={{fontSize:22, fontWeight:900}}>{value}</div>
    </div>
  );
}
const th = { padding:"8px 10px", borderBottom:"1px solid #e5e7eb", textAlign:"left" };
const td = { padding:"8px 10px", borderBottom:"1px solid #f3f4f6" };
