import React, { useState, useEffect } from 'react';
import { paymentsService, attendanceService } from '../../Data/Services/membershipService';

const PaymentHistoryView = () => {
    const [payments, setPayments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('payments');
    const [dateFilter, setDateFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [paymentsResponse, attendanceResponse] = await Promise.all([
                paymentsService.getPaymentHistory(),
                attendanceService.getAttendanceHistory()
            ]);

            if (paymentsResponse.success) {
                setPayments(paymentsResponse.data);
            }

            if (attendanceResponse.success) {
                setAttendance(attendanceResponse.data);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async (paymentId) => {
        try {
            await paymentsService.downloadReceipt(paymentId);
        } catch (err) {
            console.error('Error downloading receipt:', err);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { color: 'bg-green-100 text-green-800', text: 'Completado' },
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
            failed: { color: 'bg-red-100 text-red-800', text: 'Fallido' },
            refunded: { color: 'bg-gray-100 text-gray-800', text: 'Reembolsado' }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'card':
                return (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" />
                    </svg>
                );
            case 'transfer':
                return (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 4a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                );
            case 'cash':
                return (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const filteredPayments = payments.filter(payment => {
        const dateMatch = dateFilter === 'all' || (() => {
            const paymentDate = new Date(payment.processedAt);
            const now = new Date();

            switch (dateFilter) {
                case 'last_month':
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    return paymentDate >= lastMonth;
                case 'last_3_months':
                    const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                    return paymentDate >= last3Months;
                case 'last_year':
                    const lastYear = new Date(now.getFullYear() - 1, 0, 1);
                    return paymentDate >= lastYear;
                default:
                    return true;
            }
        })();

        const statusMatch = statusFilter === 'all' || payment.status === statusFilter;

        return dateMatch && statusMatch;
    });

    const filteredAttendance = attendance.filter(record => {
        if (dateFilter === 'all') return true;

        const recordDate = new Date(record.fecha);
        const now = new Date();

        switch (dateFilter) {
            case 'last_month':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return recordDate >= lastMonth;
            case 'last_3_months':
                const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                return recordDate >= last3Months;
            case 'last_year':
                const lastYear = new Date(now.getFullYear() - 1, 0, 1);
                return recordDate >= lastYear;
            default:
                return true;
        }
    });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow p-6">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Historial</h1>
                <p className="text-gray-600">Revisa tu historial de pagos y asistencia al gimnasio</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Historial de Pagos
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'attendance'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Historial de Asistencia
                    </button>
                </nav>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Período
                        </label>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos los períodos</option>
                            <option value="last_month">Último mes</option>
                            <option value="last_3_months">Últimos 3 meses</option>
                            <option value="last_year">Último año</option>
                        </select>
                    </div>

                    {activeTab === 'payments' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="completed">Completado</option>
                                <option value="pending">Pendiente</option>
                                <option value="failed">Fallido</option>
                                <option value="refunded">Reembolsado</option>
                            </select>
                        </div>
                    )}

                    <div className="flex items-end">
                        <button
                            onClick={fetchData}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'payments' ? (
                /* Payments Tab */
                <div className="space-y-4">
                    {filteredPayments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin pagos registrados</h3>
                            <p className="text-gray-600">No se encontraron pagos para el período seleccionado.</p>
                        </div>
                    ) : (
                        filteredPayments.map((payment) => (
                            <div key={payment.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-gray-400">
                                                {getPaymentMethodIcon(payment.method)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{payment.planName}</h3>
                                                <p className="text-sm text-gray-600">ID: {payment.transactionId}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">${payment.amount}</div>
                                            <div className="text-sm text-gray-600">{new Date(payment.processedAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Estado
                                            </label>
                                            <div className="mt-1">
                                                {getStatusBadge(payment.status)}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Método
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900 capitalize">{payment.method}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Comprobante
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">{payment.receipt}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Cliente
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900">{payment.customerName}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            Procesado el {new Date(payment.processedAt).toLocaleString()}
                                        </div>
                                        <button
                                            onClick={() => handleDownloadReceipt(payment.id)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>Descargar Comprobante</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Attendance Tab */
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredAttendance.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin registros de asistencia</h3>
                            <p className="text-gray-600">No se encontraron visitas para el período seleccionado.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actividad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hora Entrada
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hora Salida
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Duración
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAttendance.map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(record.fecha).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {record.actividad || 'Entrenamiento General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.horaEntrada || '--:--'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.horaSalida || '--:--'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.duracion || 'En progreso'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Summary Stats */}
            {activeTab === 'payments' && filteredPayments.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-medium text-gray-500">Total Pagado</div>
                        <div className="text-2xl font-bold text-gray-900">
                            ${filteredPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-medium text-gray-500">Número de Pagos</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {filteredPayments.length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm font-medium text-gray-500">Último Pago</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {filteredPayments.length > 0
                                ? new Date(Math.max(...filteredPayments.map(p => new Date(p.processedAt)))).toLocaleDateString()
                                : 'N/A'
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentHistoryView;