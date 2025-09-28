// src/Componentes/BackTo.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Botón de regreso reutilizable.
 * Props:
 * - to: ruta destino (string o número). Ej: "/admin" o -1 para ir atrás
 * - label: texto del botón
 * - className: clases extra opcionales
 */
export default function BackTo({ to = "/menu", label = "← Regresar", className = "" }) {
  const navigate = useNavigate();

  const go = () => {
    if (typeof to === "number") navigate(to);  // e.g. -1 para volver
    else navigate(to);                          // e.g. "/admin"
  };

  return (
    <div className={`back-line ${className}`}>
      <button className="btn-back-menu" onClick={go}>
        {label}
      </button>
    </div>
  );
}
