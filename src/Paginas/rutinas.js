import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/rutinas.css";

// Puedes cambiar/añadir filas aquí:
const RUTINA_CARDIO = [
  {
    ejercicio: "Jumping jacks",
    duracion: "2 minutos",
    series: 2,
    repes: "De 15 a 24",
    descanso: "15–45 segundos",
    // puedes poner una URL a PNG/SVG si tienes iconos propios
    icono: "🕺",
  },
  {
    ejercicio: "Salto en estrella",
    duracion: "2 minutos",
    series: 2,
    repes: "De 15 a 24",
    descanso: "15–45 segundos",
    icono: "🌟",
  },
  {
    ejercicio: "Sentadillas",
    duracion: "2 minutos",
    series: 2,
    repes: "De 15 a 24",
    descanso: "15–45 segundos",
    icono: "🏋️",
  },
  {
    ejercicio: "Tap backs",
    duracion: "2 minutos",
    series: 2,
    repes: "De 15 a 24",
    descanso: "15–45 segundos",
    icono: "👣",
  },
  {
    ejercicio: "Burpees",
    duracion: "2 minutos",
    series: 1,
    repes: "De 15 a 24",
    descanso: "15–45 segundos",
    icono: "🔥",
  },
];

export default function Rutinas() {
  const navigate = useNavigate();

  return (
    <div className="rtn-page">
      {/* Barra superior con botón */}
      <div className="rtn-top">
        <button className="btn-link" onClick={() => navigate("/menu")}>
          ← Regresar al menú
        </button>

        <div>
          <h1 className="rtn-title">Entrenamientos y rutinas</h1>
          <p className="rtn-sub">Tabla de cardio: 10 minutos de ejercicio</p>
        </div>
      </div>

      {/* Tarjeta con cabecera y tabla */}
      <section className="card rtn-card">
        <div className="ribbon-green">CARDIO (10 MINUTOS DE EJERCICIO)</div>

        {/* Encabezados */}
        <div className="tbl grid header">
          <div>Ejercicio</div>
          <div>Duración</div>
          <div>Series</div>
          <div>Repeticiones por serie</div>
          <div>Descanso</div>
          <div>Ilustración</div>
        </div>

        {/* Filas */}
        {RUTINA_CARDIO.map((r, i) => (
          <div className="tbl grid row" key={i}>
            <div className="cell">{r.ejercicio}</div>
            <div className="cell">{r.duracion}</div>
            <div className="cell center">{r.series}</div>
            <div className="cell">{r.repes}</div>
            <div className="cell">{r.descanso}</div>
            <div className="cell icon">
              {/* Si tienes imágenes propias, cambia este bloque por <img src={r.icono} alt={r.ejercicio} /> */}
              <span className="emoji" role="img" aria-label={r.ejercicio}>
                {r.icono}
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
