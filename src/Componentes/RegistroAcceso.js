import React, { useState, useRef, useEffect } from 'react';

const RegistroAcceso = ({ onCheckIn, onCheckOut, salas = [] }) => {
    const [form, setForm] = useState({ userId: '', sala: 'Principal' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [lastAction, setLastAction] = useState(null);
    const inputRef = useRef(null);

    // Auto focus en el input
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Limpiar mensaje después de 5 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (type) => {
        if (!form.userId.trim()) {
            setMessage({
                type: 'error',
                text: 'Por favor ingrese el ID del usuario'
            });
            return;
        }

        setLoading(true);
        try {
            if (type === 'entrada') {
                await onCheckIn(form);
                setMessage({
                    type: 'success',
                    text: `✅ Entrada registrada para ${form.userId} en sala ${form.sala}`
                });
                setLastAction({ type: 'entrada', userId: form.userId, sala: form.sala, time: new Date() });
            } else {
                await onCheckOut(form);
                setMessage({
                    type: 'success',
                    text: `✅ Salida registrada para ${form.userId} en sala ${form.sala}`
                });
                setLastAction({ type: 'salida', userId: form.userId, sala: form.sala, time: new Date() });
            }

            // Limpiar formulario
            setForm(prev => ({ ...prev, userId: '' }));
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Error al registrar la acción'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e, type) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit(type);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Registro de Accesos</h2>
                <p className="text-sm text-gray-600">
                    Ingrese el ID del usuario y seleccione la acción a realizar
                </p>
            </div>

            {/* Formulario */}
            <div className="space-y-4 mb-6">
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                        ID Usuario / Código de Barras
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        id="userId"
                        value={form.userId}
                        onChange={(e) => setForm(prev => ({ ...prev, userId: e.target.value }))}
                        onKeyPress={(e) => handleKeyPress(e, 'entrada')}
                        placeholder="Escanee o ingrese el ID del usuario"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="sala" className="block text-sm font-medium text-gray-700 mb-2">
                        Sala
                    </label>
                    <select
                        id="sala"
                        value={form.sala}
                        onChange={(e) => setForm(prev => ({ ...prev, sala: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                    >
                        <option value="Principal">Principal</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Pesas">Pesas</option>
                        <option value="Funcional">Funcional</option>
                        <option value="Spinning">Spinning</option>
                        {salas.map(sala => (
                            <option key={sala} value={sala}>{sala}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => handleSubmit('entrada')}
                    disabled={loading || !form.userId.trim()}
                    className="flex items-center justify-center px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors quick-action-btn"
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    )}
                    ENTRADA
                </button>

                <button
                    onClick={() => handleSubmit('salida')}
                    disabled={loading || !form.userId.trim()}
                    className="flex items-center justify-center px-6 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors quick-action-btn"
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    )}
                    SALIDA
                </button>
            </div>

            {/* Mensaje de Estado */}
            {message && (
                <div className={`p-4 rounded-lg mb-4 ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            {/* Última Acción */}
            {lastAction && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Última acción registrada:</h4>
                    <div className="text-sm text-blue-800">
                        <p><strong>{lastAction.type.toUpperCase()}</strong> - {lastAction.userId}</p>
                        <p>Sala: {lastAction.sala}</p>
                        <p>Hora: {formatTime(lastAction.time)}</p>
                    </div>
                </div>
            )}

            {/* Atajos de Teclado */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Atajos de teclado:</h4>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded">Enter: Registrar Entrada</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">Tab: Cambiar campo</span>
                </div>
            </div>
        </div>
    );
};

export default RegistroAcceso;