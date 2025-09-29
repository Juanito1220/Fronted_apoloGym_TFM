// src/Componentes/Admin/SimpleDashboard.js
import React from 'react';
import { FiDollarSign, FiCalendar, FiUserPlus, FiUsers } from 'react-icons/fi';
import { listPayments } from '../../Data/Stores/pagos.store';
import { listBookings } from '../../Data/Stores/reservas.store';
import { listUsers } from '../../Data/Stores/usuario.store';
import { listAttendance } from '../../Data/Stores/aforo.store';

const SimpleDashboard = () => {
    // Obtener datos directamente de los stores
    const payments = listPayments();
    const bookings = listBookings();
    const users = listUsers();
    const attendance = listAttendance();

    // Calcular métricas básicas
    const totalIngresos = payments.reduce((sum, payment) => sum + (Number(payment.total) || 0), 0);
    const totalReservas = bookings.length;
    const nuevosUsuarios = users.filter(user => {
        const createdAt = new Date(user.createdAt || user.ts || Date.now());
        const thisMonth = new Date();
        return createdAt.getMonth() === thisMonth.getMonth() && createdAt.getFullYear() === thisMonth.getFullYear();
    }).length;
    const visitasHoy = attendance.filter(record => {
        const today = new Date().toISOString().split('T')[0];
        return record.ts && record.ts.startsWith(today);
    }).length;

    const MetricCard = ({ title, value, icon: Icon, color, suffix = '' }) => (
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            {title}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                            {value.toLocaleString()}{suffix}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard del Gimnasio</h1>
                    <p className="text-gray-600">Resumen de métricas principales</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Ingresos Totales"
                        value={totalIngresos}
                        icon={FiDollarSign}
                        color="border-green-400"
                        suffix=" €"
                    />
                    <MetricCard
                        title="Total Reservas"
                        value={totalReservas}
                        icon={FiCalendar}
                        color="border-blue-400"
                    />
                    <MetricCard
                        title="Nuevos Usuarios"
                        value={nuevosUsuarios}
                        icon={FiUserPlus}
                        color="border-purple-400"
                    />
                    <MetricCard
                        title="Visitas Hoy"
                        value={visitasHoy}
                        icon={FiUsers}
                        color="border-orange-400"
                    />
                </div>

                {/* Tablas de datos recientes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pagos recientes */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Pagos Recientes</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.slice(0, 5).map((payment, index) => (
                                        <tr key={payment.id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Usuario #{payment.userId?.slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                €{payment.total}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(payment.ts).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Reservas recientes */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Reservas Recientes</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sala
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hora
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.slice(0, 5).map((booking, index) => (
                                        <tr key={booking.id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {booking.sala || 'No especificada'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.fecha}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.hora}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleDashboard;