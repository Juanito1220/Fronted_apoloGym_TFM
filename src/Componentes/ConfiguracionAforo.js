import React, { useState, useEffect } from 'react';
import { getCapacities, updateCapacities } from '../Data/Stores/aforo.store';
import { toast } from 'react-hot-toast';

const ConfiguracionAforo = ({ onClose, onSave }) => {
    const [capacities, setCapacities] = useState({});
    const [originalCapacities, setOriginalCapacities] = useState({});
    const [loading, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newSalaName, setNewSalaName] = useState('');
    const [salaToDelete, setSalaToDelete] = useState('');

    useEffect(() => {
        const current = getCapacities();
        setCapacities(current);
        setOriginalCapacities(current);
    }, []);

    useEffect(() => {
        const changed = JSON.stringify(capacities) !== JSON.stringify(originalCapacities);
        setHasChanges(changed);
    }, [capacities, originalCapacities]);

    const handleCapacityChange = (sala, value) => {
        const numValue = parseInt(value) || 0;
        if (numValue >= 0) {
            setCapacities(prev => ({
                ...prev,
                [sala]: numValue
            }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateCapacities(capacities);
            setOriginalCapacities(capacities);
            setHasChanges(false);
            onSave && onSave(capacities);
            onClose && onClose();
            toast.success('✅ Capacidades guardadas correctamente');
        } catch (error) {
            console.error('Error saving capacities:', error);
            toast.error('Error al guardar las capacidades: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setCapacities(originalCapacities);
        setHasChanges(false);
    };

    const addNewSala = () => {
        setShowAddModal(true);
    };

    const handleAddSala = () => {
        if (newSalaName && newSalaName.trim()) {
            if (!capacities[newSalaName.trim()]) {
                setCapacities(prev => ({
                    ...prev,
                    [newSalaName.trim()]: 20
                }));
                toast.success(`Sala "${newSalaName.trim()}" agregada`);
                setNewSalaName('');
                setShowAddModal(false);
            } else {
                toast.error('Esa sala ya existe');
            }
        } else {
            toast.error('Por favor ingrese un nombre válido');
        }
    };

    const removeSala = (salaToRemove) => {
        setSalaToDelete(salaToRemove);
        setShowDeleteModal(true);
    };

    const handleRemoveSala = () => {
        setCapacities(prev => {
            const newCapacities = { ...prev };
            delete newCapacities[salaToDelete];
            return newCapacities;
        });
        toast.success(`Sala "${salaToDelete}" eliminada`);
        setShowDeleteModal(false);
        setSalaToDelete('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Configuración de Capacidades</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Configure la capacidad máxima para cada sala del gimnasio.
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Lista de salas */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Capacidades por Sala</h3>
                            <button
                                onClick={addNewSala}
                                className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                                + Agregar Sala
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {Object.entries(capacities).map(([sala, capacity]) => (
                                <div key={sala} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-900 mb-1">
                                            {sala}
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="number"
                                                min="0"
                                                max="999"
                                                value={capacity}
                                                onChange={(e) => handleCapacityChange(sala, e.target.value)}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <span className="text-sm text-gray-600">personas máximo</span>
                                        </div>
                                    </div>

                                    {Object.keys(capacities).length > 1 && (
                                        <button
                                            onClick={() => removeSala(sala)}
                                            className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar sala"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Resumen de Capacidad Total</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {Object.values(capacities).reduce((sum, cap) => sum + cap, 0)}
                                </div>
                                <div className="text-sm text-blue-800">Capacidad Total</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {Object.keys(capacities).length}
                                </div>
                                <div className="text-sm text-blue-800">Salas Configuradas</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {Math.round(Object.values(capacities).reduce((sum, cap) => sum + cap, 0) / Object.keys(capacities).length) || 0}
                                </div>
                                <div className="text-sm text-blue-800">Promedio por Sala</div>
                            </div>
                        </div>
                    </div>

                    {/* Recomendaciones */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-yellow-900 mb-2">💡 Recomendaciones</h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Las alertas se activarán al 80% de la capacidad configurada</li>
                            <li>• No se permitirán ingresos cuando se alcance el 100% de capacidad</li>
                            <li>• Considere el espacio físico y las normas de seguridad al configurar capacidades</li>
                            <li>• Se recomienda revisar estas configuraciones periódicamente</li>
                        </ul>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-3">
                            {hasChanges && (
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Deshacer Cambios
                                </button>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading || !hasChanges}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Configuración'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal para agregar sala */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Agregar Nueva Sala</h3>
                        <input
                            type="text"
                            value={newSalaName}
                            onChange={(e) => setNewSalaName(e.target.value)}
                            placeholder="Nombre de la sala"
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSala()}
                            autoFocus
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewSalaName('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddSala}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para confirmar eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro de que desea eliminar la sala "{salaToDelete}"?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSalaToDelete('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRemoveSala}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfiguracionAforo;