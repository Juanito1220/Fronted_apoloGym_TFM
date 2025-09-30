import React, { useEffect, useState } from "react";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/historial.css";

const KPAG = "demo_pagos";
const KRES = "demo_reservas";

export default function Historial(){
  const [pagos, setPagos] = useState([]);
  const [asis, setAsis] = useState([]);

  useEffect(()=>{
    setPagos(JSON.parse(localStorage.getItem(KPAG) || "[]"));
    // Usamos reservas como “asistencias” de ejemplo
    setAsis(JSON.parse(localStorage.getItem(KRES) || "[]"));
  },[]);

  return (
    <div className="container page historial">
      <BackToMenu />
      <h1>Historial</h1>
      <p className="lead">Pagos y asistencia (reservas realizadas).</p>

      <div className="hist-grid">
        <div className="card">
          <h3>Pagos</h3>
          {pagos.length===0 ? <p className="muted">Sin pagos.</p> : (
            <table>
              <thead>
                <tr><th>Fecha</th><th>Monto</th><th>Método</th></tr>
              </thead>
              <tbody>
                {pagos.map(p=>(
                  <tr key={p.id}>
                    <td>{new Date(p.fecha).toLocaleString()}</td>
                    <td>${p.monto.toFixed(2)}</td>
                    <td>{p.metodo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3>Asistencias</h3>
          {asis.length===0 ? <p className="muted">Sin asistencias.</p> : (
            <table>
              <thead>
                <tr><th>Fecha</th><th>Hora</th><th>Sala</th><th>Máquina</th><th>Instructor</th></tr>
              </thead>
              <tbody>
                {asis.map(a=>(
                  <tr key={a.id}>
                    <td>{a.fecha}</td><td>{a.hora}</td><td>{a.sala}</td><td>{a.maquina}</td><td>{a.instructor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
