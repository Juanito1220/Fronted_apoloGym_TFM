import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el estado para mostrar la interfaz de error
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // También puedes registrar el error en un servicio de monitoreo
        console.error('💥 ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Interfaz de error personalizada
            return (
                <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Algo salió mal</h2>
                            <p className="text-gray-600 mb-4">
                                Ha ocurrido un error inesperado. Por favor, recarga la página e intenta nuevamente.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Recargar Página
                                </button>
                                <button
                                    onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                                    className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Intentar Nuevamente
                                </button>
                            </div>

                            {/* Detalles del error para desarrollo */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-4 text-left">
                                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                        Ver detalles del error (desarrollo)
                                    </summary>
                                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-800 overflow-auto">
                                        <div className="font-bold mb-2">Error:</div>
                                        <div className="mb-2">{this.state.error && this.state.error.toString()}</div>
                                        <div className="font-bold mb-2">Stack trace:</div>
                                        <div className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</div>
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;