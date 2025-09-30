import React, { useState } from 'react';
import { Calendar, Target, TrendingUp, Activity, Clock, User, AlertCircle } from 'lucide-react';
import ActiveRoutineCard from '../../Componentes/Routines/ActiveRoutineCard';
import ExerciseHistoryList from '../../Componentes/Routines/ExerciseHistoryList';
import ExerciseDetailModal from '../../Componentes/Routines/ExerciseDetailModal';
import { useRoutines } from '../../hooks/useRoutines';

const RutinasAsignadas = () => {
  const {
    currentRoutine,
    exerciseLibrary: allExercises,
    completedExercises,
    routineStats,
    markExerciseCompleted,
    markExerciseUncompleted,
    loadExerciseDetails: getExerciseDetails,
    loading,
    error
  } = useRoutines();

  // Mock exercise history for now - this should come from the service
  const exerciseHistory = {
    'squat_barbell': [
      {
        date: '2024-09-25T00:00:00Z',
        weight: '75kg',
        sets: 4,
        reps: '8,8,6,6',
        rpe: 7,
        notes: 'Buen entrenamiento'
      },
      {
        date: '2024-09-22T00:00:00Z',
        weight: '70kg',
        sets: 4,
        reps: '8,8,8,7',
        rpe: 6,
        notes: ''
      }
    ],
    'bench_press': [
      {
        date: '2024-09-25T00:00:00Z',
        weight: '60kg',
        sets: 4,
        reps: '10,8,8,6',
        rpe: 8,
        notes: 'Se sintió pesado'
      }
    ]
  };

  const [activeTab, setActiveTab] = useState('routine');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseFilters, setExerciseFilters] = useState({});

  // Calcular días restantes de la rutina actual
  const getDaysRemaining = () => {
    if (!currentRoutine?.endDate) return null;
    const endDate = new Date(currentRoutine.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExerciseClick = async (exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);

    // Cargar detalles del ejercicio si es necesario
    try {
      await getExerciseDetails(exercise.exerciseId);
    } catch (error) {
      console.error('Error loading exercise details:', error);
    }
  };

  const handleMarkCompleted = (exerciseId, performanceData) => {
    markExerciseCompleted(exerciseId, performanceData);
  };

  const handleMarkUncompleted = (exerciseId) => {
    markExerciseUncompleted(exerciseId);
  };

  const isRoutineActive = currentRoutine?.status === 'active';
  const daysRemaining = getDaysRemaining();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando rutinas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error al cargar las rutinas</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Título del módulo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">💪 Rutinas Asignadas</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gestiona tu rutina de entrenamiento, haz seguimiento del progreso y consulta la biblioteca de ejercicios.
          </p>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rutina actual</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {currentRoutine ? 'Activa' : 'Sin asignar'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ejercicios completados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {routineStats.completedExercises}/{routineStats.totalExercises}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(routineStats.completionPercentage)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Días restantes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {daysRemaining !== null ? daysRemaining : '--'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'routine', label: 'Rutina Actual', icon: Target },
                { id: 'exercises', label: 'Biblioteca de Ejercicios', icon: Activity },
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

          <div className="p-6">
            {activeTab === 'routine' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Mi Rutina Asignada</h2>
                  <p className="text-gray-600">
                    Aquí puedes ver tu rutina actual, hacer seguimiento del progreso y marcar ejercicios como completados.
                  </p>
                </div>

                <ActiveRoutineCard
                  routine={currentRoutine}
                  routineStats={routineStats}
                  completedExercises={completedExercises}
                  onMarkCompleted={handleMarkCompleted}
                  onMarkUncompleted={handleMarkUncompleted}
                  onViewExerciseDetails={getExerciseDetails}
                  isActive={isRoutineActive}
                  daysRemaining={daysRemaining}
                />

                {/* Próximas sesiones programadas */}
                {currentRoutine && (
                  <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas sesiones programadas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
                        const isTrainingDay = currentRoutine.trainingDays.some(day =>
                          day.toLowerCase().includes(dayName.toLowerCase())
                        );

                        return (
                          <div
                            key={i}
                            className={`p-3 rounded-lg text-center ${isTrainingDay
                              ? 'bg-blue-100 border-2 border-blue-300 text-blue-800'
                              : 'bg-gray-50 text-gray-600'
                              }`}
                          >
                            <div className="font-medium">{dayName}</div>
                            <div className="text-sm">{date.getDate()}</div>
                            {isTrainingDay && (
                              <div className="text-xs mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                Entrenamiento
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'exercises' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Biblioteca de Ejercicios</h2>
                  <p className="text-gray-600">
                    Explora todos los ejercicios disponibles, revisa tu historial de entrenamiento y aprende nuevas técnicas.
                  </p>
                </div>

                <ExerciseHistoryList
                  exercises={allExercises}
                  exerciseHistory={exerciseHistory}
                  onExerciseClick={handleExerciseClick}
                  filters={exerciseFilters}
                  onFilterChange={setExerciseFilters}
                />
              </div>
            )}
          </div>
        </div>

        {/* Información adicional para el cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contacto con el entrenador */}
          {currentRoutine && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Entrenador</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentRoutine.assignedBy.name}</p>
                  <p className="text-sm text-gray-600">{currentRoutine.assignedBy.specialization}</p>
                  <p className="text-sm text-gray-500">Contacto: trainer@apollogym.com</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Tip del entrenador:</strong> Recuerda mantener una buena técnica en cada ejercicio.
                  Es mejor hacer menos repeticiones con buena forma que muchas con mala técnica.
                </p>
              </div>
            </div>
          )}

          {/* Consejos de entrenamiento */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Consejos de Entrenamiento</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Completa todos los ejercicios de cada sesión para obtener resultados óptimos.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Respeta los tiempos de descanso entre series para mantener la intensidad.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Anota tus sensaciones y progreso para que tu entrenador pueda ajustar la rutina.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Mantente hidratado y escucha a tu cuerpo durante el entrenamiento.
                </p>
              </div>
            </div>
          </div>
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
          onMarkCompleted={handleMarkCompleted}
          isCompleted={completedExercises.has(selectedExercise.exerciseId)}
        />
      )}
    </div>
  );
};

export default RutinasAsignadas;