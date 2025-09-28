// src/Data/Stores/audit.store.js
import { db, uid, nowISO } from "../api";

const KEY = "audit_log";

export function audit(event, payload = {}, actor = { id: "admin", role: "admin" }) {
  return db.push(KEY, { id: uid(), ts: nowISO(), event, actor, payload });
}

export function listAudit() {
  return db.list(KEY);
}
