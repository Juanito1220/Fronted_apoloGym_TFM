import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Envuelve elementos que requieren sesión
export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
