import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Filter, TrendingUp, Users } from 'lucide-react';

const AttendanceHistory = ({ attendanceHistory, attendanceStats, loading }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'week', 'month'
    const [sortBy, setSortBy] = useState('date'); // 'date', 'duration'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

    // Filtrar datos por período
    const filteredAttendance = useMemo(() => {
        let filtered = [...attendanceHistory];

        if (filter !== 'all') {
            const now = new Date();
            filtered = attendanceHistory.filter(attendance => {
                const attendanceDate = new Date(attendance.date);

                if (filter === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return attendanceDate >= weekAgo;
                } else if (filter === 'month') {
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return attendanceDate >= monthAgo;
                }

                return true;
            });
        }

        // Ordenar
        filtered.sort((a, b) => {
            let aValue, bValue;

            if (sortBy === 'date') {
                aValue = new Date(a.date);
                bValue = new Date(b.date);
            } else if (sortBy === 'duration') {
                // Convertir duración a minutos para comparar
                aValue = parseDurationToMinutes(a.duration);
                bValue = parseDurationToMinutes(b.duration);
            }

            if (sortOrder === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });

        return filtered;
    }, [attendanceHistory, filter, sortBy, sortOrder]);

    // Convertir duración a minutos
    const parseDurationToMinutes = (duration) => {
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        if (match) {
            return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return 0;
    };

    // Formatear fecha
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Formatear fecha corta
    const formatShortDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    // Obtener color según la actividad
    const getActivityColor = (activity) => {
        const colors = {
            'Entrenamiento General': 'bg-blue-100 text-blue-800',
            'Cardio': 'bg-red-100 text-red-800',
            'Pesas': 'bg-purple-100 text-purple-800',
            'Funcional': 'bg-green-100 text-green-800'
        };
        return colors[activity] || 'bg-gray-100 text-gray-800';
    };

    // Estadísticas de la semana
    const weeklyStats = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const thisWeekAttendance = attendanceHistory.filter(a =>
            new Date(a.date) >= weekAgo
        );

        const totalDuration = thisWeekAttendance.reduce((sum, a) =>
            sum + parseDurationToMinutes(a.duration), 0
        );

        return {
            days: thisWeekAttendance.length,
            totalHours: Math.floor(totalDuration / 60),
            totalMinutes: totalDuration % 60,
            averageSession: thisWeekAttendance.length > 0 ? totalDuration / thisWeekAttendance.length : 0
        };
    }, [attendanceHistory]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Estadísticas de asistencia */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Este mes</p>
                            <p className="text-xl font-bold text-gray-900">{attendanceStats.thisMonth}</p>
                            <p className="text-xs text-gray-400">días</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Racha actual</p>
                            <p className="text-xl font-bold text-gray-900">{attendanceStats.streak}</p>
                            <p className="text-xs text-gray-400">días</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 text-purple-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Esta semana</p>
                            <p className="text-xl font-bold text-gray-900">
                                {weeklyStats.totalHours}h {weeklyStats.totalMinutes}m
                            </p>
                            <p className="text-xs text-gray-400">total</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <Users className="w-5 h-5 text-orange-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Promedio semanal</p>
                            <p className="text-xl font-bold text-gray-900">
                                {attendanceStats.averagePerWeek.toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-400">días</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial de asistencia */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <h3 className="text-lg font-bold text-gray-900">Historial de Asistencia</h3>

                        {/* Controles de filtro y ordenamiento */}
                        <div className="flex gap-2 text-sm">
                            {/* Filtro por período */}
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todos</option>
                                <option value="week">Última semana</option>
                                <option value="month">Último mes</option>
                            </select>

                            {/* Ordenamiento */}
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [by, order] = e.target.value.split('-');
                                    setSortBy(by);
                                    setSortOrder(order);
                                }}
                                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="date-desc">Más reciente</option>
                                <option value="date-asc">Más antiguo</option>
                                <option value="duration-desc">Mayor duración</option>
                                <option value="duration-asc">Menor duración</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    {filteredAttendance.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No hay registros de asistencia</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredAttendance.map((attendance, index) => (
                                <div
                                    key={attendance.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900">
                                                    {formatShortDate(attendance.date)}
                                                </h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(attendance.activity)}`}>
                                                    {attendance.activity}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{attendance.checkIn} - {attendance.checkOut}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span>{attendance.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">
                                                {attendance.duration.split(' ')[0]}
                                            </div>
                                            <div className="text-xs text-gray-500">duración</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Paginación simple */}
                {filteredAttendance.length > 10 && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex justify-center">
                            <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800">
                                Cargar más registros
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceHistory;