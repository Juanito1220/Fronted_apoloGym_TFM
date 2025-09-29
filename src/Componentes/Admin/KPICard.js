// src/Componentes/Admin/KPICard.js
import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const KPICard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    currency = '',
    suffix = '',
    color = 'blue',
    loading = false
}) => {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-600',
        green: 'bg-green-50 border-green-200 text-green-600',
        purple: 'bg-purple-50 border-purple-200 text-purple-600',
        orange: 'bg-orange-50 border-orange-200 text-orange-600',
        red: 'bg-red-50 border-red-200 text-red-600'
    };

    const iconBgClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600'
    };

    const getTrendIcon = () => {
        if (trend === 'up') return <FiTrendingUp className="h-4 w-4 text-green-500" />;
        if (trend === 'down') return <FiTrendingDown className="h-4 w-4 text-red-500" />;
        return <FiMinus className="h-4 w-4 text-gray-500" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-600';
        if (trend === 'down') return 'text-red-600';
        return 'text-gray-600';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-sm border-2 ${colorClasses[color]} p-6 hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {title}
                </h3>
                {Icon && (
                    <div className={`p-2 rounded-lg ${iconBgClasses[color]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>

            <div className="flex items-baseline justify-between">
                <div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                        {currency}
                        {typeof value === 'number' ? value.toLocaleString() : value}
                        {suffix}
                    </p>

                    {change !== undefined && (
                        <div className="flex items-center space-x-1">
                            {getTrendIcon()}
                            <span className={`text-sm font-medium ${getTrendColor()}`}>
                                {Math.abs(change)}%
                            </span>
                            <span className="text-xs text-gray-500">
                                vs período anterior
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KPICard;