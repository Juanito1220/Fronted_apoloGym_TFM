import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Styles/calendario.css";

// Clave YYYY-MM-DD para guardar/buscar eventos por día
function formatKey(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function Calendario() {
  // Fecha seleccionada en el calendario
  const [date, setDate] = useState(new Date());

  // Eventos por día { "2025-09-20": [ {id, title, start, end, notes}, ... ] }
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("apolo_gym_events");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Formulario
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("07:00");
  const [end, setEnd] = useState("08:00");
  const [notes, setNotes] = useState("");

  // Día actual
  const dayKey = useMemo(() => formatKey(date), [date]);
  const dayEvents = events[dayKey] || [];

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem("apolo_gym_events", JSON.stringify(events));
  }, [events]);

  // Acciones
  const addEvent = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item = { id: crypto.randomUUID(), title: title.trim(), start, end, notes };
    setEvents((prev) => ({ ...prev, [dayKey]: [...(prev[dayKey] || []), item] }));
    setTitle(""); setNotes("");
  };

  const deleteEvent = (id) => {
    setEvents((prev) => ({
      ...prev,
      [dayKey]: (prev[dayKey] || []).filter((ev) => ev.id !== id),
    }));
  };

  const goToday = () => setDate(new Date());
  const goPrev = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(d);
  };
  const goNext = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(d);
  };

  return (
    <div className="cal-page">
      {/* Barra superior */}
      <div className="cal-top">
        <div className="left">
          <h1 className="cal-title">Calendario</h1>
          <div className="cal-sub">Planifica tus entrenamientos y clases</div>
        </div>

        <div className="right">
          <button className="btn" onClick={goPrev}>◀︎ Anterior</button>
          <button className="btn" onClick={goToday}>Hoy</button>
          <button className="btn" onClick={goNext}>Siguiente ▶︎</button>
        </div>
      </div>

      {/* Layout dos columnas */}
      <div className="cal-grid">
        {/* Columna 1: calendario (selector de día) */}
        <section className="cal-col card">
          <Calendar
            onChange={setDate}
            value={date}
            locale="es-ES"
            showNeighboringMonth={false}
            tileContent={({ date: d, view }) => {
              if (view !== "month") return null;
              const k = formatKey(d);
              const count = (events[k] || []).length;
              return count ? <div className="dot" title={`${count} actividad(es)`} /> : null;
            }}
          />
        </section>

        {/* Columna 2: detalle del día */}
        <section className="cal-col card">
          <div className="day-header">
            <div className="day-date">
              {date.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="day-count">{dayEvents.length} actividades</div>
          </div>

          {/* FORMULARIO (aquí agregas nuevas actividades) */}
          <form className="event-form" onSubmit={addEvent}>
            <div className="row">
              <label>Título</label>
              <input
                type="text"
                placeholder="Ej. Fuerza – Pecho y tríceps"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="row two">
              <div>
                <label>Inicio</label>
                <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <label>Fin</label>
                <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>

            <div className="row">
              <label>Notas</label>
              <textarea
                placeholder="Ej. 4×10 press banca, 3×12 fondos, 15' cardio"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="row">
              <button className="btn primary" type="submit">Guardar actividad</button>
            </div>
          </form>

          {/* Lista de actividades del día */}
          <ul className="event-list">
            {dayEvents
              .slice()
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((ev) => (
                <li key={ev.id} className="event-item">
                  <div className="time">{ev.start}–{ev.end}</div>
                  <div className="info">
                    <div className="title">{ev.title}</div>
                    {ev.notes ? <div className="notes">{ev.notes}</div> : null}
                  </div>
                  <button className="icon-btn" title="Eliminar" onClick={() => deleteEvent(ev.id)}>✕</button>
                </li>
              ))}
            {!dayEvents.length && (
              <li className="empty">Aún no hay actividades para este día.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
