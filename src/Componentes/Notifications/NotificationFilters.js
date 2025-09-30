import React from 'react';

const NotificationFilters = ({ filters, onFiltersChange, onClearFilters, stats }) => {
    const handleTypeChange = (type) => {
        onFiltersChange({
            ...filters,
            type: filters.type === type ? null : type
        });
    };

    const handleReadStatusChange = (readStatus) => {
        onFiltersChange({
            ...filters,
            read: filters.read === readStatus ? null : readStatus
        });
    };

    const typeOptions = [
        { value: 'membership', label: 'Membresía', icon: '👤', count: stats.byType.membership || 0 },
        { value: 'class', label: 'Clases', icon: '📅', count: stats.byType.class || 0 },
        { value: 'payment', label: 'Pagos', icon: '💳', count: stats.byType.payment || 0 },
        { value: 'system', label: 'Sistema', icon: '⚙️', count: stats.byType.system || 0 },
        { value: 'promotion', label: 'Promoción', icon: '🎯', count: stats.byType.promotion || 0 }
    ];

    const hasActiveFilters = filters.type !== null || filters.read !== null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* Stats Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total</span>
                        <span className="font-semibold text-gray-900">{stats.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">No leídas</span>
                        <span className="font-semibold text-blue-600">{stats.unread}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Leídas</span>
                        <span className="font-semibold text-green-600">{stats.read}</span>
                    </div>
                </div>
            </div>

            {/* Read Status Filter */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Estado</h4>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="readStatus"
                            checked={filters.read === null}
                            onChange={() => handleReadStatusChange(null)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Todas</span>
                        <span className="ml-auto text-xs text-gray-500">({stats.total})</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="readStatus"
                            checked={filters.read === false}
                            onChange={() => handleReadStatusChange(false)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No leídas</span>
                        <span className="ml-auto text-xs text-blue-600 font-medium">({stats.unread})</span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="readStatus"
                            checked={filters.read === true}
                            onChange={() => handleReadStatusChange(true)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Leídas</span>
                        <span className="ml-auto text-xs text-green-600 font-medium">({stats.read})</span>
                    </label>
                </div>
            </div>

            {/* Type Filter */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de notificación</h4>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="notificationType"
                            checked={filters.type === null}
                            onChange={() => handleTypeChange(null)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Todos los tipos</span>
                        <span className="ml-auto text-xs text-gray-500">({stats.total})</span>
                    </label>

                    {typeOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                            <input
                                type="radio"
                                name="notificationType"
                                checked={filters.type === option.value}
                                onChange={() => handleTypeChange(option.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700 flex items-center">
                                <span className="mr-2">{option.icon}</span>
                                {option.label}
                            </span>
                            <span className="ml-auto text-xs text-gray-500">({option.count})</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros activos</h4>
                    <div className="space-y-2">
                        {filters.read !== null && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Estado: {filters.read ? 'Leídas' : 'No leídas'}
                                <button
                                    onClick={() => handleReadStatusChange(null)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {filters.type && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Tipo: {typeOptions.find(t => t.value === filters.type)?.label}
                                <button
                                    onClick={() => handleTypeChange(null)}
                                    className="ml-1 text-purple-600 hover:text-purple-800"
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
                        onClick={() => handleReadStatusChange(false)}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        Ver solo no leídas
                    </button>

                    <button
                        onClick={() => handleTypeChange('membership')}
                        className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                        Ver solo membresía
                    </button>

                    <button
                        onClick={() => handleTypeChange('class')}
                        className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    >
                        Ver solo clases
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationFilters;