// src/Data/Stores/subscriptions.store.js
const KEY = "subs";

/* Helpers */
function read() {
  try { const raw = localStorage.getItem(KEY); const arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) ? arr : []; }
  catch { return []; }
}
function write(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(Array.isArray(arr) ? arr : [])); } catch {}
}

/* API */
export function listSubs() { return read(); }

export function addSub({ clientId, planId, startDate, priceAtSignup, planName, membershipLabel = "Mensual" }) {
  const id = (window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2,8)}`);
  const sub = {
    id, clientId, planId, startDate, status: "activa",
    priceAtSignup: Number(priceAtSignup || 0),
    planName: planName || "",
    membershipLabel,
    createdAt: new Date().toISOString(),
  };
  const next = [sub, ...read()];
  write(next);
  return sub;
}

export function cancelSub(id) {
  const next = read().map(s => s.id === id ? { ...s, status: "cancelada", canceledAt: new Date().toISOString() } : s);
  write(next);
  return next;
}

export function subsOfClient(clientId) {
  return read().filter(s => s.clientId === clientId);
}

export function latestActiveSubForClient(clientId) {
  return read().find(s => s.clientId === clientId && s.status === "activa") || null;
}
