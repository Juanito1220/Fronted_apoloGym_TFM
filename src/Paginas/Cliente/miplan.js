import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/miplan.css";

const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const START_HOUR = 6;   // 06:00
const END_HOUR   = 22;  // 22:00
const STORAGE_KEY = "apolo_gym_schedule";

// util
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (dayIdx, hour) => `${dayIdx}-${hour}`;

// crea estructura vacía { "0-6": null, ... }
function emptySchedule() {
  const data = {};
  for (let d = 0; d < DAYS.length; d++) {
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      data[keyOf(d, h)] = null;
    }
  }
  return data;
}

export default function MiPlan() {
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : emptySchedule();
    } catch {
      return emptySchedule();
    }
  });

  // editor “popover” dentro de la celda
  const [editing, setEditing] = useState(null); 
  // { dayIdx, hour, title, color, notes }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  const openEditor = (dayIdx, hour) => {
    const cur = schedule[keyOf(dayIdx, hour)];
    setEditing({
      dayIdx,
      hour,
      title: cur?.title || "",
      color: cur?.color || "#2563eb",
      notes: cur?.notes || "",
    });
  };

  const saveEditor = () => {
    if (!editing) return;
    setSchedule((prev) => ({
      ...prev,
      [keyOf(editing.dayIdx, editing.hour)]: editing.title.trim()
        ? { title: editing.title.trim(), color: editing.color, notes: editing.notes.trim() }
        : null,
    }));
    setEditing(null);
  };

  const deleteSlot = () => {
    if (!editing) return;
    setSchedule((prev) => ({ ...prev, [keyOf(editing.dayIdx, editing.hour)]: null }));
    setEditing(null);
  };

  const clearAll = () => {
    if (window.confirm("¿Borrar toda la semana?")) setSchedule(emptySchedule());
  };

  // plantillas rápidas
  const applyTemplate = (name) => {
    const data = emptySchedule();
    if (name === "fullbody") {
      data[keyOf(1, 7)]  = { title: "Full Body A", color: "#16a34a", notes: "Banca / Sentadilla / Remo" };
      data[keyOf(3, 19)] = { title: "Full Body B", color: "#f59e0b", notes: "Militar / Peso muerto / Dominadas" };
      data[keyOf(5, 9)]  = { title: "Cardio + Core", color: "#06b6d4", notes: "30’ HIIT + 15’ core" };
    }
    if (name === "ppl") {
      data[keyOf(1, 7)] = { title: "PUSH", color: "#ef4444", notes: "Pecho Hombro Tríceps" };
      data[keyOf(2, 7)] = { title: "PULL", color: "#06b6d4", notes: "Espalda Bíceps" };
      data[keyOf(3, 7)] = { title: "LEGS", color: "#16a34a", notes: "Pierna" };
      data[keyOf(5, 10)] = { title: "PULL (ligero)", color: "#0ea5e9", notes: "" };
    }
    setSchedule(data);
  };

  const totalSessions = useMemo(
    () => Object.values(schedule).filter(Boolean).length,
    [schedule]
  );

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  return (
    <div className="mp-page">
      {/* Top */}
      <div className="mp-top">
        <div className="left">
          <button className="btn-link" onClick={() => navigate("/menu")}>
            ← Regresar al menú
          </button>
          <h1 className="mp-title">Mi plan semanal</h1>
          <div className="mp-sub">Horario de ejercicios en formato calendario</div>
        </div>
        <div className="right">
          <button className="btn" onClick={() => applyTemplate("fullbody")}>Plantilla Full-Body</button>
          <button className="btn" onClick={() => applyTemplate("ppl")}>Plantilla Push/Pull/Legs</button>
          <button className="btn danger" onClick={clearAll}>Limpiar</button>
        </div>
      </div>

      <div className="mp-meta">
        <span className="chip">{totalSessions} sesiones esta semana</span>
      </div>

      {/* GRID calendario */}
      <div className="mp-grid card">
        {/* esquina vacía */}
        <div className="corner" />
        {/* cabecera de días */}
        {DAYS.map((d) => (
          <div key={d} className="col-head">{d}</div>
        ))}

        {/* filas por hora */}
        {hours.map((h) => (
          <React.Fragment key={h}>
            <div className="row-head">{pad(h)}:00</div>
            {DAYS.map((_, dayIdx) => {
              const item = schedule[keyOf(dayIdx, h)];
              return (
                <div
                  key={`${dayIdx}-${h}`}
                  className={`cell ${item ? "busy" : ""}`}
                  onClick={() => openEditor(dayIdx, h)}
                >
                  {item ? (
                    <div className="pill" style={{ background: item.color }}>
                      <div className="pill-title">{item.title}</div>
                      {item.notes && <div className="pill-notes">{item.notes}</div>}
                    </div>
                  ) : (
                    <span className="hint">+</span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Editor dentro de la página */}
      {editing && (
        <div className="editor-mask" onClick={() => setEditing(null)}>
          <div className="editor" onClick={(e) => e.stopPropagation()}>
            <div className="editor-head">
              <strong>
                {DAYS[editing.dayIdx]} – {pad(editing.hour)}:00
              </strong>
            </div>

            <label>Título</label>
            <input
              type="text"
              placeholder="Ej. Fuerza – Pecho/Tríceps"
              value={editing.title}
              onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
            />

            <label>Color</label>
            <input
              type="color"
              value={editing.color}
              onChange={(e) => setEditing((s) => ({ ...s, color: e.target.value }))}
            />

            <label>Notas</label>
            <textarea
              rows={3}
              placeholder="Series, repeticiones, cardio, etc."
              value={editing.notes}
              onChange={(e) => setEditing((s) => ({ ...s, notes: e.target.value }))}
            />

            <div className="editor-actions">
              <button className="btn primary" onClick={saveEditor}>Guardar</button>
              {schedule[keyOf(editing.dayIdx, editing.hour)] && (
                <button className="btn danger" onClick={deleteSlot}>Eliminar</button>
              )}
              <button className="btn" onClick={() => setEditing(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
