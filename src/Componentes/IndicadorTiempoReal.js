import React from 'react';

const IndicadorTiempoReal = ({ aforoStatus, globalSummary }) => {
    const getCriticalSalas = () => {
        return Object.entries(aforoStatus)
            .filter(([_, data]) => data.alertLevel === 'critical')
            .map(([sala, data]) => ({ sala, ...data }));
    };

    const getWarningSalas = () => {
        return Object.entries(aforoStatus)
            .filter(([_, data]) => data.alertLevel === 'warning')
            .map(([sala, data]) => ({ sala, ...data }));
    };

    const criticalSalas = getCriticalSalas();
    const warningSalas = getWarningSalas();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estado en Tiempo Real</h3>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600">En vivo</span>
                </div>
            </div>

            {/* Indicador Global */}
            <div className={`p-4 rounded-lg mb-4 ${globalSummary.globalPercentage >= 100 ? 'bg-red-50 border border-red-200' :
                    globalSummary.globalPercentage >= 80 ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-green-50 border border-green-200'
                }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Ocupación Global</p>
                        <p className="text-2xl font-bold">
                            {globalSummary.totalCurrent} / {globalSummary.totalCapacity}
                        </p>
                    </div>
                    <div className={`text-right ${globalSummary.globalPercentage >= 100 ? 'text-red-700' :
                            globalSummary.globalPercentage >= 80 ? 'text-yellow-700' :
                                'text-green-700'
                        }`}>
                        <p className="text-3xl font-bold">{globalSummary.globalPercentage}%</p>
                        <p className="text-sm">ocupado</p>
                    </div>
                </div>
            </div>

            {/* Alertas Críticas */}
            {criticalSalas.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Salas Completas - NO PERMITIR ENTRADA
                    </h4>
                    <div className="space-y-2">
                        {criticalSalas.map(sala => (
                            <div key={sala.sala} className="flex items-center justify-between p-3 bg-red-100 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                                    <span className="font-medium text-red-900">{sala.sala}</span>
                                </div>
                                <span className="text-sm font-semibold text-red-700">
                                    {sala.currentOccupancy}/{sala.maxCapacity} - LLENO
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Alertas de Advertencia */}
            {warningSalas.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Salas Próximas al Límite - PRECAUCIÓN
                    </h4>
                    <div className="space-y-2">
                        {warningSalas.map(sala => (
                            <div key={sala.sala} className="flex items-center justify-between p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                    <span className="font-medium text-yellow-900">{sala.sala}</span>
                                </div>
                                <span className="text-sm font-semibold text-yellow-700">
                                    {sala.currentOccupancy}/{sala.maxCapacity} - {sala.available} disponibles
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Estado Normal */}
            {criticalSalas.length === 0 && warningSalas.length === 0 && (
                <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-green-800 font-medium">Todas las salas en capacidad normal</p>
                    <p className="text-green-600 text-sm">Puede procesar entradas sin restricciones</p>
                </div>
            )}

            {/* Lista de todas las salas */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Todas las Salas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(aforoStatus).map(([sala, data]) => (
                        <div key={sala} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${data.alertLevel === 'critical' ? 'bg-red-500' :
                                        data.alertLevel === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}></div>
                                <span className="font-medium">{sala}</span>
                            </div>
                            <span className="text-gray-600">{data.currentOccupancy}/{data.maxCapacity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IndicadorTiempoReal;