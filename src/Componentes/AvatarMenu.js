import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import ProfileModal from "./perfilModal";
import "../Styles/userMenu.css";

export default function AvatarMenu(){
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [pmOpen, setPmOpen] = useState(false);
  const [pmTab, setPmTab] = useState("perfil"); // "perfil" | "config"

  const initial = (user?.nombre || user?.name || "U")[0]?.toUpperCase();
  const email = user?.email || "";

  const doLogout = () => {
    setOpen(false);
    logout();
    navigate("/"); // volver a la página principal
  };

  return (
    <div className="umenuslot">
      <div className="uavatar" onClick={()=>setOpen(v=>!v)} title="Menú de usuario">
        {initial}
      </div>

      {open && (
        <div className="umenu" onMouseLeave={()=>setOpen(false)}>
          <div className="uheader">
            <div className="ucircle">{initial}</div>
            <div className="utexts">
              <div className="uname">{user?.nombre || user?.name || "Usuario"}</div>
              {email && <div className="uemail">{email}</div>}
            </div>
          </div>

          {/* Solo estas 3 opciones */}
          <button
            className="uitem"
            onClick={()=>{ setPmTab("perfil"); setPmOpen(true); setOpen(false); }}
          >
            Perfil
          </button>

          <button
            className="uitem"
            onClick={()=>{ setPmTab("config"); setPmOpen(true); setOpen(false); }}
          >
            Configuración
          </button>

          <div className="udivider" />

          <button className="uitem danger" onClick={doLogout}>
            Cerrar sesión
          </button>
        </div>
      )}

      <ProfileModal
        open={pmOpen}
        onClose={()=>setPmOpen(false)}
        startOn={pmTab}
      />
    </div>
  );
}
