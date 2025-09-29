import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/alimentacion.css";

const KCAL_GOAL = 2200; // objetivo diario (ajústalo)

const initialMeals = [
  {
    id: "desayuno",
    label: "Desayuno",
    hint: "Recomendado: 20–25% del total diario",
    items: [
      { name: "Avena con fruta", kcal: 320, carbs: 55, protein: 10, fat: 6 },
      { name: "Huevos revueltos (2)", kcal: 180, carbs: 2, protein: 12, fat: 14 },
      { name: "Yogurt natural + miel", kcal: 160, carbs: 24, protein: 9, fat: 3 },
    ],
  },
  {
    id: "comida",
    label: "Comida",
    hint: "Recomendado: 35–40% del total diario",
    items: [
      { name: "Pechuga de pollo + arroz + ensalada", kcal: 680, carbs: 78, protein: 45, fat: 18 },
      { name: "Filete de res + quinoa + verduras", kcal: 720, carbs: 62, protein: 47, fat: 24 },
      { name: "Pasta integral + atún + tomate", kcal: 640, carbs: 90, protein: 32, fat: 14 },
    ],
  },
  {
    id: "cena",
    label: "Cena",
    hint: "Recomendado: 25–30% del total diario",
    items: [
      { name: "Ensalada grande + salmón", kcal: 520, carbs: 22, protein: 36, fat: 28 },
      { name: "Tortilla de claras + verduras", kcal: 340, carbs: 12, protein: 28, fat: 18 },
      { name: "Crema de calabaza + pollo", kcal: 410, carbs: 38, protein: 25, fat: 14 },
    ],
  },
  {
    id: "aperitivos",
    label: "Aperitivos",
    hint: "Recomendado: 5–10% del total diario",
    items: [
      { name: "Manzana", kcal: 95, carbs: 25, protein: 0, fat: 0 },
      { name: "Puñado de nueces (30g)", kcal: 196, carbs: 4, protein: 5, fat: 20 },
      { name: "Yogurt griego (125g)", kcal: 120, carbs: 7, protein: 10, fat: 5 },
    ],
  },
];

export default function Alimentacion() {
  const navigate = useNavigate();
  const [meals] = useState(initialMeals);
  const [active, setActive] = useState("desayuno");

  // Totales del día (suma de todas las sugerencias mostradas)
  const totals = useMemo(() => {
    const flat = meals.flatMap((m) => m.items);
    const kcal = flat.reduce((a, b) => a + b.kcal, 0);
    const carbs = flat.reduce((a, b) => a + b.carbs, 0);
    const protein = flat.reduce((a, b) => a + b.protein, 0);
    const fat = flat.reduce((a, b) => a + b.fat, 0);
    return { kcal, carbs, protein, fat };
  }, [meals]);

  const remaining = Math.max(0, KCAL_GOAL - totals.kcal);
  const consumedPct = Math.min(100, Math.round((totals.kcal / KCAL_GOAL) * 100));

  const selected = meals.find((m) => m.id === active);

  return (
    <div className="al-page">
      <header className="al-header">
        <div className="al-title-wrap">
          <h1 className="al-title">Diario de alimentación</h1>
          <p className="al-sub">Aprende de tus hábitos alimentarios</p>
        </div>

        {/*  AQUÍ ESTÁ EL BOTÓN “IR AL INICIO” */}
        <button className="al-btn-home" onClick={() => navigate("/menu")}>
          ⮐ Ir al inicio
        </button>
        {/* FIN DEL BOTÓN */}
      </header>

      <main className="al-grid">
        {/* Columna izquierda: Resumen */}
        <section className="al-col al-summary card">
          <div
            className="al-ring"
            style={{
              background: `conic-gradient(#16a34a ${consumedPct * 3.6}deg, #e5e7eb 0deg)`,
            }}
            aria-label={`Consumo ${consumedPct}%`}
          >
            <div className="al-ring-inner">
              <div className="al-kcal-rem">{remaining}</div>
              <div className="al-kcal-caption">cal restantes</div>
              <div className="al-kcal-sub">{totals.kcal} consumidas</div>
            </div>
          </div>

          <div className="al-macros">
            <Macro label="Carbohidratos" grams={totals.carbs} />
            <Macro label="Proteína" grams={totals.protein} />
            <Macro label="Grasa" grams={totals.fat} />
          </div>
        </section>

        {/* Columna derecha: Selector + Detalle */}
        <section className="al-col al-detail card">
          <MealTabs active={active} onChange={setActive} />
          <div className="al-hint">{selected.hint}</div>

          <table className="al-table">
            <thead>
              <tr>
                <th>Recomendación</th>
                <th>Kcal</th>
                <th>Carbs (g)</th>
                <th>Prot (g)</th>
                <th>Grasa (g)</th>
              </tr>
            </thead>
            <tbody>
              {selected.items.map((it, i) => (
                <tr key={i}>
                  <td>{it.name}</td>
                  <td>{it.kcal}</td>
                  <td>{it.carbs}</td>
                  <td>{it.protein}</td>
                  <td>{it.fat}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="al-note">
            * Estas son sugerencias orientativas. Ajusta por tus necesidades y objetivos.
          </div>
        </section>
      </main>
    </div>
  );
}

function Macro({ label, grams }) {
  return (
    <div className="al-macro">
      <div className="al-macro-label">{label}</div>
      <div className="al-macro-grams">{grams} g</div>
      <div className="al-bar">
        <div className="al-fill" style={{ width: `${Math.min(100, grams / 3)}%` }} />
      </div>
    </div>
  );
}

function MealTabs({ active, onChange }) {
  return (
    <div className="al-tabs">
      {[
        { id: "desayuno", label: "Desayuno" },
        { id: "comida", label: "Comida" },
        { id: "cena", label: "Cena" },
        { id: "aperitivos", label: "Aperitivos" },
      ].map((t) => (
        <button
          key={t.id}
          className={active === t.id ? "al-tab active" : "al-tab"}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
