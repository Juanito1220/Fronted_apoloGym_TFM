import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationCard = ({ notification, onMarkAsRead, onDelete, viewMode = 'list' }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMarkingRead, setIsMarkingRead] = useState(false);

    const handleMarkAsRead = async () => {
        if (notification.read || isMarkingRead) return;

        setIsMarkingRead(true);
        try {
            await onMarkAsRead(notification.id);
        } finally {
            setIsMarkingRead(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            await onDelete(notification.id);
        } finally {
            setIsDeleting(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'membership':
                return (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'class':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'payment':
                return (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'system':
                return (
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'promotion':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Alta
                    </span>
                );
            case 'medium':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Media
                    </span>
                );
            case 'low':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Baja
                    </span>
                );
            default:
                return null;
        }
    };

    const getTypeBadge = (type) => {
        const typeLabels = {
            membership: 'Membresía',
            class: 'Clases',
            payment: 'Pagos',
            system: 'Sistema',
            promotion: 'Promoción'
        };

        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {typeLabels[type] || type}
            </span>
        );
    };

    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: es
    });

    if (viewMode === 'grid') {
        return (
            <div
                className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${notification.read
                        ? 'border-gray-200 opacity-75'
                        : 'border-blue-200 shadow-sm'
                    }`}
            >
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>

                        <div className="flex items-center space-x-1">
                            {getPriorityBadge(notification.priority)}

                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Eliminar notificación"
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="cursor-pointer"
                        onClick={handleMarkAsRead}
                    >
                        <h3 className={`text-sm font-medium mb-2 ${notification.read ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                            {notification.title}
                        </h3>

                        <p className={`text-sm mb-3 line-clamp-3 ${notification.read ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                            {notification.message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{timeAgo}</span>
                        {getTypeBadge(notification.type)}
                    </div>
                </div>
            </div>
        );
    }

    // List view
    return (
        <div
            className={`bg-white rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${notification.read
                    ? 'border-l-gray-300 opacity-75'
                    : 'border-l-blue-500 shadow-sm'
                }`}
        >
            <div className="p-4">
                <div className="flex items-start justify-between">
                    {/* Main content */}
                    <div
                        className="flex-1 cursor-pointer"
                        onClick={handleMarkAsRead}
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            {getTypeIcon(notification.type)}

                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'
                                        }`}>
                                        {notification.title}
                                    </h3>

                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}

                                    {getPriorityBadge(notification.priority)}
                                    {getTypeBadge(notification.type)}
                                </div>

                                <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'
                                    }`}>
                                    {notification.message}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>{timeAgo}</span>

                            {isMarkingRead && (
                                <span className="text-blue-600">Marcando como leída...</span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                            <button
                                onClick={handleMarkAsRead}
                                disabled={isMarkingRead}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                                title="Marcar como leída"
                            >
                                {isMarkingRead ? '...' : 'Marcar leída'}
                            </button>
                        )}

                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Eliminar notificación"
                        >
                            {isDeleting ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;