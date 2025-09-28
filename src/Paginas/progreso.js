import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/progreso.css";

// ====== Datos de ejemplo ======
const WEIGHT_POINTS = [
  // { fecha: "YYYY-MM-DD", pesoKg: number }
  { fecha: "2025-02-01", pesoKg: 59.0 },
  { fecha: "2025-02-05", pesoKg: 58.6 },
  { fecha: "2025-02-10", pesoKg: 58.2 },
  { fecha: "2025-02-15", pesoKg: 56.8 },
  { fecha: "2025-02-20", pesoKg: 55.8 },
  { fecha: "2025-02-24", pesoKg: 55.4 },
  { fecha: "2025-02-27", pesoKg: 55.2 },
];
const ALTURA_M = 1.68; // ajusta a tu altura

// ====== Helpers ======
function num(n, d = 1) { return Number(n).toFixed(d); }
function toDate(s) { return new Date(s + "T00:00:00"); }

// Normaliza puntos a un path SVG
function useLinePath(points, { w = 560, h = 220, pad = 24 }) {
  return useMemo(() => {
    if (!points.length) return { d: "", yScale: () => 0, xScale: () => 0 };
    const xs = points.map(p => +toDate(p.fecha));
    const ys = points.map(p => p.pesoKg);

    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);

    const xScale = (x) => {
      if (maxX === minX) return pad;
      return pad + ((x - minX) / (maxX - minX)) * (w - pad * 2);
    };
    const yScale = (y) => {
      if (maxY === minY) return h - pad;
      // invertimos eje y (más arriba = mayor valor)
      return pad + (1 - (y - minY) / (maxY - minY)) * (h - pad * 2);
    };

    const d = points
      .map((p, i) => `${i ? "L" : "M"} ${xScale(+toDate(p.fecha))} ${yScale(p.pesoKg)}`)
      .join(" ");

    return { d, xScale, yScale, minY, maxY, minX, maxX };
  }, [points, w, h, pad]);
}

export default function Progreso() {
  const navigate = useNavigate();
  const last = WEIGHT_POINTS[WEIGHT_POINTS.length - 1];
  const first = WEIGHT_POINTS[0];
  const delta = last.pesoKg - first.pesoKg; // negativo = bajó

  // IMC (usa el último peso)
  const imc = last ? last.pesoKg / (ALTURA_M * ALTURA_M) : 0;

  // Gráfico
  const W = 560, H = 240;
  const { d, xScale, yScale } = useLinePath(WEIGHT_POINTS, { w: W, h: H, pad: 28 });

  return (
    <div className="prog-page">
      <div className="prog-top">
        <div>
          <button className="btn-link" onClick={() => navigate("/menu")}>← Regresar al menú</button>
          <h1 className="title">Seguimiento de progreso</h1>
          <p className="sub">Últimos {WEIGHT_POINTS.length} registros</p>
        </div>
        <div className={`delta ${delta <= 0 ? "down" : "up"}`}>
          {delta > 0 ? "+" : ""}{num(delta, 1)} kg
        </div>
      </div>

      <div className="grid">
        {/* Panel PESO */}
        <section className="card">
          <div className="card-head">
            <span className="chip chip-weight">PESO</span>
            <button className="btn-ghost" onClick={() => alert("Editar registros…")}>EDITAR</button>
          </div>

          <div className="chart-wrap">
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="chart">
              {/* gradiente */}
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05"/>
                </linearGradient>
              </defs>

              {/* área bajo la curva */}
              <path
                d={`${d} L ${xScale(+toDate(WEIGHT_POINTS.at(-1).fecha))} ${H - 28} L ${xScale(+toDate(WEIGHT_POINTS[0].fecha))} ${H - 28} Z`}
                fill="url(#grad)"
                className="area"
              />
              {/* línea */}
              <path d={d} className="line" />

              {/* puntos */}
              {WEIGHT_POINTS.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={xScale(+toDate(p.fecha))}
                    cy={yScale(p.pesoKg)}
                    r="4.5"
                    className="dot"
                  />
                </g>
              ))}
            </svg>

            <div className="tag-last">
              <span>{num(last.pesoKg, 1)} kg</span>
            </div>
          </div>
        </section>

        {/* Panel IMC */}
        <section className="card">
          <div className="card-head">
            <span className="chip chip-bmi">IMC</span>
            <div className="bmi-value">{num(imc, 2)}</div>
          </div>

          <div className="bmi-scale">
            {/* rangos OMS: <18.5, 18.5–24.9, 25–29.9, 30+ */}
            <div className="seg seg-1" title="Bajo peso" />
            <div className="seg seg-2" title="Normal" />
            <div className="seg seg-3" title="Sobrepeso" />
            <div className="seg seg-4" title="Obesidad" />
            <div
              className="bmi-marker"
              style={{ left: `${Math.max(0, Math.min(100, (imc / 40) * 100))}%` }}
              title={`IMC: ${num(imc, 2)}`}
            />
          </div>

          <div className="bmi-legend">
            <span><i className="box box-1" /> Bajo</span>
            <span><i className="box box-2" /> Saludable</span>
            <span><i className="box box-3" /> Sobrepeso</span>
            <span><i className="box box-4" /> Obesidad</span>
          </div>
        </section>
      </div>
    </div>
  );
}
