// src/Data/Services/dashboardService.js
import { format } from 'date-fns';
import mockDataStore from '../mockDataStore';

class DashboardService {
    constructor() {
        this.baseUrl = '/api/v1/metrics';
    }

    /**
     * Obtiene métricas del dashboard (RF008) - SIMULADO COMO API
     * GET /api/v1/metrics/dashboard
     */
    async getDashboardMetrics(timeRange = 'today') {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            // Datos mockeados que simulan respuesta del API
            const mockData = this.generateMockMetrics(timeRange);
            return mockData;
        } catch (error) {
            console.error('Error getting dashboard metrics:', error);
            throw error;
        }
    }

    /**
     * Genera datos mock consistentes para las métricas usando mockDataStore
     */
    generateMockMetrics(timeRange) {
        // Obtener datos consistentes del store
        const metrics = mockDataStore.getMetricsForTimeRange(timeRange);
        const occupancy = mockDataStore.getCurrentOccupancy();

        // Calcular cambios vs período anterior (simulado consistentemente)
        const changeFactors = {
            today: { ingresos: 8.5, reservas: 12.3, usuarios: -2.1 },
            week: { ingresos: 15.2, reservas: 18.7, usuarios: 25.4 },
            month: { ingresos: 22.8, reservas: 16.5, usuarios: 31.2 },
            last30days: { ingresos: 19.6, reservas: 14.8, usuarios: 28.9 }
        };

        const changes = changeFactors[timeRange] || changeFactors.month;

        return {
            ingresos: {
                value: metrics.ingresos,
                currency: '$',
                change: changes.ingresos,
                trend: changes.ingresos > 0 ? 'up' : 'down'
            },
            reservas: {
                value: metrics.reservas,
                change: changes.reservas,
                trend: changes.reservas > 0 ? 'up' : 'down'
            },
            nuevosRegistros: {
                value: metrics.nuevosRegistros,
                change: changes.usuarios,
                trend: changes.usuarios > 0 ? 'up' : 'down'
            },
            ocupacionActual: {
                value: occupancy.current,
                max: occupancy.max,
                percentage: Math.round((occupancy.current / occupancy.max) * 100),
                status: occupancy.current > 80 ? 'high' :
                    occupancy.current > 50 ? 'medium' : 'low'
            }
        };
    }    /**
     * Genera datos mock para gráfico de tendencia de asistencia usando mockDataStore
     */
    generateMockAttendanceTrend() {
        return mockDataStore.getAttendanceTrendData();
    }

    /**
     * Genera datos mock para gráfico de uso por categorías usando mockDataStore
     */
    generateMockUsageByCategory() {
        return mockDataStore.getUsageByCategoryData();
    }

    /**
     * Genera datos mock para gráfico de ingresos mensuales usando mockDataStore
     */
    generateMockMonthlyRevenue() {
        return mockDataStore.getMonthlyRevenueData();
    }

    /**
     * Genera datos mock para gráfico de asistencia por hora usando mockDataStore
     */
    generateMockAttendanceByHour() {
        return mockDataStore.getAttendanceByHourData();
    }

    /**
     * Obtiene datos para gráficos de uso (RF008) - SIMULADO COMO API
     * GET /api/v1/metrics/usage-chart
     */
    async getUsageChartData(period = 'last30days') {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Generar datos mock para los gráficos
            const chartData = {
                attendanceTrend: this.generateMockAttendanceTrend(),
                usageByCategory: this.generateMockUsageByCategory(),
                monthlyRevenue: this.generateMockMonthlyRevenue(),
                attendanceByHour: this.generateMockAttendanceByHour()
            };

            return chartData;
        } catch (error) {
            console.error('Error getting usage chart data:', error);
            throw error;
        }
    }

    /**
     * Genera reporte financiero (RF007) - SIMULADO COMO API
     * GET /api/v1/reports/financial
     */
    async generateFinancialReport(startDate, endDate) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Calcular días del período
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            // Generar datos mock realistas basados en el período
            const avgDailyRevenue = 620;
            const totalIngresos = Math.round(avgDailyRevenue * days * (0.8 + Math.random() * 0.4));
            const totalTransacciones = Math.round(days * (2 + Math.random() * 6));
            const ingresoPromedio = totalTransacciones > 0 ? totalIngresos / totalTransacciones : 0;

            // Generar detalles mock
            const detalles = [];
            const usuarios = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 'Sofia Chen'];
            const metodos = ['tarjeta', 'efectivo', 'transferencia', 'paypal'];

            for (let i = 0; i < Math.min(totalTransacciones, 50); i++) {
                const fecha = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
                detalles.push({
                    id: `pay_${i + 1}`,
                    usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
                    total: [30, 50, 80, 120][Math.floor(Math.random() * 4)],
                    method: metodos[Math.floor(Math.random() * metodos.length)],
                    fecha: format(fecha, 'dd/MM/yyyy HH:mm'),
                    ts: fecha.toISOString()
                });
            }

            const reportData = {
                summary: {
                    totalIngresos,
                    totalTransacciones,
                    ingresoPromedio: Math.round(ingresoPromedio),
                    periodo: { startDate, endDate }
                },
                detalles,
                porMetodoPago: {
                    'tarjeta': Math.round(totalIngresos * 0.45),
                    'efectivo': Math.round(totalIngresos * 0.25),
                    'transferencia': Math.round(totalIngresos * 0.20),
                    'paypal': Math.round(totalIngresos * 0.10)
                },
                ingresosPorDia: this.generateMockDailyRevenue(start, end)
            };

            return reportData;
        } catch (error) {
            console.error('Error generating financial report:', error);
            throw error;
        }
    }

    /**
     * Genera reporte de uso/asistencia (RF007) - SIMULADO COMO API
     * GET /api/v1/reports/usage
     */
    async generateUsageReport(startDate, endDate) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 900));

        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            // Generar datos mock realistas
            const avgDailyVisits = 45;
            const totalVisitas = Math.round(avgDailyVisits * days * (0.7 + Math.random() * 0.6));
            const totalReservas = Math.round(totalVisitas * 0.8); // 80% de visitas tienen reserva
            const usuariosUnicos = Math.round(totalVisitas * 0.6); // Usuarios frecuentes

            const usuariosMasActivos = [
                { usuario: 'María García', visitas: Math.round(15 + Math.random() * 10) },
                { usuario: 'Carlos López', visitas: Math.round(12 + Math.random() * 8) },
                { usuario: 'Ana Martín', visitas: Math.round(10 + Math.random() * 7) },
                { usuario: 'Juan Pérez', visitas: Math.round(8 + Math.random() * 6) },
                { usuario: 'Sofia Chen', visitas: Math.round(7 + Math.random() * 5) }
            ];

            const reservasPorSala = {
                'Sala Cardio': Math.round(totalReservas * 0.25),
                'Sala Pesas': Math.round(totalReservas * 0.22),
                'Sala Grupal': Math.round(totalReservas * 0.18),
                'Spinning': Math.round(totalReservas * 0.15),
                'CrossFit': Math.round(totalReservas * 0.12),
                'Funcional': Math.round(totalReservas * 0.08)
            };

            const patronesAsistencia = {
                weekday: Math.round(totalVisitas * 0.72),
                weekend: Math.round(totalVisitas * 0.28),
                morning: Math.round(totalVisitas * 0.35),
                afternoon: Math.round(totalVisitas * 0.25),
                evening: Math.round(totalVisitas * 0.40)
            };

            const reportData = {
                summary: {
                    totalVisitas,
                    totalReservas,
                    usuariosUnicos,
                    periodo: { startDate, endDate }
                },
                usuariosMasActivos,
                reservasPorSala,
                patronesAsistencia,
                asistenciaPorDia: this.generateMockDailyAttendance(start, end),
                asistenciaPorHora: this.generateMockAttendanceByHour()
            };

            return reportData;
        } catch (error) {
            console.error('Error generating usage report:', error);
            throw error;
        }
    }

    /**
     * Genera ingresos diarios mock para reportes
     */
    generateMockDailyRevenue(start, end) {
        const data = {};
        const current = new Date(start);

        while (current <= end) {
            const dateKey = format(current, 'yyyy-MM-dd');
            const baseRevenue = 620;
            const variation = 0.3;
            const dailyRevenue = Math.round(baseRevenue * (1 + (Math.random() - 0.5) * variation));

            data[dateKey] = dailyRevenue;
            current.setDate(current.getDate() + 1);
        }

        return data;
    }

    /**
     * Genera asistencia diaria mock para reportes
     */
    generateMockDailyAttendance(start, end) {
        const data = {};
        const current = new Date(start);

        while (current <= end) {
            const dateKey = format(current, 'yyyy-MM-dd');
            const dayOfWeek = current.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const baseAttendance = isWeekend ? 35 : 55;
            const variation = Math.floor(Math.random() * 20) - 10;

            data[dateKey] = Math.max(15, baseAttendance + variation);
            current.setDate(current.getDate() + 1);
        }

        return data;
    }
}

// Instancia singleton del servicio
export const dashboardService = new DashboardService();
export default dashboardService;