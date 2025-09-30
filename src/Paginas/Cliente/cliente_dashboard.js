import React from "react";
import MembershipStatusCard from "../../Componentes/Cliente/MembershipStatusCard";
import "../../Styles/cliente-dashboard.css";

export default function ClienteDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Bienvenido a Apolo Gym! 👋</h1>
                <p className="text-xl text-gray-600">Tu centro de entrenamiento completo. Gestiona tu membresía y accede a todos los servicios.</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Membership Status */}
                <div className="lg:col-span-2">
                    <MembershipStatusCard />
                </div>

                {/* Right Column - Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                        <div className="space-y-3">
                            <a
                                href="/cliente/planes"
                                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <div className="bg-blue-500 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Planes y Membresías</div>
                                    <div className="text-sm text-gray-600">Ver planes disponibles</div>
                                </div>
                            </a>

                            <a
                                href="/cliente/reserva"
                                className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                <div className="bg-green-500 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Reservar Clases</div>
                                    <div className="text-sm text-gray-600">Agenda tu entrenamiento</div>
                                </div>
                            </a>

                            <a
                                href="/cliente/rutinas"
                                className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                <div className="bg-purple-500 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Mis Rutinas</div>
                                    <div className="text-sm text-gray-600">Ver plan de entrenamiento</div>
                                </div>
                            </a>

                            <a
                                href="/cliente/historial"
                                className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                <div className="bg-orange-500 p-2 rounded-lg mr-3">
                                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Mi Historial</div>
                                    <div className="text-sm text-gray-600">Pagos y asistencia</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Entrenamientos este mes</span>
                                <span className="text-2xl font-bold text-blue-600">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Calorías quemadas</span>
                                <span className="text-2xl font-bold text-green-600">3,450</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Racha actual</span>
                                <span className="text-2xl font-bold text-purple-600">5 días</span>
                            </div>
                        </div>
                    </div>

                    {/* Gym Hours Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios de Atención</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Lunes - Viernes</span>
                                <span className="font-medium">5:00 AM - 11:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sábados</span>
                                <span className="font-medium">6:00 AM - 10:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Domingos</span>
                                <span className="font-medium">7:00 AM - 9:00 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Recent Activity */}
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                    <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="bg-blue-500 p-2 rounded-full mr-3">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Clase de Spinning</div>
                                <div className="text-sm text-gray-600">Completada - Ayer, 7:00 PM</div>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="bg-green-500 p-2 rounded-full mr-3">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Pago Procesado</div>
                                <div className="text-sm text-gray-600">Plan Black - 15 de Noviembre</div>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="bg-purple-500 p-2 rounded-full mr-3">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Rutina Actualizada</div>
                                <div className="text-sm text-gray-600">Nueva rutina de fuerza - 14 de Noviembre</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}