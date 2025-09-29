import React, { useState, useEffect } from 'react';

const NotificacionesAforo = ({ globalSummary, aforoStatus }) => {
    const [notifications, setNotifications] = useState([]);
    const [previousSummary, setPreviousSummary] = useState({});

    useEffect(() => {
        // Detectar cambios en el estado del aforo
        const newNotifications = [];

        // Verificar salas que se vuelven críticas
        Object.entries(aforoStatus).forEach(([sala, data]) => {
            const previous = previousSummary[sala];

            if (previous && previous.alertLevel !== 'critical' && data.alertLevel === 'critical') {
                newNotifications.push({
                    id: Date.now() + Math.random(),
                    type: 'critical',
                    title: `¡Sala ${sala} completa!`,
                    message: `La sala ${sala} ha alcanzado su capacidad máxima (${data.maxCapacity} personas)`,
                    timestamp: new Date(),
                    autoClose: false
                });
            }

            if (previous && previous.alertLevel !== 'warning' && data.alertLevel === 'warning') {
                newNotifications.push({
                    id: Date.now() + Math.random(),
                    type: 'warning',
                    title: `Alerta en ${sala}`,
                    message: `La sala ${sala} está próxima a su capacidad máxima (${data.percentage}%)`,
                    timestamp: new Date(),
                    autoClose: true
                });
            }

            // Notificar cuando una sala crítica vuelve a tener espacio
            if (previous && previous.alertLevel === 'critical' && data.alertLevel !== 'critical') {
                newNotifications.push({
                    id: Date.now() + Math.random(),
                    type: 'success',
                    title: `${sala} disponible nuevamente`,
                    message: `La sala ${sala} ahora tiene ${data.available} espacios disponibles`,
                    timestamp: new Date(),
                    autoClose: true
                });
            }
        });

        if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Mantener solo las últimas 10
        }

        setPreviousSummary(aforoStatus);
    }, [aforoStatus, previousSummary]);

    // Auto-remover notificaciones después de 10 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setNotifications(prev =>
                prev.filter(notification => {
                    if (notification.autoClose) {
                        const age = Date.now() - notification.timestamp.getTime();
                        return age < 10000; // 10 segundos
                    }
                    return true;
                })
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            <div className="flex justify-end mb-2">
                <button
                    onClick={clearAll}
                    className="text-xs text-gray-500 hover:text-gray-700 bg-white px-2 py-1 rounded shadow"
                >
                    Limpiar todas
                </button>
            </div>

            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-lg shadow-lg border-l-4 bg-white animate-slide-in ${notification.type === 'critical' ? 'border-red-500' :
                            notification.type === 'warning' ? 'border-yellow-500' :
                                notification.type === 'success' ? 'border-green-500' :
                                    'border-blue-500'
                        }`}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {notification.type === 'critical' && (
                                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            )}
                            {notification.type === 'warning' && (
                                <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            )}
                            {notification.type === 'success' && (
                                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className={`text-sm font-semibold ${notification.type === 'critical' ? 'text-red-800' :
                                    notification.type === 'warning' ? 'text-yellow-800' :
                                        notification.type === 'success' ? 'text-green-800' :
                                            'text-blue-800'
                                }`}>
                                {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {notification.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                        <button
                            onClick={() => dismissNotification(notification.id)}
                            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}

            <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default NotificacionesAforo;