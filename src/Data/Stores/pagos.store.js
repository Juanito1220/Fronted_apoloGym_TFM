// src/Data/Stores/pagos.store.js
import { listPlans, getPlanById } from "./planes.store";

const KEY = "payments";

/* helpers */
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function write(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
  } catch {}
  return Array.isArray(arr) ? arr : [];
}

/** Lista todos los pagos */
export function listPayments() {
  return read();
}

/** Agrega un pago */
export function addPayment({
  clientId,
  planId,
  amount,
  date,            // "YYYY-MM-DD"
  method = "efectivo",
  status = "pagado",
  meta = {},
}) {
  const id =
    (window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const plan = planId ? (getPlanById?.(planId) || null) : null;

  const pay = {
    id,
    clientId: clientId || null,
    planId: planId || null,
    planName: plan?.nombre || meta?.planName || "",
    amount: Number(amount || 0),
    date: date || new Date().toISOString().slice(0, 10),
    method,
    status, // "pagado" | "pendiente" | "fallido"
    meta,
    createdAt: new Date().toISOString(),
  };

  const next = [pay, ...read()];
  return write(next);
}

/** Totales por mes (YYYY-MM) */
export function totalsByMonth() {
  const all = read();
  const out = {};
  for (const p of all) {
    const ym = String(p.date || "").slice(0, 7); // "YYYY-MM"
    if (!ym) continue;
    if (!out[ym]) out[ym] = { amount: 0, count: 0 };
    out[ym].amount += Number(p.amount || 0);
    out[ym].count += 1;
  }
  return out; // { "2025-09": { amount, count }, ... }
}
