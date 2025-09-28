// src/Paginas/Admin/reportes.js
import React, { useEffect, useState } from "react";
import { totalsByMonth, listPayments } from "../../Data/Stores/pagos.store";
import { listBookings } from "../../Data/Stores/reservas.store";
import { listAttendance } from "../../Data/Stores/aforo.store";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import BackToMenu from "../../Componentes/backtoMenu.js"; // si no se usa, este comentario evita warning

export default function Reportes() {
  const navigate = useNavigate();

  const [pays, setPays] = useState([]);
  const [book, setBook] = useState([]);
  const [att, setAtt]   = useState([]);
  const [porMes, setPorMes] = useState({});
  const [loading, setLoading] = useState(true);

  // Función reutilizable para cargar/recargar todo
  const loadAll = async () => {
    const [p, b, a, tm] = await Promise.all([
      Promise.resolve(listPayments?.() ?? []),
      Promise.resolve(listBookings?.() ?? []),
      Promise.resolve(listAttendance?.() ?? []),
      Promise.resolve(totalsByMonth?.() ?? {}),
    ]);

    const _p = Array.isArray(p) ? p : [];
    const _b = Array.isArray(b) ? b : [];
    const _a = Array.isArray(a) ? a : [];

    // Si totalsByMonth del store viene vacío, calculamos desde pagos
    const _tm = (tm && Object.keys(tm).length) ? tm : groupTotalsByMonth(_p);

    setPays(_p);
    setBook(_b);
    setAtt(_a);
    setPorMes(_tm);
  };

  // Carga inicial
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await loadAll();
      } catch (err) {
        console.error("Error cargando reportes:", err);
        setPays([]); setBook([]); setAtt([]); setPorMes({});
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // 🔔 Refrescar cuando se agreguen pagos desde la pantalla de Pagos
  useEffect(() => {
    const onPaymentsChanged = () => { loadAll(); };
    window.addEventListener("payments:changed", onPaymentsChanged);
    return () => window.removeEventListener("payments:changed", onPaymentsChanged);
  }, []);

  return (
    <div className="container page" style={{ padding: 20 }}>
      <h2>Reportes</h2>

      <div className="back-line" style={{ alignSelf: "start" }}>
        <button
          className="btn-back-menu"
          onClick={() => navigate("..", { replace: true, relative: "path" })}
        >
          ← Regresar al panel
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <Card title="Pagos registrados" value={loading ? "…" : pays.length} />
        <Card title="Reservas" value={loading ? "…" : book.length} />
        <Card title="Eventos de aforo" value={loading ? "…" : att.length} />
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Ingresos por mes</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Mes</th>
              <th style={th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td style={td} colSpan={2}>Cargando…</td></tr>}

            {!loading && Object.keys(porMes).length > 0 &&
              Object.entries(porMes).map(([m, t]) => (
                <tr key={m}>
                  <td style={td}>{m}</td>
                  <td style={td}>$ {Number(t || 0).toFixed(2)}</td>
                </tr>
              ))
            }

            {!loading && Object.keys(porMes).length === 0 &&
              <tr><td style={td} colSpan={2}>Sin datos</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
      <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

const th = { padding: "8px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "left" };
const td = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6" };

/**
 * Helper: calcula totales por mes si el store no los trae.
 * Ahora soporta también tu esquema real de pagos { ts, total }.
 */
function groupTotalsByMonth(pagos) {
  return (pagos || []).reduce((acc, p) => {
    // fechas posibles
    const rawDate = p.ts ?? p.date ?? p.fecha ?? p.createdAt ?? p.fechaPago;
    // montos posibles
    const amount = Number(p.total ?? p.amount ?? p.monto ?? 0) || 0;

    if (!rawDate) return acc;
    const d = new Date(rawDate);
    if (isNaN(d)) return acc;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + amount;
    return acc;
  }, {});
}
