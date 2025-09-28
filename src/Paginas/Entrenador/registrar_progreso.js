import React, { useMemo, useState } from "react";
import { listUsers } from "../../Data/Stores/usuario.store";
import { listProgresoByUser, addProgreso } from "../../Data/Stores/progreso.store";
import BackTo from "../../Componentes/backtoMenu";

export default function RegistrarProgreso(){
  const clientes = useMemo(()=> listUsers().filter(u=>u.role==="cliente" && u.active!==false), []);
  const [userId, setUserId] = useState(clientes[0]?.id || "");
  const [f, setF] = useState({ peso:"", imc:"", grasa:"", brazo:"", cintura:"", cadera:"", notas:"" });

  const rows = useMemo(()=> userId ? listProgresoByUser(userId) : [], [userId]);

  const guardar = () => {
    if(!userId) return;
    addProgreso({ userId, ...numFields(f) });
    alert("Progreso registrado");
    setF({ peso:"", imc:"", grasa:"", brazo:"", cintura:"", cadera:"", notas:"" });
  };

  return (
    <div className="container page">
      <BackTo to="/entrenador" label="← Volver al panel" />
      <h2>Registrar progreso</h2>

      <div className="grid2">
        <div className="card">
          <div className="lbl">Cliente</div>
          <select className="inp" value={userId} onChange={e=>setUserId(e.target.value)}>
            {clientes.map(c=> <option key={c.id} value={c.id}>{c.nombre || c.email}</option>)}
          </select>

          <div className="grid3" style={{marginTop:8}}>
            <input className="inp" placeholder="Peso (kg)" value={f.peso} onChange={e=>setF({...f, peso:e.target.value})}/>
            <input className="inp" placeholder="IMC" value={f.imc} onChange={e=>setF({...f, imc:e.target.value})}/>
            <input className="inp" placeholder="% Grasa" value={f.grasa} onChange={e=>setF({...f, grasa:e.target.value})}/>
          </div>
          <div className="grid3" style={{marginTop:8}}>
            <input className="inp" placeholder="Brazo (cm)" value={f.brazo} onChange={e=>setF({...f, brazo:e.target.value})}/>
            <input className="inp" placeholder="Cintura (cm)" value={f.cintura} onChange={e=>setF({...f, cintura:e.target.value})}/>
            <input className="inp" placeholder="Cadera (cm)" value={f.cadera} onChange={e=>setF({...f, cadera:e.target.value})}/>
          </div>
          <textarea className="inp" placeholder="Notas" style={{marginTop:8,height:80}} value={f.notas} onChange={e=>setF({...f, notas:e.target.value})}/>
          <button className="btn primary" style={{marginTop:8}} onClick={guardar}>Guardar</button>
        </div>

        <div className="card">
          <div className="lbl">Historial</div>
          <table className="tbl">
            <thead><tr><th>Fecha</th><th>Peso</th><th>IMC</th><th>%G</th><th>Brazo</th><th>Cintura</th><th>Cadera</th></tr></thead>
            <tbody>
              {rows.slice().reverse().map(r=>(
                <tr key={r.id}>
                  <td>{r.ts.slice(0,16).replace("T"," ")}</td>
                  <td>{r.peso}</td><td>{r.imc}</td><td>{r.grasa}</td>
                  <td>{r.brazo}</td><td>{r.cintura}</td><td>{r.cadera}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7}>Sin registros</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function numFields(f){
  const n = {};
  for (const k of ["peso","imc","grasa","brazo","cintura","cadera"]) n[k] = Number(f[k]) || 0;
  n.notas = f.notas || "";
  return n;
}
