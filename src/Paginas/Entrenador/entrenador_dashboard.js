import React from "react";
import BackTo from "../../Componentes/backtoMenu";

export default function TrainerDashboard(){
  return (
    <div className="container page">
      <BackTo to="/entrenador" label="← Panel del entrenador" />
      <h2>Resumen</h2>
      <div className="grid3">
        <div className="card"><div className="lbl">Clientes activos</div><div style={{fontWeight:900, fontSize:22}}>—</div></div>
        <div className="card"><div className="lbl">Rutinas asignadas</div><div style={{fontWeight:900, fontSize:22}}>—</div></div>
        <div className="card"><div className="lbl">Asistencias hoy</div><div style={{fontWeight:900, fontSize:22}}>—</div></div>
      </div>
    </div>
  );
}
