import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackTo from "../../Componentes/backtoMenu.js"; // 👈 importar el botón
import { occupancyNow, listAttendance, checkIn, checkOut } from "../../Data/Stores/aforo.store.js";

export default function Aforo(){
  const [occ, setOcc] = useState(()=>occupancyNow());
  const [logs, setLogs] = useState(()=>listAttendance());
  const [form, setForm] = useState({ userId:"", sala:"Principal" });

  const doIn  = () => { checkIn(form);  setOcc(occupancyNow()); setLogs(listAttendance()); setForm(f=>({...f,userId:""})); };
  const doOut = () => { checkOut(form); setOcc(occupancyNow()); setLogs(listAttendance()); setForm(f=>({...f,userId:""})); };


  const navigate = useNavigate();   // ← agrega esta línea



  return (
    <div className="container page" style={{padding:20}}>
      <h2>Control de aforo</h2>
        {/* Botón para volver al panel admin */}
      <BackTo to="/admin" label="← Regresar al panel admin" />
        
      <div style={{display:"grid", gridTemplateColumns:"1fr 2fr", gap:12}}>
        <div style={{background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:12}}>
          <h3>Check-in / Check-out manual</h3>
          <input placeholder="ID usuario" value={form.userId} onChange={(e)=>setForm(f=>({...f,userId:e.target.value}))} style={inp}/>
          <input placeholder="Sala" value={form.sala} onChange={(e)=>setForm(f=>({...f,sala:e.target.value}))} style={inp}/>
          <div style={{display:"flex", gap:8}}>
            <button onClick={doIn}>Entrar</button>
            <button onClick={doOut}>Salir</button>
          </div>

          <div style={{marginTop:14}}>
            <h4>Aforo actual por sala</h4>
            <ul>
              {Object.keys(occ).length ? Object.entries(occ).map(([s, n])=>(
                <li key={s}><b>{s}:</b> {n}</li>
              )) : <li>Sin movimientos</li>}
            </ul>
          </div>
        </div>

        <div>
          <h3>Actividad reciente</h3>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead><tr><th style={th}>Fecha</th><th style={th}>Usuario</th><th style={th}>Sala</th><th style={th}>Tipo</th></tr></thead>
            <tbody>
              {logs.slice().reverse().slice(0,50).map(r=>(
                <tr key={r.id}>
                  <td style={td}>{r.ts}</td>
                  <td style={td}>{r.userId}</td>
                  <td style={td}>{r.sala}</td>
                  <td style={td}>{r.type}</td>
                </tr>
              ))}
              {!logs.length && <tr><td style={td} colSpan={4}>Sin registros</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    //

  );
}
const th = { padding:"8px 10px", borderBottom:"1px solid #e5e7eb", textAlign:"left" };
const td = { padding:"8px 10px", borderBottom:"1px solid #f3f4f6" };
const inp= { width:"100%", padding:"10px 12px", margin:"6px 0", border:"1px solid #e5e7eb", borderRadius:10 };
