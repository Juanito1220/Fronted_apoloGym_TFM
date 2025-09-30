import React from 'react';

const ErrorMessage = ({ message, onRetry, type = 'error' }) => {
    const getIcon = () => {
        switch (type) {
            case 'warning':
                return (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-red-50 border-red-200 text-red-800';
        }
    };

    const getButtonClasses = () => {
        switch (type) {
            case 'warning':
                return 'text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100';
            case 'info':
                return 'text-blue-700 hover:text-blue-900 hover:bg-blue-100';
            default:
                return 'text-red-700 hover:text-red-900 hover:bg-red-100';
        }
    };

    return (
        <div className={`rounded-lg border p-4 ${getColorClasses()}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">
                        {message || 'Ha ocurrido un error inesperado'}
                    </p>
                </div>
                {onRetry && (
                    <div className="ml-auto">
                        <button
                            onClick={onRetry}
                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${getButtonClasses()}`}
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reintentar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;