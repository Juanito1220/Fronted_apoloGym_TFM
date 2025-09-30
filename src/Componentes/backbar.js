import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/back.css";

export default function BackBar({ showHome = true }) {
  const navigate = useNavigate();
  return (
    <div className="backbar">
      <button className="btn-back" onClick={() => navigate("/cliente")}>
        ← Regresar al menú
      </button>
      {showHome && (
        <button className="btn-home" onClick={() => navigate("/")}>
          ⮐ Ir al inicio
        </button>
      )}
    </div>
  );
}
