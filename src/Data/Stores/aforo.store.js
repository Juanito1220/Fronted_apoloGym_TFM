// src/Data/Stores/aforo.store.js
import { db, uid, nowISO } from "../../Data/api";

const KEY = "attendance";

/** Lista de eventos de aforo (in/out) */
export function listAttendance() {
  return db.list(KEY);
}

/** Check-in (entrada) */
export function checkIn({ userId, sala = "Principal" }) {
  return db.push(KEY, { id: uid(), ts: nowISO(), userId, sala, type: "in" });
}

/** Check-out (salida) */
export function checkOut({ userId, sala = "Principal" }) {
  return db.push(KEY, { id: uid(), ts: nowISO(), userId, sala, type: "out" });
}

/** Ocupación actual por sala (IN - OUT) */
export function occupancyNow() {
  const occ = {};
  for (const r of db.list(KEY)) {
    const k = r.sala || "Principal";
    occ[k] = (occ[k] || 0) + (r.type === "in" ? 1 : -1);
    if (occ[k] < 0) occ[k] = 0;
  }
  return occ;
}

/** Alias compatible si en algún lugar llamaste pushAttendance */
export function pushAttendance(rec) {
  return db.push(KEY, { id: uid(), ts: nowISO(), ...rec });
}
