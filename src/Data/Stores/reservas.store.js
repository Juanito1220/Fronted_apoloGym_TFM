// src/Data/Stores/reservas.store.js
import { db, uid, nowISO } from "../../Data/api";

const KEY = "bookings";

export function listBookings() {
  return db.list(KEY);
}

export function addBooking(b) {
  // b: { userId, fecha, hora, sala, maquina, instructorId }
  return db.push(KEY, { id: uid(), ts: nowISO(), status: "confirmada", ...b }); // ← nowISO
}

// Si en algún lado llamaste pushBooking, deja un alias:
export const pushBooking = addBooking;
