// src/Paginas/Cliente/reserva_turno.js
import React, { useEffect, useMemo, useState } from "react";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/reserva.css";

import { useAuth } from "../../Auth/AuthContext";
import { trainerOfClient } from "../../Data/Stores/usuario.store";
import { pushReservaToCalendar } from "../../hooks/useCalendarEvents";

const KEY = "demo_reservas";

/* Slots demo por sala e instructor */
const BASE_SLOTS = [
  { hora: "06:00", sala:"Pesas",     maquina:"Rack #1",  instructor:"Ana"  },
  { hora: "07:00", sala:"Pesas",     maquina:"Rack #2",  instructor:"Ana"  },
  { hora: "08:00", sala:"Cardio",    maquina:"Cinta #3", instructor:"Luis" },
  { hora: "09:00", sala:"Funcional", maquina:"Caja #1",  instructor:"Pablo"},
  { hora: "18:00", sala:"Spinning",  maquina:"Bike #7",  instructor:"Marta"},
  { hora: "19:00", sala:"Spinning",  maquina:"Bike #8",  instructor:"Marta"},
];

export default function Reservacion(){
  // ✅ hooks SIEMPRE dentro del componente
  const { user } = useAuth();

  const [fecha, setFecha] = useState(()=>new Date().toISOString().slice(0,10));
  const [filtroSala, setFiltroSala] = useState("Todas");
  const [reser, setReser] = useState([]);

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem(KEY) || "[]");
    setReser(Array.isArray(data) ? data : []);
  },[]);

  const slots = useMemo(()=>{
    const daySeed = new Date(fecha).getDay(); // 0..6
    const rotated = [...BASE_SLOTS.slice(daySeed), ...BASE_SLOTS.slice(0,daySeed)];
    return rotated.filter(s => filtroSala==="Todas" ? true : s.sala===filtroSala);
  },[fecha, filtroSala]);

  const reservar = (slot) => {
    const ok = window.confirm(`Confirmar reserva ${fecha} ${slot.hora} - ${slot.sala} (${slot.maquina}) con ${slot.instructor}`);
    if(!ok) return;

    const trainer = user?.id ? trainerOfClient(user.id) : null;

    const r = {
      id: crypto.randomUUID(),
      fecha,
      ...slot,
      clientId: user?.id || null,
      trainerId: trainer?.id || null,
    };

    const next = [r, ...reser];
    localStorage.setItem(KEY, JSON.stringify(next));
    setReser(next);

    // 👉 Empuja al calendario
    pushReservaToCalendar({
      fecha,
      hora: slot.hora,
      sala: slot.sala,
      maquina: slot.maquina,
      instructor: slot.instructor,
      clientId: user?.id || null,
      trainerId: trainer?.id || null,
    });

    alert("Reserva registrada. Revisa tu calendario.");
  };

  return (
    <div className="container page reserva">
      <BackToMenu />
      <h1>Reservar clase / turno</h1>
      <p className="lead">Selecciona fecha, sala y el horario disponible.&nbsp;
        <a href="/calendario">Ver en calendario</a>
      </p>

      <div className="res-controls">
        <div>
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} />
        </div>
        <div>
          <label>Sala</label>
          <select value={filtroSala} onChange={e=>setFiltroSala(e.target.value)}>
            <option>Todas</option>
            <option>Pesas</option>
            <option>Cardio</option>
            <option>Funcional</option>
            <option>Spinning</option>
          </select>
        </div>
      </div>

      <div className="res-grid">
        {slots.map((s,i)=>(
          <div className="res-slot" key={i}>
            <div className="big">{s.hora}</div>
            <div className="muted">{fecha}</div>
            <div className="sep" />
            <div><strong>Sala:</strong> {s.sala}</div>
            <div><strong>Máquina:</strong> {s.maquina}</div>
            <div><strong>Instructor:</strong> {s.instructor}</div>
            <button className="btn-primary" onClick={()=>reservar(s)}>Reservar</button>
          </div>
        ))}
      </div>

      <h3 style={{marginTop:16}}>Mis reservas</h3>
      {reser.length===0 ? (
        <p className="muted">Aún no tienes reservas.</p>
      ) : (
        <ul className="res-list">
          {reser.map(r=>(
            <li key={r.id}>
              <strong>{r.fecha} {r.hora}</strong> — {r.sala} · {r.maquina} · {r.instructor}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
