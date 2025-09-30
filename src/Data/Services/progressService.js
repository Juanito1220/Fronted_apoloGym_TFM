// Servicio para gestión del progreso físico del cliente
class ProgressService {
    constructor() {
        this.baseURL = '/api/v1';
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    // ==================== PROGRESO Y RENDIMIENTO ====================

    /**
     * Obtener historial completo de progreso del cliente autenticado
     */
    async getMyProgress() {
        try {
            // En desarrollo, usar datos mock
            if (this.isDevelopment) {
                return this.getMockData();
            }

            // En producción, hacer llamada real a la API
            const response = await fetch(`${this.baseURL}/progress/my-history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching progress history:', error);
            return this.handleError(error);
        }
    }

    /**
     * Obtener lista de ejercicios realizados por el cliente
     */
    async getMyExercises() {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                return {
                    success: true,
                    data: mockData.exercises
                };
            }

            const response = await fetch(`${this.baseURL}/progress/exercises`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching exercises:', error);
            return this.handleError(error);
        }
    }

    /**
     * Obtener progreso específico por ejercicio y rango de fechas
     */
    async getExerciseProgress(exerciseId, startDate, endDate) {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                const filtered = mockData.progressHistory.filter(p =>
                    p.exerciseId === exerciseId &&
                    p.date >= startDate &&
                    p.date <= endDate
                );
                return {
                    success: true,
                    data: filtered
                };
            }

            const params = new URLSearchParams({
                exerciseId: exerciseId.toString(),
                startDate,
                endDate
            });

            const response = await fetch(`${this.baseURL}/progress/exercise?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching exercise progress:', error);
            return this.handleError(error);
        }
    }

    // ==================== HISTORIAL DE ASISTENCIA ====================

    /**
     * Obtener historial de asistencia del cliente
     */
    async getAttendanceHistory(limit = 50, page = 1) {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                return {
                    success: true,
                    data: mockData.attendanceHistory.slice(0, limit)
                };
            }

            const params = new URLSearchParams({
                limit: limit.toString(),
                page: page.toString()
            });

            const response = await fetch(`${this.baseURL}/attendance/history/client?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching attendance history:', error);
            return this.handleError(error);
        }
    }

    // ==================== HISTORIAL DE MEMBRESÍAS ====================

    /**
     * Obtener historial de suscripciones/planes del cliente
     */
    async getMembershipHistory() {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                return {
                    success: true,
                    data: mockData.membershipHistory
                };
            }

            const response = await fetch(`${this.baseURL}/memberships/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching membership history:', error);
            return this.handleError(error);
        }
    }

    // ==================== DATOS BIOMÉTRICOS ====================

    /**
     * Obtener datos del perfil del cliente
     */
    async getProfileData() {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                return {
                    success: true,
                    data: mockData.biometricData.personalInfo
                };
            }

            const response = await fetch(`${this.baseURL}/users/profile/data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching profile data:', error);
            return this.handleError(error);
        }
    }

    /**
     * Obtener métricas biométricas del cliente
     */
    async getBiometricData() {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                return {
                    success: true,
                    data: mockData.biometricData
                };
            }

            const response = await fetch(`${this.baseURL}/progress/biometric`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching biometric data:', error);
            return this.handleError(error);
        }
    }

    // ==================== DATOS MOCK PARA DESARROLLO ====================

    /**
     * Generar datos mock para desarrollo
     */
    generateMockData() {
        const exercises = [
            { id: 1, name: 'Press de Banca', category: 'Pecho', unit: 'kg' },
            { id: 2, name: 'Sentadilla', category: 'Piernas', unit: 'kg' },
            { id: 3, name: 'Peso Muerto', category: 'Espalda', unit: 'kg' },
            { id: 4, name: 'Press Militar', category: 'Hombros', unit: 'kg' },
            { id: 5, name: 'Flexiones', category: 'Pecho', unit: 'reps' },
            { id: 6, name: 'Dominadas', category: 'Espalda', unit: 'reps' }
        ];

        const generateProgressData = (exerciseId, startWeight, endWeight, sessions = 12) => {
            const data = [];
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 3);

            for (let i = 0; i < sessions; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + (i * 7)); // Cada semana

                const progress = i / (sessions - 1);
                const weight = startWeight + (endWeight - startWeight) * progress;
                const reps = 8 + Math.floor(Math.random() * 4); // 8-12 reps

                data.push({
                    id: `${exerciseId}_${i}`,
                    exerciseId,
                    date: date.toISOString().split('T')[0],
                    weight: Math.round(weight * 10) / 10,
                    reps,
                    sets: 3 + Math.floor(Math.random() * 2), // 3-4 sets
                    notes: i % 3 === 0 ? 'Sesión intensa' : ''
                });
            }
            return data;
        };

        // Generar progreso para cada ejercicio
        const progressHistory = [
            ...generateProgressData(1, 60, 75), // Press de Banca
            ...generateProgressData(2, 80, 100), // Sentadilla
            ...generateProgressData(3, 70, 90), // Peso Muerto
            ...generateProgressData(4, 35, 45), // Press Militar
            ...generateProgressData(5, 15, 25), // Flexiones (reps)
            ...generateProgressData(6, 5, 12) // Dominadas (reps)
        ];

        // Historial de asistencia
        const attendanceHistory = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i * 2);

            attendanceHistory.push({
                id: i + 1,
                date: date.toISOString().split('T')[0],
                checkIn: `${7 + Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                checkOut: `${19 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                duration: `${1 + Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 60)}m`,
                activity: ['Entrenamiento General', 'Cardio', 'Pesas', 'Funcional'][Math.floor(Math.random() * 4)]
            });
        }

        // Historial de membresías
        const membershipHistory = [
            {
                id: 1,
                planName: 'Premium Anual',
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                status: 'active',
                price: 599.99,
                features: ['Acceso 24/7', 'Todas las clases', 'Entrenador personal']
            },
            {
                id: 2,
                planName: 'Básico Mensual',
                startDate: '2024-10-01',
                endDate: '2024-12-31',
                status: 'expired',
                price: 49.99,
                features: ['Acceso horario limitado', 'Clases grupales básicas']
            }
        ];

        // Datos biométricos
        const biometricData = {
            personalInfo: {
                height: 1.75,
                age: 28,
                gender: 'M',
                fitnessGoal: 'Ganancia muscular',
                medicalConditions: []
            },
            currentMetrics: {
                weight: 75.2,
                bodyFat: 12.5,
                muscleMass: 65.8,
                bmi: 24.6,
                lastUpdated: new Date().toISOString().split('T')[0]
            },
            weightHistory: this.generateWeightHistory(),
            bodyComposition: {
                muscle: 65.8,
                fat: 9.4,
                water: 62.3,
                bone: 3.2
            }
        };

        return {
            exercises,
            progressHistory,
            attendanceHistory,
            membershipHistory,
            biometricData
        };
    }

    generateWeightHistory() {
        const history = [];
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);

        let currentWeight = 78.5;

        for (let i = 0; i < 25; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + (i * 7));

            // Simulamos una tendencia de pérdida de peso gradual
            currentWeight += (Math.random() - 0.6) * 0.5;

            history.push({
                date: date.toISOString().split('T')[0],
                weight: Math.round(currentWeight * 10) / 10,
                bodyFat: 15.2 - (i * 0.1),
                muscleMass: 60.5 + (i * 0.2)
            });
        }

        return history;
    }

    // ==================== MÉTODOS AUXILIARES ====================

    handleError(error) {
        if (error.response) {
            return {
                success: false,
                error: error.response.data.message || 'Error del servidor',
                status: error.response.status
            };
        } else if (error.request) {
            return {
                success: false,
                error: 'Error de conexión con el servidor',
                status: 0
            };
        } else {
            return {
                success: false,
                error: 'Error inesperado',
                status: -1
            };
        }
    }

    // ==================== MODO DESARROLLO ====================

    async getMockData() {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            success: true,
            data: this.generateMockData()
        };
    }
}

export const progressService = new ProgressService();
export default progressService;