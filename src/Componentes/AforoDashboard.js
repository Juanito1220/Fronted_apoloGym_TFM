import React, { useState } from 'react';
import ConfiguracionAforo from './ConfiguracionAforo';
import '../Styles/aforo.css';

const AforoDashboard = ({ aforoStatus, globalSummary, onRefresh }) => {
    const [showConfig, setShowConfig] = useState(false);
    const getAlertColor = (alertLevel) => {
        switch (alertLevel) {
            case 'critical': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            case 'safe': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    const getAlertTextColor = (alertLevel) => {
        switch (alertLevel) {
            case 'critical': return 'text-red-700';
            case 'warning': return 'text-yellow-700';
            case 'safe': return 'text-green-700';
            default: return 'text-gray-700';
        }
    };

    const getAlertBgColor = (alertLevel) => {
        switch (alertLevel) {
            case 'critical': return 'bg-red-50 border-red-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            case 'safe': return 'bg-green-50 border-green-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 aforo-dashboard">
            {/* Resumen Global */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-1200">Control de Aforo</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowConfig(true)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Configurar
                        </button>
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 aforo-card hover-lift">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-900">Ocupación Total</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {globalSummary.totalCurrent} / {globalSummary.totalCapacity}
                                </p>
                                <p className="text-sm text-blue-700">{globalSummary.globalPercentage}% ocupado</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 aforo-card hover-lift">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-600 animated-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-900">Salas Normales</p>
                                <p className="text-2xl font-bold text-green-600">{globalSummary.safeCount}</p>
                                <p className="text-sm text-green-700">Capacidad OK</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 aforo-card hover-lift">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-yellow-600 animated-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-yellow-900">Salas en Alerta</p>
                                <p className="text-2xl font-bold text-yellow-600">{globalSummary.warningCount}</p>
                                <p className="text-sm text-yellow-700">&gt; 80% ocupación</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 aforo-card hover-lift">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-red-600 animated-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-red-900">Salas Completas</p>
                                <p className="text-2xl font-bold text-red-600">{globalSummary.criticalCount}</p>
                                <p className="text-sm text-red-700">Capacidad máxima</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicador de Progreso Global */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacidad Global del Gimnasio</h3>
                <div className="relative">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                Ocupación
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                                {globalSummary.globalPercentage}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                        <div
                            style={{ width: `${Math.min(globalSummary.globalPercentage, 100)}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${globalSummary.globalPercentage >= 100 ? 'bg-red-500' :
                                    globalSummary.globalPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{globalSummary.totalCurrent} personas</span>
                        <span>Máximo: {globalSummary.totalCapacity}</span>
                    </div>
                </div>
            </div>

            {/* Grid de Salas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 aforo-grid">
                {Object.entries(aforoStatus).map(([sala, data]) => (
                    <div key={sala} className={`rounded-xl shadow-sm border p-6 aforo-card hover-lift alert-state ${data.alertLevel} ${getAlertBgColor(data.alertLevel)}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{sala}</h3>
                            <div className={`w-3 h-3 rounded-full status-indicator ${data.alertLevel} ${getAlertColor(data.alertLevel)}`}></div>
                        </div>

                        {/* Círculo de Progreso */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative w-24 h-24">
                                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="#e5e7eb"
                                        strokeWidth="8"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 40}`}
                                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.percentage / 100)}`}
                                        className={`progress-circle ${getAlertTextColor(data.alertLevel)}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-lg font-bold ${getAlertTextColor(data.alertLevel)}`}>
                                        {data.percentage}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Ocupación actual:</span>
                                <span className="font-semibold">{data.currentOccupancy}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Capacidad máxima:</span>
                                <span className="font-semibold">{data.maxCapacity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Disponibles:</span>
                                <span className={`font-semibold ${data.available <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {data.available}
                                </span>
                            </div>
                        </div>

                        {data.alertLevel === 'critical' && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800 font-medium">
                                    ⚠️ Capacidad máxima alcanzada
                                </p>
                            </div>
                        )}

                        {data.alertLevel === 'warning' && (
                            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800 font-medium">
                                    ⚡ Alerta: Próximo a capacidad máxima
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal de Configuración */}
            {showConfig && (
                <ConfiguracionAforo
                    onClose={() => setShowConfig(false)}
                    onSave={(newCapacities) => {
                        console.log('Nuevas capacidades guardadas:', newCapacities);
                        setShowConfig(false);
                        onRefresh(); // Actualizar dashboard después de guardar
                    }}
                />
            )}
        </div>
    );
};

export default AforoDashboard;