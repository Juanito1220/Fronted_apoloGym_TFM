// src/Data/api.js
const get = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const db = {
  list:   (key) => get(key, []),
  save:   (key, list) => set(key, list),
  push:   (key, item) => { const arr = get(key, []); arr.push(item); set(key, arr); return item; },
  getObj: (key) => get(key, {}),
  setObj: (key, obj) => set(key, obj),
};

export const uid    = () => (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)) + "-" + Date.now();
export const nowISO = () => new Date().toISOString();
