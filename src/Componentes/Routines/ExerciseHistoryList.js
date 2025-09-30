import React, { useState } from 'react';
import { Calendar, TrendingUp, Target, Clock, Filter, Search, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

const ExerciseHistoryList = ({ exercises, exerciseHistory, onExerciseClick, filters, onFilterChange }) => {
    const [expandedExercise, setExpandedExercise] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const getExerciseStats = React.useCallback((exerciseId) => {
        const history = exerciseHistory[exerciseId] || [];
        if (history.length === 0) return null;

        const totalSessions = history.length;
        const latestSession = history[history.length - 1];
        const firstSession = history[0];

        // Calcular progreso de peso
        const weightProgress = latestSession.weight && firstSession.weight
            ? ((parseFloat(latestSession.weight) - parseFloat(firstSession.weight)) / parseFloat(firstSession.weight) * 100).toFixed(1)
            : 0;

        // Calcular volume promedio (peso x reps x sets)
        const averageVolume = history.reduce((acc, session) => {
            const weight = parseFloat(session.weight) || 0;
            const totalReps = session.reps.split(',').reduce((sum, rep) => sum + parseInt(rep.trim()), 0);
            return acc + (weight * totalReps);
        }, 0) / totalSessions;

        return {
            totalSessions,
            latestSession,
            weightProgress,
            averageVolume: Math.round(averageVolume),
            lastPerformed: new Date(latestSession.date).toLocaleDateString('es-ES')
        };
    }, [exerciseHistory]); const getMuscleGroupColor = (group) => {
        const colors = {
            'Pecho': 'bg-red-100 text-red-700 border-red-200',
            'Espalda': 'bg-blue-100 text-blue-700 border-blue-200',
            'Piernas': 'bg-green-100 text-green-700 border-green-200',
            'Hombros': 'bg-purple-100 text-purple-700 border-purple-200',
            'Brazos': 'bg-orange-100 text-orange-700 border-orange-200',
            'Core': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Cardio': 'bg-pink-100 text-pink-700 border-pink-200'
        };
        return colors[group] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getDifficultyColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'principiante': return 'bg-green-50 text-green-700 border-green-200';
            case 'intermedio': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'avanzado': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const filteredAndSortedExercises = React.useMemo(() => {
        if (!exercises || !Array.isArray(exercises)) {
            return [];
        }

        let filtered = exercises.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesMuscleGroup = !filters.muscleGroup || exercise.muscleGroup === filters.muscleGroup;
            const matchesDifficulty = !filters.difficulty || exercise.difficulty === filters.difficulty;
            const matchesEquipment = !filters.equipment || exercise.equipment === filters.equipment;

            return matchesSearch && matchesMuscleGroup && matchesDifficulty && matchesEquipment;
        });

        // Ordenar
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'muscleGroup':
                    aValue = a.muscleGroup.toLowerCase();
                    bValue = b.muscleGroup.toLowerCase();
                    break;
                case 'difficulty':
                    const difficultyOrder = { 'principiante': 1, 'intermedio': 2, 'avanzado': 3 };
                    aValue = difficultyOrder[a.difficulty.toLowerCase()] || 0;
                    bValue = difficultyOrder[b.difficulty.toLowerCase()] || 0;
                    break;
                case 'lastPerformed':
                    const aStats = getExerciseStats(a.exerciseId);
                    const bStats = getExerciseStats(b.exerciseId);
                    aValue = aStats ? new Date(aStats.latestSession.date) : new Date(0);
                    bValue = bStats ? new Date(bStats.latestSession.date) : new Date(0);
                    break;
                default:
                    aValue = a[sortBy];
                    bValue = b[sortBy];
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [exercises, searchTerm, filters, sortBy, sortOrder, getExerciseStats]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const uniqueMuscleGroups = exercises ? [...new Set(exercises.map(ex => ex.muscleGroup))] : [];
    const uniqueDifficulties = exercises ? [...new Set(exercises.map(ex => ex.difficulty))] : [];
    const uniqueEquipment = exercises ? [...new Set(exercises.map(ex => ex.equipment))] : [];

    return (
        <div className="space-y-6">
            {/* Controles de búsqueda y filtros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Búsqueda */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar ejercicios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={filters.muscleGroup || ''}
                            onChange={(e) => onFilterChange({ ...filters, muscleGroup: e.target.value || null })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los grupos</option>
                            {uniqueMuscleGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>

                        <select
                            value={filters.difficulty || ''}
                            onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value || null })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todas las dificultades</option>
                            {uniqueDifficulties.map(difficulty => (
                                <option key={difficulty} value={difficulty}>{difficulty}</option>
                            ))}
                        </select>

                        <select
                            value={filters.equipment || ''}
                            onChange={(e) => onFilterChange({ ...filters, equipment: e.target.value || null })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todo el equipamiento</option>
                            {uniqueEquipment.map(equipment => (
                                <option key={equipment} value={equipment}>{equipment}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Controles de ordenación */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500 py-2">Ordenar por:</span>
                    {[
                        { key: 'name', label: 'Nombre' },
                        { key: 'muscleGroup', label: 'Grupo muscular' },
                        { key: 'difficulty', label: 'Dificultad' },
                        { key: 'lastPerformed', label: 'Última vez' }
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => handleSort(key)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${sortBy === key
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {label}
                            {sortBy === key && (
                                sortOrder === 'asc' ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de ejercicios */}
            <div className="space-y-4">
                {filteredAndSortedExercises.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ejercicios</h3>
                        <p className="text-gray-500">
                            Intenta ajustar los filtros de búsqueda o términos de búsqueda.
                        </p>
                    </div>
                ) : (
                    filteredAndSortedExercises.map((exercise) => {
                        const stats = getExerciseStats(exercise.exerciseId);
                        const isExpanded = expandedExercise === exercise.exerciseId;

                        return (
                            <div key={exercise.exerciseId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Header del ejercicio */}
                                <div
                                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedExercise(isExpanded ? null : exercise.exerciseId)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMuscleGroupColor(exercise.muscleGroup)}`}>
                                                    {exercise.muscleGroup}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                                                    {exercise.difficulty}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>

                                            {/* Estadísticas rápidas */}
                                            {stats && (
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Última vez: {stats.lastPerformed}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <BarChart3 className="w-4 h-4" />
                                                        <span>{stats.totalSessions} sesiones</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4" />
                                                        <span className={stats.weightProgress > 0 ? 'text-green-600' : 'text-gray-500'}>
                                                            {stats.weightProgress > 0 ? '+' : ''}{stats.weightProgress}% peso
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {!stats && (
                                                <div className="text-sm text-gray-400">
                                                    Sin historial de entrenamiento
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onExerciseClick(exercise);
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Ver detalles
                                            </button>

                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Historial expandido */}
                                {isExpanded && stats && (
                                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                                        <h4 className="font-medium text-gray-900 mb-4">Historial de entrenamientos</h4>

                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {exerciseHistory[exercise.exerciseId].slice(-10).reverse().map((session, index) => (
                                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-gray-900">
                                                            {new Date(session.date).toLocaleDateString('es-ES')}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            RPE: {session.rpe || 'N/A'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Target className="w-4 h-4 text-blue-500" />
                                                            <span>{session.sets} series × {session.reps} reps</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                                            <span>Peso: {session.weight}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-purple-500" />
                                                            <span>Volumen: {Math.round((parseFloat(session.weight) || 0) * session.reps.split(',').reduce((sum, rep) => sum + parseInt(rep.trim()), 0))}kg</span>
                                                        </div>
                                                    </div>

                                                    {session.notes && (
                                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                                            <strong>Notas:</strong> {session.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {exerciseHistory[exercise.exerciseId].length > 10 && (
                                            <div className="mt-4 text-center">
                                                <button
                                                    onClick={() => onExerciseClick(exercise)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    Ver historial completo ({exerciseHistory[exercise.exerciseId].length} sesiones)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Resumen de filtros aplicados */}
            {(filters.muscleGroup || filters.difficulty || filters.equipment || searchTerm) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm text-blue-700">
                                Mostrando {filteredAndSortedExercises.length} de {exercises ? exercises.length : 0} ejercicios
                            </span>
                            {(filters.muscleGroup || filters.difficulty || filters.equipment) && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {filters.muscleGroup && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {filters.muscleGroup}
                                        </span>
                                    )}
                                    {filters.difficulty && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {filters.difficulty}
                                        </span>
                                    )}
                                    {filters.equipment && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {filters.equipment}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                onFilterChange({});
                                setSearchTerm('');
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseHistoryList;