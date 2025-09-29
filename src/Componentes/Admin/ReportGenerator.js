// src/Componentes/Admin/ReportGenerator.js
import React, { useState } from 'react';
import { FiDownload, FiCalendar, FiFilter, FiFileText } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import { toast } from 'react-hot-toast';
import dashboardService from '../../Data/Services/dashboardService';
import "react-datepicker/dist/react-datepicker.css";

const ReportGenerator = () => {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [reportType, setReportType] = useState('financial');
    const [isGenerating, setIsGenerating] = useState(false);

    const reportTypes = [
        {
            value: 'financial',
            label: 'Reporte Financiero',
            description: 'Ingresos, pagos y deudas pendientes',
            icon: '💰'
        },
        {
            value: 'usage',
            label: 'Reporte de Uso/Asistencia',
            description: 'Frecuencia y patrones de visita',
            icon: '📊'
        }
    ];

    const handleGenerateReport = async () => {
        if (startDate >= endDate) {
            toast.error('La fecha de inicio debe ser anterior a la fecha de fin');
            return;
        }

        setIsGenerating(true);

        try {
            let reportData;
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            if (reportType === 'financial') {
                reportData = await dashboardService.generateFinancialReport(startDateStr, endDateStr);
            } else {
                reportData = await dashboardService.generateUsageReport(startDateStr, endDateStr);
            }

            // Generar y descargar el archivo CSV
            downloadCSV(reportData, reportType);
            toast.success('Reporte generado exitosamente');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Error al generar el reporte');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadCSV = (data, type) => {
        let csv = '';
        let filename = '';

        if (type === 'financial') {
            filename = `reporte_financiero_${data.summary.periodo.startDate}_${data.summary.periodo.endDate}.csv`;

            // Header del reporte
            csv += 'REPORTE FINANCIERO\n';
            csv += `Periodo: ${data.summary.periodo.startDate} - ${data.summary.periodo.endDate}\n`;
            csv += `Total Ingresos: $${data.summary.totalIngresos.toLocaleString()}\n`;
            csv += `Total Transacciones: ${data.summary.totalTransacciones}\n`;
            csv += `Ingreso Promedio: $${data.summary.ingresoPromedio.toFixed(2)}\n\n`;

            // Detalles de transacciones
            csv += 'DETALLE DE TRANSACCIONES\n';
            csv += 'Fecha,Usuario,Monto,Método de Pago\n';
            data.detalles.forEach(item => {
                csv += `${item.fecha},"${item.usuario}",${item.total},${item.method || 'No especificado'}\n`;
            });

            // Resumen por método de pago
            csv += '\nRESUMEN POR MÉTODO DE PAGO\n';
            csv += 'Método,Total\n';
            Object.entries(data.porMetodoPago).forEach(([method, total]) => {
                csv += `${method},$${total.toFixed(2)}\n`;
            });
        } else {
            filename = `reporte_asistencia_${data.summary.periodo.startDate}_${data.summary.periodo.endDate}.csv`;

            // Header del reporte
            csv += 'REPORTE DE USO Y ASISTENCIA\n';
            csv += `Periodo: ${data.summary.periodo.startDate} - ${data.summary.periodo.endDate}\n`;
            csv += `Total Visitas: ${data.summary.totalVisitas}\n`;
            csv += `Total Reservas: ${data.summary.totalReservas}\n`;
            csv += `Usuarios Únicos: ${data.summary.usuariosUnicos}\n\n`;

            // Usuarios más activos
            csv += 'USUARIOS MÁS ACTIVOS\n';
            csv += 'Usuario,Visitas\n';
            data.usuariosMasActivos.forEach(item => {
                csv += `"${item.usuario}",${item.visitas}\n`;
            });

            // Reservas por sala
            csv += '\nRESERVAS POR SALA\n';
            csv += 'Sala,Reservas\n';
            Object.entries(data.reservasPorSala).forEach(([sala, count]) => {
                csv += `${sala},${count}\n`;
            });
        }

        // Crear y descargar el archivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <FiFileText className="h-6 w-6 text-blue-600" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Generador de Reportes
                    </h3>
                    <p className="text-sm text-gray-600">
                        Genera y exporta reportes detallados del gimnasio
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Selección de tipo de reporte */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        <FiFilter className="inline h-4 w-4 mr-1" />
                        Tipo de Reporte
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {reportTypes.map((type) => (
                            <div
                                key={type.value}
                                onClick={() => setReportType(type.value)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${reportType === type.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{type.icon}</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {type.label}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selección de rango de fechas */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        <FiCalendar className="inline h-4 w-4 mr-1" />
                        Rango de Fechas
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Fecha de Inicio
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Seleccionar fecha"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Fecha de Fin
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Seleccionar fecha"
                                minDate={startDate}
                            />
                        </div>
                    </div>
                </div>

                {/* Botón de generación */}
                <div className="pt-4 border-t border-gray-200">
                    <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Generando...</span>
                            </>
                        ) : (
                            <>
                                <FiDownload className="h-4 w-4" />
                                <span>Generar y Exportar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;