import React, { useState } from 'react';
import { useSystemNotifications } from '../../hooks/useSystemNotifications';
import NotificationCard from './NotificationCard';
import NotificationFilters from './NotificationFilters';
import NotificationPreferences from './NotificationPreferences';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const NotificationCenter = () => {
    const {
        notifications,
        loading,
        error,
        preferences,
        filters,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
        applyFilters,
        clearFilters,
        getStats,
        refresh
    } = useSystemNotifications();

    const [showPreferences, setShowPreferences] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

    const stats = getStats();

    const handleMarkAsRead = async (notificationId) => {
        const result = await markAsRead(notificationId);
        if (!result.success) {
            console.error('Error marking notification as read:', result.error);
        }
    };

    const handleMarkAllAsRead = async () => {
        const result = await markAllAsRead();
        if (!result.success) {
            console.error('Error marking all notifications as read:', result.error);
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        const result = await deleteNotification(notificationId);
        if (!result.success) {
            console.error('Error deleting notification:', result.error);
        }
    };

    const handleUpdatePreferences = async (newPreferences) => {
        const result = await updatePreferences(newPreferences);
        if (result.success) {
            setShowPreferences(false);
        } else {
            console.error('Error updating preferences:', result.error);
        }
    };

    if (loading && notifications.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Gestiona todas tus notificaciones y preferencias
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Stats */}
                                <div className="hidden sm:flex items-center space-x-6 text-sm">
                                    <span className="text-gray-600">
                                        Total: <span className="font-semibold text-gray-900">{stats.total}</span>
                                    </span>
                                    <span className="text-blue-600">
                                        No leídas: <span className="font-semibold">{stats.unread}</span>
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={refresh}
                                        disabled={loading}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Actualizar
                                    </button>

                                    {stats.unread > 0 && (
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Marcar todas como leídas
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setShowPreferences(true)}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Preferencias
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Filtros */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <NotificationFilters
                                filters={filters}
                                onFiltersChange={applyFilters}
                                onClearFilters={clearFilters}
                                stats={stats}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {error && (
                            <div className="mb-6">
                                <ErrorMessage
                                    message={error}
                                    onRetry={refresh}
                                />
                            </div>
                        )}

                        {/* View Mode Toggle */}
                        <div className="bg-white rounded-lg shadow mb-6">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Mis Notificaciones
                                    </h2>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-md ${viewMode === 'list'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-md ${viewMode === 'grid'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="p-6">
                                {loading && notifications.length > 0 && (
                                    <div className="text-center py-4">
                                        <LoadingSpinner size="sm" />
                                    </div>
                                )}

                                {notifications.length === 0 && !loading && (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h5v-5H4v5zM16 3H8L4 7v10h5V7h7V3z" />
                                        </svg>
                                        <h3 className="mt-4 text-sm font-medium text-gray-900">No hay notificaciones</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            No tienes notificaciones en este momento.
                                        </p>
                                    </div>
                                )}

                                {notifications.length > 0 && (
                                    <div className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                                            : 'space-y-4'
                                    }>
                                        {notifications.map((notification) => (
                                            <NotificationCard
                                                key={notification.id}
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                                onDelete={handleDeleteNotification}
                                                viewMode={viewMode}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences Modal */}
            {showPreferences && (
                <NotificationPreferences
                    preferences={preferences}
                    onUpdate={handleUpdatePreferences}
                    onClose={() => setShowPreferences(false)}
                />
            )}
        </div>
    );
};

export default NotificationCenter;