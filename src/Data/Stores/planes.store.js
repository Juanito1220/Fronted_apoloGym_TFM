// src/Data/Stores/planes.store.js
import { db, uid, nowISO } from "../../Data/api";

const KEY = "plans";

/* Helpers robustos para evitar arrays corruptos */
function read() {
  try {
    const data = db.list(KEY);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
function write(arr) {
  db.save(KEY, Array.isArray(arr) ? arr : []);
  return Array.isArray(arr) ? arr : [];
}

/** Lista TODOS los planes */
export function listPlans() {
  return read();
}

/** Crea/actualiza un plan.
 *  Shape esperado:
 *  { id?, nombre, precio(number|string), beneficios(array|string con \n), status: "activo"|"inactivo" }
 */
export function savePlan(p = {}) {
  const all = read();

  // normalizaciones suaves
  const nombre = (p.nombre || "").trim();
  const precio =
    typeof p.precio === "number"
      ? p.precio
      : Number(String(p.precio ?? "").replace(",", ".")) || 0;

  const beneficios =
    Array.isArray(p.beneficios)
      ? p.beneficios
      : String(p.beneficios || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

  const status = (p.status || "activo").toLowerCase() === "inactivo" ? "inactivo" : "activo";

  if (p.id) {
    const i = all.findIndex((x) => x.id === p.id);
    if (i >= 0) {
      all[i] = {
        ...all[i],
        nombre,
        precio,
        beneficios,
        status,
        updatedAt: nowISO(),
      };
    } else {
      all.push({
        id: p.id,
        nombre,
        precio,
        beneficios,
        status,
        createdAt: nowISO(),
      });
    }
  } else {
    all.push({
      id: uid(),
      nombre,
      precio,
      beneficios,
      status,
      createdAt: nowISO(),
    });
  }

  return write(all);
}

/** Elimina un plan por id */
export function deletePlan(id) {
  const next = read().filter((p) => p.id !== id);
  return write(next);
}

/** Devuelve solo planes con status "activo" */
export function listActivePlans() {
  try {
    return listPlans().filter(
      (p) => String(p.status || "").toLowerCase() === "activo"
    );
  } catch {
    return [];
  }
}
/** Obtiene un plan por id (o undefined) */
export function getPlanById(id) {
  if (!id) return undefined;
  return listPlans().find((p) => p.id === id);
}

/** Transforma un plan al “shape de tarjeta” del cliente */
export function toClientCardShape(plan) {
  if (!plan) return null;
  return {
    id: plan.id,
    name: plan.nombre,
    tagline:
      (Array.isArray(plan.beneficios) && plan.beneficios[0]) ||
      "Membresía Apolo",
    price: Number(plan.precio || 0),
    ivaText: "+ IVA / mes",
    features: (plan.beneficios || []).reduce(
      (acc, b) => ({ ...acc, [b]: true }),
      {}
    ),
    color: "fit",
    bestSeller: false,
    highlight: "",
  };
}
