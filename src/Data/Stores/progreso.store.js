import { db, uid, nowISO } from "../../Data/api";
const KEY = "progreso"; // {id, userId, ts, peso, imc, grasa, brazo, cintura, cadera, notas}

export const listProgresoByUser = (userId) => db.list(KEY).filter(x=>x.userId===userId);
export function addProgreso(p){
  return db.push(KEY, { id: uid(), ts: nowISO(), ...p });
}
