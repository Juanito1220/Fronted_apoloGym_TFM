import { db } from '../api';

// Servicio para gestión de rutinas asignadas del cliente
class RoutineService {
    constructor() {
        this.baseURL = '/api/v1';
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    // ==================== RUTINAS ASIGNADAS ====================

    /**
     * Obtener la rutina activa asignada al cliente autenticado
     */
    async getMyCurrentRoutine() {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                return {
                    success: true,
                    data: mockData.currentRoutine
                };
            }

            const response = await fetch(`${this.baseURL}/routines/my-current`, {
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
            console.error('Error fetching current routine:', error);
            return this.handleError(error);
        }
    }

    /**
     * Obtener historial de rutinas del cliente
     */
    async getMyRoutineHistory(limit = 20, page = 1) {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                return {
                    success: true,
                    data: mockData.routineHistory.slice(0, limit)
                };
            }

            const params = new URLSearchParams({
                limit: limit.toString(),
                page: page.toString()
            });

            const response = await fetch(`${this.baseURL}/routines/my-history?${params}`, {
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
            console.error('Error fetching routine history:', error);
            return this.handleError(error);
        }
    }

    /**
     * Obtener detalles específicos de un ejercicio
     */
    async getExerciseDetails(exerciseId) {
        try {
            if (this.isDevelopment) {
                const mockData = this.generateMockData();
                const exercise = mockData.exerciseLibrary.find(e => e.id === exerciseId);
                return {
                    success: true,
                    data: exercise || null
                };
            }

            const response = await fetch(`${this.baseURL}/exercises/${exerciseId}/details`, {
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
            console.error('Error fetching exercise details:', error);
            return this.handleError(error);
        }
    }

    /**
     * Marcar ejercicio como completado
     */
    async markExerciseCompleted(routineId, exerciseId, performanceData) {
        try {
            if (this.isDevelopment) {
                // Simular guardado en localStorage
                const key = `completed_exercises_${routineId}`;
                const completed = db.list(key);
                const newEntry = {
                    exerciseId,
                    completedAt: new Date().toISOString(),
                    performance: performanceData
                };
                completed.push(newEntry);
                db.save(key, completed);

                return {
                    success: true,
                    data: newEntry
                };
            }

            const response = await fetch(`${this.baseURL}/routines/${routineId}/exercises/${exerciseId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(performanceData)
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
            console.error('Error marking exercise as completed:', error);
            return this.handleError(error);
        }
    }

    // ==================== DATOS MOCK PARA DESARROLLO ====================

    generateMockData() {
        const exerciseLibrary = [
            {
                id: 1,
                name: 'Press de Banca',
                category: 'Pecho',
                muscleGroups: ['Pectorales', 'Tríceps', 'Deltoides anterior'],
                equipment: 'Barra',
                difficulty: 'Intermedio',
                description: 'Ejercicio fundamental para el desarrollo del pecho. Acuéstate en el banco, baja la barra hasta el pecho y empuja hacia arriba.',
                instructions: [
                    'Acuéstate en el banco con los pies firmes en el suelo',
                    'Agarra la barra con las manos separadas al ancho de los hombros',
                    'Baja la barra de forma controlada hasta tocar el pecho',
                    'Empuja la barra hacia arriba hasta extender completamente los brazos'
                ],
                videoUrl: 'https://example.com/press-banca-video',
                imageUrl: 'https://example.com/press-banca-image',
                safetyTips: [
                    'Siempre usa un spotter para pesos pesados',
                    'Mantén la espalda pegada al banco',
                    'No rebotes la barra en el pecho'
                ]
            },
            {
                id: 2,
                name: 'Sentadilla',
                category: 'Piernas',
                muscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales', 'Core'],
                equipment: 'Barra',
                difficulty: 'Intermedio',
                description: 'Ejercicio compuesto fundamental para el tren inferior. Desarrolla fuerza y masa muscular en piernas y glúteos.',
                instructions: [
                    'Coloca la barra en la parte superior de la espalda',
                    'Separa los pies al ancho de los hombros',
                    'Baja como si fueras a sentarte en una silla',
                    'Baja hasta que los muslos estén paralelos al suelo',
                    'Empuja con los talones para volver a la posición inicial'
                ],
                videoUrl: 'https://example.com/sentadilla-video',
                imageUrl: 'https://example.com/sentadilla-image',
                safetyTips: [
                    'Mantén las rodillas alineadas con los pies',
                    'No permitas que las rodillas se vayan hacia adentro',
                    'Mantén el core activado durante todo el movimiento'
                ]
            },
            {
                id: 3,
                name: 'Peso Muerto',
                category: 'Espalda',
                muscleGroups: ['Erector espinal', 'Glúteos', 'Isquiotibiales', 'Trapecios'],
                equipment: 'Barra',
                difficulty: 'Avanzado',
                description: 'Ejercicio compuesto que trabaja toda la cadena posterior. Excelente para desarrollar fuerza funcional.',
                instructions: [
                    'Colócate frente a la barra con los pies separados al ancho de las caderas',
                    'Agarra la barra con las manos separadas al ancho de los hombros',
                    'Mantén la espalda recta y el pecho arriba',
                    'Levanta la barra extendiendo las caderas y rodillas simultáneamente',
                    'Termina erguido con los hombros hacia atrás'
                ],
                videoUrl: 'https://example.com/peso-muerto-video',
                imageUrl: 'https://example.com/peso-muerto-image',
                safetyTips: [
                    'Nunca redondees la espalda',
                    'Mantén la barra cerca del cuerpo',
                    'Comienza con peso ligero para perfeccionar la técnica'
                ]
            },
            {
                id: 4,
                name: 'Press Militar',
                category: 'Hombros',
                muscleGroups: ['Deltoides', 'Tríceps', 'Core'],
                equipment: 'Barra',
                difficulty: 'Intermedio',
                description: 'Ejercicio vertical de empuje que desarrolla los hombros y estabiliza el core.',
                instructions: [
                    'Coloca la barra a la altura de los hombros',
                    'Agarra la barra con las manos separadas al ancho de los hombros',
                    'Empuja la barra directamente hacia arriba',
                    'Extiende completamente los brazos por encima de la cabeza',
                    'Baja de forma controlada a la posición inicial'
                ],
                videoUrl: 'https://example.com/press-militar-video',
                imageUrl: 'https://example.com/press-militar-image',
                safetyTips: [
                    'Mantén el core activado',
                    'No arquees excesivamente la espalda',
                    'Controla el peso en todo momento'
                ]
            },
            {
                id: 5,
                name: 'Flexiones',
                category: 'Pecho',
                muscleGroups: ['Pectorales', 'Tríceps', 'Deltoides anterior', 'Core'],
                equipment: 'Peso corporal',
                difficulty: 'Principiante',
                description: 'Ejercicio básico de peso corporal que desarrolla el tren superior y el core.',
                instructions: [
                    'Comienza en posición de plancha',
                    'Mantén el cuerpo en línea recta',
                    'Baja el pecho hacia el suelo',
                    'Empuja hacia arriba hasta extender los brazos'
                ],
                videoUrl: 'https://example.com/flexiones-video',
                imageUrl: 'https://example.com/flexiones-image',
                safetyTips: [
                    'Mantén el core activado',
                    'No permitas que las caderas se hundan',
                    'Controla el movimiento en ambas direcciones'
                ]
            },
            {
                id: 6,
                name: 'Dominadas',
                category: 'Espalda',
                muscleGroups: ['Dorsal ancho', 'Romboides', 'Bíceps', 'Core'],
                equipment: 'Barra de dominadas',
                difficulty: 'Avanzado',
                description: 'Ejercicio de tracción vertical que desarrolla la espalda y los brazos.',
                instructions: [
                    'Cuelga de la barra con agarre supino',
                    'Activa los músculos de la espalda',
                    'Tira hacia arriba hasta que el mentón pase la barra',
                    'Baja de forma controlada'
                ],
                videoUrl: 'https://example.com/dominadas-video',
                imageUrl: 'https://example.com/dominadas-image',
                safetyTips: [
                    'Evita balancearte',
                    'Controla el descenso',
                    'Usa asistencia si es necesario al principio'
                ]
            }
        ];

        const currentRoutine = {
            id: 1,
            name: 'Fuerza 5x5 - Semana 3',
            description: 'Rutina de fuerza enfocada en movimientos compuestos con el método 5x5',
            assignedBy: {
                id: 1,
                name: 'Carlos Mendoza',
                specialization: 'Entrenamiento de Fuerza',
                certification: 'NSCA-CPT'
            },
            status: 'active',
            startDate: '2025-09-15',
            endDate: '2025-10-15',
            daysPerWeek: 3,
            estimatedDuration: 60, // minutos
            difficultyLevel: 'Intermedio',
            goals: ['Aumento de fuerza', 'Hipertrofia', 'Técnica'],
            exercises: [
                {
                    id: 1,
                    exerciseId: 1,
                    name: 'Press de Banca',
                    order: 1,
                    sets: 5,
                    reps: '5',
                    restTime: '90-120 segundos',
                    targetWeight: '80-85 kg',
                    notes: 'Enfócate en la técnica perfecta. Incrementa 2.5kg si completas todas las series.',
                    rpeTarget: '7-8',
                    isCompleted: false
                },
                {
                    id: 2,
                    exerciseId: 2,
                    name: 'Sentadilla',
                    order: 2,
                    sets: 5,
                    reps: '5',
                    restTime: '120-180 segundos',
                    targetWeight: '100-110 kg',
                    notes: 'Mantén la profundidad consistente. Usa cinturón si es necesario.',
                    rpeTarget: '7-8',
                    isCompleted: false
                },
                {
                    id: 3,
                    exerciseId: 4,
                    name: 'Press Militar',
                    order: 3,
                    sets: 3,
                    reps: '8-10',
                    restTime: '60-90 segundos',
                    targetWeight: '45-50 kg',
                    notes: 'Trabajo accesorio. Mantén el core activado.',
                    rpeTarget: '6-7',
                    isCompleted: false
                },
                {
                    id: 4,
                    exerciseId: 5,
                    name: 'Flexiones',
                    order: 4,
                    sets: 3,
                    reps: '15-20',
                    restTime: '45-60 segundos',
                    targetWeight: 'Peso corporal',
                    notes: 'Finalizador. Mantén buena forma hasta el final.',
                    rpeTarget: '8-9',
                    isCompleted: false
                }
            ],
            trainingDays: ['Lunes', 'Miércoles', 'Viernes'],
            lastUpdated: '2025-09-25T10:30:00Z',
            progressNotes: 'El cliente está progresando bien. Considera incrementar pesos la próxima semana.',
            nextReview: '2025-10-01'
        };

        const routineHistory = [
            {
                id: 2,
                name: 'Adaptación Anatómica',
                assignedBy: { name: 'Carlos Mendoza' },
                startDate: '2025-08-01',
                endDate: '2025-09-14',
                status: 'completed',
                exerciseCount: 8,
                completionRate: 95,
                averageRating: 4.2
            },
            {
                id: 3,
                name: 'Resistencia Cardiovascular',
                assignedBy: { name: 'Ana García' },
                startDate: '2025-07-01',
                endDate: '2025-07-31',
                status: 'completed',
                exerciseCount: 6,
                completionRate: 88,
                averageRating: 4.0
            },
            {
                id: 4,
                name: 'Movilidad y Flexibilidad',
                assignedBy: { name: 'Carlos Mendoza' },
                startDate: '2025-06-15',
                endDate: '2025-06-30',
                status: 'completed',
                exerciseCount: 10,
                completionRate: 92,
                averageRating: 4.5
            }
        ];

        return {
            currentRoutine,
            routineHistory,
            exerciseLibrary
        };
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
                error: error.message || 'Error inesperado',
                status: -1
            };
        }
    }

    // ==================== MODO DESARROLLO ====================

    async getMockData() {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
            success: true,
            data: this.generateMockData()
        };
    }
}

export const routineService = new RoutineService();
export default routineService;