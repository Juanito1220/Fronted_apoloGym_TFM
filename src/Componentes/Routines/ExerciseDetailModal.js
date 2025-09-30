import React, { useState, useEffect } from 'react';
import { X, Play, Video, FileText, Target, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { routineService } from '../../Data/Services/routineService';

const ExerciseDetailModal = ({ exercise, onClose, onMarkCompleted, isCompleted }) => {
    const [exerciseDetails, setExerciseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('instructions');
    const [performanceData, setPerformanceData] = useState({
        weight: exercise?.targetWeight || '',
        reps: exercise?.reps || '',
        sets: exercise?.sets || '',
        rpe: '',
        notes: ''
    });

    useEffect(() => {
        const loadExerciseDetails = async () => {
            try {
                setLoading(true);
                const result = await routineService.getExerciseDetails(exercise.exerciseId);
                if (result.success) {
                    setExerciseDetails(result.data);
                } else {
                    console.error('Error loading exercise details:', result.error);
                }
            } catch (error) {
                console.error('Error loading exercise details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (exercise?.exerciseId) {
            loadExerciseDetails();
        }
    }, [exercise]);

    const handlePerformanceChange = (field, value) => {
        setPerformanceData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMarkCompleted = () => {
        if (onMarkCompleted) {
            onMarkCompleted(exercise.exerciseId, {
                ...performanceData,
                completedAt: new Date().toISOString()
            });
        }
        onClose();
    };

    const getDifficultyColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'principiante': return 'text-green-600 bg-green-100';
            case 'intermedio': return 'text-yellow-600 bg-yellow-100';
            case 'avanzado': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getMuscleGroupColor = (group) => {
        const colors = {
            'Pecho': 'bg-red-100 text-red-700',
            'Espalda': 'bg-blue-100 text-blue-700',
            'Piernas': 'bg-green-100 text-green-700',
            'Hombros': 'bg-purple-100 text-purple-700',
            'Brazos': 'bg-orange-100 text-orange-700',
            'Core': 'bg-yellow-100 text-yellow-700',
            'Cardio': 'bg-pink-100 text-pink-700'
        };
        return colors[group] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Cargando detalles del ejercicio...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!exerciseDetails) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar</h3>
                        <p className="text-gray-500 mb-4">No se pudieron cargar los detalles del ejercicio.</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{exerciseDetails.name}</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMuscleGroupColor(exerciseDetails.muscleGroup)}`}>
                                {exerciseDetails.muscleGroup}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exerciseDetails.difficulty)}`}>
                                {exerciseDetails.difficulty}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {exerciseDetails.equipment}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'instructions', label: 'Instrucciones', icon: FileText },
                            { id: 'technique', label: 'Técnica', icon: Play },
                            { id: 'performance', label: 'Rendimiento', icon: Activity }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'instructions' && (
                        <div className="space-y-6">
                            {/* Parámetros del ejercicio */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{exercise.sets}</div>
                                    <div className="text-sm text-gray-500">Series</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{exercise.reps}</div>
                                    <div className="text-sm text-gray-500">Repeticiones</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{exercise.targetWeight}</div>
                                    <div className="text-sm text-gray-500">Peso objetivo</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{exercise.restTime}</div>
                                    <div className="text-sm text-gray-500">Descanso</div>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                                <p className="text-gray-700 leading-relaxed">{exerciseDetails.description}</p>
                            </div>

                            {/* Instrucciones paso a paso */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instrucciones</h3>
                                <ol className="space-y-2">
                                    {exerciseDetails.instructions.map((instruction, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mr-3 mt-0.5">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-700">{instruction}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Músculos trabajados */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Músculos trabajados</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Músculos principales</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {exerciseDetails.primaryMuscles.map((muscle, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                    {muscle}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Músculos secundarios</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {exerciseDetails.secondaryMuscles.map((muscle, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                    {muscle}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'technique' && (
                        <div className="space-y-6">
                            {/* Video placeholder */}
                            <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Video demostrativo</h3>
                                <p className="text-gray-500 mb-4">Video próximamente disponible</p>
                                {exerciseDetails.videoUrl && (
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Ver video
                                    </button>
                                )}
                            </div>

                            {/* Consejos de técnica */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Consejos de técnica</h3>
                                <ul className="space-y-2">
                                    {exerciseDetails.techniqueTips.map((tip, index) => (
                                        <li key={index} className="flex items-start">
                                            <Target className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                                            <span className="text-gray-700">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Errores comunes */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Errores comunes</h3>
                                <ul className="space-y-2">
                                    {exerciseDetails.commonMistakes.map((mistake, index) => (
                                        <li key={index} className="flex items-start">
                                            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                                            <span className="text-gray-700">{mistake}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Progresiones */}
                            {exerciseDetails.progressions && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Progresiones</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Variación más fácil</h4>
                                            <p className="text-gray-700">{exerciseDetails.progressions.easier}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Variación más difícil</h4>
                                            <p className="text-gray-700">{exerciseDetails.progressions.harder}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar rendimiento</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Peso utilizado
                                            </label>
                                            <input
                                                type="text"
                                                value={performanceData.weight}
                                                onChange={(e) => handlePerformanceChange('weight', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="ej: 70kg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Series completadas
                                            </label>
                                            <input
                                                type="number"
                                                value={performanceData.sets}
                                                onChange={(e) => handlePerformanceChange('sets', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min="1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Repeticiones por serie
                                            </label>
                                            <input
                                                type="text"
                                                value={performanceData.reps}
                                                onChange={(e) => handlePerformanceChange('reps', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="ej: 12,10,8"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                RPE (Esfuerzo percibido 1-10)
                                            </label>
                                            <select
                                                value={performanceData.rpe}
                                                onChange={(e) => handlePerformanceChange('rpe', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Seleccionar RPE</option>
                                                {[...Array(10)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1} - {i < 5 ? 'Fácil' : i < 7 ? 'Moderado' : i < 9 ? 'Difícil' : 'Máximo'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Notas adicionales
                                            </label>
                                            <textarea
                                                value={performanceData.notes}
                                                onChange={(e) => handlePerformanceChange('notes', e.target.value)}
                                                rows="4"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Sensaciones, dificultades, mejoras..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-4">
                        {isCompleted && (
                            <div className="flex items-center text-green-600">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="text-sm font-medium">Ejercicio completado</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cerrar
                        </button>

                        {!isCompleted && onMarkCompleted && (
                            <button
                                onClick={handleMarkCompleted}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Marcar como completado
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetailModal;