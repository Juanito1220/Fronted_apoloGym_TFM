// src/Componentes/ProfileModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { updateUserRecord } from "../Data/Stores/usuario.store";
import "../Styles/userMenu.css";

export default function ProfileModal({ open, onClose, startOn = "perfil" }) {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [tab, setTab] = useState(startOn); // "perfil" | "config"
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "" });
  const [saving, setSaving] = useState(false);

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

  const guardar = async () => {
    setSaving(true);

    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 800));

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

    // Mostrar mensaje de éxito
    showSuccessToast();
    setSaving(false);
    onClose?.();
  };

  const showSuccessToast = () => {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
      <div class="toast-icon">✅</div>
      <div class="toast-message">Perfil actualizado exitosamente</div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const cerrarSesion = () => {
    logout();
    onClose?.();
    navigate("/"); // volver a la portada
  };

  return (
    <div className="umodal-backdrop modern" onClick={onClose}>
      <div className="umodal modern wide" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal mejorado */}
        <div className="pm-head modern">
          <div className="pm-id">
            <div className="pm-avatar modern">{initial}</div>
            <div className="pm-who">
              <div className="pm-name">{form.nombre || user?.name || "Usuario"}</div>
              {email && <div className="pm-email">{email}</div>}
              <div className="pm-role">{user?.role || "Cliente"}</div>
            </div>
          </div>
          <button className="ubtn ghost modern" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tabs mejorados */}
        <div className="pm-tabs modern">
          <button
            className={`pm-tab modern ${tab === "perfil" ? "active" : ""}`}
            onClick={() => setTab("perfil")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Perfil
          </button>
          <button
            className={`pm-tab modern ${tab === "config" ? "active" : ""}`}
            onClick={() => setTab("config")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6"></path>
              <path d="m15.5 3.5l-7 7m0-7l7 7"></path>
            </svg>
            Configuración
          </button>
        </div>

        {/* Contenido del perfil */}
        {tab === "perfil" && (
          <div className="pm-body modern">
            <div className="pm-field modern">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Nombre Completo
              </label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ingresa tu nombre completo"
                className="modern"
              />
            </div>

            <div className="pm-field modern">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Dirección
              </label>
              <input
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                placeholder="Calle, ciudad, código postal..."
                className="modern"
              />
            </div>

            <div className="pm-field modern">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Teléfono
              </label>
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+57 300 123 4567"
                className="modern"
              />
            </div>

            <div className="pm-field modern">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Correo Electrónico
              </label>
              <input
                value={email}
                disabled
                className="modern disabled"
                placeholder="No especificado"
              />
              <small className="field-hint">El email no se puede modificar desde aquí</small>
            </div>
          </div>
        )}

        {/* Contenido de configuración */}
        {tab === "config" && (
          <div className="pm-body modern">
            <div className="pm-block modern">
              <div className="pm-block-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                Preferencias de Apariencia
              </div>
              <div className="pm-field modern">
                <label>Tema de la aplicación</label>
                <select defaultValue="claro" className="modern">
                  <option value="claro">🌅 Tema Claro</option>
                  <option value="oscuro">🌙 Tema Oscuro</option>
                  <option value="auto">🔄 Automático</option>
                </select>
                <small className="field-hint">Próximamente disponible</small>
              </div>

              <div className="pm-field modern">
                <label>Idioma</label>
                <select defaultValue="es" className="modern">
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇺🇸 English</option>
                </select>
                <small className="field-hint">Funcionalidad en desarrollo</small>
              </div>
            </div>

            <div className="pm-block modern">
              <div className="pm-block-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Seguridad y Privacidad
              </div>
              <div className="pm-field modern">
                <label>Contraseña actual</label>
                <input type="password" value="••••••••" readOnly className="modern disabled" />
                <small className="field-hint">Contacta al administrador para cambiar tu contraseña</small>
              </div>

              <div className="pm-settings-toggle">
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                  Recibir notificaciones por email
                </label>
              </div>

              <div className="pm-settings-toggle">
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                  Permitir notificaciones push
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer mejorado */}
        <div className="pm-footer modern">
          <button className="ubtn secondary modern" onClick={onClose}>
            Cancelar
          </button>
          <div className="pm-spacer" />
          <button className="ubtn danger modern" onClick={cerrarSesion}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar sesión
          </button>
          <button
            className={`ubtn primary modern ${saving ? 'loading' : ''}`}
            onClick={guardar}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner"></div>
                Guardando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
