import React, { useState } from "react";
import {
  listPlans,
  savePlan,
  deletePlan,
  setPlanStatus,
} from "../../Data/Stores/planes.store";
import { audit } from "../../Data/Stores/audit.store";
import { useNavigate } from "react-router-dom";


/* Helpers de validación locales (no rompen tu estructura) */
const ONLY_LETTERS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const ONLY_NUMBER_DEC = /^\d+(\.\d{1,2})?$/;

const keepLetters = (s = "") => s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+/g, "");
const keepNumberDec = (s = "") => s.replace(/[^0-9.]+/g, "").replace(/(\..*)\./g, "$1"); // solo un punto

export default function PlanesConfig() {
  const [planes, setPlanes] = useState(() => listPlans());
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    precio: "",
    beneficios: "",
    status: "activo",
  });

  const [errors, setErrors] = useState({}); // { nombre, precio }
  const navigate = useNavigate();

  /* Validación por campo con mensaje */
  const validateField = (name, value) => {
    if (name === "nombre") {
      if (!value.trim()) return "Ingrese nombre";
      if (!ONLY_LETTERS.test(value.trim()))
        return "Ingrese solo letras";
    }
    if (name === "precio") {
      if (!String(value).trim()) return "Ingrese precio";
      if (!ONLY_NUMBER_DEC.test(String(value).trim()))
        return "Ingrese solo números (hasta 2 decimales)";
    }
    return "";
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    // Sanitiza mientras escribe
    let v = value;
    if (name === "nombre") v = keepLetters(value);
    if (name === "precio") v = keepNumberDec(value);

    setForm((f) => ({ ...f, [name]: v }));

    // Valida y muestra mensaje en vivo
    const msg = validateField(name, v);
    setErrors((er) => ({ ...er, [name]: msg }));
  };

  const guardar = () => {
    // Validar todo antes de guardar
    const eNombre = validateField("nombre", form.nombre);
    const ePrecio = validateField("precio", form.precio);
    const newErrors = { nombre: eNombre, precio: ePrecio };
    setErrors(newErrors);

    if (eNombre || ePrecio) {
      // no guardar si hay errores
      return;
    }

    const arr = savePlan({
      ...form,
      // precio numérico seguro
      precio: Number(String(form.precio).replace(",", ".")) || 0,
      beneficios: parseBeneficios(form.beneficios),
    });
    setPlanes(arr);

    audit(form.id ? "PLAN_UPDATE" : "PLAN_CREATE", {
      id: form.id,
      nombre: form.nombre,
    });

    setForm({ id: "", nombre: "", precio: "", beneficios: "", status: "activo" });
    setErrors({});
  };

  const editar = (p) =>
    setForm({
      ...p,
      precio: String(p.precio ?? ""),
      beneficios: (p.beneficios || []).join("\n"),
    });

  const borrar = (id) => {
    setPlanes(deletePlan(id));
    audit("PLAN_DELETE", { id });
  };

  return (
    <div className="container page" style={{ padding: 20 }}>
      <h2>Planes</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        {/* Tabla */}
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
                  <td style={td} colSpan={4}>
                    Sin planes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Volver al panel Admin */}
        <div className="back-line" style={{ alignSelf: "start" }}>
          <button
            className="btn-back-menu"
            onClick={() => navigate("..", { replace: true, relative: "path" })}
          >
            ← Regresar al panel
          </button>
        </div>

        {/* Formulario */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
          <h3>{form.id ? "Editar" : "Nuevo"} plan</h3>

          <label style={lbl}>Nombre</label>
          <input
            name="nombre"
            style={inp}
            placeholder="Ej. Black, Fit, Smart..."
            value={form.nombre}
            onChange={onChange}
          />
          {errors.nombre && <div style={err}>{errors.nombre}</div>}

          <label style={lbl}>Precio</label>
          <input
            name="precio"
            style={inp}
            placeholder="Ingrese precio"
            value={form.precio}
            onChange={onChange}
            inputMode="decimal"
          />
          {errors.precio && <div style={err}>{errors.precio}</div>}

          <label style={lbl}>Beneficios</label>
          <textarea
            name="beneficios"
            style={{ ...inp, height: 100 }}
            placeholder={"Beneficios (uno por línea)"}
            value={form.beneficios}
            onChange={onChange}
          />

          <label style={lbl}>Estatus</label>
          <select
            name="status"
            style={inp}
            value={form.status}
            onChange={onChange}
          >
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>

          <button onClick={guardar} style={{ marginTop: 6 }}>
            {form.id ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

const parseBeneficios = (txt) =>
  String(txt || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const th = { padding: "8px 10px", borderBottom: "1px solid #e5e7eb" };
const td = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6" };
const inp = {
  width: "100%",
  padding: "10px 12px",
  margin: "6px 0",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
};
const lbl = { fontWeight: 700, marginTop: 6, display: "block" };
const err = { color: "#b91c1c", fontWeight: 700, marginTop: -4, marginBottom: 8 };
