import React, { useState } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart
} from 'recharts';
import { Calendar, TrendingUp, Weight, Activity, Target, BarChart3 } from 'lucide-react';

const ProgressCharts = ({
    exerciseChartData,
    weightChartData,
    selectedExercise,
    exercises,
    onExerciseChange,
    dateRange,
    onDateRangeChange,
    progressStats
}) => {
    const [activeChart, setActiveChart] = useState('weight'); // 'weight', 'reps', 'volume'
    const [weightChartType, setWeightChartType] = useState('weight'); // 'weight', 'bodyFat', 'muscle'

    // Formatear fecha para tooltips
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short'
        });
    };

    // Custom tooltip para gráficos de ejercicios
    const ExerciseTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{formatDate(label)}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                            {entry.dataKey === 'weight' && selectedExercise?.unit === 'kg' ? ' kg' : ''}
                            {entry.dataKey === 'reps' ? ' reps' : ''}
                            {entry.dataKey === 'volume' ? ' kg total' : ''}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Custom tooltip para gráficos de peso corporal
    const WeightTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{formatDate(label)}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                            {entry.dataKey === 'weight' ? ' kg' : ''}
                            {entry.dataKey === 'bodyFat' ? '%' : ''}
                            {entry.dataKey === 'muscleMass' ? ' kg' : ''}
                            {entry.dataKey === 'bmi' ? '' : ''}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Botones rápidos para rangos de fecha
    const quickDateRanges = [
        { label: 'Última semana', days: 7 },
        { label: 'Último mes', days: 30 },
        { label: 'Últimos 3 meses', days: 90 },
        { label: 'Último año', days: 365 }
    ];

    const handleQuickDateRange = (days) => {
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        onDateRangeChange(start, end);
    };

    return (
        <div className="space-y-6">
            {/* Controles de filtros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Selector de ejercicio */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Activity className="inline w-4 h-4 mr-1" />
                            Ejercicio
                        </label>
                        <select
                            value={selectedExercise?.id || ''}
                            onChange={(e) => {
                                const exercise = exercises.find(ex => ex.id === parseInt(e.target.value));
                                onExerciseChange(exercise);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {exercises.map(exercise => (
                                <option key={exercise.id} value={exercise.id}>
                                    {exercise.name} ({exercise.category})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rango de fechas */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Rango de fechas
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => onDateRangeChange(e.target.value, dateRange.end)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => onDateRangeChange(dateRange.start, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Botones rápidos */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Períodos rápidos</label>
                        <div className="flex flex-wrap gap-1">
                            {quickDateRanges.map(range => (
                                <button
                                    key={range.days}
                                    onClick={() => handleQuickDateRange(range.days)}
                                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            {progressStats && selectedExercise && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <Target className="w-5 h-5 text-blue-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Progreso</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {progressStats.weightProgress > 0 ? '+' : ''}{progressStats.weightProgress.toFixed(1)}
                                    {selectedExercise.unit}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Sesiones</p>
                                <p className="text-lg font-bold text-gray-900">{progressStats.totalSessions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Mejor marca</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {progressStats.bestSession?.weight || 0} {selectedExercise.unit}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <Weight className="w-5 h-5 text-orange-500 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Promedio</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {progressStats.averageWeight?.toFixed(1) || 0} {selectedExercise.unit}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gráficos de progreso de ejercicios */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                        Progreso de {selectedExercise?.name || 'Ejercicio'}
                    </h3>

                    {/* Selector de métrica */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {[
                            { key: 'weight', label: 'Peso', icon: Weight },
                            { key: 'reps', label: 'Reps', icon: Target },
                            { key: 'volume', label: 'Volumen', icon: BarChart3 }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveChart(key)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${activeChart === key
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <ComposedChart data={exerciseChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                stroke="#666"
                            />
                            <YAxis stroke="#666" />
                            <Tooltip content={<ExerciseTooltip />} />
                            <Legend />

                            {activeChart === 'weight' && (
                                <>
                                    <Area
                                        type="monotone"
                                        dataKey="weight"
                                        fill="#3b82f6"
                                        fillOpacity={0.1}
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        name={`Peso (${selectedExercise?.unit || 'kg'})`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="oneRepMax"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="1RM estimado"
                                    />
                                </>
                            )}

                            {activeChart === 'reps' && (
                                <Bar
                                    dataKey="reps"
                                    fill="#8b5cf6"
                                    name="Repeticiones"
                                    radius={[2, 2, 0, 0]}
                                />
                            )}

                            {activeChart === 'volume' && (
                                <Area
                                    type="monotone"
                                    dataKey="volume"
                                    fill="#f59e0b"
                                    fillOpacity={0.2}
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    name="Volumen total (kg)"
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráficos de composición corporal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Composición Corporal</h3>

                    {/* Selector de métrica corporal */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {[
                            { key: 'weight', label: 'Peso', color: '#3b82f6' },
                            { key: 'bodyFat', label: 'Grasa %', color: '#ef4444' },
                            { key: 'muscle', label: 'Músculo', color: '#10b981' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setWeightChartType(key)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${weightChartType === key
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={weightChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                stroke="#666"
                            />
                            <YAxis stroke="#666" />
                            <Tooltip content={<WeightTooltip />} />
                            <Legend />

                            {weightChartType === 'weight' && (
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    name="Peso (kg)"
                                />
                            )}

                            {weightChartType === 'bodyFat' && (
                                <Line
                                    type="monotone"
                                    dataKey="bodyFat"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    name="Grasa corporal (%)"
                                />
                            )}

                            {weightChartType === 'muscle' && (
                                <Line
                                    type="monotone"
                                    dataKey="muscleMass"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    name="Masa muscular (kg)"
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressCharts;