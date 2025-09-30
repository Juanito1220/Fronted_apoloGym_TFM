import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Target, Zap, Plus, Save, Trash2, X, Users, TrendingUp } from "lucide-react";
import "../../Styles/miplan.css";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const START_HOUR = 6;   // 06:00
const END_HOUR = 22;  // 22:00
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
      data[keyOf(1, 7)] = { title: "Full Body A", color: "#16a34a", notes: "Banca / Sentadilla / Remo" };
      data[keyOf(3, 19)] = { title: "Full Body B", color: "#f59e0b", notes: "Militar / Peso muerto / Dominadas" };
      data[keyOf(5, 9)] = { title: "Cardio + Core", color: "#06b6d4", notes: "30’ HIIT + 15’ core" };
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
    <div className="miplan-modern">
      {/* Header moderno */}
      <div className="miplan-header">
        <div className="header-content">
          <div className="header-left">
            <div className="title-section">
              <div className="icon-wrapper">
                <Calendar className="header-icon" />
              </div>
              <div>
                <h1 className="main-title">Mi Plan de Entrenamiento</h1>
                <p className="subtitle">Planifica tu semana de ejercicios de forma inteligente</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn template-btn" onClick={() => applyTemplate("fullbody")}>
              <Target className="btn-icon" />
              Full-Body
            </button>
            <button className="action-btn template-btn" onClick={() => applyTemplate("ppl")}>
              <Zap className="btn-icon" />
              Push/Pull/Legs
            </button>
            <button className="action-btn danger-btn" onClick={clearAll}>
              <Trash2 className="btn-icon" />
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalSessions}</div>
            <div className="stat-label">Sesiones esta semana</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalSessions * 1.5}h</div>
            <div className="stat-label">Tiempo estimado</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Users className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{Math.round((totalSessions / 7) * 100)}%</div>
            <div className="stat-label">Consistencia semanal</div>
          </div>
        </div>
      </div>

      {/* GRID calendario moderno */}
      <div className="calendar-container">
        <div className="calendar-grid">
          {/* esquina vacía */}
          <div className="corner-cell">
            <Clock className="corner-icon" />
          </div>

          {/* cabecera de días */}
          {DAYS.map((day) => (
            <div key={day} className="day-header">
              <span className="day-name">{day}</span>
            </div>
          ))}

          {/* filas por hora */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="hour-cell">
                <span className="hour-time">{pad(hour)}:00</span>
              </div>
              {DAYS.map((_, dayIdx) => {
                const item = schedule[keyOf(dayIdx, hour)];
                return (
                  <div
                    key={`${dayIdx}-${hour}`}
                    className={`schedule-cell ${item ? "has-session" : "empty-cell"}`}
                    onClick={() => openEditor(dayIdx, hour)}
                  >
                    {item ? (
                      <div className="session-card" style={{ backgroundColor: item.color }}>
                        <div className="session-title">{item.title}</div>
                        {item.notes && <div className="session-notes">{item.notes}</div>}
                      </div>
                    ) : (
                      <div className="add-session">
                        <Plus className="add-icon" />
                        <span className="add-text">Agregar</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Editor modal moderno */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Calendar className="modal-icon" />
                <div>
                  <h3>{DAYS[editing.dayIdx]} - {pad(editing.hour)}:00</h3>
                  <p>Configura tu sesión de entrenamiento</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setEditing(null)}>
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">
                  <Target className="label-icon" />
                  Nombre del entrenamiento
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Entrenamiento de Pecho y Tríceps"
                  value={editing.title}
                  onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Zap className="label-icon" />
                  Color del entrenamiento
                </label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    className="color-input"
                    value={editing.color}
                    onChange={(e) => setEditing((s) => ({ ...s, color: e.target.value }))}
                  />
                  <div className="color-preview" style={{ backgroundColor: editing.color }}></div>
                  <span className="color-label">Selecciona un color identificativo</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock className="label-icon" />
                  Detalles y notas
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Ejemplo: 4 series x 8-12 reps, Banca plana, Inclinado con mancuernas, Press militar..."
                  value={editing.notes}
                  onChange={(e) => setEditing((s) => ({ ...s, notes: e.target.value }))}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setEditing(null)}>
                <X className="btn-icon" />
                Cancelar
              </button>
              {schedule[keyOf(editing.dayIdx, editing.hour)] && (
                <button className="danger-btn" onClick={deleteSlot}>
                  <Trash2 className="btn-icon" />
                  Eliminar
                </button>
              )}
              <button className="primary-btn" onClick={saveEditor}>
                <Save className="btn-icon" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
