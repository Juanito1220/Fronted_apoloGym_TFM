import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { FaTimes, FaUser, FaCalendarAlt, FaClipboardList, FaSearch } from 'react-icons/fa';

// Servicios simulados
import { listUsers } from '../../Data/Stores/usuario.store';
import { saveRutina } from '../../Data/Stores/rutinas.store';

export default function AssignRoutineModal({ isOpen, onClose, onAssign, selectedClient = null }) {
    const [assignmentData, setAssignmentData] = useState({
        clienteId: selectedClient?.id || '',
        rutinaId: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
        notas: '',
        objetivos: '',
        prioridad: 'media'
    });

    const [clientSearch, setClientSearch] = useState('');
    const [routineSearch, setRoutineSearch] = useState('');
    const [saving, setSaving] = useState(false);
    const [showRoutineDetails, setShowRoutineDetails] = useState(false);

    // Obtener datos
    const clients = useMemo(() =>
        listUsers().filter(u => u.role === "cliente" && u.active !== false), []
    );

    const routines = useMemo(() => {
        // Simular rutinas existentes (en producción vendrían del backend)
        return [
            {
                id: 1,
                nombre: 'Rutina de Fuerza Principiante',
                descripcion: 'Rutina básica para desarrollo de fuerza general',
                categoria: 'fuerza',
                duracionSemanas: 4,
                diasPorSemana: 3,
                bloques: [
                    {
                        dia: 'Lunes',
                        ejercicios: [
                            { nombre: 'Sentadilla', series: 3, repeticiones: 10, peso: 40 },
                            { nombre: 'Press de Banca', series: 3, repeticiones: 8, peso: 30 }
                        ]
                    },
                    {
                        dia: 'Miércoles',
                        ejercicios: [
                            { nombre: 'Peso Muerto', series: 3, repeticiones: 5, peso: 50 },
                            { nombre: 'Press Militar', series: 3, repeticiones: 8, peso: 20 }
                        ]
                    },
                    {
                        dia: 'Viernes',
                        ejercicios: [
                            { nombre: 'Remo con Barra', series: 3, repeticiones: 10, peso: 25 },
                            { nombre: 'Curl de Bíceps', series: 3, repeticiones: 12, peso: 10 }
                        ]
                    }
                ],
                fechaCreacion: '2024-01-15',
                totalEjercicios: 6
            },
            {
                id: 2,
                nombre: 'Rutina de Hipertrofia Intermedio',
                descripcion: 'Rutina enfocada en ganancia de masa muscular',
                categoria: 'hipertrofia',
                duracionSemanas: 6,
                diasPorSemana: 4,
                bloques: [
                    {
                        dia: 'Lunes',
                        ejercicios: [
                            { nombre: 'Press de Banca', series: 4, repeticiones: 8, peso: 40 },
                            { nombre: 'Press Inclinado', series: 3, repeticiones: 10, peso: 30 }
                        ]
                    },
                    {
                        dia: 'Martes',
                        ejercicios: [
                            { nombre: 'Sentadilla', series: 4, repeticiones: 12, peso: 50 },
                            { nombre: 'Prensa de Piernas', series: 3, repeticiones: 15, peso: 80 }
                        ]
                    }
                ],
                fechaCreacion: '2024-02-01',
                totalEjercicios: 8
            },
            {
                id: 3,
                nombre: 'Rutina Funcional',
                descripcion: 'Entrenamiento funcional con peso corporal',
                categoria: 'funcional',
                duracionSemanas: 3,
                diasPorSemana: 5,
                bloques: [
                    {
                        dia: 'Lunes',
                        ejercicios: [
                            { nombre: 'Burpees', series: 3, repeticiones: 10, peso: 0 },
                            { nombre: 'Plancha', series: 3, repeticiones: 30, peso: 0 }
                        ]
                    }
                ],
                fechaCreacion: '2024-02-10',
                totalEjercicios: 12
            }
        ];
    }, []);

    const filteredClients = useMemo(() =>
        clients.filter(client =>
            (client.nombre || client.email).toLowerCase().includes(clientSearch.toLowerCase())
        ), [clients, clientSearch]
    );

    const filteredRoutines = useMemo(() =>
        routines.filter(routine =>
            routine.nombre.toLowerCase().includes(routineSearch.toLowerCase()) ||
            routine.categoria.toLowerCase().includes(routineSearch.toLowerCase())
        ), [routines, routineSearch]
    );

    const selectedRoutine = useMemo(() =>
        routines.find(r => r.id.toString() === assignmentData.rutinaId), [routines, assignmentData.rutinaId]
    );

    const selectedClientData = useMemo(() =>
        clients.find(c => c.id === assignmentData.clienteId), [clients, assignmentData.clienteId]
    );

    useEffect(() => {
        if (selectedClient) {
            setAssignmentData(prev => ({ ...prev, clienteId: selectedClient.id }));
        }
    }, [selectedClient]);

    // Calcular fecha de fin automáticamente
    useEffect(() => {
        if (assignmentData.fechaInicio && selectedRoutine) {
            const startDate = new Date(assignmentData.fechaInicio);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + (selectedRoutine.duracionSemanas * 7));

            setAssignmentData(prev => ({
                ...prev,
                fechaFin: endDate.toISOString().split('T')[0]
            }));
        }
    }, [assignmentData.fechaInicio, selectedRoutine]);

    if (!isOpen) return null;

    const handleAssign = async () => {
        if (!assignmentData.clienteId) {
            toast.error('Debe seleccionar un cliente');
            return;
        }

        if (!assignmentData.rutinaId) {
            toast.error('Debe seleccionar una rutina');
            return;
        }

        if (!assignmentData.fechaInicio) {
            toast.error('Debe establecer una fecha de inicio');
            return;
        }

        setSaving(true);
        try {
            // Simular asignación (en producción sería una llamada a API)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const assignment = {
                id: Date.now(),
                clienteId: assignmentData.clienteId,
                rutinaId: assignmentData.rutinaId,
                fechaInicio: assignmentData.fechaInicio,
                fechaFin: assignmentData.fechaFin,
                notas: assignmentData.notas,
                objetivos: assignmentData.objetivos,
                prioridad: assignmentData.prioridad,
                estado: 'activa',
                fechaAsignacion: new Date().toISOString()
            };

            // También guardar en el store de rutinas para compatibilidad
            saveRutina({
                userId: assignmentData.clienteId,
                nombre: selectedRoutine.nombre,
                bloques: selectedRoutine.bloques,
                fechaInicio: assignmentData.fechaInicio,
                objetivos: assignmentData.objetivos
            });

            onAssign(assignment);
        } catch (error) {
            toast.error('Error al asignar la rutina');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaClipboardList className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-bold text-gray-900">Asignar Rutina a Cliente</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Client & Routine Selection */}
                        <div className="space-y-6">
                            {/* Client Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaUser className="w-5 h-5 mr-2 text-blue-600" />
                                    Seleccionar Cliente
                                </h3>

                                {selectedClient ? (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{selectedClient.nombre || selectedClient.email}</h4>
                                                <p className="text-sm text-gray-600">{selectedClient.email}</p>
                                            </div>
                                            <button
                                                onClick={() => setAssignmentData(prev => ({ ...prev, clienteId: '' }))}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Cambiar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="relative mb-3">
                                            <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar cliente..."
                                                value={clientSearch}
                                                onChange={(e) => setClientSearch(e.target.value)}
                                                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="max-h-40 overflow-y-auto space-y-2">
                                            {filteredClients.map(client => (
                                                <div
                                                    key={client.id}
                                                    onClick={() => setAssignmentData(prev => ({ ...prev, clienteId: client.id }))}
                                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${assignmentData.clienteId === client.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                        }`}
                                                >
                                                    <h4 className="font-medium text-gray-900">{client.nombre || client.email}</h4>
                                                    <p className="text-sm text-gray-600">{client.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Routine Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaClipboardList className="w-5 h-5 mr-2 text-green-600" />
                                    Seleccionar Rutina
                                </h3>

                                <div className="relative mb-3">
                                    <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar rutina..."
                                        value={routineSearch}
                                        onChange={(e) => setRoutineSearch(e.target.value)}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="max-h-64 overflow-y-auto space-y-3">
                                    {filteredRoutines.map(routine => (
                                        <div
                                            key={routine.id}
                                            onClick={() => setAssignmentData(prev => ({ ...prev, rutinaId: routine.id.toString() }))}
                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${assignmentData.rutinaId === routine.id.toString()
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{routine.nombre}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{routine.descripcion}</p>
                                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                                                            {routine.categoria}
                                                        </span>
                                                        <span>{routine.duracionSemanas} semanas</span>
                                                        <span>{routine.diasPorSemana} días/semana</span>
                                                        <span>{routine.totalEjercicios} ejercicios</span>
                                                    </div>
                                                </div>
                                                {assignmentData.rutinaId === routine.id.toString() && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowRoutineDetails(!showRoutineDetails);
                                                        }}
                                                        className="text-sm text-green-600 hover:text-green-800 ml-2"
                                                    >
                                                        Ver detalles
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Assignment Details */}
                        <div className="space-y-6">
                            {/* Assignment Configuration */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaCalendarAlt className="w-5 h-5 mr-2 text-purple-600" />
                                    Configuración de Asignación
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha de Inicio *
                                            </label>
                                            <input
                                                type="date"
                                                value={assignmentData.fechaInicio}
                                                onChange={(e) => setAssignmentData(prev => ({ ...prev, fechaInicio: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha de Fin (calculada)
                                            </label>
                                            <input
                                                type="date"
                                                value={assignmentData.fechaFin}
                                                onChange={(e) => setAssignmentData(prev => ({ ...prev, fechaFin: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prioridad
                                        </label>
                                        <select
                                            value={assignmentData.prioridad}
                                            onChange={(e) => setAssignmentData(prev => ({ ...prev, prioridad: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="baja">Baja</option>
                                            <option value="media">Media</option>
                                            <option value="alta">Alta</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Objetivos Específicos
                                        </label>
                                        <textarea
                                            value={assignmentData.objetivos}
                                            onChange={(e) => setAssignmentData(prev => ({ ...prev, objetivos: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Ej: Aumentar fuerza en press de banca, mejorar técnica en sentadilla..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notas Adicionales
                                        </label>
                                        <textarea
                                            value={assignmentData.notas}
                                            onChange={(e) => setAssignmentData(prev => ({ ...prev, notas: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            rows={2}
                                            placeholder="Consideraciones especiales, restricciones, modificaciones..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Assignment Summary */}
                            {selectedClientData && selectedRoutine && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Resumen de Asignación</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cliente:</span>
                                            <span className="font-medium">{selectedClientData.nombre || selectedClientData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Rutina:</span>
                                            <span className="font-medium">{selectedRoutine.nombre}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duración:</span>
                                            <span className="font-medium">{selectedRoutine.duracionSemanas} semanas</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Frecuencia:</span>
                                            <span className="font-medium">{selectedRoutine.diasPorSemana} días/semana</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Período:</span>
                                            <span className="font-medium">
                                                {assignmentData.fechaInicio} - {assignmentData.fechaFin}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Routine Details */}
                            {showRoutineDetails && selectedRoutine && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Detalles de la Rutina</h4>
                                    <div className="space-y-3 max-h-40 overflow-y-auto">
                                        {selectedRoutine.bloques.map((bloque, index) => (
                                            <div key={index} className="text-sm">
                                                <div className="font-medium text-blue-900">{bloque.dia}:</div>
                                                <ul className="ml-4 text-gray-700">
                                                    {bloque.ejercicios.map((ejercicio, ejIndex) => (
                                                        <li key={ejIndex}>
                                                            {ejercicio.nombre} - {ejercicio.series}x{ejercicio.repeticiones}
                                                            {ejercicio.peso > 0 && ` @ ${ejercicio.peso}kg`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {selectedClientData && selectedRoutine
                                ? `Asignando "${selectedRoutine.nombre}" a ${selectedClientData.nombre || selectedClientData.email}`
                                : 'Selecciona cliente y rutina para continuar'
                            }
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={saving || !assignmentData.clienteId || !assignmentData.rutinaId}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Asignando...
                                    </>
                                ) : (
                                    'Asignar Rutina'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}