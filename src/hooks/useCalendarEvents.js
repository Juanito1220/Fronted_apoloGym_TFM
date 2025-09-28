// src/hooks/useCalendarEvents.js
import { addEvent } from "../Data/Stores/events.store";


/* Evento desde una RESERVA */
export function pushReservaToCalendar({ fecha, hora, sala, maquina, instructor, clientId=null, trainerId=null }) {
  return addEvent({
    date: fecha,
    type: "reserva",
    title: `Reserva ${hora} · ${sala}`,
    subtitle: `${maquina} · ${instructor}`,
    meta: { hora, sala, maquina, instructor, clientId, trainerId }
  });
}

/* Evento desde un PLAN/MEMBRESÍA */
export function pushPlanToCalendar({ startDate, planName, membershipLabel, billing, unitPriceMensual, clientId=null, trainerId=null }) {
  const base = {
    type: "plan",
    title: `${planName} · ${membershipLabel}`,
    subtitle: billing === "anual"
      ? `Inicio plan (anual) · $${(unitPriceMensual*0.9).toFixed(2)}/mes`
      : `Inicio plan (mensual) · $${unitPriceMensual.toFixed(2)}/mes`,
    meta: { planName, membershipLabel, billing, unitPriceMensual, clientId, trainerId }
  };

  // Evento de inicio
  addEvent({ date: startDate, ...base });

  // Demo: próximas 2 renovaciones si es mensual
  if (billing === "mensual") {
    const d = new Date(startDate);
    for (let i = 1; i <= 2; i++) {
      const dd = new Date(d);
      dd.setMonth(dd.getMonth() + i);
      addEvent({ date: dd.toISOString().slice(0,10), ...base, subtitle: "Renovación mensual" });
    }
  }
}
