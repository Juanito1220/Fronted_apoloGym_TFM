import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const PlanModal = ({ plan, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        duracion: '',
        beneficios: [''],
        estado: 'activo'
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Cargar datos del plan si estamos editando
    useEffect(() => {
        if (plan) {
            setFormData({
                nombre: plan.nombre || '',
                precio: plan.precio?.toString() || '',
                duracion: plan.duracion?.toString() || '',
                beneficios: plan.beneficios?.length > 0 ? plan.beneficios : [''],
                estado: plan.estado || 'activo'
            });
        } else {
            // Resetear para nuevo plan
            setFormData({
                nombre: '',
                precio: '',
                duracion: '',
                beneficios: [''],
                estado: 'activo'
            });
        }
        setErrors({});
    }, [plan]);

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!formData.nombre?.trim()) {
            newErrors.nombre = 'El nombre del plan es requerido';
        }

        // Validar precio
        const precio = parseFloat(formData.precio);
        if (!formData.precio || isNaN(precio) || precio <= 0) {
            newErrors.precio = 'El precio debe ser un número mayor a 0';
        }

        // Validar duración
        const duracion = parseInt(formData.duracion);
        if (!formData.duracion || isNaN(duracion) || duracion <= 0) {
            newErrors.duracion = 'La duración debe ser un número mayor a 0';
        }

        // Validar beneficios
        const beneficiosValidos = formData.beneficios.filter(b => b.trim());
        if (beneficiosValidos.length === 0) {
            newErrors.beneficios = 'Debe agregar al menos un beneficio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleBeneficioChange = (index, value) => {
        const newBeneficios = [...formData.beneficios];
        newBeneficios[index] = value;
        setFormData(prev => ({
            ...prev,
            beneficios: newBeneficios
        }));

        // Limpiar error de beneficios
        if (errors.beneficios) {
            setErrors(prev => ({
                ...prev,
                beneficios: ''
            }));
        }
    };

    const addBeneficio = () => {
        setFormData(prev => ({
            ...prev,
            beneficios: [...prev.beneficios, '']
        }));
    };

    const removeBeneficio = (index) => {
        if (formData.beneficios.length > 1) {
            const newBeneficios = formData.beneficios.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                beneficios: newBeneficios
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            // Limpiar beneficios vacíos
            const beneficiosLimpios = formData.beneficios
                .map(b => b.trim())
                .filter(b => b);

            const planData = {
                nombre: formData.nombre.trim(),
                precio: parseFloat(formData.precio),
                duracion: parseInt(formData.duracion),
                beneficios: beneficiosLimpios,
                estado: formData.estado
            };

            await onSave(planData);
        } catch (error) {
            console.error('Error saving plan:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {plan ? 'Editar Plan' : 'Crear Nuevo Plan'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nombre del Plan */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Plan *
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ej: Plan Básico, Plan Premium..."
                        />
                        {errors.nombre && (
                            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                        )}
                    </div>

                    {/* Precio y Duración */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                                Precio (USD) *
                            </label>
                            <input
                                type="number"
                                id="precio"
                                step="0.01"
                                min="0"
                                value={formData.precio}
                                onChange={(e) => handleInputChange('precio', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.precio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="0.00"
                            />
                            {errors.precio && (
                                <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="duracion" className="block text-sm font-medium text-gray-700 mb-2">
                                Duración (días) *
                            </label>
                            <input
                                type="number"
                                id="duracion"
                                min="1"
                                value={formData.duracion}
                                onChange={(e) => handleInputChange('duracion', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.duracion ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="30"
                            />
                            {errors.duracion && (
                                <p className="mt-1 text-sm text-red-600">{errors.duracion}</p>
                            )}
                        </div>
                    </div>

                    {/* Beneficios */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Beneficios del Plan *
                            </label>
                            <button
                                type="button"
                                onClick={addBeneficio}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                                <FaPlus size={12} />
                                Agregar beneficio
                            </button>
                        </div>

                        <div className="space-y-2">
                            {formData.beneficios.map((beneficio, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={beneficio}
                                        onChange={(e) => handleBeneficioChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Beneficio ${index + 1}`}
                                    />
                                    {formData.beneficios.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBeneficio(index)}
                                            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {errors.beneficios && (
                            <p className="mt-1 text-sm text-red-600">{errors.beneficios}</p>
                        )}
                    </div>

                    {/* Estado */}
                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                            Estado del Plan
                        </label>
                        <select
                            id="estado"
                            value={formData.estado}
                            onChange={(e) => handleInputChange('estado', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="activo">Activo (Disponible para venta)</option>
                            <option value="inactivo">Inactivo (No disponible)</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${saving
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-blue-700'
                                }`}
                        >
                            {saving ? 'Guardando...' : (plan ? 'Actualizar Plan' : 'Crear Plan')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlanModal;