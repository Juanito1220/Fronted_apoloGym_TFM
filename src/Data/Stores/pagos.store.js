// src/Data/Stores/pagos.store.js
import { db, uid, nowISO } from "../../Data/api";

const KEY = "payments";

export function listPayments() {
  return db.list(KEY);
}

export function addPayment({ userId, planId, total, method }) {
  return db.push(KEY, { id: uid(), ts: nowISO(), userId, planId, total: Number(total) || 0, method });
}

/** Alias retrocompatible si en algún sitio llamaste pushPayment */
export const pushPayment = addPayment;

/** Totales por mes YYYY-MM */
export function totalsByMonth() {
  const groups = {};
  for (const p of db.list(KEY)) {
    const ym = (p.ts || "").slice(0, 7); // "YYYY-MM"
    groups[ym] = (groups[ym] || 0) + (Number(p.total) || 0);
  }
  return groups;
}
