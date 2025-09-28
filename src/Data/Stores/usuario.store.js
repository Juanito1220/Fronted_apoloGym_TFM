// src/Data/Stores/usuario.store.js
import { db, uid, nowISO } from "../../Data/api";

const KEY = "users";
const VALID_ROLES = new Set(["cliente", "entrenador", "admin"]);

/* ===================== */
/*    Helpers robustos    */
/* ===================== */
function isArray(x) { return Array.isArray(x); }

/** Lee del storage y garantiza array (autocorrige si está corrupto) */
function read() {
  try {
    const data = db.list(KEY);
    if (isArray(data)) return data;
    // Si por algún motivo guardaron un objeto u otro tipo, migra a []
    write([]);
    return [];
  } catch {
    write([]);
    return [];
  }
}

/** Escribe garantizando que sea array */
function write(arr) {
  db.save(KEY, isArray(arr) ? arr : []);
  return isArray(arr) ? arr : [];
}

/** Normaliza entrada de usuario de forma suave (email y role) */
function normalizeUserInput(u = {}) {
  const email = (u.email || "").trim();
  const role = VALID_ROLES.has(u.role) ? u.role : (u.role ? "cliente" : undefined);
  return {
    ...u,
    ...(email ? { email } : {}),
    ...(role ? { role } : {}),
  };
}

/* ===================== */
/*        Queries        */
/* ===================== */

/** Devuelve TODOS los usuarios (si algo está corrupto, devuelve []) */
export function listUsers() {
  return read();
}

/** Busca por id (undefined si no existe) */
export function getUserById(id) {
  return read().find(u => u.id === id);
}

/** Busca por email (undefined si no existe) */
export function findByEmail(email) {
  if (!email) return undefined;
  const e = (email || "").trim().toLowerCase();
  return read().find(u => (u.email || "").trim().toLowerCase() === e);
}

/* ===================== */
/*        Upserts        */
/* ===================== */

/**
 * Crea o edita usuario (upsert)
 * - Si viene con id: actualiza/crea con ese id
 * - Si NO viene id: genera uno
 * Retorna el registro guardado.
 */
export function saveUser(u) {
  const all = read();
  const patch = normalizeUserInput(u);
  let record = null;

  if (patch.id) {
    const i = all.findIndex(x => x.id === patch.id);
    if (i >= 0) {
      record = { ...all[i], ...patch, updatedAt: nowISO() };
      if (!VALID_ROLES.has(record.role)) record.role = "cliente";
      all[i] = record;
    } else {
      record = { ...defaults(), ...patch, updatedAt: nowISO() };
      if (!VALID_ROLES.has(record.role)) record.role = "cliente";
      all.push(record);
    }
  } else {
    record = {
      ...defaults(),
      ...patch,
      id: uid(),
      createdAt: nowISO(),
    };
    if (!VALID_ROLES.has(record.role)) record.role = "cliente";
    all.push(record);
  }

  write(all);
  return record;
}

/** Upsert de muchos usuarios en lote */
export function upsertMany(users = []) {
  const out = [];
  for (const u of users) out.push(saveUser(u));
  return out;
}

/**
 * Actualiza campos de un usuario existente (parche)
 * Retorna el registro actualizado o null si no existe.
 */
export function updateUserRecord(id, patch) {
  const all = read();
  const i = all.findIndex(x => x.id === id);
  if (i < 0) return null;
  const p = normalizeUserInput(patch);
  const updated = { ...all[i], ...p, updatedAt: nowISO() };
  if (!VALID_ROLES.has(updated.role)) updated.role = all[i].role || "cliente";
  all[i] = updated;
  write(all);
  return updated;
}

/* ===================== */
/*   Mutaciones simples  */
/* ===================== */

/** Cambia el rol */
export function setRole(id, role) {
  const safeRole = VALID_ROLES.has(role) ? role : "cliente";
  const all = read().map(u =>
    u.id === id ? ({ ...u, role: safeRole, updatedAt: nowISO() }) : u
  );
  write(all);
  return all;
}

/** Alterna active: true/false */
export function toggleActivo(id) {
  const all = read().map(u =>
    u.id === id ? ({ ...u, active: !u.active, updatedAt: nowISO() }) : u
  );
  write(all);
  return all;
}

/** Setter explícito de activo */
export function setActive(id, active) {
  const all = read().map(u =>
    u.id === id ? ({ ...u, active: !!active, updatedAt: nowISO() }) : u
  );
  write(all);
  return all;
}

/** Elimina usuario por id */
export function removeUser(id) {
  const all = read().filter(u => u.id !== id);
  write(all);
  return all;
}

/* ===================== */
/*        Seed/defs      */
/* ===================== */

/**
 * Si no hay usuarios, crea un admin de ejemplo.
 * Útil para el primer arranque del panel.
 */
export function seedAdminIfEmpty() {
  const all = read();
  if (all.length > 0) return all;
  const admin = saveUser({
    nombre: "Admin",
    email: "admin@apolo.local",
    role: "admin",
    active: true,
  });
  return [admin];
}

/** Valores por defecto para nuevos usuarios */
function defaults() {
  return {
    nombre: "",
    email: "",
    telefono: "",      // opcional
    cedula: "",        // opcional
    role: "cliente",   // 'cliente' | 'entrenador' | 'admin'
    trainerId: null,   // relación cliente → entrenador
    active: true,
  };
}

/* ===================== */
/*  Utilidades extra     */
/* ===================== */

/** Lista solo entrenadores activos */
export function listTrainers() {
  return read().filter(u => u.role === "entrenador" && u.active !== false);
}

/** Lista solo clientes */
export function listClients() {
  return read().filter(u => (u.role || "cliente") === "cliente");
}

/** Asigna un entrenador a un cliente (clientId ← trainerId) */
export function assignTrainerToClient({ clientId, trainerId }) {
  const all = read();
  const ci = all.findIndex(u => u.id === clientId);
  const tr = all.find(u => u.id === trainerId && u.role === "entrenador");
  if (ci < 0) throw new Error("Cliente no encontrado");
  if (!tr) throw new Error("Entrenador no encontrado");
  all[ci] = { ...all[ci], trainerId: tr.id, updatedAt: nowISO() };
  write(all);
  return all[ci];
}

/** Quita el entrenador de un cliente */
export function unassignTrainerFromClient(clientId) {
  const all = read();
  const i = all.findIndex(u => u.id === clientId);
  if (i < 0) return null;
  all[i] = { ...all[i], trainerId: null, updatedAt: nowISO() };
  write(all);
  return all[i];
}

/** Devuelve todos los clientes de un entrenador */
export function clientsOfTrainer(trainerId) {
  return read().filter(u => (u.role || "cliente") === "cliente" && u.trainerId === trainerId);
}

/** Devuelve el entrenador asignado de un cliente (o null) */
export function trainerOfClient(clientId) {
  const all = read();
  const c = all.find(u => u.id === clientId);
  if (!c?.trainerId) return null;
  return all.find(u => u.id === c.trainerId) || null;
}
