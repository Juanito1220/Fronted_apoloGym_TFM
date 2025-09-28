// src/Data/Stores/events.store.js

const KEY = "apolo_events";

/**
 * Estructura esperada de evento:
 * {
 *   id: string,
 *   date: "YYYY-MM-DD",
 *   type: "reserva" | "plan",
 *   title: string,
 *   subtitle?: string,
 *   meta?: object
 * }
 */

/* ========== helpers locales seguras ========== */
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.isArray(arr) ? arr : []));
  } catch {
    // noop
  }
}

/* ========== API pública ========== */

/** Lista todos los eventos */
export function listEvents() {
  return read();
}

/** Agrega un evento (auto genera id si falta) y devuelve la lista nueva */
export function addEvent(evt) {
  const rnd = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const genId = () =>
    (window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : rnd());

  const id = evt && evt.id ? evt.id : genId();
  const next = [{ ...(evt || {}), id }, ...read()];
  write(next);
  return next;
}

/** Agrega varios eventos y devuelve la lista nueva */
export function addEvents(bulk = []) {
  const rnd = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const genId = () =>
    (window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : rnd());

  const withIds = (Array.isArray(bulk) ? bulk : []).map((e) => ({
    ...(e || {}),
    id: e && e.id ? e.id : genId(),
  }));
  const next = [...withIds, ...read()];
  write(next);
  return next;
}

/** Limpia todos los eventos */
export function clearEvents() {
  write([]);
}
