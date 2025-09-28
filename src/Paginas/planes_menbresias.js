import React from "react";
import '../Styles/planes.css';
import { FaCheckCircle, FaMinusCircle, FaAward } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ 1) IMPORTAR useNavigate

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

function PlanCard({ plan }) {
  return (
    <article className={`plan-card ${plan.color}`}>
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
        <button
          className="btn-primary"
          onClick={() => alert(`Inscripción a ${plan.name}`)}
        >
          ¡Inscríbete ya!
        </button>
        <p className="cta-note">
          Serás encaminado al proceso de elección y contratación de tu plan.
        </p>
      </div>
    </article>
  );
}

export default function Planes() {
  const navigate = useNavigate(); // ✅ 2) CREAR navigate dentro del componente

  return (
    <div className="plans-page">
      <div className="hero">
        <h1 className="hero-title">ELIGE TU PLAN</h1>
        <p className="hero-subtitle">
          Área de peso libre, peso integrado, cardio y clases grupales
        </p>
      </div>

      {/*  BOTÓN “IR AL INICIO */}
      <div className="back-line">
        <button className="btn-back-home" onClick={() => navigate("/menu")}>
          ⮐ Ir al inicio
        </button>
      </div>
      {/*  FIN  */}

      <section className="plans-grid">
        {PLANS.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
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
