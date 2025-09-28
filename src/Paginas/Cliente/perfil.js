import React, { useEffect, useState } from "react";
import BackToMenu from "../../Componentes/backtoMenu";
import "../../Styles/perfil.css";
import { useAuth } from "../../Auth/AuthContext";

export default function Perfil(){
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ nombre:"", direccion:"", telefono:"" });

  useEffect(()=>{
    if(user){
      setForm({
        nombre: user.nombre || user.name || "",
        direccion: user.direccion || "",
        telefono: user.telefono || ""
      });
    }
  },[user]);

  const guardar = () => {
    updateUser({ ...form });
    alert("Perfil actualizado (local).");
  };

  return (
    <div className="container page perfil">
      <BackToMenu />
      <h1>Mi perfil</h1>
      <p className="lead">Edita tu información básica.</p>

      <div className="perfil-form">
        <label>Nombre</label>
        <input value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} />

        <label>Dirección</label>
        <input value={form.direccion} onChange={e=>setForm({...form, direccion:e.target.value})} />

        <label>Teléfono</label>
        <input value={form.telefono} onChange={e=>setForm({...form, telefono:e.target.value})} />

        <div className="row">
          <button className="btn-back-menu" onClick={guardar}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}
