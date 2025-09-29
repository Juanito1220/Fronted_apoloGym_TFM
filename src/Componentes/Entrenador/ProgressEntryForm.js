import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { FaTimes, FaUser, FaDumbbell, FaPlus, FaTrash, FaStar } from 'react-icons/fa';

// Servicios simulados
import { listUsers } from '../../Data/Stores/usuario.store';
import { addProgreso } from '../../Data/Stores/progreso.store';

export default function ProgressEntryForm({ isOpen, onClose, onSave, selectedClient = null, selectedDate = null }) {
    const [progressData, setProgressData] = useState({
        clienteId: selectedClient?.id || '',
        fecha: selectedDate || new Date().toISOString().split('T')[0],
        tipo: 'entrenamiento', // entrenamiento, evaluacion, medicion
        ejercicios: [],
        medidas: {
            peso: '',
            grasa: '',
            musculo: '',
            imc: ''
        },
        notas: '',
        valoracion: 5,
        duracion: '',
        intensidad: 'media',
        asistencia: true
    });

    const [newExercise, setNewExercise] = useState({
        nombre: '',
        series: '',
        repeticiones: '',
        peso: '',
        tiempo: '',
        observaciones: ''
    });

    const [saving, setSaving] = useState(false);
    const [availableExercises] = useState([
        'Sentadilla', 'Press de Banca', 'Peso Muerto', 'Press Militar',
        'Remo con Barra', 'Dominadas', 'Curl de Bíceps', 'Press Francés',
        'Plancha', 'Burpees', 'Zancadas', 'Hip Thrust'
    ]);

    // Obtener clientes
    const clients = useMemo(() =>
        listUsers().filter(u => u.role === "cliente" && u.active !== false), []
    );

    const selectedClientData = useMemo(() =>
        clients.find(c => c.id === progressData.clienteId), [clients, progressData.clienteId]
    );

    const [showMeasurements, setShowMeasurements] = useState(false);

    useEffect(() => {
        if (selectedClient) {
            setProgressData(prev => ({ ...prev, clienteId: selectedClient.id }));
        }
    }, [selectedClient]);

    useEffect(() => {
        if (selectedDate) {
            setProgressData(prev => ({ ...prev, fecha: selectedDate }));
        }
    }, [selectedDate]);

    if (!isOpen) return null;

    const addExercise = () => {
        if (!newExercise.nombre) {
            toast.error('Debe especificar el nombre del ejercicio');
            return;
        }

        const exercise = {
            ...newExercise,
            id: Date.now(),
            series: parseInt(newExercise.series) || 0,
            repeticiones: parseInt(newExercise.repeticiones) || 0,
            peso: parseFloat(newExercise.peso) || 0,
            tiempo: newExercise.tiempo || ''
        };

        setProgressData(prev => ({
            ...prev,
            ejercicios: [...prev.ejercicios, exercise]
        }));

        setNewExercise({
            nombre: '',
            series: '',
            repeticiones: '',
            peso: '',
            tiempo: '',
            observaciones: ''
        });
    };

    const removeExercise = (exerciseId) => {
        setProgressData(prev => ({
            ...prev,
            ejercicios: prev.ejercicios.filter(ex => ex.id !== exerciseId)
        }));
    };

    const handleSave = async () => {
        if (!progressData.clienteId) {
            toast.error('Debe seleccionar un cliente');
            return;
        }

        if (!progressData.fecha) {
            toast.error('Debe especificar una fecha');
            return;
        }

        if (progressData.tipo === 'entrenamiento' && progressData.ejercicios.length === 0) {
            toast.error('Debe agregar al menos un ejercicio');
            return;
        }

        setSaving(true);
        try {
            // Simular guardado (en producción sería una llamada a API)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const progress = {
                id: Date.now(),
                ...progressData,
                fechaRegistro: new Date().toISOString(),
                entrenadorId: 'trainer_123' // En producción vendría del contexto de autenticación
            };

            // Guardar en el store
            addProgreso(progress);

            toast.success('Progreso registrado exitosamente');
            onSave(progress);
        } catch (error) {
            toast.error('Error al registrar el progreso');
        } finally {
            setSaving(false);
        }
    };

    const calculateTotalVolume = () => {
        return progressData.ejercicios.reduce((total, ex) => {
            return total + (ex.series * ex.repeticiones * ex.peso);
        }, 0);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaDumbbell className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">Registrar Progreso</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-6">
                            {/* Client & Date */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaUser className="w-5 h-5 mr-2 text-blue-600" />
                                    Información Básica
                                </h3>

                                <div className="space-y-4">
                                    {selectedClient ? (
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{selectedClient.nombre || selectedClient.email}</h4>
                                                    <p className="text-sm text-gray-600">{selectedClient.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cliente *
                                            </label>
                                            <select
                                                value={progressData.clienteId}
                                                onChange={(e) => setProgressData(prev => ({ ...prev, clienteId: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Seleccionar cliente...</option>
                                                {clients.map(client => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.nombre || client.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha *
                                        </label>
                                        <input
                                            type="date"
                                            value={progressData.fecha}
                                            onChange={(e) => setProgressData(prev => ({ ...prev, fecha: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de Registro
                                        </label>
                                        <select
                                            value={progressData.tipo}
                                            onChange={(e) => setProgressData(prev => ({ ...prev, tipo: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="entrenamiento">Sesión de Entrenamiento</option>
                                            <option value="evaluacion">Evaluación Física</option>
                                            <option value="medicion">Mediciones Corporales</option>
                                        </select>
                                    </div>

                                    {progressData.tipo === 'entrenamiento' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Duración (min)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={progressData.duracion}
                                                        onChange={(e) => setProgressData(prev => ({ ...prev, duracion: e.target.value }))}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="60"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Intensidad
                                                    </label>
                                                    <select
                                                        value={progressData.intensidad}
                                                        onChange={(e) => setProgressData(prev => ({ ...prev, intensidad: e.target.value }))}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="baja">Baja</option>
                                                        <option value="media">Media</option>
                                                        <option value="alta">Alta</option>
                                                        <option value="maxima">Máxima</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Valoración de la Sesión
                                                </label>
                                                <div className="flex items-center space-x-2">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setProgressData(prev => ({ ...prev, valoracion: star }))}
                                                            className={`text-2xl ${star <= progressData.valoracion
                                                                ? 'text-yellow-500'
                                                                : 'text-gray-300'
                                                                } hover:text-yellow-400 transition-colors`}
                                                        >
                                                            <FaStar />
                                                        </button>
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        {progressData.valoracion}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notas Generales
                                        </label>
                                        <textarea
                                            value={progressData.notas}
                                            onChange={(e) => setProgressData(prev => ({ ...prev, notas: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Observaciones, sensaciones, logros..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Measurements Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Mediciones</h3>
                                    <button
                                        onClick={() => setShowMeasurements(!showMeasurements)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {showMeasurements ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>

                                {showMeasurements && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Peso (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={progressData.medidas.peso}
                                                    onChange={(e) => setProgressData(prev => ({
                                                        ...prev,
                                                        medidas: { ...prev.medidas, peso: e.target.value }
                                                    }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    % Grasa
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={progressData.medidas.grasa}
                                                    onChange={(e) => setProgressData(prev => ({
                                                        ...prev,
                                                        medidas: { ...prev.medidas, grasa: e.target.value }
                                                    }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    % Músculo
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={progressData.medidas.musculo}
                                                    onChange={(e) => setProgressData(prev => ({
                                                        ...prev,
                                                        medidas: { ...prev.medidas, musculo: e.target.value }
                                                    }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    IMC
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={progressData.medidas.imc}
                                                    onChange={(e) => setProgressData(prev => ({
                                                        ...prev,
                                                        medidas: { ...prev.medidas, imc: e.target.value }
                                                    }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Middle Column - Exercise Entry */}
                        {progressData.tipo === 'entrenamiento' && (
                            <div className="lg:col-span-2 space-y-6">
                                {/* Add Exercise Form */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaDumbbell className="w-5 h-5 mr-2 text-green-600" />
                                        Ejercicios Realizados
                                    </h3>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Agregar Ejercicio</h4>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ejercicio
                                                </label>
                                                <input
                                                    type="text"
                                                    list="exercises"
                                                    value={newExercise.nombre}
                                                    onChange={(e) => setNewExercise(prev => ({ ...prev, nombre: e.target.value }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Nombre del ejercicio"
                                                />
                                                <datalist id="exercises">
                                                    {availableExercises.map(ex => (
                                                        <option key={ex} value={ex} />
                                                    ))}
                                                </datalist>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Series
                                                </label>
                                                <input
                                                    type="number"
                                                    value={newExercise.series}
                                                    onChange={(e) => setNewExercise(prev => ({ ...prev, series: e.target.value }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="3"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Repeticiones
                                                </label>
                                                <input
                                                    type="number"
                                                    value={newExercise.repeticiones}
                                                    onChange={(e) => setNewExercise(prev => ({ ...prev, repeticiones: e.target.value }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="12"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Peso (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    value={newExercise.peso}
                                                    onChange={(e) => setNewExercise(prev => ({ ...prev, peso: e.target.value }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="20"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tiempo (opcional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newExercise.tiempo}
                                                    onChange={(e) => setNewExercise(prev => ({ ...prev, tiempo: e.target.value }))}
                                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="30s"
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                <button
                                                    onClick={addExercise}
                                                    className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                                >
                                                    <FaPlus className="w-4 h-4 mr-1" />
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Observaciones del ejercicio
                                            </label>
                                            <input
                                                type="text"
                                                value={newExercise.observaciones}
                                                onChange={(e) => setNewExercise(prev => ({ ...prev, observaciones: e.target.value }))}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Técnica, sensaciones, dificultades..."
                                            />
                                        </div>
                                    </div>

                                    {/* Exercise List */}
                                    <div className="space-y-3">
                                        {progressData.ejercicios.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                No se han agregado ejercicios
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium text-gray-900">
                                                        Ejercicios ({progressData.ejercicios.length})
                                                    </h4>
                                                    <div className="text-sm text-gray-600">
                                                        Volumen total: {calculateTotalVolume().toFixed(1)} kg
                                                    </div>
                                                </div>

                                                {progressData.ejercicios.map(exercise => (
                                                    <div key={exercise.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-4 mb-2">
                                                                    <h5 className="font-medium text-gray-900">{exercise.nombre}</h5>
                                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                                        <span className="bg-blue-100 px-2 py-1 rounded">
                                                                            {exercise.series} series
                                                                        </span>
                                                                        <span className="bg-green-100 px-2 py-1 rounded">
                                                                            {exercise.repeticiones} reps
                                                                        </span>
                                                                        {exercise.peso > 0 && (
                                                                            <span className="bg-purple-100 px-2 py-1 rounded">
                                                                                {exercise.peso} kg
                                                                            </span>
                                                                        )}
                                                                        {exercise.tiempo && (
                                                                            <span className="bg-orange-100 px-2 py-1 rounded">
                                                                                {exercise.tiempo}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {exercise.observaciones && (
                                                                    <p className="text-sm text-gray-600 mt-1">{exercise.observaciones}</p>
                                                                )}

                                                                <div className="text-xs text-gray-500 mt-2">
                                                                    Volumen: {(exercise.series * exercise.repeticiones * exercise.peso).toFixed(1)} kg
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => removeExercise(exercise.id)}
                                                                className="text-red-500 hover:text-red-700 transition-colors ml-3"
                                                            >
                                                                <FaTrash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other types content */}
                        {progressData.tipo !== 'entrenamiento' && (
                            <div className="lg:col-span-2">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {progressData.tipo === 'evaluacion' ? 'Evaluación Física' : 'Mediciones Corporales'}
                                    </h4>
                                    <p className="text-gray-600">
                                        {progressData.tipo === 'evaluacion'
                                            ? 'Utilice las mediciones y notas para registrar la evaluación física completa.'
                                            : 'Registre las mediciones corporales en la sección de la izquierda.'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {selectedClientData
                                ? `Registrando progreso para ${selectedClientData.nombre || selectedClientData.email}`
                                : 'Selecciona un cliente para continuar'
                            }
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !progressData.clienteId}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Progreso'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}