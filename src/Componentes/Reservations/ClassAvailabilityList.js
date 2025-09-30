import React, { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const ClassAvailabilityList = ({
    classes,
    loading,
    onBookClass,
    viewMode,
    onViewModeChange,
    hasConflictingBooking
}) => {
    const [sortBy, setSortBy] = useState('time'); // 'time', 'activity', 'availability'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

    const getActivityIcon = (activity) => {
        const icons = {
            yoga: '🧘‍♀️',
            spinning: '🚴‍♀️',
            funcional: '🏃‍♂️',
            cardio: '❤️',
            pesas: '🏋️‍♂️',
            crossfit: '💪',
            pilates: '🤸‍♀️',
            zumba: '💃'
        };
        return icons[activity] || '🏃‍♂️';
    };

    const getAvailabilityColor = (available, capacity) => {
        const percentage = (available / capacity) * 100;
        if (percentage > 50) return 'text-green-600';
        if (percentage > 20) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getAvailabilityBg = (available, capacity) => {
        const percentage = (available / capacity) * 100;
        if (percentage > 50) return 'bg-green-100';
        if (percentage > 20) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const sortedClasses = [...classes].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'time':
                comparison = a.startTime.localeCompare(b.startTime);
                break;
            case 'activity':
                comparison = a.activityName.localeCompare(b.activityName);
                break;
            case 'availability':
                comparison = a.available - b.available;
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    if (loading && classes.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <LoadingSpinner size="lg" text="Cargando clases disponibles..." />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                        Clases Disponibles ({classes.length})
                    </h2>

                    <div className="flex items-center space-x-4">
                        {/* Sort Options */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Ordenar por:</span>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortBy(field);
                                    setSortOrder(order);
                                }}
                                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="time-asc">Hora (Temprano)</option>
                                <option value="time-desc">Hora (Tarde)</option>
                                <option value="activity-asc">Actividad (A-Z)</option>
                                <option value="activity-desc">Actividad (Z-A)</option>
                                <option value="availability-desc">Más Disponible</option>
                                <option value="availability-asc">Menos Disponible</option>
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => onViewModeChange('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                title="Vista de lista"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onViewModeChange('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                title="Vista de cuadrícula"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {loading && classes.length > 0 && (
                    <div className="text-center py-4 mb-4">
                        <LoadingSpinner size="sm" text="Actualizando disponibilidad..." />
                    </div>
                )}

                {classes.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-4 text-sm font-medium text-gray-900">No hay clases disponibles</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Intenta cambiar los filtros o seleccionar otra fecha.
                        </p>
                    </div>
                )}

                {classes.length > 0 && (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    }>
                        {sortedClasses.map((classItem) => {
                            const hasConflict = hasConflictingBooking(classItem.date, classItem.startTime);
                            const isFullyBooked = classItem.available === 0;
                            const isAlmostFull = classItem.available <= 3 && classItem.available > 0;

                            if (viewMode === 'grid') {
                                return (
                                    <div key={classItem.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{getActivityIcon(classItem.activity)}</span>
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">{classItem.activityName}</h3>
                                                    <p className="text-sm text-gray-500">{classItem.level}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBg(classItem.available, classItem.capacity)} ${getAvailabilityColor(classItem.available, classItem.capacity)}`}>
                                                {classItem.available} libres
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="mb-4">
                                            <div className="text-2xl font-bold text-gray-900">{classItem.startTime}</div>
                                            <div className="text-sm text-gray-500">{classItem.startTime} - {classItem.endTime}</div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {classItem.trainer.name}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {classItem.room.name}
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Precio:</span>
                                                <span className="font-medium text-blue-600">€{classItem.price}</span>
                                            </div>
                                        </div>

                                        {/* Warnings */}
                                        {hasConflict && (
                                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    <span className="text-sm text-yellow-800">Ya tienes una reserva en este horario</span>
                                                </div>
                                            </div>
                                        )}

                                        {isAlmostFull && !isFullyBooked && (
                                            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm text-orange-800">¡Pocos cupos disponibles!</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Book Button */}
                                        <button
                                            onClick={() => onBookClass(classItem)}
                                            disabled={isFullyBooked || hasConflict}
                                            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${isFullyBooked || hasConflict
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                }`}
                                        >
                                            {isFullyBooked ? 'Clase Completa' : hasConflict ? 'Conflicto de Horario' : 'Reservar'}
                                        </button>
                                    </div>
                                );
                            }

                            // List view
                            return (
                                <div key={classItem.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        {/* Main Info */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{getActivityIcon(classItem.activity)}</span>
                                                <div>
                                                    <div className="text-xl font-bold text-gray-900">{classItem.startTime}</div>
                                                    <div className="text-sm text-gray-500">{classItem.startTime} - {classItem.endTime}</div>
                                                </div>
                                            </div>

                                            <div className="border-l border-gray-200 pl-4">
                                                <h3 className="text-lg font-medium text-gray-900">{classItem.activityName}</h3>
                                                <p className="text-sm text-gray-600">{classItem.trainer.name} • {classItem.room.name}</p>
                                                <p className="text-sm text-gray-500">{classItem.level} • €{classItem.price}</p>
                                            </div>
                                        </div>

                                        {/* Availability & Actions */}
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${getAvailabilityColor(classItem.available, classItem.capacity)}`}>
                                                    {classItem.available} de {classItem.capacity} disponibles
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {Math.round((classItem.occupied / classItem.capacity) * 100)}% ocupado
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => onBookClass(classItem)}
                                                disabled={isFullyBooked || hasConflict}
                                                className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${isFullyBooked || hasConflict
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                    }`}
                                            >
                                                {isFullyBooked ? 'Completa' : hasConflict ? 'Conflicto' : 'Reservar'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Warnings */}
                                    {(hasConflict || isAlmostFull) && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            {hasConflict && (
                                                <div className="flex items-center text-sm text-yellow-800 mb-2">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    Ya tienes una reserva en este horario
                                                </div>
                                            )}
                                            {isAlmostFull && !isFullyBooked && (
                                                <div className="flex items-center text-sm text-orange-800">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    ¡Pocos cupos disponibles!
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassAvailabilityList;