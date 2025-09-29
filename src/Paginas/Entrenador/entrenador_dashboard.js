import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUsers, FaDumbbell, FaChartLine, FaCalendarAlt, FaSearch, FaPlus, FaClipboardList } from 'react-icons/fa';

// Importar componentes específicos del entrenador
import RoutineBuilderModal from '../../Componentes/Entrenador/RoutineBuilderModal';
import AssignRoutineModal from '../../Componentes/Entrenador/AssignRoutineModal';
import ProgressEntryForm from '../../Componentes/Entrenador/ProgressEntryForm';
import ClientProgressHistory from '../../Componentes/Entrenador/ClientProgressHistory';
import TrainerSchedule from '../../Componentes/Entrenador/TrainerSchedule';

// Servicios simulados
import { listUsers } from '../../Data/Stores/usuario.store';

export default function TrainerDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('rutinas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  // Verificar si viene con un estado específico para mostrar una pestaña
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Estados para modales
  const [showRoutineBuilder, setShowRoutineBuilder] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);

  // Datos simulados de rutinas asignadas
  const [assignedRoutines, setAssignedRoutines] = useState([
    {
      id: 1,
      clienteId: 'client_1',
      clienteNombre: 'Juan Pérez',
      rutinaNombre: 'Rutina de Fuerza Principiante',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-02-15',
      estado: 'activa',
      progreso: 65
    },
    {
      id: 2,
      clienteId: 'client_2',
      clienteNombre: 'María García',
      rutinaNombre: 'Rutina de Hipertrofia Intermedio',
      fechaInicio: '2024-01-10',
      fechaFin: '2024-02-28',
      estado: 'activa',
      progreso: 45
    }
  ]);

  // Obtener clientes
  const clients = useMemo(() =>
    listUsers().filter(u => u.role === "cliente" && u.active !== false), []
  );

  // Filtrar clientes
  const filteredClients = useMemo(() =>
    clients.filter(client =>
      (client.nombre || client.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [clients, searchTerm]
  );

  // Estadísticas del dashboard
  const stats = useMemo(() => ({
    totalClients: clients.length,
    activeRoutines: assignedRoutines.filter(r => r.estado === 'activa').length,
    completedSessions: 24, // Simulado
    avgProgress: assignedRoutines.length > 0
      ? Math.round(assignedRoutines.reduce((sum, r) => sum + r.progreso, 0) / assignedRoutines.length)
      : 0
  }), [clients, assignedRoutines]);

  const handleRoutineCreated = (routine) => {
    toast.success('Rutina creada exitosamente');
    setShowRoutineBuilder(false);
  };

  const handleRoutineAssigned = (assignment) => {
    const newAssignment = {
      id: assignment.id,
      clienteId: assignment.clienteId,
      clienteNombre: clients.find(c => c.id === assignment.clienteId)?.nombre || 'Cliente',
      rutinaNombre: 'Nueva Rutina', // En producción vendría del assignment
      fechaInicio: assignment.fechaInicio,
      fechaFin: assignment.fechaFin,
      estado: 'activa',
      progreso: 0
    };

    setAssignedRoutines(prev => [...prev, newAssignment]);
    toast.success('Rutina asignada exitosamente');
    setShowAssignModal(false);
  };

  const handleProgressSaved = (progress) => {
    toast.success('Progreso registrado exitosamente');
    setShowProgressForm(false);
  };

  const openAssignModal = (client = null) => {
    setSelectedClient(client);
    setShowAssignModal(true);
  };

  const openProgressForm = (client = null) => {
    setSelectedClient(client);
    setShowProgressForm(true);
  };

  const tabs = [
    { id: 'rutinas', label: 'Gestión de Rutinas', icon: FaDumbbell },
    { id: 'progreso', label: 'Seguimiento', icon: FaChartLine },
    { id: 'agenda', label: 'Agenda', icon: FaCalendarAlt },
    { id: 'clientes', label: 'Mis Clientes', icon: FaUsers }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel del Entrenador</h1>
              <p className="text-gray-600 mt-1">Gestiona rutinas, progreso y agenda de tus clientes</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRoutineBuilder(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Nueva Rutina
              </button>
              <button
                onClick={() => openAssignModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaClipboardList className="w-4 h-4 mr-2" />
                Asignar Rutina
              </button>
              <button
                onClick={() => openProgressForm()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <FaChartLine className="w-4 h-4 mr-2" />
                Registrar Progreso
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <FaUsers className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <FaDumbbell className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Rutinas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeRoutines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <FaChartLine className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Sesiones Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Progreso Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Rutinas Tab */}
            {activeTab === 'rutinas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Rutinas Asignadas</h2>
                  <div className="text-sm text-gray-600">
                    {assignedRoutines.length} rutinas activas
                  </div>
                </div>

                {assignedRoutines.length === 0 ? (
                  <div className="text-center py-12">
                    <FaDumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay rutinas asignadas</h3>
                    <p className="text-gray-600 mb-4">Comienza creando y asignando rutinas a tus clientes</p>
                    <button
                      onClick={() => setShowRoutineBuilder(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Crear Primera Rutina
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignedRoutines.map(routine => (
                      <div key={routine.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{routine.clienteNombre}</h3>
                            <p className="text-sm text-gray-600">{routine.rutinaNombre}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${routine.estado === 'activa'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {routine.estado}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progreso:</span>
                            <span className="font-medium">{routine.progreso}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${routine.progreso}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Inicio: {routine.fechaInicio}</span>
                            <span>Fin: {routine.fechaFin}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => openProgressForm(clients.find(c => c.id === routine.clienteId))}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Ver Progreso
                          </button>
                          <button
                            onClick={() => openAssignModal(clients.find(c => c.id === routine.clienteId))}
                            className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                          >
                            Modificar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progreso Tab */}
            {activeTab === 'progreso' && (
              <ClientProgressHistory />
            )}

            {/* Agenda Tab */}
            {activeTab === 'agenda' && (
              <TrainerSchedule />
            )}

            {/* Clientes Tab */}
            {activeTab === 'clientes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Clientes</h2>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar clientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {filteredClients.length === 0 ? (
                  <div className="text-center py-12">
                    <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Intenta con un término de búsqueda diferente' : 'No hay clientes registrados'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map(client => {
                      const clientRoutine = assignedRoutines.find(r => r.clienteId === client.id);

                      return (
                        <div key={client.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">{client.nombre || client.email}</h3>
                              <p className="text-sm text-gray-600">{client.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${clientRoutine
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {clientRoutine ? 'Con rutina' : 'Sin rutina'}
                            </span>
                          </div>

                          {clientRoutine && (
                            <div className="mb-4 p-3 bg-white rounded border">
                              <p className="text-sm font-medium text-gray-900">{clientRoutine.rutinaNombre}</p>
                              <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>Progreso: {clientRoutine.progreso}%</span>
                                <span>{clientRoutine.estado}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <button
                              onClick={() => openAssignModal(client)}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              {clientRoutine ? 'Cambiar Rutina' : 'Asignar Rutina'}
                            </button>
                            <button
                              onClick={() => openProgressForm(client)}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Progreso
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <RoutineBuilderModal
        isOpen={showRoutineBuilder}
        onClose={() => setShowRoutineBuilder(false)}
        onSave={handleRoutineCreated}
      />

      <AssignRoutineModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleRoutineAssigned}
        selectedClient={selectedClient}
      />

      <ProgressEntryForm
        isOpen={showProgressForm}
        onClose={() => setShowProgressForm(false)}
        onSave={handleProgressSaved}
        selectedClient={selectedClient}
      />
    </div>
  );
}
