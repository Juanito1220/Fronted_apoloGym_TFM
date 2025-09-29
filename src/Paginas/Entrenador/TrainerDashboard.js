import React, { useState, useMemo } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { toast } from 'react-hot-toast';
import {
    FaPlus,
    FaSearch,
    FaCalendarAlt,
    FaChartLine,
    FaDumbbell,
    FaUsers,
    FaClipboardList,
    FaFilter,
    FaEye
} from 'react-icons/fa';

// Componentes que implementaremos
import RoutineBuilderModal from '../../Componentes/Entrenador/RoutineBuilderModal';
import AssignRoutineModal from '../../Componentes/Entrenador/AssignRoutineModal';
import ProgressEntryForm from '../../Componentes/Entrenador/ProgressEntryForm';
import ClientProgressHistory from '../../Componentes/Entrenador/ClientProgressHistory';
import TrainerSchedule from '../../Componentes/Entrenador/TrainerSchedule';

// Servicios simulados (luego se conectarán con el backend)
import { listUsers } from '../../Data/Stores/usuario.store';
import { listRutinasByUser } from '../../Data/Stores/rutinas.store';
import { listProgresoByUser } from '../../Data/Stores/progreso.store';

export default function TrainerDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('routines');
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para modales
    const [showRoutineBuilder, setShowRoutineBuilder] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showProgressForm, setShowProgressForm] = useState(false);

    // Datos simulados
    const clients = useMemo(() =>
        listUsers().filter(u => u.role === "cliente" && u.active !== false), []
    );

    const filteredClients = useMemo(() =>
        clients.filter(client =>
            (client.nombre || client.email).toLowerCase().includes(searchTerm.toLowerCase())
        ), [clients, searchTerm]
    );

    const getClientStats = (clientId) => {
        const rutinas = listRutinasByUser(clientId);
        const progreso = listProgresoByUser(clientId);
        return {
            rutinasAsignadas: rutinas.length,
            ultimaSesion: progreso.length > 0 ? progreso[progreso.length - 1].fecha : null,
            progresoEntries: progreso.length
        };
    };

    const tabs = [
        { id: 'routines', label: 'Gestión de Rutinas', icon: FaDumbbell },
        { id: 'progress', label: 'Seguimiento de Progreso', icon: FaChartLine },
        { id: 'schedule', label: 'Agenda', icon: FaCalendarAlt }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Panel del Entrenador</h1>
                            <p className="text-sm text-gray-600">Gestión de rutinas, progreso y agenda</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                👋 Bienvenido, {user?.nombre || user?.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab: Gestión de Rutinas */}
                {activeTab === 'routines' && (
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Gestión de Rutinas</h2>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowRoutineBuilder(true)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FaPlus className="w-4 h-4 mr-2" />
                                        Nueva Rutina
                                    </button>
                                    <button
                                        onClick={() => setShowAssignModal(true)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <FaClipboardList className="w-4 h-4 mr-2" />
                                        Asignar Rutina
                                    </button>
                                </div>
                            </div>

                            {/* Client Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Client List with Routine Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredClients.map(client => {
                                    const stats = getClientStats(client.id);
                                    return (
                                        <div
                                            key={client.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => setSelectedClient(client)}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-medium text-gray-900">
                                                    {client.nombre || client.email}
                                                </h3>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {stats.rutinasAsignadas} rutinas
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p>Email: {client.email}</p>
                                                <p>Última sesión: {stats.ultimaSesion || 'Sin registro'}</p>
                                                <p>Registros de progreso: {stats.progresoEntries}</p>
                                            </div>
                                            <div className="mt-3 flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedClient(client);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                                >
                                                    Asignar
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedClient(client);
                                                        setActiveTab('progress');
                                                    }}
                                                    className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                                                >
                                                    Ver Progreso
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Seguimiento de Progreso */}
                {activeTab === 'progress' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Seguimiento de Progreso</h2>
                                <button
                                    onClick={() => setShowProgressForm(true)}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <FaPlus className="w-4 h-4 mr-2" />
                                    Registrar Progreso
                                </button>
                            </div>

                            {/* Client Selector for Progress */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar Cliente
                                </label>
                                <select
                                    value={selectedClient?.id || ''}
                                    onChange={(e) => {
                                        const client = clients.find(c => c.id === e.target.value);
                                        setSelectedClient(client);
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar cliente...</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.nombre || client.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Progress History Component */}
                            {selectedClient && (
                                <ClientProgressHistory clientId={selectedClient.id} />
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: Agenda */}
                {activeTab === 'schedule' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mi Agenda</h2>
                            <TrainerSchedule trainerId={user?.id} />
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showRoutineBuilder && (
                <RoutineBuilderModal
                    isOpen={showRoutineBuilder}
                    onClose={() => setShowRoutineBuilder(false)}
                    onSave={(routine) => {
                        toast.success('Rutina creada exitosamente');
                        setShowRoutineBuilder(false);
                    }}
                />
            )}

            {showAssignModal && (
                <AssignRoutineModal
                    isOpen={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    selectedClient={selectedClient}
                    onAssign={(assignment) => {
                        toast.success('Rutina asignada exitosamente');
                        setShowAssignModal(false);
                    }}
                />
            )}

            {showProgressForm && (
                <ProgressEntryForm
                    isOpen={showProgressForm}
                    onClose={() => setShowProgressForm(false)}
                    selectedClient={selectedClient}
                    onSave={(progress) => {
                        toast.success('Progreso registrado exitosamente');
                        setShowProgressForm(false);
                    }}
                />
            )}
        </div>
    );
}