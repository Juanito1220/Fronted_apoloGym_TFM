import React, { useState, useEffect } from 'react';
import { useReservations } from '../../hooks/useReservations';
import ClassAvailabilityList from './ClassAvailabilityList';
import MyBookingsTable from './MyBookingsTable';
import BookingFilters from './BookingFilters';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const ReservationManager = () => {
    const {
        availableClasses,
        myBookings,
        systemInfo,
        loading,
        bookingLoading,
        error,
        loadAvailableClasses,
        loadMyBookings,
        bookClass,
        cancelBooking,
        getClassCapacity,
        hasConflictingBooking,
        getBookingStats,
        ACTIVITY_TYPES,
        BOOKING_STATUS
    } = useReservations();

    const [activeTab, setActiveTab] = useState('available'); // 'available' | 'mybookings'
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0],
        activity: 'all',
        room: 'all',
        timeSlot: 'all'
    });

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const stats = getBookingStats();

    // Cargar clases disponibles cuando cambien los filtros
    useEffect(() => {
        if (activeTab === 'available') {
            const filterParams = {
                date: filters.date,
                ...(filters.activity !== 'all' && { activity: filters.activity }),
                ...(filters.room !== 'all' && { room: filters.room })
            };
            loadAvailableClasses(filterParams);
        }
    }, [filters, activeTab, loadAvailableClasses]);

    const handleBookClass = async (classData) => {
        // Verificar conflictos de horario
        if (hasConflictingBooking(classData.date, classData.startTime)) {
            alert('Ya tienes una reserva en este horario');
            return;
        }

        // Verificar disponibilidad
        if (classData.available <= 0) {
            alert('Esta clase ya está completa');
            return;
        }

        setSelectedClass(classData);
        setShowBookingModal(true);
    };

    const confirmBooking = async () => {
        if (!selectedClass) return;

        const result = await bookClass(selectedClass.id);

        if (result.success) {
            setShowBookingModal(false);
            setSelectedClass(null);
            alert('¡Reserva confirmada exitosamente!');
        } else {
            alert(result.error || 'Error al realizar la reserva');
        }
    };

    const handleCancelBooking = async (bookingId, reason = '') => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        const result = await cancelBooking(bookingId, reason);

        if (result.success) {
            alert('Reserva cancelada exitosamente');
        } else {
            alert(result.error || 'Error al cancelar la reserva');
        }
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    if (loading && availableClasses.length === 0 && myBookings.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Cargando reservas..." />
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
                                <h1 className="text-3xl font-bold text-gray-900">Reservas y Turnos</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Gestiona tus reservas y descubre nuevas clases disponibles
                                </p>
                            </div>

                            {/* Stats Dashboard */}
                            <div className="hidden sm:flex items-center space-x-6 text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                                    <div className="text-gray-600">Próximas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
                                    <div className="text-gray-600">Esta semana</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                                    <div className="text-gray-600">Total</div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="mt-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('available')}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'available'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Clases Disponibles
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('mybookings')}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'mybookings'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Mis Reservas ({stats.upcoming})
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6">
                        <ErrorMessage
                            message={error}
                            onRetry={() => {
                                if (activeTab === 'available') {
                                    loadAvailableClasses(filters);
                                } else {
                                    loadMyBookings();
                                }
                            }}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Filters */}
                    {activeTab === 'available' && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6">
                                <BookingFilters
                                    filters={filters}
                                    systemInfo={systemInfo}
                                    onFiltersChange={handleFiltersChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className={activeTab === 'available' ? 'lg:col-span-3' : 'lg:col-span-4'}>
                        {activeTab === 'available' ? (
                            <ClassAvailabilityList
                                classes={availableClasses}
                                loading={loading}
                                onBookClass={handleBookClass}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                hasConflictingBooking={hasConflictingBooking}
                            />
                        ) : (
                            <MyBookingsTable
                                bookings={myBookings}
                                loading={loading}
                                onCancelBooking={handleCancelBooking}
                                stats={stats}
                                BOOKING_STATUS={BOOKING_STATUS}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            {showBookingModal && selectedClass && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Confirmar Reserva
                                </h3>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Actividad:</span>
                                    <span className="font-medium">{selectedClass.activityName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fecha:</span>
                                    <span className="font-medium">{new Date(selectedClass.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Horario:</span>
                                    <span className="font-medium">{selectedClass.startTime} - {selectedClass.endTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Instructor:</span>
                                    <span className="font-medium">{selectedClass.trainer.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sala:</span>
                                    <span className="font-medium">{selectedClass.room.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Disponibilidad:</span>
                                    <span className={`font-medium ${selectedClass.available > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {selectedClass.available} cupos disponibles
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Precio:</span>
                                    <span className="font-medium text-blue-600">€{selectedClass.price}</span>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmBooking}
                                    disabled={bookingLoading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {bookingLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Reservando...
                                        </div>
                                    ) : (
                                        'Confirmar Reserva'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationManager;