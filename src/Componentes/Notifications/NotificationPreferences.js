import React, { useState, useEffect } from 'react';

const NotificationPreferences = ({ preferences, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({
        email: {
            enabled: true,
            types: {
                membership: true,
                class: true,
                payment: true,
                system: false,
                promotion: true
            }
        },
        push: {
            enabled: true,
            types: {
                membership: true,
                class: true,
                payment: true,
                system: false,
                promotion: false
            }
        },
        frequency: 'immediate', // immediate, daily, weekly
        quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00'
        }
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (preferences) {
            setFormData(preferences);
        }
    }, [preferences]);

    const handleChannelToggle = (channel) => {
        setFormData(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                enabled: !prev[channel].enabled
            }
        }));
    };

    const handleTypeToggle = (channel, type) => {
        setFormData(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                types: {
                    ...prev[channel].types,
                    [type]: !prev[channel].types[type]
                }
            }
        }));
    };

    const handleFrequencyChange = (frequency) => {
        setFormData(prev => ({
            ...prev,
            frequency
        }));
    };

    const handleQuietHoursToggle = () => {
        setFormData(prev => ({
            ...prev,
            quietHours: {
                ...prev.quietHours,
                enabled: !prev.quietHours.enabled
            }
        }));
    };

    const handleQuietHoursChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            quietHours: {
                ...prev.quietHours,
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate(formData);
        } finally {
            setIsSaving(false);
        }
    };

    const typeLabels = {
        membership: 'Membresía',
        class: 'Clases',
        payment: 'Pagos',
        system: 'Sistema',
        promotion: 'Promociones'
    };

    const frequencyOptions = [
        { value: 'immediate', label: 'Inmediato', description: 'Recibe notificaciones al instante' },
        { value: 'daily', label: 'Diario', description: 'Resumen diario a las 9:00 AM' },
        { value: 'weekly', label: 'Semanal', description: 'Resumen semanal los lunes' }
    ];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        Preferencias de Notificaciones
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="py-6 space-y-8">
                    {/* Notification Channels */}
                    <div>
                        <h4 className="text-base font-medium text-gray-900 mb-4">Canales de Notificación</h4>

                        {/* Email Notifications */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    <span className="font-medium text-gray-900">Notificaciones por Email</span>
                                </div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.email.enabled}
                                        onChange={() => handleChannelToggle('email')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Activar</span>
                                </label>
                            </div>

                            {formData.email.enabled && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 mb-3">Selecciona qué tipos de notificaciones quieres recibir por email:</p>
                                    {Object.entries(typeLabels).map(([type, label]) => (
                                        <label key={type} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.email.types[type]}
                                                onChange={() => handleTypeToggle('email', type)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Push Notifications */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h5v-5H4v5zM16 3H8L4 7v10h5V7h7V3z" />
                                    </svg>
                                    <span className="font-medium text-gray-900">Notificaciones Push</span>
                                </div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.push.enabled}
                                        onChange={() => handleChannelToggle('push')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Activar</span>
                                </label>
                            </div>

                            {formData.push.enabled && (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 mb-3">Selecciona qué tipos de notificaciones push quieres recibir:</p>
                                    {Object.entries(typeLabels).map(([type, label]) => (
                                        <label key={type} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.push.types[type]}
                                                onChange={() => handleTypeToggle('push', type)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Frequency Settings */}
                    <div>
                        <h4 className="text-base font-medium text-gray-900 mb-4">Frecuencia de Notificaciones</h4>
                        <div className="space-y-3">
                            {frequencyOptions.map((option) => (
                                <label key={option.value} className="flex items-start">
                                    <input
                                        type="radio"
                                        name="frequency"
                                        value={option.value}
                                        checked={formData.frequency === option.value}
                                        onChange={() => handleFrequencyChange(option.value)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Quiet Hours */}
                    <div>
                        <h4 className="text-base font-medium text-gray-900 mb-4">Horario de Silencio</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Activar horario de silencio</p>
                                    <p className="text-sm text-gray-500">No recibir notificaciones durante estas horas</p>
                                </div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.quietHours.enabled}
                                        onChange={handleQuietHoursToggle}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </label>
                            </div>

                            {formData.quietHours.enabled && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Desde
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.quietHours.start}
                                            onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hasta
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.quietHours.end}
                                            onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-6 border-t space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Guardando...
                            </div>
                        ) : (
                            'Guardar Preferencias'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPreferences;