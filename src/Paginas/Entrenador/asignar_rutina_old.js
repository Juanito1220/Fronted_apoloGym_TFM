import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AsignarRutina() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al dashboard con la pestaña de rutinas activa
    navigate("/entrenador", { 
      replace: true,
      state: { activeTab: 'rutinas' }
    });
  }, [navigate]);

  return (
    <div className="container page">
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Redirigiendo al Panel del Entrenador...</p>
        </div>
      </div>
    </div>
  );
}

  const addEj = () => {
    if (!ej.nombre.trim()) return;
    setPlan(p => {
      const i = p.findIndex(b => b.dia === dia);
      if (i >= 0) {
        const upd = [...p];
        upd[i] = { ...upd[i], ejercicios: [...upd[i].ejercicios, ej] };
        return upd;
      }
      return [...p, { dia, ejercicios: [ej] }];
    });
    setEj({ nombre: "", series: 3, reps: 12, peso: 0 });
  };

  const guardar = () => {
    if (!userId || !plan.length) return alert("Selecciona cliente y agrega ejercicios");
    saveRutina({ userId, nombre, bloques: plan });
    setPlan([]); alert("Rutina asignada");
  };

  const borrar = (id) => {
    removeRutina(id);
    alert("Rutina eliminada. Cambia cliente para refrescar la lista.");
  };

  return (
    <div className="container page">
      <h2>Asignar rutina a cliente</h2>

      <div className="grid3">
        <div className="card">
          <div className="lbl">Cliente</div>
          <select className="inp" value={userId} onChange={e => setUserId(e.target.value)}>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre || c.email}</option>)}
          </select>
          <div className="lbl">Nombre de la rutina</div>
          <input className="inp" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>

        <div className="card">
          <div className="lbl">Día</div>
          <select className="inp" value={dia} onChange={e => setDia(e.target.value)}>
            {DIAS.map(d => <option key={d}>{d}</option>)}
          </select>

          <div className="lbl">Ejercicio</div>
          <input className="inp" placeholder="Nombre" value={ej.nombre} onChange={e => setEj(s => ({ ...s, nombre: e.target.value }))} />
          <div className="grid3" style={{ marginTop: 8 }}>
            <input className="inp" type="number" placeholder="Series" value={ej.series} onChange={e => setEj(s => ({ ...s, series: Number(e.target.value) || 0 }))} />
            <input className="inp" type="number" placeholder="Reps" value={ej.reps} onChange={e => setEj(s => ({ ...s, reps: Number(e.target.value) || 0 }))} />
            <input className="inp" type="number" placeholder="Peso" value={ej.peso} onChange={e => setEj(s => ({ ...s, peso: Number(e.target.value) || 0 }))} />
          </div>
          <button className="btn" style={{ marginTop: 8 }} onClick={addEj}>Añadir ejercicio</button>
        </div>

        <div className="card">
          <div className="lbl">Plan (borrador)</div>
          {plan.length ? plan.map(b => (
            <div key={b.dia} style={{ marginBottom: 8 }}>
              <b>{b.dia}</b>
              <ul style={{ margin: 6 }}>
                {b.ejercicios.map((x, i) => <li key={i}>{x.nombre} — {x.series}×{x.reps} {x.peso ? `@${x.peso}kg` : ""}</li>)}
              </ul>
            </div>
          )) : <div className="lbl">Sin ejercicios aún</div>}
          <button className="btn primary" onClick={guardar}>Guardar rutina</button>
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Rutinas previas del cliente</h3>
      <table className="tbl">
        <thead><tr><th>Fecha</th><th>Nombre</th><th>Bloques</th><th></th></tr></thead>
        <tbody>
          {rutinasPrev.map(r => (
            <tr key={r.id}>
              <td>{r.ts?.slice(0, 10)}</td>
              <td>{r.nombre}</td>
              <td>{r.bloques?.length || 0}</td>
              <td><button className="btn" onClick={() => borrar(r.id)}>Borrar</button></td>
            </tr>
          ))}
          {!rutinasPrev.length && <tr><td colSpan={4}>Sin rutinas previas</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
