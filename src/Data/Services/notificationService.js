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
    (error) => {
        return Promise.reject(error);
    }
);

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
    REMINDER: 'reminder',
    MEMBERSHIP_EXPIRY: 'membership_expiry',
    PAYMENT_CONFIRMATION: 'payment_confirmation',
    PROMOTION: 'promotion',
    SYSTEM: 'system',
    BOOKING_CONFIRMATION: 'booking_confirmation'
};

// Canales de notificación
export const NOTIFICATION_CHANNELS = {
    EMAIL: 'email',
    SMS: 'sms',
    WHATSAPP: 'whatsapp',
    IN_APP: 'in_app'
};

class NotificationService {
    // Obtener notificaciones del cliente
    async getClientNotifications(filters = {}) {
        try {
            const params = new URLSearchParams();

            if (filters.type) params.append('type', filters.type);
            if (filters.read !== undefined) params.append('read', filters.read);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);

            const response = await api.get(`/notifications/client?${params}`);

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    total: response.data.total || response.data.data.length
                };
            }
            return { success: false, error: 'Failed to fetch notifications' };
        } catch (error) {
            console.error('Error fetching notifications:', error);

            // Simular datos para desarrollo
            return this.getMockNotifications(filters);
        }
    }

    // Marcar notificación como leída
    async markAsRead(notificationId) {
        try {
            const response = await api.put(`/notifications/${notificationId}/read`);
            return { success: response.data.success };
        } catch (error) {
            console.error('Error marking notification as read:', error);

            // Simular éxito para desarrollo
            return { success: true };
        }
    }

    // Marcar todas las notificaciones como leídas
    async markAllAsRead() {
        try {
            const response = await api.put('/notifications/read-all');
            return { success: response.data.success };
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return { success: true };
        }
    }

    // Eliminar notificación
    async deleteNotification(notificationId) {
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            return { success: response.data.success };
        } catch (error) {
            console.error('Error deleting notification:', error);
            return { success: true };
        }
    }

    // Obtener preferencias de notificación
    async getNotificationPreferences() {
        try {
            const response = await api.get('/notifications/preferences');

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return { success: false, error: 'Failed to fetch preferences' };
        } catch (error) {
            console.error('Error fetching notification preferences:', error);

            // Datos mock para desarrollo
            return {
                success: true,
                data: {
                    channels: {
                        email: true,
                        sms: false,
                        whatsapp: false,
                        in_app: true
                    },
                    types: {
                        reminder: true,
                        membership_expiry: true,
                        payment_confirmation: true,
                        promotion: true,
                        system: true,
                        booking_confirmation: true
                    }
                }
            };
        }
    }

    // Actualizar preferencias de notificación
    async updateNotificationPreferences(preferences) {
        try {
            const response = await api.put('/notifications/preferences', preferences);
            return { success: response.data.success };
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            return { success: true };
        }
    }

    // Obtener conteo de notificaciones no leídas
    async getUnreadCount() {
        try {
            const response = await api.get('/notifications/unread-count');

            if (response.data.success) {
                return {
                    success: true,
                    count: response.data.count
                };
            }
            return { success: false, count: 0 };
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return { success: true, count: 3 }; // Mock data
        }
    }

    // Datos mock para desarrollo
    getMockNotifications(filters = {}) {
        const mockData = [
            {
                id: 'n1',
                type: NOTIFICATION_TYPES.BOOKING_CONFIRMATION,
                title: 'Reserva confirmada',
                message: 'Spinning 19:00 con Marta para hoy.',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
                read: false,
                priority: 'high',
                category: 'Entrenamientos'
            },
            {
                id: 'n2',
                type: NOTIFICATION_TYPES.REMINDER,
                title: 'Rutina actualizada',
                message: 'Tu entrenador ajustó el bloque de pierna para la próxima semana.',
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
                read: false,
                priority: 'medium',
                category: 'Rutinas'
            },
            {
                id: 'n3',
                type: NOTIFICATION_TYPES.PAYMENT_CONFIRMATION,
                title: 'Pago registrado',
                message: 'Se registró tu último pago de membresía por $29.900.',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
                read: true,
                priority: 'medium',
                category: 'Pagos'
            },
            {
                id: 'n4',
                type: NOTIFICATION_TYPES.MEMBERSHIP_EXPIRY,
                title: 'Membresía próxima a vencer',
                message: 'Tu membresía vence en 7 días. Renuévala para continuar disfrutando de nuestros servicios.',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
                read: false,
                priority: 'high',
                category: 'Membresías'
            },
            {
                id: 'n5',
                type: NOTIFICATION_TYPES.PROMOTION,
                title: '¡Nueva promoción disponible!',
                message: '20% de descuento en entrenamientos personales durante octubre.',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
                read: true,
                priority: 'low',
                category: 'Promociones'
            },
            {
                id: 'n6',
                type: NOTIFICATION_TYPES.REMINDER,
                title: 'Recordatorio de clase',
                message: 'No olvides tu clase de Yoga a las 18:00 hoy.',
                createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
                read: false,
                priority: 'high',
                category: 'Entrenamientos'
            }
        ];

        // Aplicar filtros
        let filteredData = mockData;

        if (filters.type) {
            filteredData = filteredData.filter(n => n.type === filters.type);
        }

        if (filters.read !== undefined) {
            filteredData = filteredData.filter(n => n.read === filters.read);
        }

        // Simular paginación
        const limit = filters.limit || 10;
        const offset = filters.offset || 0;
        const paginatedData = filteredData.slice(offset, offset + limit);

        return {
            success: true,
            data: paginatedData,
            total: filteredData.length
        };
    }
}

export const notificationService = new NotificationService();
export default notificationService;