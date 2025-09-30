import { useState, useEffect, useCallback, useMemo } from 'react';
import { progressService } from '../Data/Services/progressService';

export const useProgress = () => {
    // Estados principales
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    // Estados específicos
    const [exercises, setExercises] = useState([]);
    const [progressHistory, setProgressHistory] = useState([]);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [membershipHistory, setMembershipHistory] = useState([]);
    const [biometricData, setBiometricData] = useState(null);

    // Filtros para gráficos
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 meses atrás
        end: new Date().toISOString().split('T')[0]
    });

    // ==================== FUNCIONES DE CARGA DE DATOS ====================

    const loadProgressData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // En desarrollo, usar datos mock
            const isDevelopment = process.env.NODE_ENV === 'development';

            if (isDevelopment) {
                const response = await progressService.getMockData();

                if (response.success) {
                    const mockData = response.data;
                    setData(mockData);
                    setExercises(mockData.exercises);
                    setProgressHistory(mockData.progressHistory);
                    setAttendanceHistory(mockData.attendanceHistory);
                    setMembershipHistory(mockData.membershipHistory);
                    setBiometricData(mockData.biometricData);

                    // Seleccionar primer ejercicio por defecto
                    if (mockData.exercises.length > 0) {
                        setSelectedExercise(mockData.exercises[0]);
                    }
                } else {
                    throw new Error(response.error);
                }
            } else {
                // Cargar datos reales del API
                const [
                    progressResponse,
                    exercisesResponse,
                    attendanceResponse,
                    membershipResponse,
                    biometricResponse
                ] = await Promise.all([
                    progressService.getMyProgress(),
                    progressService.getMyExercises(),
                    progressService.getAttendanceHistory(),
                    progressService.getMembershipHistory(),
                    progressService.getBiometricData()
                ]);

                if (progressResponse.success) setProgressHistory(progressResponse.data);
                if (exercisesResponse.success) {
                    setExercises(exercisesResponse.data);
                    if (exercisesResponse.data.length > 0) {
                        setSelectedExercise(exercisesResponse.data[0]);
                    }
                }
                if (attendanceResponse.success) setAttendanceHistory(attendanceResponse.data);
                if (membershipResponse.success) setMembershipHistory(membershipResponse.data);
                if (biometricResponse.success) setBiometricData(biometricResponse.data);
            }

        } catch (err) {
            console.error('Error loading progress data:', err);
            setError(err.message || 'Error al cargar los datos de progreso');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadExerciseProgress = useCallback(async (exerciseId, startDate, endDate) => {
        try {
            setLoading(true);
            const response = await progressService.getExerciseProgress(exerciseId, startDate, endDate);

            if (response.success) {
                // Actualizar el historial con los nuevos datos
                setProgressHistory(prev => {
                    const filtered = prev.filter(p => p.exerciseId !== exerciseId);
                    return [...filtered, ...response.data];
                });
            }
        } catch (err) {
            console.error('Error loading exercise progress:', err);
            setError('Error al cargar el progreso del ejercicio');
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== DATOS COMPUTADOS ====================

    // Progreso filtrado por ejercicio y fechas
    const filteredProgress = useMemo(() => {
        if (!selectedExercise || !progressHistory.length) return [];

        return progressHistory
            .filter(p => p.exerciseId === selectedExercise.id)
            .filter(p => p.date >= dateRange.start && p.date <= dateRange.end)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [selectedExercise, progressHistory, dateRange]);

    // Estadísticas del progreso
    const progressStats = useMemo(() => {
        if (!filteredProgress.length) {
            return {
                totalSessions: 0,
                weightProgress: 0,
                repsProgress: 0,
                lastSession: null,
                bestSession: null
            };
        }

        const first = filteredProgress[0];
        const last = filteredProgress[filteredProgress.length - 1];
        const best = filteredProgress.reduce((max, current) =>
            current.weight > max.weight ? current : max
        );

        return {
            totalSessions: filteredProgress.length,
            weightProgress: last.weight - first.weight,
            repsProgress: last.reps - first.reps,
            lastSession: last,
            bestSession: best,
            averageWeight: filteredProgress.reduce((sum, p) => sum + p.weight, 0) / filteredProgress.length,
            averageReps: filteredProgress.reduce((sum, p) => sum + p.reps, 0) / filteredProgress.length
        };
    }, [filteredProgress]);

    // Estadísticas de asistencia
    const attendanceStats = useMemo(() => {
        if (!attendanceHistory.length) {
            return {
                totalDays: 0,
                thisMonth: 0,
                lastMonth: 0,
                averagePerWeek: 0,
                streak: 0
            };
        }

        const now = new Date();
        const thisMonth = attendanceHistory.filter(a => {
            const date = new Date(a.date);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;

        const lastMonth = attendanceHistory.filter(a => {
            const date = new Date(a.date);
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
            return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
        }).length;

        // Calcular racha actual
        let streak = 0;
        const sortedAttendance = [...attendanceHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        let lastDate = new Date();

        for (const attendance of sortedAttendance) {
            const attendanceDate = new Date(attendance.date);
            const diffDays = Math.floor((lastDate - attendanceDate) / (1000 * 60 * 60 * 24));

            if (diffDays <= 2) { // Permitir un día de descanso
                streak++;
                lastDate = attendanceDate;
            } else {
                break;
            }
        }

        return {
            totalDays: attendanceHistory.length,
            thisMonth,
            lastMonth,
            averagePerWeek: (attendanceHistory.length / 12) * 7, // Aproximado últimos 3 meses
            streak
        };
    }, [attendanceHistory]);

    // Datos para gráficos de peso corporal
    const weightChartData = useMemo(() => {
        if (!biometricData?.weightHistory) return [];

        return biometricData.weightHistory.map(entry => ({
            date: entry.date,
            weight: entry.weight,
            bodyFat: entry.bodyFat,
            muscleMass: entry.muscleMass,
            bmi: entry.weight / Math.pow(biometricData.personalInfo.height, 2)
        }));
    }, [biometricData]);

    // Datos para gráficos de progreso de ejercicios
    const exerciseChartData = useMemo(() => {
        return filteredProgress.map(entry => ({
            date: entry.date,
            weight: entry.weight,
            reps: entry.reps,
            volume: entry.weight * entry.reps * entry.sets, // Volumen total
            oneRepMax: entry.weight * (1 + entry.reps / 30) // Fórmula aproximada 1RM
        }));
    }, [filteredProgress]);

    // ==================== ACCIONES ====================

    const updateDateRange = useCallback((start, end) => {
        setDateRange({ start, end });
    }, []);

    const selectExercise = useCallback((exercise) => {
        setSelectedExercise(exercise);
    }, []);

    const refreshData = useCallback(() => {
        loadProgressData();
    }, [loadProgressData]);

    // ==================== EFECTOS ====================

    useEffect(() => {
        loadProgressData();
    }, [loadProgressData]);

    // Recargar progreso cuando cambie el ejercicio o rango de fechas
    useEffect(() => {
        if (selectedExercise && dateRange.start && dateRange.end) {
            const isDevelopment = process.env.NODE_ENV === 'development';
            if (!isDevelopment) {
                loadExerciseProgress(selectedExercise.id, dateRange.start, dateRange.end);
            }
        }
    }, [selectedExercise, dateRange, loadExerciseProgress]);

    return {
        // Estados
        loading,
        error,
        data,

        // Datos específicos
        exercises,
        progressHistory,
        attendanceHistory,
        membershipHistory,
        biometricData,

        // Filtros
        selectedExercise,
        dateRange,

        // Datos computados
        filteredProgress,
        progressStats,
        attendanceStats,
        weightChartData,
        exerciseChartData,

        // Acciones
        updateDateRange,
        selectExercise,
        refreshData,
        loadExerciseProgress
    };
};

export default useProgress;