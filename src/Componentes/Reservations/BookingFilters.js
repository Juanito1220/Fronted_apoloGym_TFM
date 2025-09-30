import React from 'react';

const BookingFilters = ({ filters, systemInfo, onFiltersChange }) => {
    const handleFilterChange = (key, value) => {
        onFiltersChange({ [key]: value });
    };

    const clearFilters = () => {
        onFiltersChange({
            date: new Date().toISOString().split('T')[0],
            activity: 'all',
            room: 'all',
            timeSlot: 'all'
        });
    };

    const hasActiveFilters =
        filters.activity !== 'all' ||
        filters.room !== 'all' ||
        filters.timeSlot !== 'all' ||
        filters.date !== new Date().toISOString().split('T')[0];

    // Obtener fechas de la próxima semana
    const getDateOptions = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                value: date.toISOString().split('T')[0],
                label: i === 0 ? 'Hoy' :
                    i === 1 ? 'Mañana' :
                        date.toLocaleDateString('es-ES', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })
            });
        }

        return dates;
    };

    const dateOptions = getDateOptions();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* Quick Date Selection */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Fecha</h4>
                <div className="grid grid-cols-2 gap-2">
                    {dateOptions.slice(0, 6).map((date) => (
                        <button
                            key={date.value}
                            onClick={() => handleFilterChange('date', date.value)}
                            className={`px-3 py-2 text-sm rounded-md border transition-colors ${filters.date === date.value
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {date.label}
                        </button>
                    ))}
                </div>

                {/* Custom Date Picker */}
                <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Otra fecha:</label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Activity Filter */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Actividad</h4>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="activity"
                            value="all"
                            checked={filters.activity === 'all'}
                            onChange={(e) => handleFilterChange('activity', e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Todas las actividades</span>
                    </label>

                    {systemInfo.activities.map((activity) => {
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
                        const icon = icons[activity.id] || '🏃‍♂️';

                        return (
                            <label key={activity.id} className="flex items-center">
                                <input
                                    type="radio"
                                    name="activity"
                                    value={activity.id}
                                    checked={filters.activity === activity.id}
                                    onChange={(e) => handleFilterChange('activity', e.target.value)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700 flex items-center">
                                    <span className="mr-2">{icon}</span>
                                    {activity.name}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Room Filter */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sala</h4>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="room"
                            value="all"
                            checked={filters.room === 'all'}
                            onChange={(e) => handleFilterChange('room', e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Todas las salas</span>
                    </label>

                    {systemInfo.rooms.map((room) => (
                        <label key={room.id} className="flex items-center">
                            <input
                                type="radio"
                                name="room"
                                value={room.id.toString()}
                                checked={filters.room === room.id.toString()}
                                onChange={(e) => handleFilterChange('room', e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {room.name}
                                <span className="text-xs text-gray-500 block">
                                    Capacidad: {room.capacity} personas
                                </span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Time Slot Filter */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Horario</h4>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="timeSlot"
                            value="all"
                            checked={filters.timeSlot === 'all'}
                            onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Todos los horarios</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="timeSlot"
                            value="morning"
                            checked={filters.timeSlot === 'morning'}
                            onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            🌅 Mañana (06:00 - 12:00)
                        </span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="timeSlot"
                            value="afternoon"
                            checked={filters.timeSlot === 'afternoon'}
                            onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            ☀️ Tarde (12:00 - 18:00)
                        </span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="timeSlot"
                            value="evening"
                            checked={filters.timeSlot === 'evening'}
                            onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            🌆 Noche (18:00 - 22:00)
                        </span>
                    </label>
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros activos</h4>
                    <div className="space-y-2">
                        {filters.date !== new Date().toISOString().split('T')[0] && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Fecha: {new Date(filters.date).toLocaleDateString()}
                                <button
                                    onClick={() => handleFilterChange('date', new Date().toISOString().split('T')[0])}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {filters.activity !== 'all' && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Actividad: {systemInfo.activities.find(a => a.id === filters.activity)?.name}
                                <button
                                    onClick={() => handleFilterChange('activity', 'all')}
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {filters.room !== 'all' && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Sala: {systemInfo.rooms.find(r => r.id.toString() === filters.room)?.name}
                                <button
                                    onClick={() => handleFilterChange('room', 'all')}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {filters.timeSlot !== 'all' && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Horario: {
                                    filters.timeSlot === 'morning' ? 'Mañana' :
                                        filters.timeSlot === 'afternoon' ? 'Tarde' :
                                            'Noche'
                                }
                                <button
                                    onClick={() => handleFilterChange('timeSlot', 'all')}
                                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Acciones rápidas</h4>
                <div className="space-y-2">
                    <button
                        onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            handleFilterChange('date', tomorrow.toISOString().split('T')[0]);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        Ver clases de mañana
                    </button>

                    <button
                        onClick={() => handleFilterChange('timeSlot', 'evening')}
                        className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                        Solo clases nocturnas
                    </button>

                    <button
                        onClick={() => handleFilterChange('activity', 'spinning')}
                        className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    >
                        Solo Spinning
                    </button>
                </div>
            </div>

            {/* Info Panel */}
            <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Consejos para reservar</p>
                        <ul className="text-xs space-y-1 text-blue-700">
                            <li>• Las reservas se pueden cancelar hasta 2 horas antes</li>
                            <li>• Los cupos se liberan automáticamente al cancelar</li>
                            <li>• Llega 10 minutos antes del inicio de la clase</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingFilters;