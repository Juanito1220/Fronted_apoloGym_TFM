import React, { useMemo, useState } from "react";
import '../../Styles/planes.css';
import { FaCheckCircle, FaMinusCircle, FaAward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ======= DATA ======= */
const FEATURES = [
  "Área de peso libre, peso integrado, cardio y clases grupales",
  "Acceso a todas las áreas del gimnasio",
  "Acceso a otros Smart Fit en el mundo",
  "Sin cargo por cancelación",
  "Smart Fit App",
  "Smart Fit Go",
  "Invitar un amigo a entrenar",
  "Sillones de masaje",
];

const PLANS = [
  {
    id: "black",
    name: "PLAN Black",
    tagline: "Entrena en cualquiera de nuestros gimnasios en Latinoamérica",
    price: 29.9,
    ivaText: "+ IVA / mes",
    bestSeller: true,
    highlight: "El más vendido",
    color: "black",
    features: {
      "Área de peso libre, peso integrado, cardio y clases grupales": true,
      "Acceso a todas las áreas del gimnasio": true,
      "Acceso a otros Smart Fit en el mundo": true,
      "Sin cargo por cancelación": true,
      "Smart Fit App": true,
      "Smart Fit Go": true,
      "Invitar un amigo a entrenar": true,
      "Sillones de masaje": true,
    },
  },
  {
    id: "fit",
    name: "PLAN Fit",
    tagline: "Entrena todo lo que quieras en tu unidad y paga menos",
    price: 21.9,
    ivaText: "+ IVA / mes",
    bestSeller: false,
    color: "fit",
    features: {
      "Área de peso libre, peso integrado, cardio y clases grupales": true,
      "Acceso a todas las áreas del gimnasio": true,
      "Acceso a otros Smart Fit en el mundo": false,
      "Sin cargo por cancelación": true,
      "Smart Fit App": true,
      "Smart Fit Go": true,
      "Invitar un amigo a entrenar": false,
      "Sillones de masaje": false,
    },
  },
  {
    id: "smart",
    name: "PLAN Smart",
    tagline: "Entrena cuando quieras en tu gimnasio de elección",
    price: 25.9,
    ivaText: "+ IVA / mes",
    bestSeller: false,
    color: "smart",
    features: {
      "Área de peso libre, peso integrado, cardio y clases grupales": true,
      "Acceso a todas las áreas del gimnasio": true,
      "Acceso a otros Smart Fit en el mundo": false,
      "Sin cargo por cancelación": false,
      "Smart Fit App": true,
      "Smart Fit Go": false,
      "Invitar un amigo a entrenar": false,
      "Sillones de masaje": false,
    },
  },
];

/* Tipos de membresía disponibles */
const MEMBERSHIPS = [
  { id: "individual", label: "Individual", factor: 1.0, desc: "1 titular" },
  { id: "duo",       label: "Duo",       factor: 1.8, desc: "2 personas" },
  { id: "familiar",  label: "Familiar",  factor: 2.6, desc: "Hasta 4 personas" },
  { id: "estudiante",label: "Estudiante",factor: 0.85,desc: "Descuento aplicado" },
];

/* Add-ons opcionales por mes */
const ADDONS = [
  { id: "locker", label: "Locker fijo", price: 5 },
  { id: "toalla", label: "Servicio de toallas", price: 3 },
  { id: "coach",  label: "Coach 1:1 (x4 sesiones)", price: 15 },
  { id: "spa",    label: "Zona spa / masajes", price: 10 },
];

/* ======= UI helpers ======= */
function Price({ value, ivaText }) {
  const [int, dec] = value.toFixed(2).split(".");
  return (
    <div className="price">
      <span className="currency">$</span>
      <span className="int">{int}</span>
      <span className="dec">.{dec}</span>
      <span className="per"> {ivaText}</span>
    </div>
  );
}

function FeatureRow({ label, enabled }) {
  return (
    <li className="feature-row">
      {enabled ? (
        <FaCheckCircle className="icon ok" aria-label="Incluido" />
      ) : (
        <FaMinusCircle className="icon no" aria-label="No incluido" />
      )}
      <span className="feature-text">{label}</span>
    </li>
  );
}

function Ribbon({ text }) {
  return (
    <div className="ribbon">
      <FaAward className="ribbon-icon" />
      <span>{text}</span>
    </div>
  );
}

function PlanCard({ plan, selected, onSelect }) {
  return (
    <article className={`plan-card ${plan.color} ${selected ? "selected" : ""}`}>
      {plan.bestSeller && <Ribbon text={plan.highlight} />}
      <header className="plan-header">
        <h3 className="plan-name">{plan.name}</h3>
        <p className="plan-tag">{plan.tagline}</p>
      </header>

      <div className="divider" />

      <div className="price-wrap">
        <span className="price-label">DESDE</span>
        <Price value={plan.price} ivaText={plan.ivaText} />
      </div>

      <ul className="features">
        {FEATURES.map((f) => (
          <FeatureRow key={f} label={f} enabled={Boolean(plan.features[f])} />
        ))}
      </ul>

      <div className="cta-wrap">
        <button className="btn-primary" onClick={() => onSelect(plan.id)}>
          {selected ? "Seleccionado ✓" : "Elegir este plan"}
        </button>
        <p className="cta-note">Elige abajo tu membresía, ciclo y extras.</p>
      </div>
    </article>
  );
}

/* ======= Página principal ======= */
export default function Planes() {
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState(PLANS[0].id);
  const [membershipId, setMembershipId] = useState(MEMBERSHIPS[0].id);
  const [billing, setBilling] = useState("mensual"); // mensual | anual (-10%)
  const [addons, setAddons] = useState(() => Object.fromEntries(ADDONS.map(a => [a.id, false])));
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0,10));

  const plan = useMemo(
    () => PLANS.find(p => p.id === selectedPlanId),
    [selectedPlanId]
  );
  const membership = useMemo(
    () => MEMBERSHIPS.find(m => m.id === membershipId),
    [membershipId]
  );

  const addonsTotal = useMemo(
    () => ADDONS.filter(a => addons[a.id]).reduce((acc, a) => acc + a.price, 0),
    [addons]
  );

  const baseMensual = useMemo(
    () => (plan?.price ?? 0) * (membership?.factor ?? 1) + addonsTotal,
    [plan, membership, addonsTotal]
  );

  const total = useMemo(() => {
    if (billing === "anual") {
      const mensualConDescuento = baseMensual * 0.9; // 10% off
      return { label: "Total anual (10% off)", amount: mensualConDescuento * 12 };
    }
    return { label: "Total mensual", amount: baseMensual };
  }, [billing, baseMensual]);

  const toggleAddon = (id) => setAddons(prev => ({ ...prev, [id]: !prev[id] }));

  const confirmar = () => {
    const payload = {
      planId: plan.id,
      planName: plan.name,
      membershipId: membership.id,
      membershipLabel: membership.label,
      billing, // mensual/anual
      addons: ADDONS.filter(a => addons[a.id]),
      startDate,
      totalLabel: total.label,
      totalAmount: Number(total.amount.toFixed(2)),
      unitPriceMensual: Number(baseMensual.toFixed(2)),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("apolo_checkout", JSON.stringify(payload));
    navigate("/pagos", { state: { checkout: payload } });
  };

  return (
    <div className="plans-page">
      <div className="hero">
        <h1 className="hero-title">ELIGE TU PLAN</h1>
        <p className="hero-subtitle">
          Área de peso libre, peso integrado, cardio y clases grupales
        </p>
      </div>

      <div className="back-line">
        <button className="btn-back-home" onClick={() => navigate("/menu")}>
          ⮐ Ir al inicio
        </button>
      </div>

      {/* GRID de planes */}
      <section className="plans-grid">
        {PLANS.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            selected={p.id === selectedPlanId}
            onSelect={setSelectedPlanId}
          />
        ))}
      </section>

      {/* CONFIGURADOR: Membresía, ciclo, extras, fecha y total */}
      <section className="plan-config">
        <h2>Configura tu membresía</h2>

        <div className="config-grid">
          <div className="config-block">
            <label className="lbl">Membresía</label>
            <div className="choices">
              {MEMBERSHIPS.map(m => (
                <button
                  key={m.id}
                  className={`chip ${membershipId === m.id ? "active" : ""}`}
                  onClick={() => setMembershipId(m.id)}
                >
                  {m.label} <small>({m.desc})</small>
                </button>
              ))}
            </div>
          </div>

          <div className="config-block">
            <label className="lbl">Ciclo de pago</label>
            <div className="choices">
              <button
                className={`chip ${billing === "mensual" ? "active" : ""}`}
                onClick={() => setBilling("mensual")}
              >
                Mensual
              </button>
              <button
                className={`chip ${billing === "anual" ? "active" : ""}`}
                onClick={() => setBilling("anual")}
              >
                Anual <small>(-10%)</small>
              </button>
            </div>
          </div>

          <div className="config-block">
            <label className="lbl">Extras</label>
            <ul className="addons">
              {ADDONS.map(a => (
                <li key={a.id}>
                  <label className="addon-row">
                    <input
                      type="checkbox"
                      checked={Boolean(addons[a.id])}
                      onChange={() => toggleAddon(a.id)}
                    />
                    <span>{a.label}</span>
                    <span className="addon-price">+${a.price.toFixed(2)}/mes</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="config-block">
            <label className="lbl">Fecha de inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e)=>setStartDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        <div className="summary">
          <div className="sum-left">
            <div className="sum-line">
              <span className="sum-label">Plan</span>
              <span className="sum-value">{plan?.name}</span>
            </div>
            <div className="sum-line">
              <span className="sum-label">Membresía</span>
              <span className="sum-value">{membership?.label}</span>
            </div>
            <div className="sum-line">
              <span className="sum-label">Ciclo</span>
              <span className="sum-value">{billing === "anual" ? "Anual (-10%)" : "Mensual"}</span>
            </div>
            {ADDONS.filter(a => addons[a.id]).length > 0 && (
              <div className="sum-line">
                <span className="sum-label">Extras</span>
                <span className="sum-value">
                  {ADDONS.filter(a => addons[a.id]).map(a => a.label).join(", ")}
                </span>
              </div>
            )}
            <div className="sum-line">
              <span className="sum-label">Inicio</span>
              <span className="sum-value">{startDate}</span>
            </div>
          </div>

          <div className="sum-right">
            <div className="sum-amount">
              <div className="sum-caption">{total.label}</div>
              <div className="sum-price">${total.amount.toFixed(2)}</div>
              {billing === "anual" && (
                <div className="sum-note">Equivale a ${(baseMensual*0.9).toFixed(2)}/mes con descuento.</div>
              )}
              {billing === "mensual" && (
                <div className="sum-note">Subtotal mensual: ${baseMensual.toFixed(2)}</div>
              )}
            </div>
            <button className="btn-primary big" onClick={confirmar}>
              Continuar al pago
            </button>
          </div>
        </div>
      </section>

      <footer className="plans-footer">
        <button
          className="btn-outline"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Volver arriba
        </button>
      </footer>
    </div>
  );
}
