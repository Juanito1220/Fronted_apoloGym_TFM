import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/rutinas.css";

/** ======= Datos de ejemplo (edítalos a tu gusto) ======= */
const RUTINA_CARDIO = [
  { ejercicio: "Jumping jacks", duracion: "2 minutos", series: 2, repes: "15–24", descanso: "15–45 s", icono: "🕺" },
  { ejercicio: "Salto en estrella", duracion: "2 minutos", series: 2, repes: "15–24", descanso: "15–45 s", icono: "🌟" },
  { ejercicio: "Sentadillas", duracion: "2 minutos", series: 2, repes: "15–24", descanso: "15–45 s", icono: "🏋️" },
  { ejercicio: "Tap backs", duracion: "2 minutos", series: 2, repes: "15–24", descanso: "15–45 s", icono: "👣" },
  { ejercicio: "Burpees", duracion: "2 minutos", series: 1, repes: "15–24", descanso: "15–45 s", icono: "🔥" },
];

const RUTINA_FUERZA = [
  { ejercicio: "Press banca", duracion: "—", series: 4, repes: "8–10", descanso: "60–90 s", icono: "🏋️‍♀️" },
  { ejercicio: "Remo con barra", duracion: "—", series: 4, repes: "8–10", descanso: "60–90 s", icono: "🏋️‍♂️" },
  { ejercicio: "Sentadilla trasera", duracion: "—", series: 4, repes: "6–8", descanso: "90–120 s", icono: "🦵" },
  { ejercicio: "Press militar", duracion: "—", series: 3, repes: "8–10", descanso: "60–90 s", icono: "💪" },
];

const RUTINA_HIIT = [
  { ejercicio: "Sprints estáticos", duracion: "30 s", series: 8, repes: "—", descanso: "30 s", icono: "⚡" },
  { ejercicio: "Mountain climbers", duracion: "30 s", series: 8, repes: "—", descanso: "30 s", icono: "⛰️" },
  { ejercicio: "High knees", duracion: "30 s", series: 8, repes: "—", descanso: "30 s", icono: "🦵" },
];

const MAPA_RUTINAS = {
  cardio: { titulo: "CARDIO (10 MINUTOS)", data: RUTINA_CARDIO },
  fuerza: { titulo: "FUERZA (COMPLETO)", data: RUTINA_FUERZA },
  hiit:   { titulo: "HIIT (INTERVALOS)", data: RUTINA_HIIT },
};

/** ======= Utils ======= */
const toMinutes = (txt) => {
  // "2 minutos" -> 2 ; "30 s" -> 0.5 ; "—" -> 0
  if (!txt || txt === "—") return 0;
  const m = txt.match(/(\d+)\s*min/i);
  if (m) return Number(m[1]);
  const s = txt.match(/(\d+)\s*s/i);
  if (s) return Number(s[1]) / 60;
  return 0;
};

const PROGRESO_KEY = "demo_progreso";

function pushToProgreso(items, categoria) {
  const rec = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    categoria,
    items, // [{ ejercicio, series, repes, duracion }]
  };
  try {
    const prev = JSON.parse(localStorage.getItem(PROGRESO_KEY) || "[]");
    prev.unshift(rec);
    localStorage.setItem(PROGRESO_KEY, JSON.stringify(prev));
  } catch {}
  return rec;
}

/** ======= Componente ======= */
export default function Rutinas() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("cardio"); // cardio | fuerza | hiit
  const rutina = MAPA_RUTINAS[tab];

  const totalMin = useMemo(() => {
    // suma estimada: min por ejercicio × series (si aplica)
    return rutina.data.reduce((acc, r) => acc + (toMinutes(r.duracion) * (r.series || 1)), 0);
  }, [rutina]);

  const agregarTodoAlProgreso = () => {
    const items = rutina.data.map(({ ejercicio, series, repes, duracion }) => ({
      ejercicio, series, repes, duracion
    }));
    const rec = pushToProgreso(items, tab);
    // Aviso no bloqueante
    const ok = document.getElementById("rtn-ok");
    if (ok) {
      ok.innerText = `Rutina guardada en Progreso (${new Date(rec.ts).toLocaleString()})`;
      ok.style.display = "block";
      setTimeout(()=>{ ok.style.display = "none"; }, 2500);
    }
  };

  return (
    <div className="rtn-page">
      {/* Top */}
      <div className="rtn-top">
        <BackToMenu />
        <div>
          <h1 className="rtn-title">Entrenamientos y rutinas</h1>
          <p className="rtn-sub">
            Selecciona una rutina y envíala a tu <Link to="/progreso">Progreso</Link>.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rtn-tabs">
        <button className={`rtn-tab ${tab==="cardio"?"active":""}`} onClick={()=>setTab("cardio")}>Cardio</button>
        <button className={`rtn-tab ${tab==="fuerza"?"active":""}`} onClick={()=>setTab("fuerza")}>Fuerza</button>
        <button className={`rtn-tab ${tab==="hiit"?"active":""}`} onClick={()=>setTab("hiit")}>HIIT</button>

        <div className="rtn-meta">
          <span className="pill">{rutina.titulo}</span>
          <span className="pill light">~ {Math.round(totalMin)} min</span>
        </div>
      </div>

      {/* Tarjeta / Tabla */}
      <section className="card rtn-card">
        <div className="ribbon-green">{rutina.titulo}</div>

        {/* Encabezados */}
        <div className="tbl grid header">
          <div>Ejercicio</div>
          <div>Duración</div>
          <div>Series</div>
          <div>Repeticiones por serie</div>
          <div>Descanso</div>
          <div>Ilustración</div>
          <div className="center">Acción</div>
        </div>

        {/* Filas */}
        {rutina.data.map((r, i) => (
          <div className="tbl grid row" key={i}>
            <div className="cell">{r.ejercicio}</div>
            <div className="cell">{r.duracion}</div>
            <div className="cell center">{r.series ?? "—"}</div>
            <div className="cell">{r.repes ?? "—"}</div>
            <div className="cell">{r.descanso ?? "—"}</div>
            <div className="cell icon">
              <span className="emoji" role="img" aria-label={r.ejercicio}>{r.icono}</span>
            </div>
            <div className="cell center">
              <button
                className="btn mini"
                onClick={() => {
                  pushToProgreso([{ ejercicio: r.ejercicio, series: r.series, repes: r.repes, duracion: r.duracion }], tab);
                  const ok = document.getElementById("rtn-ok");
                  if (ok) {
                    ok.innerText = `“${r.ejercicio}” añadido a Progreso`;
                    ok.style.display = "block";
                    setTimeout(()=>{ ok.style.display = "none"; }, 1800);
                  }
                }}
              >
                Añadir a progreso
              </button>
            </div>
          </div>
        ))}

        <div className="rtn-actions">
          <button className="btn primary" onClick={agregarTodoAlProgreso}>
            Añadir rutina completa a Progreso
          </button>
          <Link className="btn outline" to="/progreso">Ver Progreso</Link>
          <div id="rtn-ok" className="rtn-ok" style={{display:"none"}} />
        </div>
      </section>
    </div>
  );
}
