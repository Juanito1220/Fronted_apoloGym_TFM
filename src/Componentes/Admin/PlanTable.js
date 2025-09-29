import React from 'react';
import { FaEdit, FaTrash, FaEye, FaDollarSign, FaCalendarAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const PlanTable = ({ planes, loading, onEdit, onDelete, searchTerm }) => {

    const getEstadoBadge = (estado) => {
        const badges = {
            activo: 'bg-green-100 text-green-800 border-green-200',
            inactivo: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            eliminado: 'bg-red-100 text-red-800 border-red-200'
        };

        const icons = {
            activo: <FaToggleOn className="text-green-600" />,
            inactivo: <FaToggleOff className="text-yellow-600" />,
            eliminado: <FaTrash className="text-red-600 text-xs" />
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badges[estado] || badges.inactivo}`}>
                {icons[estado]}
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </span>
        );
    };

    const formatPrice = (precio) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(precio);
    };

    const formatDuration = (duracion) => {
        if (duracion === 1) return '1 día';
        if (duracion < 30) return `${duracion} días`;
        if (duracion === 30) return '1 mes';
        if (duracion < 365) {
            const meses = Math.floor(duracion / 30);
            const diasRestantes = duracion % 30;
            if (diasRestantes === 0) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
            return `${meses}m ${diasRestantes}d`;
        }
        const años = Math.floor(duracion / 365);
        const diasRestantes = duracion % 365;
        if (diasRestantes === 0) return `${años} ${años === 1 ? 'año' : 'años'}`;
        return `${años}a ${diasRestantes}d`;
    };

    const highlightSearchTerm = (text, term) => {
        if (!term.trim()) return text;

        const regex = new RegExp(`(${term})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ?
                <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> :
                part
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="animate-pulse">
                    {/* Header skeleton */}
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="flex space-x-4">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                        </div>
                    </div>

                    {/* Rows skeleton */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-6 py-4 border-b border-gray-100">
                            <div className="flex space-x-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (planes.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                    <FaEye size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes disponibles</h3>
                <p className="text-gray-500">
                    {searchTerm ? 'No se encontraron planes que coincidan con tu búsqueda.' : 'Comienza creando tu primer plan de membresía.'}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Nombre del Plan</div>
                    <div className="col-span-2">Precio</div>
                    <div className="col-span-2">Duración</div>
                    <div className="col-span-3">Beneficios</div>
                    <div className="col-span-1">Estado</div>
                    <div className="col-span-1">Acciones</div>
                </div>
            </div>

            {/* Body */}
            <div className="divide-y divide-gray-100">
                {planes.map((plan) => (
                    <div key={plan.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">

                            {/* Nombre */}
                            <div className="col-span-3">
                                <div className="font-medium text-gray-900">
                                    {highlightSearchTerm(plan.nombre, searchTerm)}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    ID: {plan.id}
                                </div>
                            </div>

                            {/* Precio */}
                            <div className="col-span-2">
                                <div className="flex items-center gap-1">
                                    <FaDollarSign className="text-green-500 text-sm" />
                                    <span className="font-semibold text-gray-900">
                                        {formatPrice(plan.precio)}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    ${(plan.precio / plan.duracion).toFixed(2)}/día
                                </div>
                            </div>

                            {/* Duración */}
                            <div className="col-span-2">
                                <div className="flex items-center gap-1">
                                    <FaCalendarAlt className="text-blue-500 text-sm" />
                                    <span className="font-medium text-gray-900">
                                        {formatDuration(plan.duracion)}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {plan.duracion} días
                                </div>
                            </div>

                            {/* Beneficios */}
                            <div className="col-span-3">
                                <div className="space-y-1">
                                    {plan.beneficios.slice(0, 2).map((beneficio, index) => (
                                        <div key={index} className="text-sm text-gray-700">
                                            • {highlightSearchTerm(beneficio, searchTerm)}
                                        </div>
                                    ))}
                                    {plan.beneficios.length > 2 && (
                                        <div className="text-xs text-gray-500">
                                            +{plan.beneficios.length - 2} más...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="col-span-1">
                                {getEstadoBadge(plan.estado)}
                            </div>

                            {/* Acciones */}
                            <div className="col-span-1">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(plan)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                        title="Editar plan"
                                    >
                                        <FaEdit size={14} />
                                    </button>

                                    {plan.estado !== 'eliminado' && (
                                        <button
                                            onClick={() => onDelete(plan.id)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Eliminar plan"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Beneficios expandidos en hover (opcional) */}
                        {plan.beneficios.length > 2 && (
                            <details className="mt-3">
                                <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                                    Ver todos los beneficios ({plan.beneficios.length})
                                </summary>
                                <div className="mt-2 ml-4 space-y-1">
                                    {plan.beneficios.map((beneficio, index) => (
                                        <div key={index} className="text-sm text-gray-700">
                                            • {beneficio}
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer con información adicional */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                        Total: {planes.length} plan(es)
                    </div>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Activos: {planes.filter(p => p.estado === 'activo').length}
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Inactivos: {planes.filter(p => p.estado === 'inactivo').length}
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Eliminados: {planes.filter(p => p.estado === 'eliminado').length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanTable;