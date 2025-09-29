// src/Componentes/Admin/OccupancyIndicator.js
import React from 'react';
import { FiUsers, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const OccupancyIndicator = ({ current, max, percentage, status, loading = false }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-100 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    const getStatusColor = () => {
        switch (status) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'low':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'high':
                return <FiAlertCircle className="h-5 w-5" />;
            case 'medium':
                return <FiUsers className="h-5 w-5" />;
            case 'low':
                return <FiCheckCircle className="h-5 w-5" />;
            default:
                return <FiUsers className="h-5 w-5" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'high':
                return 'Ocupación alta';
            case 'medium':
                return 'Ocupación moderada';
            case 'low':
                return 'Ocupación baja';
            default:
                return 'Estado normal';
        }
    };

    const getProgressColor = () => {
        switch (status) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-orange-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border-2 p-6 ${getStatusColor()}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Ocupación Actual
                </h3>
                <div className={`p-2 rounded-lg ${getStatusColor().replace('border-', 'bg-').replace('text-', 'text-')}`}>
                    {getStatusIcon()}
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                        {current}
                    </span>
                    <span className="text-lg text-gray-600">
                        / {max}
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                        {percentage}% ocupado
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor().split(' ')[0]}`}>
                        {getStatusText()}
                    </span>
                </div>
            </div>

            {/* Información adicional */}
            <div className="border-t pt-3">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Capacidad disponible:</span>
                    <span className="font-medium">{max - current} personas</span>
                </div>
            </div>

            {/* Indicador de tiempo real */}
            <div className="mt-3 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                    Actualizado en tiempo real
                </span>
            </div>
        </div>
    );
};

export default OccupancyIndicator;