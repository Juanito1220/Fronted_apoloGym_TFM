// src/Paginas/Admin/usuarios_roles.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackToMenu from "../../Componentes/backtoMenu.js";
import {
  listUsers,
  saveUser,
  setRole,
  setActive,
  removeUser,
} from "../../Data/Stores/usuario.store"; // ← respeta tu casing/ruta real
import { audit } from "../../Data/Stores/audit.store"; // ajusta si tu ruta difiere

export default function UsuariosRoles() {
  const [users, setUsers] = useState(() => listUsers());
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    email: "",
    role: "cliente",
    active: true,
  });
 const navigate = useNavigate();   // ← agrega esta línea
  const save = () => {
    const arr = saveUser(form); // upsert: crea o edita
    setUsers(arr);
    audit(form.id ? "USER_UPDATE" : "USER_CREATE", {
      id: form.id || "(nuevo)",
      email: form.email,
      role: form.role,
    });
    setForm({ id: "", nombre: "", email: "", role: "cliente", active: true });
  };

  const edit = (u) => setForm(u);

  const del = (id) => {
    const arr = removeUser(id);
    setUsers(arr);
    audit("USER_DELETE", { id });
  };

  const changeRole = (id, role) => {
    const arr = setRole(id, role);
    setUsers(arr);
    audit("USER_SET_ROLE", { id, role });
  };

  const toggleActiveRow = (id, checked) => {
    const arr = setActive(id, checked); // setter explícito
    setUsers(arr);
    audit("USER_SET_ACTIVE", { id, active: checked });
  };

  return (
    <div className="container page" style={{ padding: 20 }}>
      <h2>Usuarios y roles</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#f9fafb" }}>
                <th style={th}>Nombre</th>
                <th style={th}>Email</th>
                <th style={th}>Rol</th>
                <th style={th}>Activo</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={td}>{u.nombre}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                    >
                      <option value="cliente">cliente</option>
                      <option value="entrenador">entrenador</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td style={td}>
                    <input
                      type="checkbox"
                      checked={!!u.active}
                      onChange={(e) => toggleActiveRow(u.id, e.target.checked)}
                    />
                  </td>
                  <td style={td}>
                    <button onClick={() => edit(u)}>Editar</button>
                    <button onClick={() => del(u.id)} style={{ marginLeft: 6 }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td style={td} colSpan={5}>
                    Sin usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <h3>{form.id ? "Editar" : "Crear"} usuario</h3>
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm((f) => ({ ...f, nombre: e.target.value }))
            }
            style={inp}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
            style={inp}
          />
          <select
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value }))
            }
            style={inp}
          >
            <option value="cliente">cliente</option>
            <option value="entrenador">entrenador</option>
            <option value="admin">admin</option>
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
            />
            Activo
          </label>
          
          <div style={{ marginTop: 10 }}>
            <button onClick={save}>{form.id ? "Actualizar" : "Crear"}</button>
          </div>
           <div className="back-line">
        <button className="btn-back-menu" onClick={() => navigate("/menu")}>
            ← Regresar al menú
        </button>
         </div>
        </div>
      </div>
    </div>
    
  );
}

const th = {
  padding: "8px 10px",
  borderBottom: "1px solid #e5e7eb",
};
const td = {
  padding: "8px 10px",
  borderBottom: "1px solid #f3f4f6",
};
const inp = {
  width: "100%",
  padding: "10px 12px",
  margin: "6px 0",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
};
