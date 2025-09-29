import React, { useMemo, useState } from "react";
import { db } from "../../Data/api";
import BackTo from "../../Componentes/backtoMenu";
import { 
  FiSettings, 
  FiClock, 
  FiHome, 
  FiSave, 
  FiRotateCcw, 
  FiCheck,
  FiX,
  FiPlus,
  FiTrash2,
  FiEye,
  FiUpload
} from "react-icons/fi";
import { toast } from 'react-hot-toast';
import "../../Styles/admin_config.css";

const DEFAULTS = {
  general: {
    nombre: "Apolo Gym",
    logoUrl: "",
    colorPrimario: "#2563eb",
  },
  horario: {
    abre: "06:00",
    cierra: "22:00",
    feriados: [] // ["2025-12-25", ...]
  },
  salas: [
    { id: "principal", nombre: "Principal", capacidad: 60 },
    { id: "funcional", nombre: "Sala Funcional", capacidad: 25 },
  ],
  reservas: {
    duracionMin: 60,         // minutos por slot
    anticipacionHoras: 24,   // cuántas horas antes se puede reservar
    maxReservasDia: 1,       // por usuario
    cancelacionHoras: 6      // sin penalidad
  },
  pagos: {
    moneda: "USD",
    ivaPorc: 12,
    metodos: { card: true, transfer: true, cash: true }
  },
  notificaciones: {
    emailFrom: "no-reply@apologym.com",
    emailEnabled: true,
    smsEnabled: false
  },
  planes: {
    periodoLabel: "mes",
    ivaIncluido: false // si el precio que muestras ya incluye IVA
  }
};

export default function SistemaConfig(){
  const initial = useMemo(() => {
    const saved = db.getObj("settings");
    return deepMerge(DEFAULTS, saved || {});
  }, []);

  const [cfg, setCfg] = useState(initial);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Detectar cambios
  const checkForChanges = (newConfig) => {
    const hasChanged = JSON.stringify(newConfig) !== JSON.stringify(initial);
    setHasChanges(hasChanged);
  };

  // Actualizar configuración
  const updateConfig = (path, value) => {
    setCfg(prevCfg => {
      const newCfg = { ...prevCfg };
      const keys = path.split('.');
      let current = newCfg;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      checkForChanges(newCfg);
      return newCfg;
    });
  };

  // Guardar configuración
  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay
      db.setObj("settings", cfg);
      setHasChanges(false);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  // Resetear configuración
  const handleReset = () => {
    setCfg(initial);
    setHasChanges(false);
    toast.info('Configuración restablecida');
  };
  const [nuevaSala, setNuevaSala] = useState({ nombre: "", capacidad: 0 });
  const [nuevoFeriado, setNuevoFeriado] = useState("");

  const save = () => {
    db.setObj("settings", cfg);
    alert("✅ Configuración guardada (local)");
  };

  const addSala = () => {
    const nombre = (nuevaSala.nombre || "").trim();
    const cap = Number(nuevaSala.capacidad) || 0;
    if (!nombre) return;
    const id = slug(nombre);
    if (cfg.salas.some(s => s.id === id)) {
      return alert("Esa sala ya existe.");
    }
    setCfg(c => ({ ...c, salas: [...c.salas, { id, nombre, capacidad: cap }] }));
    setNuevaSala({ nombre: "", capacidad: 0 });
  };

  const delSala = (id) => {
    setCfg(c => ({ ...c, salas: c.salas.filter(s => s.id !== id) }));
  };

  const addFeriado = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nuevoFeriado)) return alert("Usa formato YYYY-MM-DD");
    if (cfg.horario.feriados.includes(nuevoFeriado)) return;
    setCfg(c => ({ ...c, horario: { ...c.horario, feriados: [...c.horario.feriados, nuevoFeriado] }}));
    setNuevoFeriado("");
  };

  const delFeriado = (d) => {
    setCfg(c => ({ ...c, horario: { ...c.horario, feriados: c.horario.feriados.filter(x => x !== d) }}));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación y acciones */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BackTo to="/admin" label="← Regresar al panel admin" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
                <p className="text-sm text-gray-600">Administra la configuración general del gimnasio</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Cambios sin guardar
                </span>
              )}
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiRotateCcw className="h-4 w-4" />
                <span>Resetear</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <FiSave className="h-4 w-4" />
                )}
                <span>{saving ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'general', label: 'General', icon: FiSettings },
              { id: 'horarios', label: 'Horarios', icon: FiClock },
              { id: 'salas', label: 'Salas', icon: FiHome },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'general' && (
          <GeneralTab cfg={cfg} updateConfig={updateConfig} />
        )}
        {activeTab === 'horarios' && (
          <HorariosTab 
            cfg={cfg} 
            setCfg={setCfg}
            nuevoFeriado={nuevoFeriado}
            setNuevoFeriado={setNuevoFeriado}
            addFeriado={addFeriado}
            delFeriado={delFeriado}
          />
        )}
        {activeTab === 'salas' && (
          <SalasTab 
            cfg={cfg} 
            setCfg={setCfg}
            nuevaSala={nuevaSala}
            setNuevaSala={setNuevaSala}
            addSala={addSala}
            delSala={delSala}
          />
        )}
      </div>
    </div>
  );
              onChange={(e)=>setCfg(c=>({...c, general:{...c.general, nombre: e.target.value}}))}
            />
            <label className="lbl">Logo (URL)</label>
            <input
              className="inp"
              value={cfg.general.logoUrl}
              onChange={(e)=>setCfg(c=>({...c, general:{...c.general, logoUrl: e.target.value}}))}
              placeholder="https://..."
            />
            <label className="lbl">Color primario</label>
            <input
              className="inp"
              type="color"
              value={cfg.general.colorPrimario}
              onChange={(e)=>setCfg(c=>({...c, general:{...c.general, colorPrimario: e.target.value}}))}
              style={{height:40, padding:0}}
            />
          </div>

          <div className="card logo-preview">
            <div className="lbl">Vista previa</div>
            <div className="brand" style={{'--brand': cfg.general.colorPrimario}}>
              <div className="brand-dot" />
              <div className="brand-name">{cfg.general.nombre}</div>
            </div>
            {cfg.general.logoUrl ? (
              <img alt="Logo" src={cfg.general.logoUrl} className="logo-img" />
            ) : <div className="logo-placeholder">Sin logo</div>}
          </div>
        </div>
      </Section>

      {/* Horarios */}
      <Section title="Horarios">
        <div className="row2">
          <div className="card">
            <div className="grid2">
              <div>
                <label className="lbl">Apertura</label>
                <input className="inp" type="time" value={cfg.horario.abre}
                       onChange={(e)=>setCfg(c=>({...c, horario:{...c.horario, abre:e.target.value}}))}/>
              </div>
              <div>
                <label className="lbl">Cierre</label>
                <input className="inp" type="time" value={cfg.horario.cierra}
                       onChange={(e)=>setCfg(c=>({...c, horario:{...c.horario, cierra:e.target.value}}))}/>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="lbl">Feriados (cerrado)</div>
            <div className="addline">
              <input className="inp" type="date" value={nuevoFeriado} onChange={(e)=>setNuevoFeriado(e.target.value)}/>
              <button className="btn" onClick={addFeriado}>Añadir</button>
            </div>
            <ul className="chips">
              {cfg.horario.feriados.map(d=>(
                <li key={d} className="chip">
                  {d} <button className="chip-x" onClick={()=>delFeriado(d)}>×</button>
                </li>
              ))}
              {!cfg.horario.feriados.length && <li className="muted">Sin feriados</li>}
            </ul>
          </div>
        </div>
      </Section>

      {/* Salas & Capacidad */}
      <Section title="Salas & capacidad">
        <div className="card">
          <div className="addline">
            <input className="inp" placeholder="Nombre de sala"
                   value={nuevaSala.nombre} onChange={(e)=>setNuevaSala(s=>({...s, nombre:e.target.value}))}/>
            <input className="inp" type="number" placeholder="Capacidad"
                   value={nuevaSala.capacidad} onChange={(e)=>setNuevaSala(s=>({...s, capacidad:e.target.value}))}/>
            <button className="btn" onClick={addSala}>Añadir sala</button>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Id</th><th>Nombre</th><th>Capacidad</th><th></th></tr>
            </thead>
            <tbody>
              {cfg.salas.map(s=>(
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <input className="inp"
                      value={s.nombre}
                      onChange={(e)=>setCfg(c=>({...c, salas: c.salas.map(x=>x.id===s.id? {...x, nombre:e.target.value}:x)}))}
                    />
                  </td>
                  <td style={{width:140}}>
                    <input className="inp" type="number"
                      value={s.capacidad}
                      onChange={(e)=>setCfg(c=>({...c, salas: c.salas.map(x=>x.id===s.id? {...x, capacidad:Number(e.target.value)||0}:x)}))}
                    />
                  </td>
                  <td style={{width:80}}>
                    <button className="btn danger" onClick={()=>delSala(s.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
              {!cfg.salas.length && (<tr><td colSpan={4} className="muted">Sin salas</td></tr>)}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Reservas */}
      <Section title="Reservas">
        <div className="grid3">
          <div className="card">
            <label className="lbl">Duración por turno (min)</label>
            <input className="inp" type="number"
              value={cfg.reservas.duracionMin}
              onChange={(e)=>setCfg(c=>({...c, reservas:{...c.reservas, duracionMin:Number(e.target.value)||0}}))}
            />
          </div>
          <div className="card">
            <label className="lbl">Anticipación máx. (horas)</label>
            <input className="inp" type="number"
              value={cfg.reservas.anticipacionHoras}
              onChange={(e)=>setCfg(c=>({...c, reservas:{...c.reservas, anticipacionHoras:Number(e.target.value)||0}}))}
            />
          </div>
          <div className="card">
            <label className="lbl">Máx. reservas por día</label>
            <input className="inp" type="number"
              value={cfg.reservas.maxReservasDia}
              onChange={(e)=>setCfg(c=>({...c, reservas:{...c.reservas, maxReservasDia:Number(e.target.value)||0}}))}
            />
          </div>
        </div>
        <div className="card">
          <label className="lbl">Cancelación sin penalidad (horas antes)</label>
          <input className="inp" type="number"
            value={cfg.reservas.cancelacionHoras}
            onChange={(e)=>setCfg(c=>({...c, reservas:{...c.reservas, cancelacionHoras:Number(e.target.value)||0}}))}
          />
        </div>
      </Section>

      {/* Pagos */}
      <Section title="Pagos">
        <div className="grid3">
          <div className="card">
            <label className="lbl">Moneda</label>
            <select className="inp"
              value={cfg.pagos.moneda}
              onChange={(e)=>setCfg(c=>({...c, pagos:{...c.pagos, moneda:e.target.value}}))}
            >
              <option>USD</option>
              <option>EUR</option>
              <option>PEN</option>
              <option>ARS</option>
              <option>CLP</option>
              <option>MXN</option>
            </select>
          </div>
          <div className="card">
            <label className="lbl">IVA (%)</label>
            <input className="inp" type="number"
              value={cfg.pagos.ivaPorc}
              onChange={(e)=>setCfg(c=>({...c, pagos:{...c.pagos, ivaPorc:Number(e.target.value)||0}}))}
            />
          </div>
          <div className="card">
            <label className="lbl">Métodos habilitados</label>
            <div className="checks">
              {Object.entries(cfg.pagos.metodos).map(([k,v])=>(
                <label key={k}>
                  <input type="checkbox" checked={!!v}
                         onChange={(e)=>setCfg(c=>({...c, pagos:{...c.pagos, metodos:{...c.pagos.metodos, [k]: e.target.checked}}}))}/>
                  {k}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Notificaciones */}
      <Section title="Notificaciones">
        <div className="grid3">
          <div className="card">
            <label className="lbl">Email remitente</label>
            <input className="inp" placeholder="no-reply@apologym.com"
              value={cfg.notificaciones.emailFrom}
              onChange={(e)=>setCfg(c=>({...c, notificaciones:{...c.notificaciones, emailFrom:e.target.value}}))}
            />
          </div>
          <div className="card">
            <label className="lbl">Canales</label>
            <div className="checks">
              <label>
                <input type="checkbox" checked={cfg.notificaciones.emailEnabled}
                  onChange={(e)=>setCfg(c=>({...c, notificaciones:{...c.notificaciones, emailEnabled:e.target.checked}}))}
                />
                Email
              </label>
              <label>
                <input type="checkbox" checked={cfg.notificaciones.smsEnabled}
                  onChange={(e)=>setCfg(c=>({...c, notificaciones:{...c.notificaciones, smsEnabled:e.target.checked}}))}
                />
                SMS
              </label>
            </div>
          </div>
        </div>
      </Section>

      {/* Parámetros de planes */}
      <Section title="Parámetros de planes">
        <div className="grid2">
          <div className="card">
            <label className="lbl">Etiqueta de periodo</label>
            <select className="inp"
              value={cfg.planes.periodoLabel}
              onChange={(e)=>setCfg(c=>({...c, planes:{...c.planes, periodoLabel:e.target.value}}))}
            >
              <option value="mes">mes</option>
              <option value="quincena">quincena</option>
              <option value="semana">semana</option>
              <option value="día">día</option>
            </select>
          </div>
          <div className="card">
            <label className="lbl">Precio incluye IVA</label>
            <label className="switch">
              <input type="checkbox" checked={cfg.planes.ivaIncluido}
                     onChange={(e)=>setCfg(c=>({...c, planes:{...c.planes, ivaIncluido:e.target.checked}}))}
              />
              <span />
            </label>
          </div>
        </div>
      </Section>

      <div className="actions">
        <button className="btn primary" onClick={save}>Guardar cambios</button>
      </div>
    </div>
  );
}

/* ---------- helpers UI ---------- */
function Section({ title, children }) {
  return (
    <section className="cfg-section">
      <h2 className="sec-title">{title}</h2>
      {children}
    </section>
  );
}

function slug(s){
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

function deepMerge(a, b){
  if (Array.isArray(a) || Array.isArray(b)) return b ?? a;
  if (typeof a === "object" && typeof b === "object"){
    const out = { ...a };
    for(const k of Object.keys(b)) out[k] = deepMerge(a?.[k], b[k]);
    return out;
  }
  return b ?? a;
}
