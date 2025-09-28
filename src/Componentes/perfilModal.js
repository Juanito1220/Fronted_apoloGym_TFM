// src/Componentes/ProfileModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { updateUserRecord } from "../Data/Stores/usuario.store";
import "../Styles/userMenu.css";

export default function ProfileModal({ open, onClose, startOn="perfil" }) {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [tab, setTab] = useState(startOn); // "perfil" | "config"
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "" });

  useEffect(() => {
    if (open) {
      setTab(startOn);
      setForm({
        nombre: user?.nombre || user?.name || "",
        direccion: user?.direccion || "",
        telefono: user?.telefono || "",
      });
    }
  }, [open, startOn, user]);

  if (!open) return null;

  const initial = (user?.nombre || user?.name || "U")[0]?.toUpperCase();
  const email = user?.email || "";

  const guardar = () => {
    // Actualiza en memoria (AuthContext)
    updateUser({
      nombre: form.nombre,
      direccion: form.direccion,
      telefono: form.telefono,
    });
    // Si el usuario tiene id, también persiste en store local
    if (user?.id) {
      updateUserRecord(user.id, {
        nombre: form.nombre,
        direccion: form.direccion,
        telefono: form.telefono,
      });
    }
    onClose?.();
  };

  const cerrarSesion = () => {
    logout();
    onClose?.();
    navigate("/"); // volver a la portada
  };

  return (
    <div className="umodal-backdrop" onClick={onClose}>
      <div className="umodal wide" onClick={(e)=>e.stopPropagation()}>
        {/* Header del modal */}
        <div className="pm-head">
          <div className="pm-id">
            <div className="pm-avatar">{initial}</div>
            <div className="pm-who">
              <div className="pm-name">{form.nombre || user?.name || "Usuario"}</div>
              {email && <div className="pm-email">{email}</div>}
            </div>
          </div>
          <button className="ubtn ghost" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="pm-tabs">
          <button
            className={`pm-tab ${tab==="perfil" ? "active":""}`}
            onClick={()=>setTab("perfil")}
          >
            Perfil
          </button>
          <button
            className={`pm-tab ${tab==="config" ? "active":""}`}
            onClick={()=>setTab("config")}
          >
            Configuración
          </button>
        </div>

        {/* Contenido */}
        {tab === "perfil" && (
          <div className="pm-body">
            <div className="pm-field">
              <label>Nombre</label>
              <input
                value={form.nombre}
                onChange={(e)=>setForm({...form, nombre:e.target.value})}
                placeholder="Tu nombre"
              />
            </div>
            <div className="pm-field">
              <label>Dirección</label>
              <input
                value={form.direccion}
                onChange={(e)=>setForm({...form, direccion:e.target.value})}
                placeholder="Calle, ciudad…"
              />
            </div>
            <div className="pm-field">
              <label>Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e)=>setForm({...form, telefono:e.target.value})}
                placeholder="0999999999"
              />
            </div>
          </div>
        )}

        {tab === "config" && (
          <div className="pm-body">
            <div className="pm-block">
              <div className="pm-block-title">Preferencias</div>
              <div className="pm-field">
                <label>Tema</label>
                <select defaultValue="light" disabled>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
                <small className="muted">Demo: sin persistencia real.</small>
              </div>
            </div>

            <div className="pm-block">
              <div className="pm-block-title">Seguridad</div>
              <div className="pm-field">
                <label>Contraseña</label>
                <input type="password" value="********" readOnly />
                <small className="muted">En esta demo no cambiamos contraseña.</small>
              </div>
            </div>
          </div>
        )}

        {/* Footer con acciones: guardar y cerrar sesión */}
        <div className="pm-footer">
          <button className="ubtn" onClick={onClose}>Cancelar</button>
          <div className="pm-spacer" />
          <button className="ubtn danger" onClick={cerrarSesion}>Cerrar sesión</button>
          <button className="ubtn primary" onClick={guardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
