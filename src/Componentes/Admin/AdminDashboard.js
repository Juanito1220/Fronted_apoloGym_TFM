// src\Componentes\Admin\AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    FiDollarSign,
    FiCalendar,
    FiUserPlus,
    FiRefreshCw,
    FiTrendingUp
} from 'react-icons/fi';
import KPICard from './KPICard';
import TimeRangePicker from './TimeRangePicker';
import AttendanceTrendChart from './Charts/AttendanceTrendChart';
import UsagePieChart from './Charts/UsagePieChart';
import RevenueBarChart from './Charts/RevenueBarChart';
import AttendanceByHourChart from './Charts/AttendanceByHourChart';
import OccupancyIndicator from './OccupancyIndicator';
import ReportGenerator from './ReportGenerator';
import dashboardService from '../../Data/Services/dashboardService';
import { toast } from 'react-hot-toast';
import '../../Styles/dashboard.css';

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(true);
    const [chartsLoading, setChartsLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        ingresos: { value: 0, change: 0, trend: 'up' },
        reservas: { value: 0, change: 0, trend: 'up' },
        nuevosRegistros: { value: 0, change: 0, trend: 'up' },
        ocupacionActual: { value: 0, max: 100, percentage: 0, status: 'low' }
    });
    const [chartData, setChartData] = useState({
        attendanceTrend: [],
        usageByCategory: [],
        monthlyRevenue: [],
        attendanceByHour: []
    });
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getDashboardMetrics(timeRange);
            setMetrics(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Error al cargar los datos del dashboard');
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    const loadChartData = async () => {
        try {
            setChartsLoading(true);
            const data = await dashboardService.getUsageChartData('last30days');

            // Verificar que los datos tienen el formato correcto
            const validatedData = {
                attendanceTrend: Array.isArray(data?.attendanceTrend) ? data.attendanceTrend : [],
                usageByCategory: Array.isArray(data?.usageByCategory) ? data.usageByCategory : [],
                monthlyRevenue: Array.isArray(data?.monthlyRevenue) ? data.monthlyRevenue : [],
                attendanceByHour: Array.isArray(data?.attendanceByHour) ? data.attendanceByHour : []
            };

            setChartData(validatedData);
        } catch (error) {
            console.error('Error loading chart data:', error);
            toast.error('Error al cargar los gráficos');

            // Establecer datos vacíos en caso de error
            setChartData({
                attendanceTrend: [],
                usageByCategory: [],
                monthlyRevenue: [],
                attendanceByHour: []
            });
        } finally {
            setChartsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        loadChartData();

        // Actualizar datos cada 5 minutos
        const interval = setInterval(() => {
            loadDashboardData();
        }, 300000);

        return () => clearInterval(interval);
    }, [timeRange, loadDashboardData]);

    const handleRefresh = () => {
        loadDashboardData();
        loadChartData();
        toast.success('Datos actualizados');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Panel de Administración
                        </h1>
                        <p className="text-gray-600">
                            Métricas y análisis del gimnasio Apolo
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
                        <div className="text-sm text-gray-500">
                            Última actualización: {lastUpdated.toLocaleTimeString()}
                        </div>
                        <TimeRangePicker selected={timeRange} onChange={setTimeRange} />
                        <button
                            onClick={handleRefresh}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <FiRefreshCw className="h-4 w-4" />
                            <span>Actualizar</span>
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Ingresos"
                        value={metrics.ingresos.value}
                        currency="$"
                        change={metrics.ingresos.change}
                        trend={metrics.ingresos.trend}
                        icon={FiDollarSign}
                        color="green"
                        loading={loading}
                    />

                    <KPICard
                        title="Reservas"
                        value={metrics.reservas.value}
                        change={metrics.reservas.change}
                        trend={metrics.reservas.trend}
                        icon={FiCalendar}
                        color="blue"
                        loading={loading}
                    />

                    <KPICard
                        title="Nuevos Registros"
                        value={metrics.nuevosRegistros.value}
                        change={metrics.nuevosRegistros.change}
                        trend={metrics.nuevosRegistros.trend}
                        icon={FiUserPlus}
                        color="purple"
                        loading={loading}
                    />

                    <div className="md:col-span-2 lg:col-span-1">
                        <OccupancyIndicator
                            current={metrics.ocupacionActual.value}
                            max={metrics.ocupacionActual.max}
                            percentage={metrics.ocupacionActual.percentage}
                            status={metrics.ocupacionActual.status}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tendencia de Asistencia */}
                    <div className="lg:col-span-2">
                        <AttendanceTrendChart
                            data={chartData.attendanceTrend}
                            loading={chartsLoading}
                        />
                    </div>

                    {/* Uso por Categorías */}
                    <UsagePieChart
                        data={chartData.usageByCategory}
                        title="Uso por Salas"
                        loading={chartsLoading}
                    />

                    {/* Asistencia por Hora */}
                    <AttendanceByHourChart
                        data={chartData.attendanceByHour}
                        loading={chartsLoading}
                    />
                </div>

                {/* Revenue Chart */}
                <div className="grid grid-cols-1">
                    <RevenueBarChart
                        data={chartData.monthlyRevenue}
                        loading={chartsLoading}
                    />
                </div>

                {/* Report Generator */}
                <div className="grid grid-cols-1">
                    <ReportGenerator />
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiTrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                        Resumen Rápido
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {metrics.ingresos.value > 0 ?
                                    Math.round(metrics.ingresos.value / (metrics.reservas.value || 1)) : 0
                                }
                            </div>
                            <div className="text-sm text-gray-600">Ingreso promedio por reserva</div>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {metrics.ocupacionActual.percentage}%
                            </div>
                            <div className="text-sm text-gray-600">Ocupación actual</div>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {chartData.attendanceTrend.length > 0 ?
                                    Math.round(chartData.attendanceTrend.reduce((sum, day) => sum + day.asistencia, 0) / chartData.attendanceTrend.length) : 0
                                }
                            </div>
                            <div className="text-sm text-gray-600">Asistencia diaria promedio</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;