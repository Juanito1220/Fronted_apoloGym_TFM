// src/Componentes/Admin/TimeRangePicker.js
import React from 'react';

const TimeRangePicker = ({ selected, onChange }) => {
    const options = [
        { value: 'today', label: 'Hoy' },
        { value: 'week', label: 'Última Semana' },
        { value: 'month', label: 'Mes Actual' },
        { value: 'last30days', label: 'Últimos 30 días' }
    ];

    return (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${selected === option.value
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default TimeRangePicker;