import React, { useState } from "react";
import { listPlans, savePlan, deletePlan } from "../../Data/Stores/planes.store";
import { audit } from "../../Data/Stores/audit.store";
import { useNavigate } from "react-router-dom";
// import BackToMenu from "../../Componentes/backtoMenu.js"; // no se usa aquí

export default function PlanesConfig(){
  const [planes, setPlanes] = useState(() => listPlans());
  const [form, setForm] = useState({ id:"", nombre:"", precio:0, beneficios:"", status:"activo" });
  const navigate = useNavigate();

  const guardar = () => {
    const arr = savePlan({
      ...form,
      precio: Number(form.precio) || 0,
      beneficios: parseBeneficios(form.beneficios),
    });
    setPlanes(arr);
    audit(form.id ? "PLAN_UPDATE" : "PLAN_CREATE", { id: form.id, nombre: form.nombre });
    setForm({ id:"", nombre:"", precio:0, beneficios:"", status:"activo" });
  };

  const editar = (p) => setForm({ ...p, beneficios: (p.beneficios || []).join("\n") });
  const borrar = (id) => { setPlanes(deletePlan(id)); audit("PLAN_DELETE", { id }); };

  return (
    <div className="container page" style={{ padding: 20 }}>
      <h2>Planes</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Nombre</th>
                <th style={th}>Precio</th>
                <th style={th}>Estatus</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((p) => (
                <tr key={p.id}>
                  <td style={td}>{p.nombre}</td>
                  <td style={td}>$ {Number(p.precio || 0).toFixed(2)}</td>
                  <td style={td}>{p.status}</td>
                  <td style={td}>
                    <button onClick={() => editar(p)}>Editar</button>
                    <button onClick={() => borrar(p.id)} style={{ marginLeft: 6 }}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              {!planes.length && (
                <tr>
                  <td style={td} colSpan={4}>Sin planes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BOTÓN REGRESAR → al dashboard de Admin dentro del AdminLayout */}
        <div className="back-line">
          {/* Opción A: relativa (desde /admin/planes sube a /admin) */}
          <button
            className="btn-back-menu"
            onClick={() => navigate("..", { replace: true, relative: "path" })}
          >
            ← Regresar al panel
          </button>

          {/* Opción B: absoluta (si prefieres ruta fija) */}
          {/* <button className="btn-back-menu" onClick={() => navigate("/admin")}>← Regresar al panel</button> */}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
          <h3>{form.id ? "Editar" : "Nuevo"} plan</h3>
          <input
            style={inp}
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          />
          <input
            style={inp}
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
          />
          <textarea
            style={{ ...inp, height: 100 }}
            placeholder={"Beneficios (uno por línea)"}
            value={form.beneficios}
            onChange={(e) => setForm((f) => ({ ...f, beneficios: e.target.value }))}
          />
          <select
            style={inp}
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
          <button onClick={guardar}>{form.id ? "Actualizar" : "Crear"}</button>
        </div>
      </div>
    </div>
  );
}

const parseBeneficios = (txt) => txt.split("\n").map((s) => s.trim()).filter(Boolean);
const th = { padding: "8px 10px", borderBottom: "1px solid #e5e7eb" };
const td = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6" };
const inp = { width: "100%", padding: "10px 12px", margin: "6px 0", border: "1px solid #e5e7eb", borderRadius: 10 };
