import React, { useState, useEffect, useMemo } from 'react';
import { FaUser, FaChartLine, FaFilter, FaCalendarAlt, FaDumbbell, FaWeight, FaEye, FaTimes } from 'react-icons/fa';

// Servicios simulados
import { listUsers } from '../../Data/Stores/usuario.store';

export default function ClientProgressHistory({ clientId = null }) {
    const [selectedClient, setSelectedClient] = useState(clientId || '');
    const [filters, setFilters] = useState({
        tipo: 'todos',
        fechaInicio: '',
        fechaFin: '',
        mostrarSolo: 'todos' // todos, entrenamientos, mediciones
    });

    const [selectedProgress, setSelectedProgress] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Obtener clientes
    const clients = useMemo(() =>
        listUsers().filter(u => u.role === "cliente" && u.active !== false), []
    );

    const selectedClientData = useMemo(() =>
        clients.find(c => c.id === selectedClient), [clients, selectedClient]
    );

    // Simular datos de progreso
    const mockProgressData = useMemo(() => {
        if (!selectedClient) return [];

        return [
            {
                id: 1,
                clienteId: selectedClient,
                fecha: '2024-01-15',
                tipo: 'entrenamiento',
                ejercicios: [
                    { nombre: 'Sentadilla', series: 3, repeticiones: 10, peso: 40 },
                    { nombre: 'Press de Banca', series: 3, repeticiones: 8, peso: 30 },
                    { nombre: 'Peso Muerto', series: 3, repeticiones: 5, peso: 50 }
                ],
                duracion: 60,
                intensidad: 'media',
                valoracion: 4,
                notas: 'Buena sesión, mejoró la técnica en sentadilla',
                medidas: { peso: '', grasa: '', musculo: '', imc: '' }
            },
            {
                id: 2,
                clienteId: selectedClient,
                fecha: '2024-01-17',
                tipo: 'medicion',
                ejercicios: [],
                medidas: { peso: '70.5', grasa: '15.2', musculo: '42.8', imc: '22.1' },
                notas: 'Medición mensual - progreso positivo',
                duracion: '',
                intensidad: '',
                valoracion: 0
            },
            {
                id: 3,
                clienteId: selectedClient,
                fecha: '2024-01-18',
                tipo: 'entrenamiento',
                ejercicios: [
                    { nombre: 'Sentadilla', series: 3, repeticiones: 12, peso: 42.5 },
                    { nombre: 'Press de Banca', series: 3, repeticiones: 8, peso: 32.5 },
                    { nombre: 'Remo con Barra', series: 3, repeticiones: 10, peso: 25 }
                ],
                duracion: 65,
                intensidad: 'alta',
                valoracion: 5,
                notas: 'Excelente progreso, aumentó peso en todos los ejercicios'
            },
            {
                id: 4,
                clienteId: selectedClient,
                fecha: '2024-01-20',
                tipo: 'evaluacion',
                ejercicios: [],
                medidas: { peso: '70.2', grasa: '14.8', musculo: '43.2', imc: '22.0' },
                notas: 'Evaluación trimestral - excelente progreso en composición corporal',
                valoracion: 5
            },
            {
                id: 5,
                clienteId: selectedClient,
                fecha: '2024-01-22',
                tipo: 'entrenamiento',
                ejercicios: [
                    { nombre: 'Sentadilla', series: 4, repeticiones: 10, peso: 45 },
                    { nombre: 'Press de Banca', series: 4, repeticiones: 6, peso: 35 },
                    { nombre: 'Peso Muerto', series: 3, repeticiones: 5, peso: 55 }
                ],
                duracion: 70,
                intensidad: 'alta',
                valoracion: 4,
                notas: 'Trabajó fuerza máxima, buen rendimiento'
            }
        ];
    }, [selectedClient]);

    // Filtrar datos de progreso
    const filteredProgressData = useMemo(() => {
        let filtered = mockProgressData;

        if (filters.tipo !== 'todos') {
            filtered = filtered.filter(p => p.tipo === filters.tipo);
        }

        if (filters.fechaInicio) {
            filtered = filtered.filter(p => p.fecha >= filters.fechaInicio);
        }

        if (filters.fechaFin) {
            filtered = filtered.filter(p => p.fecha <= filters.fechaFin);
        }

        if (filters.mostrarSolo !== 'todos') {
            if (filters.mostrarSolo === 'entrenamientos') {
                filtered = filtered.filter(p => p.tipo === 'entrenamiento');
            } else if (filters.mostrarSolo === 'mediciones') {
                filtered = filtered.filter(p => p.tipo === 'medicion' || p.tipo === 'evaluacion');
            }
        }

        return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }, [mockProgressData, filters]);

    // Calcular estadísticas
    const statistics = useMemo(() => {
        const entrenamientos = filteredProgressData.filter(p => p.tipo === 'entrenamiento');
        const mediciones = filteredProgressData.filter(p => p.tipo === 'medicion' || p.tipo === 'evaluacion');

        const totalSesiones = entrenamientos.length;
        const promedioValoracion = entrenamientos.length > 0
            ? (entrenamientos.reduce((sum, p) => sum + p.valoracion, 0) / entrenamientos.length).toFixed(1)
            : 0;

        const promedioDuracion = entrenamientos.length > 0
            ? (entrenamientos.reduce((sum, p) => sum + (p.duracion || 0), 0) / entrenamientos.length).toFixed(0)
            : 0;

        // Progreso en ejercicios principales
        const ejerciciosProgreso = {};
        entrenamientos.forEach(sesion => {
            sesion.ejercicios.forEach(ej => {
                if (!ejerciciosProgreso[ej.nombre]) {
                    ejerciciosProgreso[ej.nombre] = [];
                }
                ejerciciosProgreso[ej.nombre].push({
                    fecha: sesion.fecha,
                    peso: ej.peso,
                    volumen: ej.series * ej.repeticiones * ej.peso
                });
            });
        });

        // Progreso en mediciones
        const medidasProgreso = {};
        mediciones.forEach(med => {
            Object.entries(med.medidas || {}).forEach(([key, value]) => {
                if (value && !isNaN(parseFloat(value))) {
                    if (!medidasProgreso[key]) {
                        medidasProgreso[key] = [];
                    }
                    medidasProgreso[key].push({
                        fecha: med.fecha,
                        valor: parseFloat(value)
                    });
                }
            });
        });

        return {
            totalSesiones,
            promedioValoracion,
            promedioDuracion,
            totalMediciones: mediciones.length,
            ejerciciosProgreso,
            medidasProgreso
        };
    }, [filteredProgressData]);

    useEffect(() => {
        if (clientId) {
            setSelectedClient(clientId);
        }
    }, [clientId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTypeIcon = (tipo) => {
        switch (tipo) {
            case 'entrenamiento':
                return <FaDumbbell className="w-4 h-4 text-blue-500" />;
            case 'medicion':
                return <FaWeight className="w-4 h-4 text-green-500" />;
            case 'evaluacion':
                return <FaChartLine className="w-4 h-4 text-purple-500" />;
            default:
                return <FaUser className="w-4 h-4 text-gray-500" />;
        }
    };

    const getTypeColor = (tipo) => {
        switch (tipo) {
            case 'entrenamiento':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'medicion':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'evaluacion':
                return 'bg-purple-50 border-purple-200 text-purple-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const calculateVolume = (ejercicios) => {
        return ejercicios.reduce((total, ej) => total + (ej.series * ej.repeticiones * ej.peso), 0);
    };

    return (
        <div className="space-y-6">
            {/* Header & Client Selection */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <FaChartLine className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Historial de Progreso</h2>
                </div>
            </div>

            {/* Client Selector */}
            {!clientId && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar Cliente
                    </label>
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Seleccionar cliente...</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.nombre || client.email}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedClient && (
                <>
                    {/* Client Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FaUser className="w-5 h-5 text-blue-600" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {selectedClientData?.nombre || selectedClientData?.email}
                                    </h3>
                                    <p className="text-sm text-gray-600">{selectedClientData?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Total registros: {filteredProgressData.length}</span>
                                <span>Sesiones: {statistics.totalSesiones}</span>
                                <span>Mediciones: {statistics.totalMediciones}</span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2">
                                <FaDumbbell className="w-5 h-5 text-blue-500" />
                                <h4 className="font-medium text-gray-900">Sesiones</h4>
                            </div>
                            <p className="text-2xl font-bold text-blue-600 mt-2">{statistics.totalSesiones}</p>
                            <p className="text-sm text-gray-600">Total entrenamientos</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2">
                                <FaChartLine className="w-5 h-5 text-green-500" />
                                <h4 className="font-medium text-gray-900">Valoración</h4>
                            </div>
                            <p className="text-2xl font-bold text-green-600 mt-2">{statistics.promedioValoracion}/5</p>
                            <p className="text-sm text-gray-600">Promedio</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2">
                                <FaCalendarAlt className="w-5 h-5 text-purple-500" />
                                <h4 className="font-medium text-gray-900">Duración</h4>
                            </div>
                            <p className="text-2xl font-bold text-purple-600 mt-2">{statistics.promedioDuracion}</p>
                            <p className="text-sm text-gray-600">Minutos promedio</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2">
                                <FaWeight className="w-5 h-5 text-orange-500" />
                                <h4 className="font-medium text-gray-900">Mediciones</h4>
                            </div>
                            <p className="text-2xl font-bold text-orange-600 mt-2">{statistics.totalMediciones}</p>
                            <p className="text-sm text-gray-600">Registros físicos</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <FaFilter className="w-4 h-4 text-gray-500" />
                            <h4 className="font-medium text-gray-900">Filtros</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo
                                </label>
                                <select
                                    value={filters.tipo}
                                    onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="entrenamiento">Entrenamiento</option>
                                    <option value="medicion">Medición</option>
                                    <option value="evaluacion">Evaluación</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    value={filters.fechaInicio}
                                    onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    value={filters.fechaFin}
                                    onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vista
                                </label>
                                <select
                                    value={filters.mostrarSolo}
                                    onChange={(e) => setFilters(prev => ({ ...prev, mostrarSolo: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="entrenamientos">Solo Entrenamientos</option>
                                    <option value="mediciones">Solo Mediciones</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Línea de Tiempo del Progreso</h3>
                        </div>

                        <div className="p-4">
                            {filteredProgressData.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay registros de progreso para mostrar
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredProgressData.map(progress => (
                                        <div key={progress.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        {getTypeIcon(progress.tipo)}
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-gray-900">
                                                                {formatDate(progress.fecha)}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(progress.tipo)}`}>
                                                                {progress.tipo === 'entrenamiento' ? 'Entrenamiento' :
                                                                    progress.tipo === 'medicion' ? 'Medición' : 'Evaluación'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                                        {progress.tipo === 'entrenamiento' && (
                                                            <>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Ejercicios: </span>
                                                                    <span className="font-medium">{progress.ejercicios.length}</span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Duración: </span>
                                                                    <span className="font-medium">{progress.duracion || 'N/A'} min</span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Volumen: </span>
                                                                    <span className="font-medium">{calculateVolume(progress.ejercicios)} kg</span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Intensidad: </span>
                                                                    <span className={`font-medium capitalize ${progress.intensidad === 'alta' ? 'text-red-600' :
                                                                            progress.intensidad === 'media' ? 'text-yellow-600' : 'text-green-600'
                                                                        }`}>
                                                                        {progress.intensidad}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Valoración: </span>
                                                                    <span className="font-medium">{progress.valoracion}/5 ⭐</span>
                                                                </div>
                                                            </>
                                                        )}

                                                        {(progress.tipo === 'medicion' || progress.tipo === 'evaluacion') && (
                                                            <>
                                                                {progress.medidas.peso && (
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-600">Peso: </span>
                                                                        <span className="font-medium">{progress.medidas.peso} kg</span>
                                                                    </div>
                                                                )}
                                                                {progress.medidas.grasa && (
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-600">% Grasa: </span>
                                                                        <span className="font-medium">{progress.medidas.grasa}%</span>
                                                                    </div>
                                                                )}
                                                                {progress.medidas.musculo && (
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-600">% Músculo: </span>
                                                                        <span className="font-medium">{progress.medidas.musculo}%</span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {progress.notas && (
                                                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                                                            "{progress.notas}"
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setSelectedProgress(progress);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors ml-4"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedProgress && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {getTypeIcon(selectedProgress.tipo)}
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Detalles del {selectedProgress.tipo === 'entrenamiento' ? 'Entrenamiento' :
                                            selectedProgress.tipo === 'medicion' ? 'Medición' : 'Evaluación'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimes className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-gray-600 mt-2">{formatDate(selectedProgress.fecha)}</p>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {selectedProgress.tipo === 'entrenamiento' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Duración</h4>
                                            <p className="text-gray-600">{selectedProgress.duracion || 'N/A'} minutos</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Intensidad</h4>
                                            <p className="text-gray-600 capitalize">{selectedProgress.intensidad}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Valoración</h4>
                                            <p className="text-gray-600">{selectedProgress.valoracion}/5</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Volumen Total</h4>
                                            <p className="text-gray-600">{calculateVolume(selectedProgress.ejercicios)} kg</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Ejercicios Realizados</h4>
                                        <div className="space-y-2">
                                            {selectedProgress.ejercicios.map((ej, index) => (
                                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="font-medium text-gray-900">{ej.nombre}</h5>
                                                        <div className="text-sm text-gray-600">
                                                            {ej.series}x{ej.repeticiones} @ {ej.peso}kg
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(selectedProgress.tipo === 'medicion' || selectedProgress.tipo === 'evaluacion') && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Mediciones</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedProgress.medidas.peso && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <h5 className="font-medium text-gray-900">Peso</h5>
                                                    <p className="text-lg text-blue-600">{selectedProgress.medidas.peso} kg</p>
                                                </div>
                                            )}
                                            {selectedProgress.medidas.grasa && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <h5 className="font-medium text-gray-900">% Grasa Corporal</h5>
                                                    <p className="text-lg text-red-600">{selectedProgress.medidas.grasa}%</p>
                                                </div>
                                            )}
                                            {selectedProgress.medidas.musculo && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <h5 className="font-medium text-gray-900">% Masa Muscular</h5>
                                                    <p className="text-lg text-green-600">{selectedProgress.medidas.musculo}%</p>
                                                </div>
                                            )}
                                            {selectedProgress.medidas.imc && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <h5 className="font-medium text-gray-900">IMC</h5>
                                                    <p className="text-lg text-purple-600">{selectedProgress.medidas.imc}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedProgress.notas && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-gray-700">{selectedProgress.notas}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}