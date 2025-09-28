import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/reserva.css";

/* ====== Catálogo base ====== */
const ROOMS = [
  { id: "pesas", name: "Sala de Pesas" },
  { id: "func", name: "Sala Funcional" },
  { id: "cardio", name: "Cardio" },
  { id: "spin", name: "Spinning" },
];

const MACHINES = {
  pesas: [
    { id: "press1", name: "Press banca #1" },
    { id: "smith1", name: "Smith #1" },
    { id: "remo1", name: "Remo bajo #1" },
  ],
  func: [
    { id: "rack1", name: "Power rack" },
    { id: "kb1", name: "Kettlebells" },
    { id: "trx1", name: "TRX" },
  ],
  cardio: [
    { id: "tread1", name: "Cinta #1" },
    { id: "tread2", name: "Cinta #2" },
    { id: "ellip1", name: "Elíptica #1" },
  ],
  spin: [
    { id: "bike1", name: "Bici #1" },
    { id: "bike2", name: "Bici #2" },
    { id: "bike3", name: "Bici #3" },
  ],
};

const INSTRUCTORS = [
  { id: "ana", name: "Ana L." },
  { id: "luis", name: "Luis G." },
  { id: "tati", name: "Tati V." },
  { id: "joel", name: "Joel S." },
];

/* Horario del gimnasio por día (0=Dom..6=Sáb) */
const GYM_HOURS = {
  0: { open: "08:00", close: "14:00" },
  1: { open: "06:00", close: "22:00" },
  2: { open: "06:00", close: "22:00" },
  3: { open: "06:00", close: "22:00" },
  4: { open: "06:00", close: "22:00" },
  5: { open: "06:00", close: "22:00" },
  6: { open: "08:00", close: "18:00" },
};

const SLOT_MIN = 60;   // duración de turno
const CAPACITY = 6;    // cupos por turno/puesto

