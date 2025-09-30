import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Tipos de actividades disponibles
export const ACTIVITY_TYPES = {
    YOGA: 'yoga',
    SPINNING: 'spinning',
    FUNCIONAL: 'funcional',
    CARDIO: 'cardio',
    PESAS: 'pesas',
    CROSSFIT: 'crossfit',
    PILATES: 'pilates',
    ZUMBA: 'zumba'
};

// Estados de reserva
export const BOOKING_STATUS = {
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    NO_SHOW: 'no_show'
};

// Datos mock para desarrollo
const MOCK_TRAINERS = [
    { id: 1, name: 'Ana García', specialties: ['yoga', 'pilates'] },
    { id: 2, name: 'Luis Martín', specialties: ['cardio', 'funcional'] },
    { id: 3, name: 'Pablo Ruiz', specialties: ['funcional', 'crossfit'] },
    { id: 4, name: 'Marta López', specialties: ['spinning', 'zumba'] },
    { id: 5, name: 'Carlos Sánchez', specialties: ['pesas', 'crossfit'] }
];

const MOCK_ROOMS = [
    { id: 1, name: 'Sala de Pesas', capacity: 20, equipment: ['Rack #1', 'Rack #2', 'Banco #1'] },
    { id: 2, name: 'Sala de Cardio', capacity: 15, equipment: ['Cinta #1', 'Cinta #2', 'Cinta #3'] },
    { id: 3, name: 'Sala Funcional', capacity: 12, equipment: ['Caja #1', 'TRX #1', 'Kettlebells'] },
    { id: 4, name: 'Sala de Spinning', capacity: 20, equipment: ['Bike #1', 'Bike #2', 'Bike #3'] },
    { id: 5, name: 'Sala Polivalente', capacity: 25, equipment: ['Espejo', 'Esterillas', 'Música'] }
];

// Generar horarios mock para una fecha específica
const generateMockSchedule = (date) => {
    const schedules = [];
    const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '17:00', '18:00', '19:00', '20:00'];
    const activities = Object.values(ACTIVITY_TYPES);

    timeSlots.forEach((time, index) => {
        const activity = activities[index % activities.length];
        const trainer = MOCK_TRAINERS[index % MOCK_TRAINERS.length];
        const room = MOCK_ROOMS[index % MOCK_ROOMS.length];
        const capacity = room.capacity;
        const occupied = Math.floor(Math.random() * capacity * 0.8); // 80% máximo ocupación

        schedules.push({
            id: `schedule_${date}_${time}_${index}`,
            date,
            startTime: time,
            endTime: addHour(time),
            activity,
            activityName: activity.charAt(0).toUpperCase() + activity.slice(1),
            trainer: {
                id: trainer.id,
                name: trainer.name
            },
            room: {
                id: room.id,
                name: room.name,
                equipment: room.equipment[0] // Primer equipo disponible
            },
            capacity,
            occupied,
            available: capacity - occupied,
            price: Math.floor(Math.random() * 20) + 10, // Entre 10 y 30 euros
            description: `Clase de ${activity} con ${trainer.name}`,
            level: ['Principiante', 'Intermedio', 'Avanzado'][Math.floor(Math.random() * 3)],
            isAvailable: (capacity - occupied) > 0
        });
    });

    return schedules;
};

