import React, { useState } from "react";
import BackTo from "../../Componentes/backtoMenu.js";
import AforoDashboard from "../../Componentes/AforoDashboard.js";
import RegistroAcceso from "../../Componentes/RegistroAcceso.js";
import HistorialActividad from "../../Componentes/HistorialActividad.js";
import IndicadorTiempoReal from "../../Componentes/IndicadorTiempoReal.js";
import NotificacionesAforo from "../../Componentes/NotificacionesAforo.js";
import useAforo from "../../hooks/useAforo.js";
import "../../Styles/aforo.css";

export default function Aforo() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    aforoStatus,
    globalSummary,
    recentActivity,
    isLoading,
    error,
    handleCheckIn,
    handleCheckOut,
    refreshData,
    getStats
  } = useAforo(5000); // Polling cada 5 segundos

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Cargando control de aforo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <BackTo to="/admin" label="← Regresar al panel admin" />
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Actualización automática activa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas mejorada */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 rounded-2xl shadow-lg border border-gray-200">
            <nav className="flex space-x-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`relative px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center group ${activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-white-900 hover:text-blue-600 hover:bg-white/80 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center">
                  <svg className={`w-6 h-6 mr-3 transition-transform group-hover:scale-110 ${activeTab === 'dashboard' ? 'text-white' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Dashboard</span>
                </div>
                {activeTab === 'dashboard' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-md"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('registro')}
                className={`relative px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center group ${activeTab === 'registro'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                  : 'text-white-900 hover:text-green-600 hover:bg-white/80 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center">
                  <svg className={`w-6 h-6 mr-3 transition-transform group-hover:scale-110 ${activeTab === 'registro' ? 'text-white' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                  </svg>
                  <span>Registro de Accesos</span>
                </div>
                {activeTab === 'registro' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-md"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('historial')}
                className={`relative px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center group ${activeTab === 'historial'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white-900 hover:text-purple-600 hover:bg-white/80 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center">
                  <svg className={`w-6 h-6 mr-3 transition-transform group-hover:scale-110 ${activeTab === 'historial' ? 'text-white' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Historial</span>
                  {recentActivity.length > 0 && (
                    <span className={`ml-3 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border-2 ${activeTab === 'historial'
                      ? 'bg-white text-purple-700 border-white'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}>
                      {recentActivity.length}
                    </span>
                  )}
                </div>
                {activeTab === 'historial' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-md"></div>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Alertas globales */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error en el sistema de aforo</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {globalSummary.criticalCount > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Alerta: Capacidad Máxima Alcanzada</h3>
                <p className="text-sm text-red-700 mt-1">
                  {globalSummary.criticalCount} sala(s) han alcanzado su capacidad máxima.
                  No se permiten más ingresos hasta que haya salidas.
                </p>
              </div>
            </div>
          </div>
        )}

        {globalSummary.warningCount > 0 && globalSummary.criticalCount === 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Alerta: Próximo a Capacidad Máxima</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {globalSummary.warningCount} sala(s) están por alcanzar su capacidad máxima (&gt;80% ocupación).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contenido de las pestañas */}
        <div className="pb-8">
          {activeTab === 'dashboard' && (
            <AforoDashboard
              aforoStatus={aforoStatus}
              globalSummary={globalSummary}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'registro' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RegistroAcceso
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                />
              </div>
              <div>
                <IndicadorTiempoReal
                  aforoStatus={aforoStatus}
                  globalSummary={globalSummary}
                />
              </div>
            </div>
          )}

          {activeTab === 'historial' && (
            <HistorialActividad
              recentActivity={recentActivity}
              stats={stats}
            />
          )}
        </div>
      </div>

      {/* Notificaciones en tiempo real */}
      <NotificacionesAforo
        globalSummary={globalSummary}
        aforoStatus={aforoStatus}
      />
    </div>
  );
}
