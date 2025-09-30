import { useState, useEffect, useCallback } from 'react';
import { routineService } from '../Data/Services/routineService';

export const useRoutines = () => {
    // Estados principales
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados específicos
    const [currentRoutine, setCurrentRoutine] = useState(null);
    const [routineHistory, setRoutineHistory] = useState([]);
    const [exerciseLibrary, setExerciseLibrary] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);

    // Estados de progreso
    const [completedExercises, setCompletedExercises] = useState(new Set());
    const [exerciseProgress, setExerciseProgress] = useState({});

    // ==================== FUNCIONES DE CARGA DE DATOS ====================

    const loadCurrentRoutine = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await routineService.getMyCurrentRoutine();

            if (response.success) {
                setCurrentRoutine(response.data);

                // Cargar progreso de ejercicios completados
                if (response.data?.id) {
                    const completed = JSON.parse(localStorage.getItem(`completed_exercises_${response.data.id}`) || '[]');
                    const completedIds = new Set(completed.map(c => c.exerciseId));
                    setCompletedExercises(completedIds);

                    // Crear mapa de progreso
                    const progressMap = {};
                    completed.forEach(c => {
                        progressMap[c.exerciseId] = c;
                    });
                    setExerciseProgress(progressMap);
                }
            } else {
                throw new Error(response.error);
            }
        } catch (err) {
            console.error('Error loading current routine:', err);
            setError(err.message || 'Error al cargar la rutina actual');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadRoutineHistory = useCallback(async (limit = 20) => {
        try {
            const response = await routineService.getMyRoutineHistory(limit);

            if (response.success) {
                setRoutineHistory(response.data);
            } else {
                console.error('Error loading routine history:', response.error);
            }
        } catch (err) {
            console.error('Error loading routine history:', err);
        }
    }, []);

    const loadExerciseDetails = useCallback(async (exerciseId) => {
        try {
            const response = await routineService.getExerciseDetails(exerciseId);

            if (response.success) {
                setSelectedExercise(response.data);
                return response.data;
            } else {
                console.error('Error loading exercise details:', response.error);
                return null;
            }
        } catch (err) {
            console.error('Error loading exercise details:', err);
            return null;
        }
    }, []);

    // ==================== ACCIONES ====================

    const markExerciseCompleted = useCallback(async (exerciseId, performanceData) => {
        try {
            if (!currentRoutine) return false;

            const response = await routineService.markExerciseCompleted(
                currentRoutine.id,
                exerciseId,
                performanceData
            );

            if (response.success) {
                // Actualizar estado local
                setCompletedExercises(prev => new Set([...prev, exerciseId]));
                setExerciseProgress(prev => ({
                    ...prev,
                    [exerciseId]: response.data
                }));

                return true;
            } else {
                console.error('Error marking exercise as completed:', response.error);
                return false;
            }
        } catch (err) {
            console.error('Error marking exercise as completed:', err);
            return false;
        }
    }, [currentRoutine]);

    const markExerciseUncompleted = useCallback((exerciseId) => {
        try {
            if (!currentRoutine) return;

            // Actualizar localStorage
            const key = `completed_exercises_${currentRoutine.id}`;
            const completed = JSON.parse(localStorage.getItem(key) || '[]');
            const filtered = completed.filter(c => c.exerciseId !== exerciseId);
            localStorage.setItem(key, JSON.stringify(filtered));

            // Actualizar estado local
            setCompletedExercises(prev => {
                const newSet = new Set(prev);
                newSet.delete(exerciseId);
                return newSet;
            });

            setExerciseProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[exerciseId];
                return newProgress;
            });
        } catch (err) {
            console.error('Error marking exercise as uncompleted:', err);
        }
    }, [currentRoutine]);

    const refreshRoutine = useCallback(() => {
        loadCurrentRoutine();
    }, [loadCurrentRoutine]);

    // ==================== DATOS COMPUTADOS ====================

    // Calcular estadísticas de la rutina
    const routineStats = useCallback(() => {
        if (!currentRoutine || !currentRoutine.exercises) {
            return {
                totalExercises: 0,
                completedExercises: 0,
                completionPercentage: 0,
                estimatedTimeRemaining: 0,
                nextExercise: null
            };
        }

        const totalExercises = currentRoutine.exercises.length;
        const completed = currentRoutine.exercises.filter(ex =>
            completedExercises.has(ex.exerciseId)
        ).length;

        const completionPercentage = totalExercises > 0 ? (completed / totalExercises) * 100 : 0;

        // Encontrar siguiente ejercicio no completado
        const nextExercise = currentRoutine.exercises.find(ex =>
            !completedExercises.has(ex.exerciseId)
        );

        // Estimar tiempo restante (aproximado)
        const remainingExercises = totalExercises - completed;
        const estimatedTimePerExercise = currentRoutine.estimatedDuration / totalExercises;
        const estimatedTimeRemaining = remainingExercises * estimatedTimePerExercise;

        return {
            totalExercises,
            completedExercises: completed,
            completionPercentage,
            estimatedTimeRemaining: Math.round(estimatedTimeRemaining),
            nextExercise
        };
    }, [currentRoutine, completedExercises]);

    // Verificar si la rutina está activa
    const isRoutineActive = useCallback(() => {
        if (!currentRoutine) return false;

        const now = new Date();
        const endDate = new Date(currentRoutine.endDate);

        return currentRoutine.status === 'active' && endDate > now;
    }, [currentRoutine]);

    // Obtener días de entrenamiento restantes
    const getDaysRemaining = useCallback(() => {
        if (!currentRoutine) return 0;

        const now = new Date();
        const endDate = new Date(currentRoutine.endDate);
        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    }, [currentRoutine]);

    // ==================== EFECTOS ====================

    useEffect(() => {
        loadCurrentRoutine();
        loadRoutineHistory();
    }, [loadCurrentRoutine, loadRoutineHistory]);

    // Cargar biblioteca de ejercicios (independiente de la rutina)
    useEffect(() => {
        // En modo development, cargar desde mock data
        if (process.env.NODE_ENV === 'development') {
            const mockData = routineService.generateMockData();
            setExerciseLibrary(mockData.exerciseLibrary);
        }
    }, []);

    return {
        // Estados
        loading,
        error,

        // Datos principales
        currentRoutine,
        routineHistory,
        exerciseLibrary,
        selectedExercise,

        // Estados de progreso
        completedExercises,
        exerciseProgress,

        // Datos computados
        routineStats: routineStats(),
        isRoutineActive: isRoutineActive(),
        daysRemaining: getDaysRemaining(),

        // Acciones
        markExerciseCompleted,
        markExerciseUncompleted,
        loadExerciseDetails,
        refreshRoutine,

        // Setters
        setSelectedExercise
    };
};

export default useRoutines;