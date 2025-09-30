import React, { useState } from 'react';
import { Calendar, Clock, User, Target, CheckCircle, Circle, Play, Info } from 'lucide-react';
import ExerciseDetailModal from './ExerciseDetailModal';

const ActiveRoutineCard = ({
    routine,
    routineStats,
    completedExercises,
    onMarkCompleted,
    onMarkUncompleted,
    onViewExerciseDetails,
    isActive,
    daysRemaining
}) => {
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    if (!routine) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay rutina asignada</h3>
                    <p className="text-gray-500">
                        Contacta con tu entrenador para que te asigne una rutina personalizada.
                    </p>
                </div>
            </div>
        );
    }

    const handleExerciseClick = async (exercise) => {
        setSelectedExercise(exercise);
        setShowExerciseModal(true);
        if (onViewExerciseDetails) {
            await onViewExerciseDetails(exercise.exerciseId);
        }
    };

    const handleToggleComplete = (exercise) => {
        const isCompleted = completedExercises.has(exercise.exerciseId);
        if (isCompleted) {
            onMarkUncompleted(exercise.exerciseId);
        } else {
            // En un caso real, aquí podrías abrir un modal para registrar el desempeño
            const performanceData = {
                weight: exercise.targetWeight,
                reps: exercise.reps,
                sets: exercise.sets,
                rpe: exercise.rpeTarget,
                notes: '',
                completedAt: new Date().toISOString()
            };
            onMarkCompleted(exercise.exerciseId, performanceData);
        }
    };

    const getStatusColor = () => {
        if (!isActive) return 'bg-gray-100 text-gray-600';
        if (daysRemaining <= 3) return 'bg-red-100 text-red-700';
        if (daysRemaining <= 7) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getStatusText = () => {
        if (!isActive) return 'Inactiva';
        if (daysRemaining <= 0) return 'Expirada';
        if (daysRemaining === 1) return 'Vence mañana';
        return `${daysRemaining} días restantes`;
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Header de la rutina */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{routine.name}</h2>
                            <p className="text-blue-100 mb-4">{routine.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Entrenador: {routine.assignedBy.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{routine.trainingDays.join(', ')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>~{routine.estimatedDuration} min</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                                <Circle className="w-3 h-3 fill-current" />
                                {getStatusText()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas de progreso */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {routineStats.completedExercises}/{routineStats.totalExercises}
                            </div>
                            <div className="text-sm text-gray-500">Ejercicios completados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {Math.round(routineStats.completionPercentage)}%
                            </div>
                            <div className="text-sm text-gray-500">Progreso</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {routineStats.estimatedTimeRemaining}min
                            </div>
                            <div className="text-sm text-gray-500">Tiempo restante</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {routine.difficultyLevel}
                            </div>
                            <div className="text-sm text-gray-500">Dificultad</div>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progreso general</span>
                            <span>{Math.round(routineStats.completionPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${routineStats.completionPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de ejercicios */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ejercicios de la rutina</h3>

                    <div className="space-y-3">
                        {routine.exercises.map((exercise, index) => {
                            const isCompleted = completedExercises.has(exercise.exerciseId);

                            return (
                                <div
                                    key={exercise.id}
                                    className={`p-4 border rounded-lg transition-all duration-200 ${isCompleted
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            {/* Número de orden */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                            </div>

                                            {/* Información del ejercicio */}
                                            <div className="flex-1">
                                                <h4 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                                                    {exercise.name}
                                                </h4>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Target className="w-3 h-3" />
                                                        {exercise.sets} series × {exercise.reps} reps
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {exercise.restTime}
                                                    </span>
                                                    <span className="font-medium text-blue-600">
                                                        {exercise.targetWeight}
                                                    </span>
                                                </div>
                                                {exercise.notes && (
                                                    <p className="text-xs text-gray-500 mt-1">{exercise.notes}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleExerciseClick(exercise)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Ver detalles del ejercicio"
                                            >
                                                <Info className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleToggleComplete(exercise)}
                                                className={`p-2 rounded-full transition-colors ${isCompleted
                                                    ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={isCompleted ? 'Marcar como no completado' : 'Marcar como completado'}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="w-5 h-5 fill-current" />
                                                ) : (
                                                    <Circle className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Próximo ejercicio recomendado */}
                {routineStats.nextExercise && (
                    <div className="p-6 bg-blue-50 border-t border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-blue-900">Próximo ejercicio recomendado</h4>
                                <p className="text-blue-700">{routineStats.nextExercise.name}</p>
                            </div>
                            <button
                                onClick={() => handleExerciseClick(routineStats.nextExercise)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Play className="w-4 h-4" />
                                Comenzar
                            </button>
                        </div>
                    </div>
                )}

                {/* Información del entrenador */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">Asignado por</h4>
                            <p className="text-gray-600">{routine.assignedBy.name}</p>
                            <p className="text-sm text-gray-500">{routine.assignedBy.specialization}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Última actualización</p>
                            <p className="text-gray-700">
                                {new Date(routine.lastUpdated).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>

                    {routine.progressNotes && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h5 className="font-medium text-yellow-800">Notas del entrenador</h5>
                            <p className="text-yellow-700 text-sm mt-1">{routine.progressNotes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de detalles del ejercicio */}
            {showExerciseModal && selectedExercise && (
                <ExerciseDetailModal
                    exercise={selectedExercise}
                    onClose={() => {
                        setShowExerciseModal(false);
                        setSelectedExercise(null);
                    }}
                />
            )}
        </>
    );
};

export default ActiveRoutineCard;