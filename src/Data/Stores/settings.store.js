import { db } from "../api";
const KEY = "settings";
export const getSettings = () => db.get(KEY, { horario:{ apertura:"06:00", cierre:"22:00" }, aforoMax: 80 });
export const setSettings = (s) => db.set(KEY, s);
