import React, { useMemo, useState } from "react";
import { listUsers } from "../../Data/Stores/usuario.store";
import { checkIn, checkOut, listAttendance } from "../../Data/Stores/aforo.store";

export default function MarcarAsistencia() {
  const clientes = useMemo(() => listUsers().filter(u => u.role === "cliente" && u.active !== false), []);
  const [userId, setUserId] = useState(clientes[0]?.id || "");
  const [sala, setSala] = useState("Principal");
  const [logs, setLogs] = useState(() => listAttendance());

  const entrar = () => { if (!userId) return; checkIn({ userId, sala }); setLogs(listAttendance()); };
  const salir = () => { if (!userId) return; checkOut({ userId, sala }); setLogs(listAttendance()); };

  return (
    <div className="container page">
      <h2>Marcar asistencia</h2>

      <div className="grid2">
        <div className="card">
          <div className="lbl">Cliente</div>
          <select className="inp" value={userId} onChange={e => setUserId(e.target.value)}>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre || c.email}</option>)}
          </select>
          <div className="lbl" style={{ marginTop: 8 }}>Sala</div>
          <input className="inp" value={sala} onChange={e => setSala(e.target.value)} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn" onClick={entrar}>Entrar</button>
            <button className="btn" onClick={salir}>Salir</button>
          </div>
        </div>

        <div className="card">
          <div className="lbl">Movimientos recientes</div>
          <table className="tbl">
            <thead><tr><th>Fecha</th><th>Usuario</th><th>Sala</th><th>Tipo</th></tr></thead>
            <tbody>
              {logs.slice().reverse().slice(0, 50).map(r => (
                <tr key={r.id}>
                  <td>{r.ts.slice(0, 16).replace("T", " ")}</td>
                  <td>{r.userId}</td>
                  <td>{r.sala}</td>
                  <td>{r.type}</td>
                </tr>
              ))}
              {!logs.length && <tr><td colSpan={4}>Sin registros</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
