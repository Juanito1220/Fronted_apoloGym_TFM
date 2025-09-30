import React, { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const MyBookingsTable = ({ bookings, loading, onCancelBooking, stats, BOOKING_STATUS }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    const getStatusColor = (status) => {
        switch (status) {
            case BOOKING_STATUS.CONFIRMED:
                return 'bg-green-100 text-green-800';
            case BOOKING_STATUS.COMPLETED:
                return 'bg-blue-100 text-blue-800';
            case BOOKING_STATUS.CANCELLED:
                return 'bg-red-100 text-red-800';
            case BOOKING_STATUS.NO_SHOW:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case BOOKING_STATUS.CONFIRMED:
                return 'Confirmada';
            case BOOKING_STATUS.COMPLETED:
                return 'Completada';
            case BOOKING_STATUS.CANCELLED:
                return 'Cancelada';
            case BOOKING_STATUS.NO_SHOW:
                return 'No asistió';
            default:
                return 'Desconocido';
        }
    };

    const getActivityIcon = (activity) => {
        const icons = {
            yoga: '🧘‍♀️',
            spinning: '🚴‍♀️',
            funcional: '🏃‍♂️',
            cardio: '❤️',
            pesas: '🏋️‍♂️',
            crossfit: '💪',
            pilates: '🤸‍♀️',
            zumba: '💃'
        };
        return icons[activity] || '🏃‍♂️';
    };

    const canCancelBooking = (booking) => {
        if (booking.status !== BOOKING_STATUS.CONFIRMED) return false;

        const bookingDateTime = new Date(booking.date + 'T' + booking.startTime);
        const now = new Date();
        const hoursUntilClass = (bookingDateTime - now) / (1000 * 60 * 60);

        return hoursUntilClass > 2; // Permitir cancelación solo si faltan más de 2 horas
    };

    const isUpcoming = (booking) => {
        const bookingDateTime = new Date(booking.date + 'T' + booking.startTime);
        return bookingDateTime > new Date() && booking.status === BOOKING_STATUS.CONFIRMED;
    };

    const filteredBookings = bookings.filter(booking => {
        switch (filter) {
            case 'upcoming':
                return isUpcoming(booking);
            case 'completed':
                return booking.status === BOOKING_STATUS.COMPLETED;
            case 'cancelled':
                return booking.status === BOOKING_STATUS.CANCELLED;
            default:
                return true;
        }
    });

    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
        setCancelReason('');
    };

    const confirmCancellation = async () => {
        if (!selectedBooking) return;

        await onCancelBooking(selectedBooking.id, cancelReason);
        setShowCancelModal(false);
        setSelectedBooking(null);
        setCancelReason('');
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <LoadingSpinner size="lg" text="Cargando tus reservas..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Próximas</dt>
                                <dd className="text-2xl font-bold text-gray-900">{stats.upcoming}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Completadas</dt>
                                <dd className="text-2xl font-bold text-gray-900">{stats.completed}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Esta semana</dt>
                                <dd className="text-2xl font-bold text-gray-900">{stats.thisWeek}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                                <dd className="text-2xl font-bold text-gray-900">{stats.total}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">
                            Mis Reservas ({filteredBookings.length})
                        </h2>

                        {/* Filter Tabs */}
                        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                            {[
                                { key: 'all', label: 'Todas', count: bookings.length },
                                { key: 'upcoming', label: 'Próximas', count: stats.upcoming },
                                { key: 'completed', label: 'Completadas', count: stats.completed },
                                { key: 'cancelled', label: 'Canceladas', count: stats.cancelled }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${filter === tab.key
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden">
                    {loading && bookings.length > 0 && (
                        <div className="text-center py-4">
                            <LoadingSpinner size="sm" text="Actualizando reservas..." />
                        </div>
                    )}

                    {filteredBookings.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-4 text-sm font-medium text-gray-900">No hay reservas</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filter === 'all'
                                    ? 'Aún no has realizado ninguna reserva.'
                                    : `No tienes reservas ${filter === 'upcoming' ? 'próximas' : filter === 'completed' ? 'completadas' : 'canceladas'}.`
                                }
                            </p>
                        </div>
                    )}

                    {filteredBookings.length > 0 && (
                        <div className="divide-y divide-gray-200">
                            {filteredBookings.map((booking) => {
                                const canCancel = canCancelBooking(booking);
                                const upcoming = isUpcoming(booking);

                                return (
                                    <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            {/* Main Info */}
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{getActivityIcon(booking.activity)}</span>
                                                    <div>
                                                        <div className="text-xl font-bold text-gray-900">{booking.startTime}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(booking.date).toLocaleDateString('es-ES', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-l border-gray-200 pl-4">
                                                    <h3 className="text-lg font-medium text-gray-900">{booking.activityName}</h3>
                                                    <p className="text-sm text-gray-600">{booking.trainer.name} • {booking.room.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Reservado el {new Date(booking.bookedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {getStatusLabel(booking.status)}
                                                    </span>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        €{booking.price}
                                                    </div>
                                                </div>

                                                {/* Cancel Button - Now much more prominent */}
                                                {canCancel && (
                                                    <button
                                                        onClick={() => handleCancelClick(booking)}
                                                        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Cancelar Reserva
                                                    </button>
                                                )}

                                                {upcoming && !canCancel && (
                                                    <div className="text-xs text-gray-500 max-w-xs">
                                                        No se puede cancelar<br />
                                                        (menos de 2h antes)
                                                    </div>
                                                )}

                                                {booking.status === BOOKING_STATUS.CANCELLED && booking.cancelledAt && (
                                                    <div className="text-xs text-gray-500 max-w-xs">
                                                        Cancelada el<br />
                                                        {new Date(booking.cancelledAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Additional Info for upcoming bookings */}
                                        {upcoming && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center text-sm text-blue-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Recuerda llegar 10 minutos antes del inicio de la clase
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Booking Modal */}
            {showCancelModal && selectedBooking && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Cancelar Reserva
                                </h3>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <div className="flex">
                                        <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div className="text-sm text-yellow-800">
                                            <p className="font-medium">¿Estás seguro de que deseas cancelar esta reserva?</p>
                                            <p className="mt-1">Esta acción no se puede deshacer y el cupo será liberado para otros usuarios.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-md p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Detalles de la reserva:</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div><strong>Actividad:</strong> {selectedBooking.activityName}</div>
                                        <div><strong>Fecha:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</div>
                                        <div><strong>Horario:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}</div>
                                        <div><strong>Instructor:</strong> {selectedBooking.trainer.name}</div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo de cancelación (opcional)
                                    </label>
                                    <textarea
                                        id="cancelReason"
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Ejemplo: Surgió un imprevisto, cambio de planes, etc."
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Mantener Reserva
                                </button>
                                <button
                                    onClick={confirmCancellation}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Confirmar Cancelación
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookingsTable;