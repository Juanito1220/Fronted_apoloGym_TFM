import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listUsers, saveUser } from "../Data/Stores/usuario.store";

const AuthCtx = createContext(null);

// CUENTAS DE PRUEBA (rol explícito)
const HARD_USERS = [
  { email: "admin@apolo.com",      password: "1234", nombre: "Admin",       role: "admin",       active: true },
  { email: "entrenador@apolo.com", password: "1234", nombre: "Entrenador",  role: "entrenador",  active: true },
  { email: "cliente@apolo.com",    password: "1234", nombre: "Cliente",     role: "cliente",     active: true },
  { email: "jessicamaliza19@gmail.com", password: "1234", nombre: "Jessica", role: "admin",      active: true },
];

// roles válidos
const VALID_ROLES = new Set(["admin", "entrenador", "cliente"]);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Restaurar sesión
  useEffect(() => {
    try {
      const raw = localStorage.getItem("apolo_auth_user");
      if (raw) {
        const u = JSON.parse(raw);
        // sanea rol si viene mal
        if (!VALID_ROLES.has(u?.role)) u.role = "cliente";
        setUser(u);
      }
    } catch {}
  }, []);

  const persist = (u) => {
    // sanea antes de guardar
    const safe = { ...u, role: VALID_ROLES.has(u?.role) ? u.role : "cliente" };
    setUser(safe);
    try { localStorage.setItem("apolo_auth_user", JSON.stringify(safe)); } catch {}
  };

  async function login({ email, password }) {
    const emailNorm = (email || "").toLowerCase();

    // 1) Hardcoded: rol explícito
    const hard = HARD_USERS.find(
      u => u.email.toLowerCase() === emailNorm && u.password === password
    );
    if (hard && hard.active !== false) {
      const sessionUser = { email: hard.email, nombre: hard.nombre, role: hard.role };
      persist(sessionUser);
      // opcional: guardarlo en tu store
      try {
        const all = listUsers();
        const exists = all.find(x => (x.email || "").toLowerCase() === emailNorm);
        if (!exists) saveUser({ email: hard.email, nombre: hard.nombre, role: hard.role, active: true });
      } catch {}
      return sessionUser;
    }

    // 2) Store: si existe, usar su rol; si el rol es inválido, forzar cliente
    try {
      const all = listUsers(); // [{ id, email, nombre, role, active, password? }, ...]
      const found = all.find(u => (u.email || "").toLowerCase() === emailNorm);
      if (found && found.active !== false) {
        // si tu store guarda password, aquí podrías validarla:
        // if (typeof found.password === "string" && found.password !== password) throw new Error("BAD_PASSWORD");
        const role = VALID_ROLES.has(found.role) ? found.role : "cliente";
        const sessionUser = {
          id: found.id,
          email: found.email,
          nombre: found.nombre || found.email?.split("@")[0],
          role
        };
        persist(sessionUser);
        return sessionUser;
      }
    } catch {}

    // 3) Nuevo usuario: SIEMPRE cliente (no deducimos por email)
    const nuevo = { email, nombre: email.split("@")[0], role: "cliente", active: true };
    try { saveUser(nuevo); } catch {}
    const sessionUser = { email: nuevo.email, nombre: nuevo.nombre, role: "cliente" };
    persist(sessionUser);
    return sessionUser;
  }

  function logout() {
    try { localStorage.removeItem("apolo_auth_user"); } catch {}
    setUser(null);
  }

  function updateUser(patch) {
    if (!user) return;
    const next = { ...user, ...patch };
    persist(next);
  }

  const value = useMemo(() => ({ user, login, logout, updateUser }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
