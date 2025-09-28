// src/Paginas/Cliente/reserva_turno.js
import React, { useEffect, useMemo, useState } from "react";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/reserva.css";

import { useAuth } from "../../Auth/AuthContext";
import { trainerOfClient } from "../../Data/Stores/usuario.store";
import { pushReservaToCalendar } from "../../hooks/useCalendarEvents";
import { getPlanById } from "../../Data/Stores/planes.store";

const KEY = "demo_reservas";

/* Slots demo por sala e instructor */
const BASE_SLOTS = [
  { hora: "06:00", sala: "Pesas",     maquina: "Rack #1",  instructor: "Ana"   },
  { hora: "07:00", sala: "Pesas",     maquina: "Rack #2",  instructor: "Ana"   },
  { hora: "08:00", sala: "Cardio",    maquina: "Cinta #3", instructor: "Luis"  },
  { hora: "09:00", sala: "Funcional", maquina: "Caja #1",  instructor: "Pablo" },
  { hora: "18:00", sala: "Spinning",  maquina: "Bike #7",  instructor: "Marta" },
  { hora: "19:00", sala: "Spinning",  maquina: "Bike #8",  instructor: "Marta" },
];

export default function Reservacion() {
  const { user } = useAuth();

  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [filtroSala, setFiltroSala] = useState("Todas");
  const [reser, setReser] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Cargar reservas guardadas
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "[]");
      setReser(Array.isArray(data) ? data : []);
    } catch {
      setReser([]);
    }
  }, []);

  // Cargar plan seleccionado (soporta 2 llaves):
  // - "apolo_selected_plan": { id, name, price }
  // - "apolo_selected_plan_id": solo el id y se busca en store
  useEffect(() => {
    try {
      const rawObj = localStorage.getItem("apolo_selected_plan");
      if (rawObj) {
        const obj = JSON.parse(rawObj);
        if (obj && obj.id) {
          setSelectedPlan({
            id: obj.id,
            name: obj.name || "",
            price: Number(obj.price || 0),
          });
          return;
        }
      }
      const planIdOnly = localStorage.getItem("apolo_selected_plan_id");
      if (planIdOnly) {
        const p = getPlanById(planIdOnly);
        if (p) {
          setSelectedPlan({
            id: p.id,
            name: p.nombre || "",
            price: Number(p.precio || 0),
          });
          return;
        }
      }
      setSelectedPlan(null);
    } catch {
      setSelectedPlan(null);
    }
  }, []);

  // Slots filtrados por fecha/sala
  const slots = useMemo(() => {
    const daySeed = new Date(fecha).getDay(); // 0..6
    const rotated = [...BASE_SLOTS.slice(daySeed), ...BASE_SLOTS.slice(0, daySeed)];
    return rotated.filter((s) => (filtroSala === "Todas" ? true : s.sala === filtroSala));
  }, [fecha, filtroSala]);

  const reservar = (slot) => {
    const ok = window.confirm(
      `Confirmar reserva ${fecha} ${slot.hora} - ${slot.sala} (${slot.maquina}) con ${slot.instructor}`
    );
    if (!ok) return;

    const trainer = user?.id ? trainerOfClient(user.id) : null;

    const r = {
      id: (window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2,8)}`),
      fecha,
      ...slot,
      clientId: user?.id || null,
      trainerId: trainer?.id || null,
      // 🔗 enlaza el plan (si hay)
      planId: selectedPlan?.id || null,
      planName: selectedPlan?.name || null,
      planPrice: selectedPlan ? Number(selectedPlan.price || 0) : null,
    };

    const next = [r, ...reser];
    localStorage.setItem(KEY, JSON.stringify(next));
    setReser(next);

    // 👉 Empuja al calendario (incluye meta del plan)
    pushReservaToCalendar({
      fecha,
      hora: slot.hora,
      sala: slot.sala,
      maquina: slot.maquina,
      instructor: slot.instructor,
      clientId: user?.id || null,
      trainerId: trainer?.id || null,
      planId: selectedPlan?.id || null,
      planName: selectedPlan?.name || null,
      planPrice: selectedPlan ? Number(selectedPlan.price || 0) : null,
    });

    alert("Reserva registrada. Revisa tu calendario.");
    // Si quieres limpiar la selección del plan al reservar:
    // localStorage.removeItem("apolo_selected_plan");
    // localStorage.removeItem("apolo_selected_plan_id");
    // setSelectedPlan(null);
  };

  return (
    <div className="container page reserva">
      <BackToMenu />
      <h1>Reservar clase / turno</h1>
      <p className="lead">
        Selecciona fecha, sala y el horario disponible.&nbsp;
        <a href="/calendario">Ver en calendario</a>
      </p>

      {/* Banner del plan seleccionado */}
      {selectedPlan && (
        <div
          style={{
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            color: "#0f172a",
            padding: "12px 16px",
            borderRadius: 12,
            margin: "8px 0 16px",
          }}
        >
          <strong>Reservando para:</strong> {selectedPlan.name} — $
          {Number(selectedPlan.price || 0).toFixed(2)}/mes
        </div>
      )}

      <div className="res-controls">
        <div>
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <label>Sala</label>
          <select value={filtroSala} onChange={(e) => setFiltroSala(e.target.value)}>
            <option>Todas</option>
            <option>Pesas</option>
            <option>Cardio</option>
            <option>Funcional</option>
            <option>Spinning</option>
          </select>
        </div>
      </div>

      <div className="res-grid">
        {slots.map((s, i) => (
          <div className="res-slot" key={i}>
            <div className="big">{s.hora}</div>
            <div className="muted">{fecha}</div>
            <div className="sep" />
            <div>
              <strong>Sala:</strong> {s.sala}
            </div>
            <div>
              <strong>Máquina:</strong> {s.maquina}
            </div>
            <div>
              <strong>Instructor:</strong> {s.instructor}
            </div>
            <button className="btn-primary" onClick={() => reservar(s)}>
              Reservar
            </button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 16 }}>Mis reservas</h3>
      {reser.length === 0 ? (
        <p className="muted">Aún no tienes reservas.</p>
      ) : (
        <ul className="res-list">
          {reser.map((r) => (
            <li key={r.id}>
              <strong>
                {r.fecha} {r.hora}
              </strong>{" "}
              — {r.sala} · {r.maquina} · {r.instructor}
              {r.planName ? <> · <em>Plan: {r.planName}</em></> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
