import { useState, useEffect, useCallback } from 'react';
import { reservationService, ACTIVITY_TYPES, BOOKING_STATUS } from '../Data/Services/reservationService';
import { useAuth } from '../Auth/AuthContext';

export const useReservations = () => {
    const { user } = useAuth();
    const [availableClasses, setAvailableClasses] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBbookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const [systemInfo, setSystemInfo] = useState({
        activities: [],
        rooms: [],
        trainers: [],
        timeSlots: []
    });

    // Cargar información del sistema
    const loadSystemInfo = useCallback(async () => {
        try {
            const response = await reservationService.getSystemInfo();
            if (response.success) {
                setSystemInfo(response.data);
            }
        } catch (err) {
            console.error('Error loading system info:', err);
        }
    }, []);

    // Cargar clases disponibles
    const loadAvailableClasses = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await reservationService.getAvailableClasses(filters);

            if (response.success) {
                setAvailableClasses(response.data);
            } else {
                setError(response.error);
                setAvailableClasses([]);
            }
        } catch (err) {
            setError('Error de conexión al cargar clases');
            setAvailableClasses([]);
            console.error('Error loading available classes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar mis reservas
    const loadMyBookings = useCallback(async (filters = {}) => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await reservationService.getMyBookings(user.id, filters);

            if (response.success) {
                setMyBookings(response.data);
            } else {
                setError(response.error);
                setMyBookings([]);
            }
        } catch (err) {
            setError('Error de conexión al cargar reservas');
            setMyBookings([]);
            console.error('Error loading my bookings:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Reservar clase
    const bookClass = useCallback(async (scheduleId) => {
        if (!user?.id) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            setBbookingLoading(true);
            setError(null);

            const response = await reservationService.bookClass(scheduleId, user.id);

            if (response.success) {
                // Recargar datos después de una reserva exitosa
                loadMyBookings();
                loadAvailableClasses(); // Para actualizar disponibilidad

                return {
                    success: true,
                    data: response.data,
                    message: response.message
                };
            } else {
                return {
                    success: false,
                    error: response.error,
                    code: response.code
                };
            }
        } catch (err) {
            console.error('Error booking class:', err);
            return {
                success: false,
                error: 'Error de conexión al realizar la reserva'
            };
        } finally {
            setBbookingLoading(false);
        }
    }, [user?.id, loadMyBookings, loadAvailableClasses]);

    // Cancelar reserva
    const cancelBooking = useCallback(async (bookingId, reason = '') => {
        try {
            setBbookingLoading(true);
            setError(null);

            const response = await reservationService.cancelBooking(bookingId, reason);

            if (response.success) {
                // Actualizar el estado local inmediatamente
                setMyBookings(prev =>
                    prev.map(booking =>
                        booking.id === bookingId
                            ? { ...booking, status: BOOKING_STATUS.CANCELLED, cancelledAt: new Date().toISOString() }
                            : booking
                    )
                );

                // Recargar para asegurar consistencia
                loadMyBookings();
                loadAvailableClasses(); // Para actualizar disponibilidad

                return {
                    success: true,
                    message: response.message
                };
            } else {
                return {
                    success: false,
                    error: response.error,
                    code: response.code
                };
            }
        } catch (err) {
            console.error('Error cancelling booking:', err);
            return {
                success: false,
                error: 'Error de conexión al cancelar la reserva'
            };
        } finally {
            setBbookingLoading(false);
        }
    }, [loadMyBookings, loadAvailableClasses]);

    // Obtener aforo de clase
    const getClassCapacity = useCallback(async (scheduleId) => {
        try {
            const response = await reservationService.getClassCapacity(scheduleId);
            return response;
        } catch (err) {
            console.error('Error getting class capacity:', err);
            return {
                success: false,
                error: 'Error al obtener información de aforo'
            };
        }
    }, []);

    // Verificar si el usuario ya tiene una reserva en un horario específico
    const hasConflictingBooking = useCallback((date, startTime) => {
        return myBookings.some(booking =>
            booking.date === date &&
            booking.startTime === startTime &&
            booking.status === BOOKING_STATUS.CONFIRMED
        );
    }, [myBookings]);

    // Obtener estadísticas de reservas
    const getBookingStats = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];

        const stats = {
            total: myBookings.length,
            upcoming: myBookings.filter(b => b.date >= today && b.status === BOOKING_STATUS.CONFIRMED).length,
            completed: myBookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length,
            cancelled: myBookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length,
            thisWeek: 0,
            thisMonth: 0
        };

        // Calcular reservas de esta semana y este mes
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        stats.thisWeek = myBookings.filter(b => {
            const bookingDate = new Date(b.date);
            return bookingDate >= startOfWeek && b.status === BOOKING_STATUS.CONFIRMED;
        }).length;

        stats.thisMonth = myBookings.filter(b => {
            const bookingDate = new Date(b.date);
            return bookingDate >= startOfMonth && b.status === BOOKING_STATUS.CONFIRMED;
        }).length;

        return stats;
    }, [myBookings]);

    // Efectos
    useEffect(() => {
        loadSystemInfo();
    }, [loadSystemInfo]);

    useEffect(() => {
        if (user?.id) {
            loadMyBookings();
        }
    }, [user?.id, loadMyBookings]);

    // Auto-recargar cada 2 minutos para mantener disponibilidad actualizada
    useEffect(() => {
        const interval = setInterval(() => {
            if (availableClasses.length > 0) {
                loadAvailableClasses();
            }
        }, 120000); // 2 minutos

        return () => clearInterval(interval);
    }, [availableClasses.length, loadAvailableClasses]);

    return {
        // Datos
        availableClasses,
        myBookings,
        systemInfo,
        loading,
        bookingLoading,
        error,

        // Acciones
        loadAvailableClasses,
        loadMyBookings,
        bookClass,
        cancelBooking,
        getClassCapacity,

        // Utilidades
        hasConflictingBooking,
        getBookingStats,

        // Constantes
        ACTIVITY_TYPES,
        BOOKING_STATUS
    };
};

// Hook específico para obtener solo las próximas reservas (para dashboards)
export const useUpcomingBookings = () => {
    const { user } = useAuth();
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadUpcomingBookings = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const response = await reservationService.getMyBookings(user.id, { upcoming: true });

            if (response.success) {
                // Ordenar por fecha y hora más próxima
                const sortedBookings = response.data
                    .filter(booking => booking.status === BOOKING_STATUS.CONFIRMED)
                    .sort((a, b) => {
                        const dateTimeA = new Date(a.date + 'T' + a.startTime);
                        const dateTimeB = new Date(b.date + 'T' + b.startTime);
                        return dateTimeA - dateTimeB;
                    })
                    .slice(0, 3); // Solo las próximas 3

                setUpcomingBookings(sortedBookings);
            }
        } catch (err) {
            console.error('Error loading upcoming bookings:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadUpcomingBookings();
    }, [loadUpcomingBookings]);

    return {
        upcomingBookings,
        loading,
        refresh: loadUpcomingBookings
    };
};

export default useReservations;