import React, { useState } from 'react';
import { CreditCard, Calendar, CheckCircle, XCircle, Clock, Star, Shield } from 'lucide-react';

const MembershipHistory = ({ membershipHistory, loading }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'expired'

    // Filtrar membresías
    const filteredMemberships = membershipHistory.filter(membership => {
        if (filter === 'all') return true;
        return membership.status === filter;
    });

    // Formatear fecha
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Calcular días restantes para membresías activas
    const getDaysRemaining = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Obtener estado y color de la membresía
    const getMembershipStatus = (membership) => {
        const now = new Date();
        const endDate = new Date(membership.endDate);

        if (membership.status === 'active' && endDate > now) {
            const daysRemaining = getDaysRemaining(membership.endDate);
            if (daysRemaining <= 7) {
                return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
            }
            return { status: 'active', color: 'bg-green-100 text-green-800', icon: CheckCircle };
        } else {
            return { status: 'expired', color: 'bg-red-100 text-red-800', icon: XCircle };
        }
    };

    // Obtener icono del plan
    const getPlanIcon = (planName) => {
        if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('vip')) {
            return Star;
        } else if (planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('plus')) {
            return Shield;
        }
        return CreditCard;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <h3 className="text-lg font-bold text-gray-900">Historial de Membresías</h3>

                    {/* Filtro por estado */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {[
                            { key: 'all', label: 'Todas' },
                            { key: 'active', label: 'Activas' },
                            { key: 'expired', label: 'Expiradas' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === key
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4">
                {filteredMemberships.length === 0 ? (
                    <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No se encontraron membresías</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMemberships.map((membership) => {
                            const statusInfo = getMembershipStatus(membership);
                            const PlanIcon = getPlanIcon(membership.planName);
                            const daysRemaining = membership.status === 'active' ? getDaysRemaining(membership.endDate) : null;

                            return (
                                <div
                                    key={membership.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusInfo.status === 'active' ? 'bg-blue-100' :
                                                        statusInfo.status === 'expiring' ? 'bg-yellow-100' : 'bg-gray-100'
                                                    }`}>
                                                    <PlanIcon className={`w-6 h-6 ${statusInfo.status === 'active' ? 'text-blue-600' :
                                                            statusInfo.status === 'expiring' ? 'text-yellow-600' : 'text-gray-600'
                                                        }`} />
                                                </div>
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                        {membership.planName}
                                                    </h4>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                                                        <statusInfo.icon className="w-3 h-3" />
                                                        {statusInfo.status === 'active' ? 'Activa' :
                                                            statusInfo.status === 'expiring' ? 'Por vencer' : 'Expirada'}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Inicio: {formatDate(membership.startDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Fin: {formatDate(membership.endDate)}</span>
                                                    </div>
                                                </div>

                                                {/* Características del plan */}
                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-500 mb-2">Características incluidas:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {membership.features.map((feature, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Información de días restantes para membresías activas */}
                                                {membership.status === 'active' && daysRemaining !== null && (
                                                    <div className={`mt-2 p-2 rounded-md text-sm ${daysRemaining <= 7 ? 'bg-yellow-50 text-yellow-700' :
                                                            daysRemaining <= 30 ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                                                        }`}>
                                                        {daysRemaining > 0 ? (
                                                            <>
                                                                <Clock className="inline w-4 h-4 mr-1" />
                                                                {daysRemaining === 1 ? 'Vence mañana' :
                                                                    daysRemaining <= 7 ? `Vence en ${daysRemaining} días` :
                                                                        `${daysRemaining} días restantes`}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="inline w-4 h-4 mr-1" />
                                                                Membresía expirada
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                ${membership.price}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {membership.planName.toLowerCase().includes('anual') ? 'anual' : 'mensual'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Resumen de gastos */}
            {membershipHistory.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Resumen de Gastos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Total invertido:</span>
                                <span className="ml-2 font-semibold text-gray-900">
                                    ${membershipHistory.reduce((sum, m) => sum + m.price, 0).toFixed(2)}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Membresías activas:</span>
                                <span className="ml-2 font-semibold text-green-600">
                                    {membershipHistory.filter(m => m.status === 'active').length}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Membresías totales:</span>
                                <span className="ml-2 font-semibold text-gray-900">
                                    {membershipHistory.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipHistory;