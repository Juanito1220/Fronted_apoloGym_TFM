// src/Data/mockDataStore.js
import { format, subDays } from 'date-fns';

/**
 * Store centralizado para datos mock consistentes en toda la aplicación
 * Simula una base de datos en memoria con datos coherentes
 */
class MockDataStore {
    constructor() {
        this.initialized = false;
        // Usar una semilla fija para consistencia en la sesión
        this.sessionSeed = Date.now();
        this.data = {
            users: [],
            payments: [],
            bookings: [],
            attendance: [],
            metrics: {},
            lastGenerated: null
        };
        this.seedConsistentData();
    }

    /**
     * Genera datos consistentes que se mantienen durante toda la sesión
     */
    seedConsistentData() {
        if (this.initialized) return;

        console.log('🔄 Generando datos mock consistentes...');

        this.generateUsers();
        this.generatePayments();
        this.generateBookings();
        this.generateAttendance();
        this.calculateConsistentMetrics();

        this.initialized = true;
        this.lastGenerated = new Date();

        console.log('✅ Datos mock consistentes generados');
    }

    /**
     * Genera usuarios consistentes
     */
    generateUsers() {
        this.data.users = [
            { id: 'user_001', nombre: 'María García', email: 'maria.garcia@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 120) },
            { id: 'user_002', nombre: 'Carlos López', email: 'carlos.lopez@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 95) },
            { id: 'user_003', nombre: 'Ana Martín', email: 'ana.martin@email.com', rol: 'entrenador', activo: true, createdAt: subDays(new Date(), 200) },
            { id: 'user_004', nombre: 'Juan Pérez', email: 'juan.perez@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 80) },
            { id: 'user_005', nombre: 'Sofia Chen', email: 'sofia.chen@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 45) },
            { id: 'user_006', nombre: 'Diego Morales', email: 'diego.morales@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 60) },
            { id: 'user_007', nombre: 'Laura Vega', email: 'laura.vega@email.com', rol: 'entrenador', activo: true, createdAt: subDays(new Date(), 180) },
            { id: 'user_008', nombre: 'Miguel Torres', email: 'miguel.torres@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 30) },
            { id: 'user_009', nombre: 'Carmen Silva', email: 'carmen.silva@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 15) },
            { id: 'user_010', nombre: 'Roberto Vargas', email: 'roberto.vargas@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 5) },
            { id: 'user_011', nombre: 'Elena Ruiz', email: 'elena.ruiz@email.com', rol: 'cliente', activo: true, createdAt: subDays(new Date(), 2) },
            { id: 'user_012', nombre: 'Fernando Castro', email: 'fernando.castro@email.com', rol: 'cliente', activo: true, createdAt: new Date() }
        ];
    }

    /**
     * Genera pagos consistentes con patrones realistas
     */
    generatePayments() {
        const plans = [
            { id: 1, name: 'Básico', price: 30 },
            { id: 2, name: 'Premium', price: 50 },
            { id: 3, name: 'VIP', price: 80 },
            { id: 4, name: 'Anual', price: 120 }
        ];

        const methods = ['tarjeta', 'efectivo', 'transferencia', 'paypal'];
        const clients = this.data.users.filter(u => u.rol === 'cliente');

        this.data.payments = [];
        let paymentId = 1;

        // Generar pagos de los últimos 6 meses
        for (let i = 180; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dayOfMonth = date.getDate();

            // Más pagos los primeros días del mes (renovaciones)
            let paymentsToday = 0;
            if (dayOfMonth <= 2) paymentsToday = this.seededRandom(3, 8); // 3-8 pagos
            else if (dayOfMonth <= 5) paymentsToday = this.seededRandom(1, 4); // 1-4 pagos
            else if (dayOfMonth <= 15) paymentsToday = this.seededRandom(0, 3); // 0-3 pagos
            else paymentsToday = this.seededRandom(0, 2); // 0-2 pagos

            for (let j = 0; j < paymentsToday; j++) {
                const client = clients[this.seededRandom(0, clients.length - 1)];
                const plan = plans[this.seededRandom(0, plans.length - 1)];
                const method = methods[this.seededRandom(0, methods.length - 1)];

                this.data.payments.push({
                    id: `pay_${paymentId.toString().padStart(3, '0')}`,
                    userId: client.id,
                    planId: plan.id,
                    total: plan.price,
                    method: method,
                    ts: date.toISOString(),
                    status: 'completed'
                });
                paymentId++;
            }
        }
    }

    /**
     * Genera reservas consistentes
     */
    generateBookings() {
        const salas = ['Sala Cardio', 'Sala Pesas', 'Sala Grupal', 'Spinning', 'CrossFit', 'Funcional'];
        const horarios = ['08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
        const clients = this.data.users.filter(u => u.rol === 'cliente');

        this.data.bookings = [];
        let bookingId = 1;

        // Generar reservas de los últimos 30 días
        for (let i = 30; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            // Menos reservas en fines de semana
            const bookingsToday = isWeekend ?
                this.seededRandom(8, 15) :
                this.seededRandom(15, 25);

            for (let j = 0; j < bookingsToday; j++) {
                const client = clients[this.seededRandom(0, clients.length - 1)];
                const sala = salas[this.seededRandom(0, salas.length - 1)];
                const hora = horarios[this.seededRandom(0, horarios.length - 1)];

                this.data.bookings.push({
                    id: `book_${bookingId.toString().padStart(3, '0')}`,
                    userId: client.id,
                    fecha: format(date, 'yyyy-MM-dd'),
                    hora: hora,
                    sala: sala,
                    maquina: `${sala} - Equipo ${this.seededRandom(1, 6)}`,
                    status: 'confirmada',
                    ts: date.toISOString()
                });
                bookingId++;
            }
        }
    }

    /**
     * Genera registros de asistencia consistentes
     */
    generateAttendance() {
        const clients = this.data.users.filter(u => u.rol === 'cliente');
        this.data.attendance = [];
        let attendanceId = 1;

        // Generar asistencia basada en las reservas
        this.data.bookings.forEach(booking => {
            const bookingDate = new Date(booking.fecha + 'T' + booking.hora);

            // 85% probabilidad de asistir a la reserva
            if (this.seededRandom(0, 1) < 0.85) {
                // Entrada (puede llegar 5-15 min antes)
                const entradaTime = new Date(bookingDate.getTime() - this.seededRandom(5, 15) * 60000);

                this.data.attendance.push({
                    id: `att_${attendanceId.toString().padStart(4, '0')}`,
                    userId: booking.userId,
                    action: 'entrada',
                    area: 'recepcion',
                    ts: entradaTime.toISOString()
                });

                // Salida (sesión de 45-90 minutos)
                const sessionDuration = this.seededRandom(45, 90) * 60000;
                const salidaTime = new Date(entradaTime.getTime() + sessionDuration);

                this.data.attendance.push({
                    id: `att_${(attendanceId + 1).toString().padStart(4, '0')}`,
                    userId: booking.userId,
                    action: 'salida',
                    area: 'recepcion',
                    ts: salidaTime.toISOString()
                });

                attendanceId += 2;
            }
        });

        // Agregar algunas visitas sin reserva (walk-ins)
        for (let i = 15; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const walkIns = this.seededRandom(5, 12);

            for (let j = 0; j < walkIns; j++) {
                const client = clients[this.seededRandom(0, clients.length - 1)];
                const hora = this.seededRandom(6, 21); // 6 AM - 9 PM
                const minutos = this.seededRandom(0, 59);

                const entradaTime = new Date(date);
                entradaTime.setHours(hora, minutos, 0, 0);

                const sessionDuration = this.seededRandom(30, 120) * 60000;
                const salidaTime = new Date(entradaTime.getTime() + sessionDuration);

                this.data.attendance.push({
                    id: `att_${attendanceId.toString().padStart(4, '0')}`,
                    userId: client.id,
                    action: 'entrada',
                    area: 'recepcion',
                    ts: entradaTime.toISOString()
                }, {
                    id: `att_${(attendanceId + 1).toString().padStart(4, '0')}`,
                    userId: client.id,
                    action: 'salida',
                    area: 'recepcion',
                    ts: salidaTime.toISOString()
                });

                attendanceId += 2;
            }
        }
    }

    /**
     * Calcula métricas consistentes basadas en los datos generados
     */
    calculateConsistentMetrics() {
        const now = new Date();

        // Métricas por período
        this.data.metrics = {
            today: this.calculateMetricsForPeriod(now, now),
            week: this.calculateMetricsForPeriod(subDays(now, 7), now),
            month: this.calculateMetricsForPeriod(subDays(now, 30), now),
            last30days: this.calculateMetricsForPeriod(subDays(now, 30), now)
        };

        // Ocupación actual (simulada)
        this.data.metrics.currentOccupancy = {
            current: this.seededRandom(45, 85),
            max: 100
        };
    }

    /**
     * Calcula métricas para un período específico
     */
    calculateMetricsForPeriod(startDate, endDate) {
        const startStr = format(startDate, 'yyyy-MM-dd');
        const endStr = format(endDate, 'yyyy-MM-dd');

        // Filtrar pagos del período
        const periodPayments = this.data.payments.filter(p => {
            const paymentDate = format(new Date(p.ts), 'yyyy-MM-dd');
            return paymentDate >= startStr && paymentDate <= endStr;
        });

        // Filtrar reservas del período
        const periodBookings = this.data.bookings.filter(b => {
            return b.fecha >= startStr && b.fecha <= endStr;
        });

        // Filtrar nuevos usuarios del período
        const periodUsers = this.data.users.filter(u => {
            const userDate = format(new Date(u.createdAt), 'yyyy-MM-dd');
            return userDate >= startStr && userDate <= endStr;
        });

        // Filtrar asistencia del período
        const periodAttendance = this.data.attendance.filter(a => {
            const attendanceDate = format(new Date(a.ts), 'yyyy-MM-dd');
            return attendanceDate >= startStr && attendanceDate <= endStr;
        });

        return {
            ingresos: periodPayments.reduce((sum, p) => sum + p.total, 0),
            reservas: periodBookings.length,
            nuevosRegistros: periodUsers.length,
            asistencia: periodAttendance.filter(a => a.action === 'entrada').length
        };
    }

    /**
     * Función de random con semilla para consistencia
     */
    seededRandom(min, max) {
        if (typeof min === 'undefined') {
            // Generar entre 0 y 1
            const x = Math.sin(this.sessionSeed++) * 10000;
            return x - Math.floor(x);
        }

        const x = Math.sin(this.sessionSeed++) * 10000;
        const random = x - Math.floor(x);
        return Math.floor(random * (max - min + 1)) + min;
    }

    // Getters para acceso a los datos
    getUsers() { return [...this.data.users]; }
    getPayments() { return [...this.data.payments]; }
    getBookings() { return [...this.data.bookings]; }
    getAttendance() { return [...this.data.attendance]; }
    getMetrics() { return { ...this.data.metrics }; }

    // Métodos específicos para el dashboard
    getMetricsForTimeRange(timeRange) {
        return this.data.metrics[timeRange] || this.data.metrics.month;
    }

    getCurrentOccupancy() {
        return this.data.metrics.currentOccupancy;
    }

    // Generar datos para gráficos
    getAttendanceTrendData() {
        const data = [];
        for (let i = 29; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dateStr = format(date, 'yyyy-MM-dd');

            const dayAttendance = this.data.attendance.filter(a => {
                const attendanceDate = format(new Date(a.ts), 'yyyy-MM-dd');
                return attendanceDate === dateStr && a.action === 'entrada';
            }).length;

            data.push({
                date: format(date, 'dd/MM'),
                asistencia: dayAttendance,
                fullDate: dateStr
            });
        }
        return data;
    }

    getUsageByCategoryData() {
        const salaCounts = {};
        this.data.bookings.forEach(booking => {
            salaCounts[booking.sala] = (salaCounts[booking.sala] || 0) + 1;
        });

        const total = Object.values(salaCounts).reduce((sum, count) => sum + count, 0);

        return Object.entries(salaCounts).map(([name, value]) => ({
            name,
            value,
            percentage: Math.round((value / total) * 100)
        }));
    }

    getMonthlyRevenueData() {
        const monthlyData = {};

        this.data.payments.forEach(payment => {
            const month = format(new Date(payment.ts), 'yyyy-MM');
            monthlyData[month] = (monthlyData[month] || 0) + payment.total;
        });

        return Object.entries(monthlyData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, ingresos]) => ({
                month,
                ingresos,
                formattedMonth: format(new Date(month + '-01'), 'MMM yyyy')
            }));
    }

    getAttendanceByHourData() {
        const hourCounts = Array(24).fill(0);

        this.data.attendance
            .filter(a => a.action === 'entrada')
            .forEach(record => {
                const hour = new Date(record.ts).getHours();
                hourCounts[hour]++;
            });

        return hourCounts.map((visits, hour) => ({
            hour,
            visits,
            label: `${hour.toString().padStart(2, '0')}:00`
        }));
    }
}

// Instancia singleton
export const mockDataStore = new MockDataStore();
export default mockDataStore;