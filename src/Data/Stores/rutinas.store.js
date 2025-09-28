import { db, uid, nowISO } from "../../Data/api";
const KEY = "rutinas"; // {id, userId, nombre, bloques:[{dia, ejercicios:[{nombre, series, reps, peso}]}], ts}

export const listRutinas = () => db.list(KEY);
export function saveRutina(r){
  const all = db.list(KEY);
  if (r.id){
    const i = all.findIndex(x=>x.id===r.id);
    all[i] = { ...all[i], ...r, updatedAt: nowISO() };
  } else {
    all.push({ id: uid(), ts: nowISO(), ...r });
  }
  db.save(KEY, all); return all;
}
export const listRutinasByUser = (userId) => db.list(KEY).filter(r=>r.userId===userId);
export const removeRutina = (id) => { const all=db.list(KEY).filter(r=>r.id!==id); db.save(KEY, all); return all; };