/* ========= Helpers ========= */
const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const timeAdd = (hhmm, mins) => {
  const [h, m] = hhmm.split(":").map(Number);
  const dt = new Date(2000, 0, 1, h, m);
  dt.setMinutes(dt.getMinutes() + mins);
  return `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
};
const timeRange = (open, close, stepMin) => {
  const out = [];
  for (let t = open; t < close; t = timeAdd(t, stepMin)) out.push(t);
  return out;
};

/* Genera una “agenda” de ejemplo por día:
   - Pesas: 06:00–22:00 (o según GYM_HOURS)
   - Funcional: bloques cada 90 min
   - Cardio: cada 60 min
   - Spinning: clases fijas
   Asigna instructor rotando. */
function generateDaySchedule(date) {
  const dow = date.getDay();
  const cfg = GYM_HOURS[dow];
  if (!cfg) return [];
  const { open, close } = cfg;

  const pick = (arr, i) => arr[i % arr.length];

  const blocks = [];

  // PESAS: cada 60' por máquina
  timeRange(open, close, SLOT_MIN).forEach((t, i) => {
    MACHINES.pesas.forEach((m, j) => {
      blocks.push({
        room: "pesas",
        machine: m.id,
        machineName: m.name,
        time: t,
        instructor: pick(INSTRUCTORS, i + j).id,
        capacity: CAPACITY,
      });
    });
  });

  // FUNCIONAL: cada 90'
  timeRange(open, timeAdd(close, -30), 90).forEach((t, i) => {
    const m = MACHINES.func[i % MACHINES.func.length];
    blocks.push({
      room: "func",
      machine: m.id,
      machineName: m.name,
      time: t,
      instructor: pick(INSTRUCTORS, i + 1).id,
      capacity: CAPACITY,
    });
  });

  // CARDIO: cada 60', máquinas
  timeRange(open, close, 60).forEach((t, i) => {
    MACHINES.cardio.forEach((m, j) => {
      blocks.push({
        room: "cardio",
        machine: m.id,
        machineName: m.name,
        time: t,
        instructor: pick(INSTRUCTORS, i + j + 2).id,
        capacity: CAPACITY,
      });
    });
  });

  // SPINNING: clases fijas
  ["07:00", "12:00", "18:00"].forEach((t, i) => {
    if (t >= open && t < close) {
      MACHINES.spin.forEach((m, j) => {
        blocks.push({
          room: "spin",
          machine: m.id,
          machineName: m.name,
          time: t,
          instructor: pick(INSTRUCTORS, i + j + 3).id,
          capacity: CAPACITY,
        });
      });
    }
  });

  return blocks;
}

/* ========= Página ========= */
export default function Reservas() {
  const navigate = useNavigate();

  // semana visible (0 = actual)
  const [weekOffset, setWeekOffset] = useState(0);
  const startOfWeek = useMemo(() => {
    const d = new Date();
    const day = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - (day - 1) + weekOffset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [weekOffset]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    }),
    [startOfWeek]
  );

  const [selectedDay, setSelectedDay] = useState(days[0]);
  useEffect(() => setSelectedDay(days[0]), [startOfWeek]);

  // bookings en localStorage -> { dateKey: { slotKey: booked } }
  const [book, setBook] = useState(() => {
    try { return JSON.parse(localStorage.getItem("apolo_book")) || {}; }
    catch { return {}; }
  });
  useEffect(() => localStorage.setItem("apolo_book", JSON.stringify(book)), [book]);

  // filtros
  const [roomFilter, setRoomFilter] = useState("all");
  const [machineFilter, setMachineFilter] = useState("all");
  const [instructorFilter, setInstructorFilter] = useState("all");

  // agenda del día
  const dayKey = toKey(selectedDay);
  const agenda = useMemo(() => generateDaySchedule(selectedDay), [selectedDay]);

  // opciones dinámicas de máquinas según sala
  const machineOptions = useMemo(() => {
    if (roomFilter === "all") return [];
    return MACHINES[roomFilter] || [];
  }, [roomFilter]);

  // agenda filtrada
  const filtered = useMemo(() => {
    return agenda.filter((b) => {
      if (roomFilter !== "all" && b.room !== roomFilter) return false;
      if (machineFilter !== "all" && machineFilter !== "all" && b.machine !== machineFilter) return false;
      if (instructorFilter !== "all" && b.instructor !== instructorFilter) return false;
      return true;
    }).sort((a, b) => a.time.localeCompare(b.time));
  }, [agenda, roomFilter, machineFilter, instructorFilter]);

  // cupos libres por bloque
  const freeFor = (slot) => {
    const k = `${slot.time}|${slot.room}|${slot.machine}|${slot.instructor}`;
    const d = book[dayKey] || {};
    return Math.max(0, slot.capacity - (d[k] || 0));
  };

  // reservar
  const onReserve = (slot) => {
    const k = `${slot.time}|${slot.room}|${slot.machine}|${slot.instructor}`;
    setBook((prev) => {
      const day = { ...(prev[dayKey] || {}) };
      const current = day[k] || 0;
      if (current >= slot.capacity) return prev;
      day[k] = current + 1;
      return { ...prev, [dayKey]: day };
    });
    alert(
      `✅ Reserva creada\n\nDía: ${selectedDay.toLocaleDateString("es-ES", { weekday:"long", day:"2-digit", month:"long" })}\n` +
      `Hora: ${slot.time}\nSala: ${ROOMS.find(r=>r.id===slot.room).name}\n` +
      `Máquina: ${slot.machineName}\nInstructor: ${INSTRUCTORS.find(i=>i.id===slot.instructor).name}`
    );
  };

  const monthLabel = selectedDay.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  // contador de disponibilidad por tarjeta de día
  const freeCountForDay = (d) => {
    const blocks = generateDaySchedule(d);
    const dKey = toKey(d);
    const map = book[dKey] || {};
    return blocks.reduce((acc, s) => {
      const k = `${s.time}|${s.room}|${s.machine}|${s.instructor}`;
      const left = Math.max(0, s.capacity - (map[k] || 0));
      return acc + left;
    }, 0);
  };

  return (
    <div className="rs-page">
      {/* Top */}
      <div className="rs-top">
        <button className="btn-link" onClick={() => navigate("/menu")}>← Regresar al menú</button>
        <h1 className="rs-title">Reservar un turno</h1>
      </div>

      {/* Semana y navegación */}
      <div className="rs-month">
        <div className="month">{monthLabel}</div>
        <div className="nav">
          <button className="btn-ghost" onClick={() => setWeekOffset((w) => w - 1)}>◀ Semana</button>
          <button className="btn-ghost" onClick={() => setWeekOffset(0)}>Hoy</button>
          <button className="btn-ghost" onClick={() => setWeekOffset((w) => w + 1)}>Semana ▶</button>
        </div>
      </div>

      {/* Días con disponibilidad total */}
      <div className="rs-days">
        {days.map((d) => {
          const active = toKey(d) === toKey(selectedDay);
          const dow = d.toLocaleDateString("es-ES", { weekday: "long" });
          const free = freeCountForDay(d);
          const hours = GYM_HOURS[d.getDay()];
          return (
            <button
              key={toKey(d)}
              className={`day ${active ? "active" : ""}`}
              onClick={() => setSelectedDay(d)}
            >
              <div className="dow">{dow.toUpperCase()}</div>
              <div className="num">{d.getDate()}</div>
              <div className="mon">{d.toLocaleDateString("es-ES", { month: "long" }).toUpperCase()}</div>
              <div className="hours">{hours ? `${hours.open} – ${hours.close}` : "CERRADO"}</div>
              <div className={`dot ${hours ? "ok" : "off"}`} />
              <div className="free">{hours ? `${free} lugares` : "—"}</div>
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      <section className="card rs-filters">
        <div className="f-group">
          <label>Sala</label>
          <select value={roomFilter} onChange={(e) => { setRoomFilter(e.target.value); setMachineFilter("all"); }}>
            <option value="all">Todas</option>
            {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <div className="f-group">
          <label>Máquina/Puesto</label>
          <select value={machineFilter} onChange={(e) => setMachineFilter(e.target.value)} disabled={roomFilter==="all"}>
            <option value="all">Todas</option>
            {machineOptions.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <div className="f-group">
          <label>Instructor</label>
          <select value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)}>
            <option value="all">Todos</option>
            {INSTRUCTORS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
      </section>

      {/* Slots del día con sala/máquina/instructor */}
      <section className="card rs-slots">
        <div className="rs-slots-head">
          <div className="h-title">
            {`Disponibilidad para ${selectedDay.toLocaleDateString("es-ES", { weekday:"long", day:"2-digit", month:"long" })}`}
          </div>
        </div>

        <div className="slot-grid">
          {filtered.map((s, idx) => {
            const free = freeFor(s);
            const room = ROOMS.find(r => r.id === s.room)?.name;
            const inst = INSTRUCTORS.find(i => i.id === s.instructor)?.name;
            return (
              <div key={`${s.time}-${s.room}-${s.machine}-${idx}`} className="slot-card">
                <div className="time">{s.time}</div>
                <div className="badges">
                  <span className="badge">{room}</span>
                  <span className="badge">{s.machineName}</span>
                  <span className="badge ghost">Instructor: {inst}</span>
                </div>
                <div className="actions">
                  <span className={`free ${free===0 ? "full" : ""}`}>{free===0 ? "Completo" : `${free} libres`}</span>
                  <button className="btn primary" disabled={free===0} onClick={() => onReserve(s)}>
                    Reservar
                  </button>
                </div>
              </div>
            );
          })}
          {!filtered.length && (
            <div className="empty">No hay turnos que cumplan con los filtros seleccionados.</div>
          )}
        </div>
      </section>
    </div>
  );
}
