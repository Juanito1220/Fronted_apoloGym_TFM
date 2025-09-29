// src/Componentes/Debug/DataDebug.js
import React, { useState, useEffect } from 'react';
import mockDataStore from '../../Data/mockDataStore';
import dashboardService from '../../Data/Services/dashboardService';

const DataDebug = () => {
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const loadDebugData = async () => {
            try {
                console.log('🔧 Debug: Cargando datos...');

                // Datos directos del store
                const storeData = {
                    users: mockDataStore.getUsers(),
                    payments: mockDataStore.getPayments(),
                    bookings: mockDataStore.getBookings(),
                    attendance: mockDataStore.getAttendance(),
                    metrics: mockDataStore.getMetrics()
                };

                // Datos de gráficos del store
                const chartDataDirect = {
                    attendanceTrend: mockDataStore.getAttendanceTrendData(),
                    usageByCategory: mockDataStore.getUsageByCategoryData(),
                    monthlyRevenue: mockDataStore.getMonthlyRevenueData(),
                    attendanceByHour: mockDataStore.getAttendanceByHourData()
                };

                // Datos a través del servicio
                const serviceData = await dashboardService.getUsageChartData();

                setDebugInfo({
                    store: storeData,
                    chartsDirect: chartDataDirect,
                    chartsService: serviceData
                });

                console.log('✅ Debug datos cargados:', {
                    store: storeData,
                    chartsDirect: chartDataDirect,
                    chartsService: serviceData
                });

            } catch (error) {
                console.error('❌ Error en debug:', error);
            }
        };

        loadDebugData();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Debug de Datos</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold">Usuarios en Store:</h3>
                    <p>{debugInfo.store?.users?.length || 0} usuarios</p>
                </div>

                <div>
                    <h3 className="font-semibold">Pagos en Store:</h3>
                    <p>{debugInfo.store?.payments?.length || 0} pagos</p>
                </div>

                <div>
                    <h3 className="font-semibold">Reservas en Store:</h3>
                    <p>{debugInfo.store?.bookings?.length || 0} reservas</p>
                </div>

                <div>
                    <h3 className="font-semibold">Asistencia en Store:</h3>
                    <p>{debugInfo.store?.attendance?.length || 0} registros</p>
                </div>

                <div>
                    <h3 className="font-semibold">Datos de Tendencia (Directo):</h3>
                    <p>{debugInfo.chartsDirect?.attendanceTrend?.length || 0} puntos</p>
                </div>

                <div>
                    <h3 className="font-semibold">Datos de Categorías (Directo):</h3>
                    <p>{debugInfo.chartsDirect?.usageByCategory?.length || 0} categorías</p>
                </div>

                <div>
                    <h3 className="font-semibold">Datos de Ingresos (Directo):</h3>
                    <p>{debugInfo.chartsDirect?.monthlyRevenue?.length || 0} meses</p>
                </div>

                <div>
                    <h3 className="font-semibold">Datos por Hora (Directo):</h3>
                    <p>{debugInfo.chartsDirect?.attendanceByHour?.length || 0} horas</p>
                </div>

                <div>
                    <h3 className="font-semibold">Datos del Servicio:</h3>
                    <p>Tendencia: {debugInfo.chartsService?.attendanceTrend?.length || 0}</p>
                    <p>Categorías: {debugInfo.chartsService?.usageByCategory?.length || 0}</p>
                    <p>Ingresos: {debugInfo.chartsService?.monthlyRevenue?.length || 0}</p>
                    <p>Por hora: {debugInfo.chartsService?.attendanceByHour?.length || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default DataDebug;