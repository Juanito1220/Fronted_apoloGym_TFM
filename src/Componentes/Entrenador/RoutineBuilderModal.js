import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTimes, FaDumbbell, FaTrash, FaSave } from 'react-icons/fa';

// Base de datos simulada de ejercicios
const EXERCISE_DATABASE = [
    {
        id: 1,
        nombre: 'Press de Banca',
        categoria: 'Pecho',
        grupoMuscular: 'pectorales',
        equipo: 'Barra',
        descripcion: 'Ejercicio básico para desarrollo del pecho'
    },
    {
        id: 2,
        nombre: 'Sentadilla',
        categoria: 'Piernas',
        grupoMuscular: 'cuadriceps',
        equipo: 'Barra',
        descripcion: 'Ejercicio fundamental para piernas'
    },
    {
        id: 3,
        nombre: 'Peso Muerto',
        categoria: 'Espalda',
        grupoMuscular: 'espalda_baja',
        equipo: 'Barra',
        descripcion: 'Ejercicio compuesto para espalda y piernas'
    },
    {
        id: 4,
        nombre: 'Press Militar',
        categoria: 'Hombros',
        grupoMuscular: 'deltoides',
        equipo: 'Barra',
        descripcion: 'Desarrollo de hombros y estabilidad del core'
    },
    {
        id: 5,
        nombre: 'Remo con Barra',
        categoria: 'Espalda',
        grupoMuscular: 'dorsales',
        equipo: 'Barra',
        descripcion: 'Fortalecimiento de la espalda media'
    },
    {
        id: 6,
        nombre: 'Curl de Bíceps',
        categoria: 'Brazos',
        grupoMuscular: 'biceps',
        equipo: 'Mancuernas',
        descripcion: 'Aislamiento de bíceps'
    },
    {
        id: 7,
        nombre: 'Extensión de Tríceps',
        categoria: 'Brazos',
        grupoMuscular: 'triceps',
        equipo: 'Mancuernas',
        descripcion: 'Aislamiento de tríceps'
    },
    {
        id: 8,
        nombre: 'Plancha',
        categoria: 'Core',
        grupoMuscular: 'abdominales',
        equipo: 'Peso Corporal',
        descripcion: 'Fortalecimiento del core'
    }
];

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function RoutineBuilderModal({ isOpen, onClose, onSave, editingRoutine = null }) {
    const [routineData, setRoutineData] = useState({
        nombre: '',
        descripcion: '',
        categoria: 'fuerza',
        duracionSemanas: 4,
        diasPorSemana: 3,
        bloques: []
    });

    const [selectedDay, setSelectedDay] = useState('Lunes');
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingRoutine) {
            setRoutineData(editingRoutine);
        }
    }, [editingRoutine]);

    if (!isOpen) return null;

    const categories = [...new Set(EXERCISE_DATABASE.map(ex => ex.categoria))];

    const filteredExercises = EXERCISE_DATABASE.filter(exercise => {
        const matchesSearch = exercise.nombre.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
            exercise.categoria.toLowerCase().includes(exerciseSearch.toLowerCase());
        const matchesCategory = !selectedCategory || exercise.categoria === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addExerciseToDay = (exercise) => {
        const newExercise = {
            id: Date.now(),
            ejercicioId: exercise.id,
            nombre: exercise.nombre,
            categoria: exercise.categoria,
            series: 3,
            repeticiones: 10,
            peso: 0,
            descanso: 60,
            notas: ''
        };

        setRoutineData(prev => {
            const bloqueIndex = prev.bloques.findIndex(b => b.dia === selectedDay);

            if (bloqueIndex >= 0) {
                const updatedBloques = [...prev.bloques];
                updatedBloques[bloqueIndex] = {
                    ...updatedBloques[bloqueIndex],
                    ejercicios: [...updatedBloques[bloqueIndex].ejercicios, newExercise]
                };
                return { ...prev, bloques: updatedBloques };
            } else {
                return {
                    ...prev,
                    bloques: [...prev.bloques, {
                        dia: selectedDay,
                        ejercicios: [newExercise]
                    }]
                };
            }
        });

        setExerciseSearch('');
        toast.success(`${exercise.nombre} agregado a ${selectedDay}`);
    };

    const updateExercise = (dayIndex, exerciseIndex, field, value) => {
        setRoutineData(prev => {
            const updatedBloques = [...prev.bloques];
            updatedBloques[dayIndex].ejercicios[exerciseIndex] = {
                ...updatedBloques[dayIndex].ejercicios[exerciseIndex],
                [field]: value
            };
            return { ...prev, bloques: updatedBloques };
        });
    };

    const removeExercise = (dayIndex, exerciseIndex) => {
        setRoutineData(prev => {
            const updatedBloques = [...prev.bloques];
            updatedBloques[dayIndex].ejercicios.splice(exerciseIndex, 1);

            // Remover el día si no tiene ejercicios
            if (updatedBloques[dayIndex].ejercicios.length === 0) {
                updatedBloques.splice(dayIndex, 1);
            }

            return { ...prev, bloques: updatedBloques };
        });
    };

    const handleSave = async () => {
        if (!routineData.nombre.trim()) {
            toast.error('El nombre de la rutina es requerido');
            return;
        }

        if (routineData.bloques.length === 0) {
            toast.error('Debe agregar al menos un ejercicio');
            return;
        }

        setSaving(true);
        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const routineToSave = {
                ...routineData,
                id: editingRoutine?.id || Date.now(),
                fechaCreacion: editingRoutine?.fechaCreacion || new Date().toISOString(),
                fechaModificacion: new Date().toISOString()
            };

            onSave(routineToSave);
        } catch (error) {
            toast.error('Error al guardar la rutina');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaDumbbell className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex h-[calc(90vh-140px)]">
                    {/* Left Panel - Routine Info & Exercise Library */}
                    <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Routine Basic Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Rutina</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre de la Rutina *
                                        </label>
                                        <input
                                            type="text"
                                            value={routineData.nombre}
                                            onChange={(e) => setRoutineData(prev => ({ ...prev, nombre: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ej: Rutina de Fuerza Principiante"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={routineData.descripcion}
                                            onChange={(e) => setRoutineData(prev => ({ ...prev, descripcion: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="Describe los objetivos y características de la rutina..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Categoría
                                            </label>
                                            <select
                                                value={routineData.categoria}
                                                onChange={(e) => setRoutineData(prev => ({ ...prev, categoria: e.target.value }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="fuerza">Fuerza</option>
                                                <option value="resistencia">Resistencia</option>
                                                <option value="hipertrofia">Hipertrofia</option>
                                                <option value="definicion">Definición</option>
                                                <option value="funcional">Funcional</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Duración (semanas)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="52"
                                                value={routineData.duracionSemanas}
                                                onChange={(e) => setRoutineData(prev => ({ ...prev, duracionSemanas: parseInt(e.target.value) }))}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Exercise Library */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biblioteca de Ejercicios</h3>

                                {/* Search and Filter */}
                                <div className="space-y-3 mb-4">
                                    <input
                                        type="text"
                                        value={exerciseSearch}
                                        onChange={(e) => setExerciseSearch(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Buscar ejercicio..."
                                    />

                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Exercise List */}
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {filteredExercises.map(exercise => (
                                        <div
                                            key={exercise.id}
                                            className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                                            onClick={() => addExerciseToDay(exercise)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{exercise.nombre}</h4>
                                                    <p className="text-sm text-gray-600">{exercise.categoria} • {exercise.equipo}</p>
                                                </div>
                                                <FaPlus className="w-4 h-4 text-blue-600" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Routine Structure */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Estructura de la Rutina</h3>

                                {/* Day Selector */}
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {DIAS_SEMANA.map(dia => (
                                        <option key={dia} value={dia}>{dia}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Days Overview */}
                            <div className="grid grid-cols-7 gap-2 mb-6">
                                {DIAS_SEMANA.map(dia => {
                                    const dayBlock = routineData.bloques.find(b => b.dia === dia);
                                    const exerciseCount = dayBlock?.ejercicios.length || 0;

                                    return (
                                        <div
                                            key={dia}
                                            onClick={() => setSelectedDay(dia)}
                                            className={`p-3 text-center rounded-lg cursor-pointer transition-colors ${selectedDay === dia
                                                    ? 'bg-blue-100 border-2 border-blue-500'
                                                    : exerciseCount > 0
                                                        ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                                                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className="text-xs font-medium text-gray-700">{dia.slice(0, 3)}</div>
                                            <div className="text-lg font-bold text-gray-900">{exerciseCount}</div>
                                            <div className="text-xs text-gray-500">ejercicios</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Selected Day Exercises */}
                            <div>
                                <h4 className="text-md font-semibold text-gray-900 mb-4">
                                    Ejercicios para {selectedDay}
                                </h4>

                                {(() => {
                                    const dayIndex = routineData.bloques.findIndex(b => b.dia === selectedDay);
                                    const dayBlock = dayIndex >= 0 ? routineData.bloques[dayIndex] : null;

                                    if (!dayBlock || dayBlock.ejercicios.length === 0) {
                                        return (
                                            <div className="text-center py-8 text-gray-500">
                                                <FaDumbbell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No hay ejercicios para {selectedDay}</p>
                                                <p className="text-sm">Selecciona ejercicios de la biblioteca</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-4">
                                            {dayBlock.ejercicios.map((exercise, exerciseIndex) => (
                                                <div key={exercise.id} className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="font-medium text-gray-900">{exercise.nombre}</h5>
                                                        <button
                                                            onClick={() => removeExercise(dayIndex, exerciseIndex)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Series
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={exercise.series}
                                                                onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'series', parseInt(e.target.value))}
                                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Repeticiones
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={exercise.repeticiones}
                                                                onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'repeticiones', parseInt(e.target.value))}
                                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Peso (kg)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.5"
                                                                value={exercise.peso}
                                                                onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'peso', parseFloat(e.target.value))}
                                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Descanso (seg)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="30"
                                                                step="15"
                                                                value={exercise.descanso}
                                                                onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'descanso', parseInt(e.target.value))}
                                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Notas
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={exercise.notas}
                                                            onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'notas', e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded text-sm"
                                                            placeholder="Técnica, progresión, observaciones..."
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {routineData.bloques.reduce((total, bloque) => total + bloque.ejercicios.length, 0)} ejercicios en {routineData.bloques.length} días
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="w-4 h-4 mr-2" />
                                        {editingRoutine ? 'Actualizar Rutina' : 'Crear Rutina'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}