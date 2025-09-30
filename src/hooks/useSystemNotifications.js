import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../Data/Services/notificationService';

export const useSystemNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [allNotifications, setAllNotifications] = useState([]); // Todas las notificaciones sin filtrar
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [preferences, setPreferences] = useState(null);
    const [filters, setFilters] = useState({
        type: null,
        read: null
    });

    // Cargar notificaciones
    const loadNotifications = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true);
            setError(null);

            // Siempre cargar todas las notificaciones primero
            const allResponse = await notificationService.getClientNotifications({});

            if (allResponse.success) {
                setAllNotifications(allResponse.data);

                // Aplicar filtros localmente
                const finalFilters = { ...filters, ...customFilters };
                let filteredData = allResponse.data;

                if (finalFilters.type) {
                    filteredData = filteredData.filter(n => n.type === finalFilters.type);
                }

                if (finalFilters.read !== null) {
                    filteredData = filteredData.filter(n => n.read === finalFilters.read);
                }

                setNotifications(filteredData);
            } else {
                setError(allResponse.error || 'Error al cargar notificaciones');
            }
        } catch (err) {
            setError('Error de conexión al cargar notificaciones');
            console.error('Error loading notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Cargar conteo de no leídas
    const loadUnreadCount = useCallback(async () => {
        try {
            const response = await notificationService.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.count);
            }
        } catch (err) {
            console.error('Error loading unread count:', err);
        }
    }, []);

    // Cargar preferencias
    const loadPreferences = useCallback(async () => {
        try {
            const response = await notificationService.getNotificationPreferences();
            if (response.success) {
                setPreferences(response.data);
            }
        } catch (err) {
            console.error('Error loading preferences:', err);
        }
    }, []);

    // Marcar como leída
    const markAsRead = useCallback(async (notificationId) => {
        try {
            const response = await notificationService.markAsRead(notificationId);
            if (response.success) {
                // Actualizar ambos estados
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notificationId ? { ...n, read: true } : n
                    )
                );
                setAllNotifications(prev =>
                    prev.map(n =>
                        n.id === notificationId ? { ...n, read: true } : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
                return { success: true };
            }
            return { success: false, error: 'Error al marcar como leída' };
        } catch (err) {
            return { success: false, error: 'Error de conexión' };
        }
    }, []);

    // Marcar todas como leídas
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await notificationService.markAllAsRead();
            if (response.success) {
                // Actualizar ambos estados
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
                setAllNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
                setUnreadCount(0);
                return { success: true };
            }
            return { success: false, error: 'Error al marcar todas como leídas' };
        } catch (err) {
            return { success: false, error: 'Error de conexión' };
        }
    }, []);

    // Eliminar notificación
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            const response = await notificationService.deleteNotification(notificationId);
            if (response.success) {
                const notification = allNotifications.find(n => n.id === notificationId);

                // Actualizar ambos estados
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                setAllNotifications(prev => prev.filter(n => n.id !== notificationId));

                if (notification && !notification.read) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }

                return { success: true };
            }
            return { success: false, error: 'Error al eliminar notificación' };
        } catch (err) {
            return { success: false, error: 'Error de conexión' };
        }
    }, [allNotifications]);

    // Actualizar preferencias
    const updatePreferences = useCallback(async (newPreferences) => {
        try {
            const response = await notificationService.updateNotificationPreferences(newPreferences);
            if (response.success) {
                setPreferences(newPreferences);
                return { success: true };
            }
            return { success: false, error: 'Error al actualizar preferencias' };
        } catch (err) {
            return { success: false, error: 'Error de conexión' };
        }
    }, []);

    // Aplicar filtros
    const applyFilters = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    // Limpiar filtros
    const clearFilters = useCallback(() => {
        setFilters({ type: null, read: null });
    }, []);

    // Efectos
    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    useEffect(() => {
        loadUnreadCount();
        loadPreferences();
    }, [loadUnreadCount, loadPreferences]);

    // Aplicar filtros cuando cambien los filtros o todas las notificaciones
    useEffect(() => {
        if (allNotifications.length > 0) {
            let filteredData = allNotifications;

            if (filters.type) {
                filteredData = filteredData.filter(n => n.type === filters.type);
            }

            if (filters.read !== null) {
                filteredData = filteredData.filter(n => n.read === filters.read);
            }

            setNotifications(filteredData);
        }
    }, [filters, allNotifications]);

    // Actualizar conteo cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            loadUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [loadUnreadCount]);

    // Obtener estadísticas
    const getStats = useCallback(() => {
        // Estadísticas globales (todas las notificaciones)
        const total = allNotifications.length;
        const unread = allNotifications.filter(n => !n.read).length;
        const byType = allNotifications.reduce((acc, n) => {
            acc[n.type] = (acc[n.type] || 0) + 1;
            return acc;
        }, {});

        return {
            total,
            unread,
            read: total - unread,
            byType
        };
    }, [allNotifications]);

    return {
        // Datos
        notifications,
        unreadCount,
        loading,
        error,
        preferences,
        filters,

        // Acciones
        loadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
        applyFilters,
        clearFilters,

        // Utilidades
        getStats,
        refresh: loadNotifications
    };
};

// Hook para obtener solo el conteo de no leídas (para el badge)
export const useNotificationBadge = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const loadCount = async () => {
            try {
                const response = await notificationService.getUnreadCount();
                if (response.success) {
                    setUnreadCount(response.count);
                }
            } catch (err) {
                console.error('Error loading notification count:', err);
            }
        };

        loadCount();

        // Actualizar cada 30 segundos
        const interval = setInterval(loadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return unreadCount;
};

export default useSystemNotifications;