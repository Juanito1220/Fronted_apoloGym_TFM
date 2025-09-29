import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
    getAforoStatus,
    getGlobalSummary,
    checkIn,
    checkOut,
    listAttendance,
    getCapacities,
    initializeTestData
} from '../Data/Stores/aforo.store';

export const useAforo = (pollingInterval = 5000) => {
    const [aforoStatus, setAforoStatus] = useState({});
    const [globalSummary, setGlobalSummary] = useState({
        totalCurrent: 0,
        totalCapacity: 0,
        globalPercentage: 0,
        criticalCount: 0,
        warningCount: 0,
        safeCount: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [capacities, setCapacities] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para actualizar todos los datos
    const refreshData = useCallback(() => {
        try {
            // Inicializar datos de prueba si es la primera vez
            initializeTestData();

            const status = getAforoStatus();
            const summary = getGlobalSummary();
            const activity = listAttendance().slice(-10).reverse(); // Últimas 10 actividades
            const caps = getCapacities();

            setAforoStatus(status);
            setGlobalSummary(summary);
            setRecentActivity(activity);
            setCapacities(caps);
            setError(null);
        } catch (err) {
            console.error('Error actualizando datos de aforo:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Polling automático
    useEffect(() => {
        // Carga inicial
        refreshData();

        // Configurar polling si está habilitado
        if (pollingInterval > 0) {
            const interval = setInterval(refreshData, pollingInterval);
            return () => clearInterval(interval);
        }
    }, [refreshData, pollingInterval]);

    // Función para obtener el estado de una sala específica
    const getSalaStatus = useCallback((salaName) => {
        return aforoStatus[salaName] || {
            currentOccupancy: 0,
            maxCapacity: capacities[salaName] || 50,
            percentage: 0,
            alertLevel: 'safe',
            available: capacities[salaName] || 50
        };
    }, [aforoStatus, capacities]);

    // Función para verificar si se puede permitir entrada a una sala
    const canEnterSala = useCallback((salaName) => {
        const salaStatus = getSalaStatus(salaName);
        return salaStatus.available > 0;
    }, [getSalaStatus]);

    // Función para registrar entrada
    const handleCheckIn = useCallback(async (data) => {
        try {
            // Verificar disponibilidad antes de permitir entrada
            if (!canEnterSala(data.sala || 'Principal')) {
                toast.error(`No se puede ingresar a ${data.sala || 'Principal'}. Capacidad máxima alcanzada.`);
                throw new Error('Capacidad máxima alcanzada');
            }

            await checkIn(data);

            // Notificación de éxito
            toast.success(`✅ Entrada registrada: ${data.usuario || 'Usuario'} en ${data.sala || 'Principal'}`);

            // Actualizar inmediatamente después de la acción
            refreshData();

            // Verificar si se alcanzó un nivel de alerta después del ingreso
            const newStatus = getAforoStatus();
            const newSalaStatus = newStatus[data.sala || 'Principal'];

            if (newSalaStatus?.alertLevel === 'critical') {
                toast.error(`⚠️ ${data.sala || 'Principal'} ha alcanzado su capacidad máxima`);
            } else if (newSalaStatus?.alertLevel === 'warning') {
                toast(`⚠️ ${data.sala || 'Principal'} está cerca de su capacidad máxima (${newSalaStatus.percentage}%)`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error en check-in:', error);
            toast.error(`Error al registrar entrada: ${error.message}`);
            return { success: false, error: error.message };
        }
    }, [canEnterSala, refreshData]);

    // Función para registrar salida
    const handleCheckOut = useCallback(async (data) => {
        try {
            await checkOut(data);

            // Notificación de éxito
            toast.success(`🚪 Salida registrada: ${data.usuario || 'Usuario'} de ${data.sala || 'Principal'}`);

            // Actualizar inmediatamente después de la acción
            refreshData();

            return { success: true };
        } catch (error) {
            console.error('Error en check-out:', error);
            toast.error(`Error al registrar salida: ${error.message}`);
            return { success: false, error: error.message };
        }
    }, [refreshData]);

    // Obtener salas en estado crítico
    const getCriticalSalas = useCallback(() => {
        return Object.entries(aforoStatus)
            .filter(([_, data]) => data.alertLevel === 'critical')
            .map(([sala, data]) => ({ sala, ...data }));
    }, [aforoStatus]);

    // Obtener salas en alerta
    const getWarningSalas = useCallback(() => {
        return Object.entries(aforoStatus)
            .filter(([_, data]) => data.alertLevel === 'warning')
            .map(([sala, data]) => ({ sala, ...data }));
    }, [aforoStatus]);

    // Estadísticas adicionales
    const getStats = useCallback(() => {
        const now = new Date();
        const today = now.toDateString();

        // Filtrar actividad del día
        const todayActivity = recentActivity.filter(activity => {
            const activityDate = new Date(activity.ts).toDateString();
            return activityDate === today;
        });

        // Contar entradas y salidas de hoy
        const todayEntries = todayActivity.filter(a => a.type === 'in').length;
        const todayExits = todayActivity.filter(a => a.type === 'out').length;

        // Actividad por sala hoy
        const salaActivity = {};
        todayActivity.forEach(activity => {
            const sala = activity.sala || 'Principal';
            if (!salaActivity[sala]) {
                salaActivity[sala] = { entries: 0, exits: 0 };
            }
            if (activity.type === 'in') {
                salaActivity[sala].entries++;
            } else {
                salaActivity[sala].exits++;
            }
        });

        return {
            todayEntries,
            todayExits,
            totalTodayMovements: todayEntries + todayExits,
            salaActivity,
            peakOccupancy: Math.max(...Object.values(aforoStatus).map(s => s.currentOccupancy), 0)
        };
    }, [recentActivity, aforoStatus]);

    return {
        // Estados principales
        aforoStatus,
        globalSummary,
        recentActivity,
        capacities,
        isLoading,
        error,

        // Acciones
        handleCheckIn,
        handleCheckOut,
        refreshData,

        // Utilidades
        getSalaStatus,
        canEnterSala,
        getCriticalSalas,
        getWarningSalas,
        getStats
    };
};

export default useAforo;