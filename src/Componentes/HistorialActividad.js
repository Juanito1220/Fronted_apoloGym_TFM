import React, { useState } from 'react';

const HistorialActividad = ({ recentActivity = [], stats }) => {
    const [filter, setFilter] = useState('all'); // all, in, out
    const [salaFilter, setSalaFilter] = useState('all');

    const filteredActivity = recentActivity.filter(activity => {
        const typeMatch = filter === 'all' || activity.type === filter;
        const salaMatch = salaFilter === 'all' || activity.sala === salaFilter;
        return typeMatch && salaMatch;
    });

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    };

    const getTypeIcon = (type) => {
        if (type === 'in') {
            return (
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                    </svg>
                </div>
            );
        }
        return (
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
            </div>
        );
    };

    const salas = [...new Set(recentActivity.map(a => a.sala))];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Historial de Actividad</h2>

                {/* Estadísticas del día */}
                {stats && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{stats.todayEntries}</div>
                            <div className="text-sm text-blue-800">Entradas hoy</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{stats.todayExits}</div>
                            <div className="text-sm text-purple-800">Salidas hoy</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{stats.peakOccupancy}</div>
                            <div className="text-sm text-orange-800">Pico ocupación</div>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="flex flex-wrap gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todos</option>
                            <option value="in">Entradas</option>
                            <option value="out">Salidas</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sala</label>
                        <select
                            value={salaFilter}
                            onChange={(e) => setSalaFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todas</option>
                            {salas.map(sala => (
                                <option key={sala} value={sala}>{sala}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Actividad */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p>No hay actividad registrada</p>
                    </div>
                ) : (
                    filteredActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            {getTypeIcon(activity.type)}

                            <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.userId}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {activity.type === 'in' ? 'Entrada' : 'Salida'} - Sala {activity.sala}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            {formatTime(activity.ts)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {filteredActivity.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                    Mostrando {filteredActivity.length} de {recentActivity.length} registros
                </div>
            )}
        </div>
    );
};

export default HistorialActividad;