// Función auxiliar para añadir una hora
const addHour = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const nextHour = (hours + 1) % 24;
    return `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Generar reservas mock del usuario
const generateMockBookings = (userId) => {
    const bookings = [];
    const today = new Date();

    // Reservas pasadas
    for (let i = 1; i <= 3; i++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i);

        bookings.push({
            id: `booking_past_${i}`,
            userId,
            scheduleId: `schedule_${pastDate.toISOString().split('T')[0]}_18:00_${i}`,
            date: pastDate.toISOString().split('T')[0],
            startTime: '18:00',
            endTime: '19:00',
            activity: Object.values(ACTIVITY_TYPES)[i % Object.values(ACTIVITY_TYPES).length],
            activityName: Object.values(ACTIVITY_TYPES)[i % Object.values(ACTIVITY_TYPES).length].charAt(0).toUpperCase() + Object.values(ACTIVITY_TYPES)[i % Object.values(ACTIVITY_TYPES).length].slice(1),
            trainer: MOCK_TRAINERS[i % MOCK_TRAINERS.length],
            room: MOCK_ROOMS[i % MOCK_ROOMS.length],
            status: BOOKING_STATUS.COMPLETED,
            bookedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            price: 15
        });
    }

    // Reservas futuras
    for (let i = 1; i <= 2; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);

        bookings.push({
            id: `booking_future_${i}`,
            userId,
            scheduleId: `schedule_${futureDate.toISOString().split('T')[0]}_19:00_${i}`,
            date: futureDate.toISOString().split('T')[0],
            startTime: '19:00',
            endTime: '20:00',
            activity: Object.values(ACTIVITY_TYPES)[i % Object.values(ACTIVITY_TYPES).length],
            activityName: Object.values(ACTIVITY_TYPES)[i % Object.values(ACTIVITY_TYPES).length].charAt(0).toUpperCase() + Object.values(ACTIVITY_TYPES)[i % Object.values(ACTIVITY_TYPES).length].slice(1),
            trainer: MOCK_TRAINERS[i % MOCK_TRAINERS.length],
            room: MOCK_ROOMS[i % MOCK_ROOMS.length],
            status: BOOKING_STATUS.CONFIRMED,
            bookedAt: new Date().toISOString(),
            price: 20,
            canCancel: true
        });
    }

    return bookings.sort((a, b) => new Date(b.date + 'T' + b.startTime) - new Date(a.date + 'T' + a.startTime));
};

// Servicios de API
export const reservationService = {
    // Obtener clases/sesiones disponibles
    async getAvailableClasses(filters = {}) {
        try {
            const { date = new Date().toISOString().split('T')[0], activity, room } = filters;

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 300));

            let schedules = generateMockSchedule(date);

            // Aplicar filtros
            if (activity && activity !== 'all') {
                schedules = schedules.filter(s => s.activity === activity);
            }

            if (room && room !== 'all') {
                schedules = schedules.filter(s => s.room.id === parseInt(room));
            }

            return {
                success: true,
                data: schedules,
                message: 'Clases disponibles obtenidas correctamente'
            };
        } catch (error) {
            console.error('Error fetching available classes:', error);
            return {
                success: false,
                error: 'Error al obtener las clases disponibles',
                data: []
            };
        }
    },

    // Procesar reserva de clase
    async bookClass(scheduleId, userId) {
        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simular validaciones
            const random = Math.random();
            if (random < 0.1) { // 10% chance de error
                return {
                    success: false,
                    error: 'La clase ya está completa',
                    code: 'CLASS_FULL'
                };
            }

            if (random < 0.15) { // 5% chance de conflicto
                return {
                    success: false,
                    error: 'Ya tienes una reserva en este horario',
                    code: 'TIME_CONFLICT'
                };
            }

            const booking = {
                id: `booking_${Date.now()}`,
                userId,
                scheduleId,
                status: BOOKING_STATUS.CONFIRMED,
                bookedAt: new Date().toISOString(),
                confirmationCode: Math.random().toString(36).substr(2, 8).toUpperCase()
            };

            return {
                success: true,
                data: booking,
                message: 'Reserva confirmada exitosamente'
            };
        } catch (error) {
            console.error('Error booking class:', error);
            return {
                success: false,
                error: 'Error al procesar la reserva'
            };
        }
    },

    // Obtener reservas del cliente
    async getMyBookings(userId, filters = {}) {
        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 200));

            let bookings = generateMockBookings(userId);

            // Aplicar filtros
            if (filters.status) {
                bookings = bookings.filter(b => b.status === filters.status);
            }

            if (filters.upcoming) {
                const today = new Date().toISOString().split('T')[0];
                bookings = bookings.filter(b => b.date >= today);
            }

            return {
                success: true,
                data: bookings,
                message: 'Reservas obtenidas correctamente'
            };
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return {
                success: false,
                error: 'Error al obtener las reservas',
                data: []
            };
        }
    },

    // Cancelar reserva
    async cancelBooking(bookingId, reason = '') {
        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 400));

            // Simular validación de cancelación
            const random = Math.random();
            if (random < 0.1) { // 10% chance de error
                return {
                    success: false,
                    error: 'No se puede cancelar la reserva (menos de 2 horas antes)',
                    code: 'CANCELLATION_DENIED'
                };
            }

            return {
                success: true,
                data: {
                    bookingId,
                    status: BOOKING_STATUS.CANCELLED,
                    cancelledAt: new Date().toISOString(),
                    reason
                },
                message: 'Reserva cancelada exitosamente'
            };
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return {
                success: false,
                error: 'Error al cancelar la reserva'
            };
        }
    },

    // Obtener aforo de clase específica
    async getClassCapacity(scheduleId) {
        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 150));

            const capacity = Math.floor(Math.random() * 20) + 10; // Entre 10 y 30
            const occupied = Math.floor(Math.random() * capacity * 0.9); // Hasta 90% ocupación

            return {
                success: true,
                data: {
                    scheduleId,
                    capacity,
                    occupied,
                    available: capacity - occupied,
                    occupancyRate: Math.round((occupied / capacity) * 100),
                    lastUpdated: new Date().toISOString()
                },
                message: 'Información de aforo obtenida'
            };
        } catch (error) {
            console.error('Error fetching class capacity:', error);
            return {
                success: false,
                error: 'Error al obtener información de aforo'
            };
        }
    },

    // Obtener información de actividades y salas
    async getSystemInfo() {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            return {
                success: true,
                data: {
                    activities: Object.entries(ACTIVITY_TYPES).map(([key, value]) => ({
                        id: value,
                        name: value.charAt(0).toUpperCase() + value.slice(1),
                        key
                    })),
                    rooms: MOCK_ROOMS,
                    trainers: MOCK_TRAINERS,
                    timeSlots: ['06:00', '07:00', '08:00', '09:00', '10:00', '17:00', '18:00', '19:00', '20:00']
                }
            };
        } catch (error) {
            console.error('Error fetching system info:', error);
            return {
                success: false,
                error: 'Error al obtener información del sistema'
            };
        }
    }
};

export default reservationService;