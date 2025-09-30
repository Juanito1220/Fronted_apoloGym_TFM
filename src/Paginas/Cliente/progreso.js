import React, { useState } from 'react';
import { TrendingUp, Activity, Calendar, User, BarChart3, Target } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';
import ProgressCharts from '../../Componentes/Progress/ProgressCharts';
import AttendanceHistory from '../../Componentes/Progress/AttendanceHistory';
import MembershipHistory from '../../Componentes/Progress/MembershipHistory';
import BiometricProfile from '../../Componentes/Progress/BiometricProfile';
import LoadingSpinner from '../../Componentes/LoadingSpinner';
import ErrorMessage from '../../Componentes/ErrorMessage';
import '../../Styles/progreso.css';

const ProgressDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'charts', 'attendance', 'memberships', 'profile'

  const {
    loading,
    error,
    exercises,
    progressHistory,
    attendanceHistory,
    membershipHistory,
    biometricData,
    selectedExercise,
    dateRange,
    progressStats,
    attendanceStats,
    weightChartData,
    exerciseChartData,
    updateDateRange,
    selectExercise,
    refreshData
  } = useProgress();

  // Pestañas del dashboard
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'charts', label: 'Progreso', icon: TrendingUp },
    { id: 'attendance', label: 'Asistencia', icon: Calendar },
    { id: 'memberships', label: 'Membresías', icon: Target },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  // Renderizar contenido de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <ErrorMessage
            error={error}
            showRetry={true}
            onRetry={refreshData}
            className="mb-6"
          />
        </div>
      </div>
    );
  }

  // Renderizar contenido de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" className="text-blue-600" />
        <p className="ml-4 text-gray-600">Cargando datos de progreso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header del dashboard */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Progreso Físico</h1>
          <p className="text-gray-600">
            Seguimiento completo de tu evolución y rendimiento en el gimnasio
          </p>
        </div>

        {/* Navegación de pestañas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="space-y-6">
          {/* Tab: Resumen General */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total de entrenamientos */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Entrenamientos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {progressHistory.length}
                      </p>
                      <p className="text-xs text-gray-400">sesiones registradas</p>
                    </div>
                  </div>
                </div>

                {/* Asistencia del mes */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Este mes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {attendanceStats.thisMonth}
                      </p>
                      <p className="text-xs text-gray-400">días de asistencia</p>
                    </div>
                  </div>
                </div>

                {/* Peso actual */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Peso actual</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {biometricData?.currentMetrics?.weight || '--'} kg
                      </p>
                      <p className="text-xs text-gray-400">
                        IMC: {biometricData?.currentMetrics?.bmi || '--'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Racha actual */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Racha actual</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {attendanceStats.streak}
                      </p>
                      <p className="text-xs text-gray-400">días consecutivos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista rápida de gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progreso de peso corporal */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Evolución del Peso</h3>
                  {weightChartData.length > 0 ? (
                    <div className="h-48">
                      <svg width="100%" height="100%" viewBox="0 0 400 192" className="overflow-visible">
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        {/* Línea simplificada del peso */}
                        <path
                          d={`M 20 ${180 - (weightChartData[0]?.weight - 70) * 4} ${weightChartData.map((d, i) =>
                            `L ${20 + (i * (360 / (weightChartData.length - 1)))} ${180 - (d.weight - 70) * 4}`
                          ).join(' ')}`}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      No hay datos de peso disponibles
                    </div>
                  )}
                </div>

                {/* Progreso de ejercicios */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Progreso de {selectedExercise?.name || 'Ejercicio'}
                  </h3>
                  {exerciseChartData.length > 0 ? (
                    <div className="h-48">
                      <svg width="100%" height="100%" viewBox="0 0 400 192" className="overflow-visible">
                        {/* Barras simplificadas */}
                        {exerciseChartData.slice(-8).map((d, i) => (
                          <rect
                            key={i}
                            x={20 + (i * 45)}
                            y={180 - (d.weight * 2)}
                            width="35"
                            height={d.weight * 2}
                            fill="#8b5cf6"
                            rx="2"
                          />
                        ))}
                      </svg>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      No hay datos de progreso disponibles
                    </div>
                  )}
                </div>
              </div>

              {/* Actividad reciente */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {attendanceHistory.slice(0, 5).map((attendance, index) => (
                    <div key={attendance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(attendance.date).toLocaleDateString('es-ES')}
                          </p>
                          <p className="text-sm text-gray-500">{attendance.activity}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {attendance.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Gráficos de Progreso */}
          {activeTab === 'charts' && (
            <ProgressCharts
              exerciseChartData={exerciseChartData}
              weightChartData={weightChartData}
              selectedExercise={selectedExercise}
              exercises={exercises}
              onExerciseChange={selectExercise}
              dateRange={dateRange}
              onDateRangeChange={updateDateRange}
              progressStats={progressStats}
            />
          )}

          {/* Tab: Historial de Asistencia */}
          {activeTab === 'attendance' && (
            <AttendanceHistory
              attendanceHistory={attendanceHistory}
              attendanceStats={attendanceStats}
              loading={false}
            />
          )}

          {/* Tab: Historial de Membresías */}
          {activeTab === 'memberships' && (
            <MembershipHistory
              membershipHistory={membershipHistory}
              loading={false}
            />
          )}

          {/* Tab: Perfil Biométrico */}
          {activeTab === 'profile' && (
            <BiometricProfile
              biometricData={biometricData}
              loading={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
