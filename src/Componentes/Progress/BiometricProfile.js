import React from 'react';
import { User, Heart, Target, Scale, Ruler, Calendar, Activity } from 'lucide-react';

const BiometricProfile = ({ biometricData, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!biometricData) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay datos biométricos disponibles</p>
                </div>
            </div>
        );
    }

    const { personalInfo, currentMetrics, bodyComposition } = biometricData;

    // Calcular el estado del IMC
    const getBMIStatus = (bmi) => {
        if (bmi < 18.5) return { text: 'Bajo peso', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (bmi < 25) return { text: 'Peso normal', color: 'text-green-600', bg: 'bg-green-100' };
        if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { text: 'Obesidad', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const bmiStatus = getBMIStatus(currentMetrics.bmi);

    // Calcular la edad a partir de la fecha de nacimiento o usar la edad directa
    const getAgeDisplay = () => {
        if (personalInfo.age) return `${personalInfo.age} años`;
        return 'No especificada';
    };

    // Formatear el género
    const getGenderDisplay = (gender) => {
        const genders = {
            'M': 'Masculino',
            'F': 'Femenino',
            'O': 'Otro'
        };
        return genders[gender] || 'No especificado';
    };

    // Formatear fecha de última actualización
    const formatLastUpdated = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Ruler className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-500">Altura</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            {personalInfo.height ? `${personalInfo.height}m` : 'No registrada'}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Calendar className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-500">Edad</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{getAgeDisplay()}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <User className="w-4 h-4 text-purple-500 mr-2" />
                            <span className="text-sm text-gray-500">Género</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{getGenderDisplay(personalInfo.gender)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Target className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="text-sm text-gray-500">Objetivo</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{personalInfo.fitnessGoal || 'No definido'}</p>
                    </div>
                </div>

                {/* Condiciones médicas */}
                {personalInfo.medicalConditions && personalInfo.medicalConditions.length > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center mb-2">
                            <Heart className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm font-medium text-yellow-800">Condiciones Médicas</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {personalInfo.medicalConditions.map((condition, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md"
                                >
                                    {condition}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Métricas Actuales */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Scale className="w-5 h-5 mr-2" />
                        Métricas Actuales
                    </h3>
                    <p className="text-sm text-gray-500">
                        Actualizado: {formatLastUpdated(currentMetrics.lastUpdated)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-blue-600">Peso Actual</span>
                            <Scale className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{currentMetrics.weight} kg</p>
                    </div>

                    <div className={`p-4 rounded-lg border ${bmiStatus.bg} border-${bmiStatus.color.replace('text-', '').replace('-600', '-200')}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm ${bmiStatus.color}`}>IMC</span>
                            <Activity className={`w-4 h-4 ${bmiStatus.color}`} />
                        </div>
                        <p className={`text-2xl font-bold ${bmiStatus.color.replace('-600', '-900')}`}>
                            {currentMetrics.bmi}
                        </p>
                        <p className={`text-xs ${bmiStatus.color}`}>{bmiStatus.text}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-green-600">Masa Muscular</span>
                            <Target className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-green-900">{currentMetrics.muscleMass} kg</p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-red-600">Grasa Corporal</span>
                            <Heart className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold text-red-900">{currentMetrics.bodyFat}%</p>
                    </div>
                </div>
            </div>

            {/* Composición Corporal */}
            {bodyComposition && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Composición Corporal Detallada
                    </h3>

                    <div className="space-y-4">
                        {/* Gráfico de barras visual */}
                        <div className="space-y-3">
                            {[
                                { name: 'Músculo', value: bodyComposition.muscle, total: currentMetrics.weight, color: 'bg-blue-500' },
                                { name: 'Grasa', value: bodyComposition.fat, total: currentMetrics.weight, color: 'bg-red-500' },
                                { name: 'Agua', value: bodyComposition.water, total: currentMetrics.weight, color: 'bg-cyan-500' },
                                { name: 'Hueso', value: bodyComposition.bone, total: currentMetrics.weight, color: 'bg-gray-500' }
                            ].map((component) => {
                                const percentage = (component.value / component.total) * 100;
                                return (
                                    <div key={component.name} className="flex items-center">
                                        <div className="w-20 text-sm text-gray-600">{component.name}</div>
                                        <div className="flex-1 mx-4">
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full ${component.color}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="w-20 text-sm font-medium text-gray-900 text-right">
                                            {component.value} kg ({percentage.toFixed(1)}%)
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Indicadores de salud */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Indicadores de Salud</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Hidratación:</span>
                                    <span className={`ml-2 font-semibold ${bodyComposition.water >= 60 ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {bodyComposition.water >= 60 ? 'Buena' : 'Mejorar'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Masa muscular:</span>
                                    <span className={`ml-2 font-semibold ${bodyComposition.muscle >= 35 ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {bodyComposition.muscle >= 35 ? 'Óptima' : 'A desarrollar'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Grasa corporal:</span>
                                    <span className={`ml-2 font-semibold ${bodyComposition.fat <= 15 ? 'text-green-600' :
                                            bodyComposition.fat <= 20 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {bodyComposition.fat <= 15 ? 'Excelente' :
                                            bodyComposition.fat <= 20 ? 'Bueno' : 'Alto'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiometricProfile;