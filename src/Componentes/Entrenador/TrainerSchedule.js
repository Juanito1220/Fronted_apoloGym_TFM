import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Servicios simulados
import { listUsers } from '../../Data/Stores/usuario.store';

export default function TrainerSchedule() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('week'); // week, day, month
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        clientId: '',
        type: 'entrenamiento', // entrenamiento, evaluacion, consulta
        status: 'programado'
    });

    // Obtener clientes
    const clients = useMemo(() =>
        listUsers().filter(u => u.role === "cliente" && u.active !== false), []
    );

    // Eventos simulados del calendario
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Entrenamiento Personal - Juan Pérez',
            description: 'Sesión de fuerza - tren superior',
            date: '2024-01-15',
            startTime: '09:00',
            endTime: '10:00',
            clientId: 'client_1',
            type: 'entrenamiento',
            status: 'completado'
        },
        {
            id: 2,
            title: 'Evaluación Inicial - María García',
            description: 'Primera evaluación física y mediciones',
            date: '2024-01-15',
            startTime: '11:00',
            endTime: '12:00',
            clientId: 'client_2',
            type: 'evaluacion',
            status: 'programado'
        },
        {
            id: 3,
            title: 'Entrenamiento Personal - Carlos López',
            description: 'Rutina de cardio y resistencia',
            date: '2024-01-16',
            startTime: '08:00',
            endTime: '09:00',
            clientId: 'client_3',
            type: 'entrenamiento',
            status: 'programado'
        },
        {
            id: 4,
            title: 'Consulta Nutricional - Ana Martín',
            description: 'Revisión del plan alimenticio',
            date: '2024-01-16',
            startTime: '14:00',
            endTime: '14:30',
            clientId: 'client_4',
            type: 'consulta',
            status: 'programado'
        },
        {
            id: 5,
            title: 'Entrenamiento Grupal',
            description: 'Clase de funcional - 5 personas',
            date: '2024-01-17',
            startTime: '18:00',
            endTime: '19:00',
            clientId: '',
            type: 'entrenamiento',
            status: 'programado'
        }
    ]);

    // Obtener eventos del día
    const getDayEvents = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateString)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    // Generar días de la semana
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'entrenamiento':
                return 'bg-blue-100 border-blue-300 text-blue-800';
            case 'evaluacion':
                return 'bg-green-100 border-green-300 text-green-800';
            case 'consulta':
                return 'bg-purple-100 border-purple-300 text-purple-800';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completado':
                return 'bg-green-500';
            case 'programado':
                return 'bg-blue-500';
            case 'cancelado':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const openEventModal = (event = null) => {
        if (event) {
            setSelectedEvent(event);
            setEventForm({
                title: event.title,
                description: event.description,
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                clientId: event.clientId,
                type: event.type,
                status: event.status
            });
        } else {
            setSelectedEvent(null);
            setEventForm({
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
                clientId: '',
                type: 'entrenamiento',
                status: 'programado'
            });
        }
        setShowEventModal(true);
    };

    const saveEvent = () => {
        if (!eventForm.title || !eventForm.date || !eventForm.startTime || !eventForm.endTime) {
            toast.error('Complete todos los campos obligatorios');
            return;
        }

        if (eventForm.startTime >= eventForm.endTime) {
            toast.error('La hora de fin debe ser posterior a la hora de inicio');
            return;
        }

        const eventData = {
            ...eventForm,
            id: selectedEvent ? selectedEvent.id : Date.now()
        };

        if (selectedEvent) {
            setEvents(events.map(e => e.id === selectedEvent.id ? eventData : e));
            toast.success('Evento actualizado correctamente');
        } else {
            setEvents([...events, eventData]);
            toast.success('Evento creado correctamente');
        }

        setShowEventModal(false);
    };

    const deleteEvent = (eventId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este evento?')) {
            setEvents(events.filter(e => e.id !== eventId));
            toast.success('Evento eliminado correctamente');
        }
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        return client ? (client.nombre || client.email) : 'Cliente no encontrado';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Agenda del Entrenador</h2>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'day' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                                }`}
                        >
                            Día
                        </button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === 'week' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                                }`}
                        >
                            Semana
                        </button>
                    </div>

                    <button
                        onClick={() => openEventModal()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <FaPlus className="w-4 h-4 mr-2" />
                        Nuevo Evento
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                <button
                    onClick={() => navigateWeek(-1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    ← Anterior
                </button>

                <h3 className="text-lg font-semibold text-gray-900">
                    {viewMode === 'week' ? (
                        `Semana del ${getWeekDays()[0].toLocaleDateString('es-ES')} al ${getWeekDays()[6].toLocaleDateString('es-ES')}`
                    ) : (
                        formatDate(currentDate)
                    )}
                </h3>

                <button
                    onClick={() => navigateWeek(1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Siguiente →
                </button>
            </div>

            {/* Calendar View */}
            {viewMode === 'week' ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-gray-200">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                            <div key={day} className="p-4 text-center font-medium text-gray-900 bg-gray-50 border-r border-gray-200 last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 min-h-[400px]">
                        {getWeekDays().map((day, index) => {
                            const dayEvents = getDayEvents(day);
                            const isToday = day.toDateString() === new Date().toDateString();

                            return (
                                <div key={index} className="border-r border-gray-200 last:border-r-0 p-2 bg-gray-50">
                                    <div className={`text-center mb-2 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                                        {day.getDate()}
                                    </div>

                                    <div className="space-y-1">
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={() => openEventModal(event)}
                                                className={`p-2 rounded text-xs cursor-pointer border ${getEventTypeColor(event.type)} hover:shadow-sm transition-shadow`}
                                            >
                                                <div className="flex items-center space-x-1 mb-1">
                                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
                                                    <span className="font-medium truncate">{formatTime(event.startTime)}</span>
                                                </div>
                                                <div className="truncate">{event.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Eventos del {formatDate(currentDate)}
                        </h3>
                    </div>

                    <div className="p-4">
                        {getDayEvents(currentDate).length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No hay eventos programados para este día
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {getDayEvents(currentDate).map(event => (
                                    <div key={event.id} className={`border rounded-lg p-4 ${getEventTypeColor(event.type)}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}></div>
                                                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                                                    <span className="text-sm text-gray-600">
                                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                    </span>
                                                </div>

                                                {event.description && (
                                                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                                )}

                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <span className="flex items-center">
                                                        <FaClock className="w-4 h-4 mr-1" />
                                                        {Math.round((new Date(`1970-01-01T${event.endTime}`) - new Date(`1970-01-01T${event.startTime}`)) / 60000)} min
                                                    </span>

                                                    {event.clientId && (
                                                        <span className="flex items-center">
                                                            <FaUser className="w-4 h-4 mr-1" />
                                                            {getClientName(event.clientId)}
                                                        </span>
                                                    )}

                                                    <span className="capitalize bg-white bg-opacity-50 px-2 py-1 rounded">
                                                        {event.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 ml-4">
                                                <button
                                                    onClick={() => openEventModal(event)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteEvent(event.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">
                                {selectedEvent ? 'Editar Evento' : 'Nuevo Evento'}
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={eventForm.title}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Título del evento"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={eventForm.description}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Descripción del evento"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        value={eventForm.type}
                                        onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="entrenamiento">Entrenamiento</option>
                                        <option value="evaluacion">Evaluación</option>
                                        <option value="consulta">Consulta</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select
                                        value={eventForm.status}
                                        onChange={(e) => setEventForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="programado">Programado</option>
                                        <option value="completado">Completado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cliente
                                </label>
                                <select
                                    value={eventForm.clientId}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, clientId: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar cliente (opcional)</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.nombre || client.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha *
                                </label>
                                <input
                                    type="date"
                                    value={eventForm.date}
                                    onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hora inicio *
                                    </label>
                                    <input
                                        type="time"
                                        value={eventForm.startTime}
                                        onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hora fin *
                                    </label>
                                    <input
                                        type="time"
                                        value={eventForm.endTime}
                                        onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveEvent}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {selectedEvent ? 'Actualizar' : 'Crear'} Evento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}