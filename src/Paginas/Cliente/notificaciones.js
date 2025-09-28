import React, { useEffect, useState } from "react";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/notificaciones.css";

const KEY = "demo_notifs";
const DEMO = [
  { id:"n1", fecha:new Date().toISOString(), titulo:"Rutina actualizada", msg:"Tu entrenador ajustó el bloque de pierna para la próxima semana." },
  { id:"n2", fecha:new Date().toISOString(), titulo:"Reserva confirmada", msg:"Spinning 19:00 con Marta para hoy." },
  { id:"n3", fecha:new Date().toISOString(), titulo:"Pago registrado", msg:"Se registró tu último pago de membresía." },
];

export default function Notificaciones(){
  const [items, setItems] = useState([]);

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem(KEY) || "null");
    if(data) setItems(data);
    else setItems(DEMO);
  },[]);

  const limpiar = ()=>{
    if(!window.confirm("¿Vaciar notificaciones?")) return;
    localStorage.setItem(KEY, JSON.stringify([]));
    setItems([]);
  };

  return (
    <div className="container page notifs">
      <BackToMenu />
      <h1>Notificaciones</h1>
      <p className="lead">Novedades sobre tus pagos, reservas y rutinas.</p>

      <div className="notifs-head">
        <button className="btn-back-menu" onClick={limpiar}>Vaciar</button>
      </div>

      {items.length===0 ? (
        <p className="muted">No tienes notificaciones.</p>
      ) : (
        <ul className="notif-list">
          {items.map(n=>(
            <li key={n.id} className="notif">
              <div className="title">{n.titulo}</div>
              <div className="body">{n.msg}</div>
              <div className="date">{new Date(n.fecha).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
