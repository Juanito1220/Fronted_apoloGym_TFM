import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Permite solo ciertos roles: <RequireRole roles={["admin"]}>...</RequireRole>
export default function RequireRole({ roles = [], children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role)) {
    // si está logueado pero no tiene rol adecuado, mándalo a su panel
    const target = user.role === "admin" ? "/admin"
                 : user.role === "entrenador" ? "/entrenador"
                 : "/menu";
    return <Navigate to={target} replace />;
  }
  return children;
}
