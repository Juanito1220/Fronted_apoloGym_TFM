// src/hooks/useNotifications.js
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useNotifications = () => {

    const showNotification = useCallback((message, type = 'info') => {
        console.log('🔔 Showing toast notification:', type, message);

        switch (type) {
            case 'success':
                return toast.success(message);
            case 'error':
                return toast.error(message);
            case 'warning':
                return toast(message, {
                    icon: '⚠️',
                    style: {
                        borderLeft: '4px solid #f59e0b',
                    },
                });
            case 'info':
            default:
                return toast(message, {
                    icon: 'ℹ️',
                    style: {
                        borderLeft: '4px solid #3b82f6',
                    },
                });
        }
    }, []);

    const showSuccess = useCallback((message) => {
        return toast.success(message);
    }, []);

    const showError = useCallback((message) => {
        return toast.error(message);
    }, []);

    const showWarning = useCallback((message) => {
        return toast(message, {
            icon: '⚠️',
            style: {
                borderLeft: '4px solid #f59e0b',
            },
        });
    }, []);

    const showInfo = useCallback((message) => {
        return toast(message, {
            icon: 'ℹ️',
            style: {
                borderLeft: '4px solid #3b82f6',
            },
        });
    }, []);

    const removeNotification = useCallback((id) => {
        toast.dismiss(id);
    }, []);

    const clearAll = useCallback(() => {
        toast.dismiss();
    }, []);

    return {
        notifications: [], // Mantenemos compatibilidad pero react-hot-toast maneja el estado
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
        clearAll
    };
};