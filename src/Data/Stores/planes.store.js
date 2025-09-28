// src/Data/Stores/planes.store.js
import { db, uid, nowISO } from "../../Data/api";

const KEY = "plans";

export function listPlans() {
  return db.list(KEY);
}

export function savePlan(p) {
  const all = db.list(KEY);
  if (p.id) {
    const i = all.findIndex(x => x.id === p.id);
    all[i] = { ...all[i], ...p, updatedAt: nowISO() };        // ← usa nowISO
  } else {
    all.push({ id: uid(), createdAt: nowISO(), status: "activo", ...p }); // ← usa nowISO
  }
  db.save(KEY, all);
  return all;
}

export function deletePlan(id) {
  const all = db.list(KEY).filter(p => p.id !== id);
  db.save(KEY, all);
  return all;
}
