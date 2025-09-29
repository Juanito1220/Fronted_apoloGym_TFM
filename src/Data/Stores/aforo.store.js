// src/Data/Stores/aforo.store.js
import { db, uid, nowISO } from "../../Data/api";

const KEY = "attendance";
const CONFIG_KEY = "aforo_config";

// Configuración por defecto de capacidades
const DEFAULT_CAPACITIES = {
  "Principal": 50,
  "Cardio": 25,
  "Pesas": 30,
  "Funcional": 20,
  "Spinning": 15
};

/** Lista de eventos de aforo (in/out) */
export function listAttendance() {
  return db.list(KEY);
}

/** Obtener configuración de capacidades */
export function getCapacities() {
  const config = db.list(CONFIG_KEY);
  return config.length > 0 ? config[0].capacities : DEFAULT_CAPACITIES;
}

/** Actualizar capacidades de las salas */
export function updateCapacities(capacities) {
  const config = db.list(CONFIG_KEY);
  if (config.length > 0) {
    // Actualizar el primer elemento
    const updatedConfig = config.map((item, index) =>
      index === 0 ? { ...item, capacities } : item
    );
    db.save(CONFIG_KEY, updatedConfig);
  } else {
    db.push(CONFIG_KEY, { id: uid(), capacities });
  }
}

/** Check-in (entrada) - con validación de capacidad */
export function checkIn({ userId, sala = "Principal" }) {
  // Validaciones básicas
  if (!userId || !userId.trim()) {
    throw new Error("El ID del usuario es requerido");
  }

  const capacities = getCapacities();
  const current = occupancyNow();

  const currentOccupancy = current[sala] || 0;
  const maxCapacity = capacities[sala] || DEFAULT_CAPACITIES[sala] || 50;

  // Verificar si el usuario ya está en la sala
  const recentEntries = db.list(KEY)
    .filter(r => r.userId === userId && r.sala === sala)
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));

  if (recentEntries.length > 0 && recentEntries[0].type === "in") {
    throw new Error(`El usuario ${userId} ya tiene una entrada registrada en ${sala}`);
  }

  // Verificar capacidad
  if (currentOccupancy >= maxCapacity) {
    throw new Error(`Capacidad máxima alcanzada en ${sala} (${maxCapacity} personas)`);
  }

  return db.push(KEY, {
    id: uid(),
    ts: nowISO(),
    userId: userId.trim(),
    sala,
    type: "in"
  });
}

/** Check-out (salida) */
export function checkOut({ userId, sala = "Principal" }) {
  // Validaciones básicas
  if (!userId || !userId.trim()) {
    throw new Error("El ID del usuario es requerido");
  }

  // Verificar si el usuario tiene una entrada previa en la sala
  const userEntries = db.list(KEY)
    .filter(r => r.userId === userId && r.sala === sala)
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));

  if (userEntries.length === 0) {
    throw new Error(`No se encontró entrada previa para el usuario ${userId} en ${sala}`);
  }

  if (userEntries[0].type === "out") {
    throw new Error(`El usuario ${userId} ya tiene una salida registrada en ${sala}`);
  }

  return db.push(KEY, {
    id: uid(),
    ts: nowISO(),
    userId: userId.trim(),
    sala,
    type: "out"
  });
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

/** Estado completo del aforo con alertas */
export function getAforoStatus() {
  const capacities = getCapacities();
  const current = occupancyNow();
  const status = {};

  Object.keys(capacities).forEach(sala => {
    const currentOccupancy = current[sala] || 0;
    const maxCapacity = capacities[sala];
    const percentage = (currentOccupancy / maxCapacity) * 100;

    let alertLevel = 'safe'; // verde
    if (percentage >= 100) {
      alertLevel = 'critical'; // rojo
    } else if (percentage >= 80) {
      alertLevel = 'warning'; // amarillo/naranja
    }

    status[sala] = {
      currentOccupancy,
      maxCapacity,
      percentage: Math.round(percentage),
      alertLevel,
      available: maxCapacity - currentOccupancy
    };
  });

  return status;
}

/** Obtener resumen global */
export function getGlobalSummary() {
  const status = getAforoStatus();
  let totalCurrent = 0;
  let totalCapacity = 0;
  let criticalCount = 0;
  let warningCount = 0;

  Object.values(status).forEach(sala => {
    totalCurrent += sala.currentOccupancy;
    totalCapacity += sala.maxCapacity;
    if (sala.alertLevel === 'critical') criticalCount++;
    else if (sala.alertLevel === 'warning') warningCount++;
  });

  const globalPercentage = totalCapacity > 0 ? (totalCurrent / totalCapacity) * 100 : 0;

  return {
    totalCurrent,
    totalCapacity,
    globalPercentage: Math.round(globalPercentage),
    criticalCount,
    warningCount,
    safeCount: Object.keys(status).length - criticalCount - warningCount
  };
}

/** Inicializar datos de prueba (solo una vez) */
export function initializeTestData() {
  const existing = db.list(KEY);
  if (existing.length === 0) {
    // Agregar algunas entradas de prueba
    const testEntries = [
      { userId: "user001", sala: "Principal", type: "in" },
      { userId: "user002", sala: "Principal", type: "in" },
      { userId: "user003", sala: "Cardio", type: "in" },
      { userId: "user004", sala: "Cardio", type: "in" },
      { userId: "user005", sala: "Pesas", type: "in" },
      { userId: "user006", sala: "Pesas", type: "in" },
      { userId: "user007", sala: "Funcional", type: "in" },
      { userId: "user008", sala: "Spinning", type: "in" },
    ];

    testEntries.forEach(entry => {
      db.push(KEY, {
        id: uid(),
        ts: nowISO(),
        ...entry
      });
    });
  }
}

/** Alias compatible si en algún lugar llamaste pushAttendance */
export function pushAttendance(rec) {
  return db.push(KEY, { id: uid(), ts: nowISO(), ...rec });
}
