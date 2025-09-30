import React, { useState, useEffect } from 'react';
import { membershipsService } from '../../Data/Services/membershipService';

const MembershipStatusCard = () => {
    const [membershipStatus, setMembershipStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMembershipStatus();
    }, []);

    const fetchMembershipStatus = async () => {
        try {
            setLoading(true);
            const response = await membershipsService.getMyMembershipStatus();

            if (response.success) {
                setMembershipStatus(response.data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching membership status:', err);
            setError('Error al cargar el estado de membresía');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        if (!membershipStatus) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Sin membresía
                </span>
            );
        }

        if (membershipStatus.isExpired) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Expirada
                </span>
            );
        }

        if (membershipStatus.isExpiringSoon) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Por vencer
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Activa
            </span>
        );
    };

    const getExpirationAlert = () => {
        if (!membershipStatus) return null;

        if (membershipStatus.isExpired) {
            return (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Membresía expirada
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Tu membresía expiró el {new Date(membershipStatus.expirationDate).toLocaleDateString()}. Renueva ahora para seguir disfrutando de todos los beneficios.</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (membershipStatus.isExpiringSoon) {
            return (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Membresía por vencer
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>Tu membresía vence en {membershipStatus.daysUntilExpiration} días ({new Date(membershipStatus.expirationDate).toLocaleDateString()}). ¡Renueva pronto!</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="text-red-600">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Estado de Membresía</h2>
                    {getStatusBadge()}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {membershipStatus ? (
                    <div className="space-y-4">
                        {/* Plan details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{membershipStatus.planName}</h3>
                            <p className="text-gray-600">{membershipStatus.membershipType}</p>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                                <p className="mt-1 text-sm text-gray-900">{new Date(membershipStatus.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha de vencimiento</label>
                                <p className="mt-1 text-sm text-gray-900">{new Date(membershipStatus.expirationDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Days remaining */}
                        {!membershipStatus.isExpired && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Días restantes</label>
                                <p className="mt-1 text-2xl font-bold text-blue-600">{membershipStatus.daysUntilExpiration}</p>
                            </div>
                        )}

                        {/* Benefits */}
                        {membershipStatus.benefits && membershipStatus.benefits.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Beneficios incluidos</label>
                                <ul className="space-y-1">
                                    {membershipStatus.benefits.slice(0, 3).map((benefit, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {benefit}
                                        </li>
                                    ))}
                                    {membershipStatus.benefits.length > 3 && (
                                        <li className="text-sm text-gray-500">
                                            +{membershipStatus.benefits.length - 3} beneficios más
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Expiration alert */}
                        {getExpirationAlert()}

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            {(membershipStatus.isExpired || membershipStatus.isExpiringSoon) && (
                                <button
                                    onClick={() => window.location.href = '/cliente/planes'}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Renovar Membresía
                                </button>
                            )}
                            <button
                                onClick={() => window.location.href = '/cliente/historial'}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Ver Historial
                            </button>
                        </div>
                    </div>
                ) : (
                    /* No membership state */
                    <div className="text-center py-8">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7 6h-2m-6 0a6 6 0 110-12h2m4 0a2 2 0 012 2m0 0v0a2 2 0 01-2 2m0 0a2 2 0 012 2v0c0 1.11-.89 2-2 2h-4M7 16h6" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Sin membresía activa</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Adquiere un plan para comenzar a entrenar con nosotros.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => window.location.href = '/cliente/planes'}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Ver Planes Disponibles
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembershipStatusCard;