import React, { useMemo, useState } from "react";
import { db } from "../../Data/api";
import {
  FiSettings,
  FiClock,
  FiHome,
  FiSave,
  FiRotateCcw,
  FiPlus,
  FiTrash2,
  FiEye,
  FiUpload,
  FiX
} f        {activeTab === 'horarios' && (
          <HorariosTab 
            cfg={cfg} 
            updateCfg={updateCfg}
            nuevoFeriado={nuevoFeriado}
            setNuevoFeriado={setNuevoFeriado}
            addFeriado={addFeriado}
            delFeriado={delFeriado}
          />
        )}
        {activeTab === 'salas' && (
          <SalasTab 
            cfg={cfg} 
            updateCfg={updateCfg}
            nuevaSala={nuevaSala}
            setNuevaSala={setNuevaSala}
            addSala={addSala}
            delSala={delSala}
          />
        )};
import { toast } from 'react-hot-toast'; const DEFAULTS = {
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

export default function SistemaConfig() {
  const initial = useMemo(() => {
    const saved = db.getObj("settings");
    return deepMerge(DEFAULTS, saved || {});
  }, []);

  const [cfg, setCfg] = useState(initial);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [nuevaSala, setNuevaSala] = useState({ nombre: "", capacidad: 0 });
  const [nuevoFeriado, setNuevoFeriado] = useState("");

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
      
      // Verificar cambios después de que el estado se actualice
      setTimeout(() => checkForChanges(newCfg), 0);
      return newCfg;
    });
  };

  // Función helper para actualizar configuración con detección de cambios
  const updateCfg = (updater) => {
    setCfg(prevCfg => {
      const newCfg = typeof updater === 'function' ? updater(prevCfg) : updater;
      // Verificar cambios después de que el estado se actualice
      setTimeout(() => checkForChanges(newCfg), 0);
      return newCfg;
    });
  };  // Guardar configuración
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

  const addSala = () => {
    const nombre = (nuevaSala.nombre || "").trim();
    const cap = Number(nuevaSala.capacidad) || 0;
    if (!nombre) return;
    const id = slug(nombre);
    if (cfg.salas.some(s => s.id === id)) {
      toast.error("Esa sala ya existe.");
      return;
    }
    updateCfg(c => ({ ...c, salas: [...c.salas, { id, nombre, capacidad: cap }] }));
    setNuevaSala({ nombre: "", capacidad: 0 });
  };

  const delSala = (id) => {
    updateCfg(c => ({ ...c, salas: c.salas.filter(s => s.id !== id) }));
  };

  const addFeriado = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nuevoFeriado)) {
      toast.error("Usa formato YYYY-MM-DD");
      return;
    }
    if (cfg.horario.feriados.includes(nuevoFeriado)) return;
    updateCfg(c => ({ ...c, horario: { ...c.horario, feriados: [...c.horario.feriados, nuevoFeriado] } }));
    setNuevoFeriado("");
  };

  const delFeriado = (d) => {
    updateCfg(c => ({ ...c, horario: { ...c.horario, feriados: c.horario.feriados.filter(x => x !== d) } }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación y acciones */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
              <p className="text-sm text-gray-600">Administra la configuración general del gimnasio</p>
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
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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
}

// Componente para la pestaña General
const GeneralTab = ({ cfg, updateConfig }) => {
  const [imageError, setImageError] = useState(false);

  // Reset error when URL changes
  React.useEffect(() => {
    setImageError(false);
  }, [cfg.general.logoUrl]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuración General */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiSettings className="h-5 w-5 mr-2 text-blue-600" />
              Información General
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del gimnasio
                </label>
                <input
                  type="text"
                  value={cfg.general.nombre}
                  onChange={(e) => updateConfig('general.nombre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Apolo Gym"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo (URL)
                </label>
                <input
                  type="url"
                  value={cfg.general.logoUrl}
                  onChange={(e) => updateConfig('general.logoUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color primario
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={cfg.general.colorPrimario}
                    onChange={(e) => updateConfig('general.colorPrimario', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={cfg.general.colorPrimario}
                    onChange={(e) => updateConfig('general.colorPrimario', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiEye className="h-5 w-5 mr-2 text-blue-600" />
              Vista Previa
            </h3>

            <div className="space-y-4">
              {/* Preview del branding */}
              <div
                className="flex items-center space-x-2 p-3 rounded-lg"
                style={{
                  backgroundColor: cfg.general.colorPrimario + '10',
                  color: cfg.general.colorPrimario
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cfg.general.colorPrimario }}
                />
                <span className="font-semibold">{cfg.general.nombre}</span>
              </div>

              {/* Preview del logo */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                {cfg.general.logoUrl && !imageError ? (
                  <img
                    src={cfg.general.logoUrl}
                    alt="Logo preview"
                    className="max-w-full h-16 mx-auto object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : cfg.general.logoUrl && imageError ? (
                  <div className="text-red-500">
                    <FiX className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Error al cargar logo</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <FiUpload className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Sin logo</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para la pestaña de Horarios  
const HorariosTab = ({ cfg, setCfg, nuevoFeriado, setNuevoFeriado, addFeriado, delFeriado }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horarios de operación */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiClock className="h-5 w-5 mr-2 text-blue-600" />
            Horarios de Operación
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apertura
              </label>
              <input
                type="time"
                value={cfg.horario.abre}
                onChange={(e) => setCfg(c => ({ ...c, horario: { ...c.horario, abre: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cierre
              </label>
              <input
                type="time"
                value={cfg.horario.cierra}
                onChange={(e) => setCfg(c => ({ ...c, horario: { ...c.horario, cierra: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Feriados */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Días Feriados (Cerrado)
          </h3>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="date"
                value={nuevoFeriado}
                onChange={(e) => setNuevoFeriado(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={addFeriado}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="h-4 w-4" />
                <span>Añadir</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cfg.horario.feriados.map(fecha => (
                <div key={fecha} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{fecha}</span>
                  <button
                    onClick={() => delFeriado(fecha)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {cfg.horario.feriados.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No hay feriados configurados
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para la pestaña de Salas
const SalasTab = ({ cfg, setCfg, nuevaSala, setNuevaSala, addSala, delSala }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiHome className="h-5 w-5 mr-2 text-blue-600" />
          Gestión de Salas
        </h3>

        {/* Formulario para añadir sala */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            placeholder="Nombre de la sala"
            value={nuevaSala.nombre}
            onChange={(e) => setNuevaSala(s => ({ ...s, nombre: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Capacidad"
            value={nuevaSala.capacidad}
            onChange={(e) => setNuevaSala(s => ({ ...s, capacidad: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addSala}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            <span>Añadir Sala</span>
          </button>
        </div>

        {/* Tabla de salas */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cfg.salas.map(sala => (
                <tr key={sala.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sala.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={sala.nombre}
                      onChange={(e) => setCfg(c => ({
                        ...c,
                        salas: c.salas.map(x => x.id === sala.id ? { ...x, nombre: e.target.value } : x)
                      }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={sala.capacidad}
                      onChange={(e) => setCfg(c => ({
                        ...c,
                        salas: c.salas.map(x => x.id === sala.id ? { ...x, capacidad: Number(e.target.value) || 0 } : x)
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => delSala(sala.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {cfg.salas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No hay salas configuradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para slug
function slug(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Función auxiliar para merge profundo
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}