import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansService, membershipsService } from '../../Data/Services/membershipService';

// Tipos de membresía con factores de precio (fuera del componente para evitar re-renders)
const membershipTypes = {
    individual: { label: 'Individual', factor: 1, description: 'Para una persona', icon: '👤' },
    duo: { label: 'Dúo', factor: 1.7, description: 'Para dos personas', icon: '👥' },
    familiar: { label: 'Familiar', factor: 2.5, description: 'Para toda la familia (hasta 4 personas)', icon: '👨‍👩‍👧‍👦' },
    estudiante: { label: 'Estudiante', factor: 0.8, description: 'Descuento especial para estudiantes', icon: '🎓' }
};

// Add-ons disponibles (fuera del componente para evitar re-renders)
const availableAddons = [
    { id: 'nutrition', name: 'Asesoría Nutricional', price: 15, description: 'Consultas mensuales con nutricionista', icon: '🥗' },
    { id: 'personal_trainer', name: 'Entrenador Personal', price: 80, description: '4 sesiones mensuales', icon: '💪' },
    { id: 'massage', name: 'Masajes Terapéuticos', price: 25, description: '2 sesiones mensuales', icon: '💆‍♀️' },
    { id: 'supplements', name: 'Suplementos Premium', price: 30, description: 'Pack mensual de suplementos', icon: '💊' }
];

const PlanSubscriptionGallery = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [membershipType, setMembershipType] = useState('individual');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [addons, setAddons] = useState([]);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState('processing'); // 'processing', 'success', 'error'

    useEffect(() => {
        fetchPlans();
    }, []);

    // Debug: Monitorear cambios de estado
    useEffect(() => {
        console.log('🔍 State changed:', {
            membershipType,
            billingCycle,
            selectedPlan: selectedPlan?.name,
            addons: addons.length,
            loading,
            error,
            showPaymentModal
        });
    }, [membershipType, billingCycle, selectedPlan, addons, loading, error, showPaymentModal]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await plansService.getActivePlans();

            if (response.success) {
                setPlans(response.data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching plans:', err);
            setError('Error al cargar los planes');
        } finally {
            setLoading(false);
        }
    };

    const calculatePrice = useCallback((basePlan) => {
        console.log('🧮 Calculating price for plan:', basePlan?.name, 'Type:', membershipType, 'Cycle:', billingCycle);

        if (!basePlan || !basePlan.price) {
            console.log('⚠️ No plan or price, returning default values');
            return {
                basePrice: 0,
                addonsTotal: 0,
                totalMonthly: 0,
                finalPrice: 0,
                savings: 0
            };
        }

        try {
            const membershipFactor = membershipTypes[membershipType]?.factor || 1;
            const billingDiscount = billingCycle === 'annual' ? 0.9 : 1; // 10% descuento anual
            const addonsTotal = addons.reduce((sum, addonId) => {
                const addon = availableAddons.find(a => a.id === addonId);
                return sum + (addon ? addon.price : 0);
            }, 0);

            const basePrice = basePlan.price * membershipFactor;
            const totalMonthly = basePrice + addonsTotal;
            const finalPrice = totalMonthly * billingDiscount;

            const result = {
                basePrice,
                addonsTotal,
                totalMonthly,
                finalPrice: billingCycle === 'annual' ? finalPrice * 12 : finalPrice,
                savings: billingCycle === 'annual' ? (totalMonthly * 12) - (finalPrice * 12) : 0
            };

            console.log('✅ Price calculated:', result);
            return result;
        } catch (error) {
            console.error('💥 Error calculating price:', error);
            return {
                basePrice: 0,
                addonsTotal: 0,
                totalMonthly: 0,
                finalPrice: 0,
                savings: 0
            };
        }
    }, [membershipType, billingCycle, addons]);

    const handleSelectPlan = (plan) => {
        try {
            if (!plan) {
                console.error('Plan is null or undefined');
                setError('Error al seleccionar el plan. Por favor, intenta nuevamente.');
                return;
            }

            // Preservar scroll al seleccionar plan
            const scrollPosition = { x: window.scrollX, y: window.scrollY };

            setSelectedPlan(plan);
            setError(null); // Limpiar errores previos cuando se selecciona un plan

            // Restaurar scroll después del re-render
            setTimeout(() => {
                window.scrollTo(scrollPosition.x, scrollPosition.y);
            }, 0);

        } catch (error) {
            console.error('Error selecting plan:', error);
            setError('Error al seleccionar el plan. Por favor, intenta nuevamente.');
        }
    };

    // Handlers simples sin scroll interference
    const handleMembershipTypeChange = (e) => {
        const value = e.target.value;
        console.log('🔄 Changing membership type to:', value);
        if (!value || !membershipTypes[value]) {
            console.error('❌ Invalid membership type:', value);
            return;
        }
        setMembershipType(value);
        setError(null);
        console.log('✅ Membership type changed successfully');
    };

    const handleBillingCycleChange = (e) => {
        const value = e.target.value;
        console.log('🔄 Changing billing cycle to:', value);
        if (!value || (value !== 'monthly' && value !== 'annual')) {
            console.error('❌ Invalid billing cycle:', value);
            return;
        }
        setBillingCycle(value);
        setError(null);
        console.log('✅ Billing cycle changed successfully');
    };

    const handleAddonToggle = (addonId) => {
        console.log('🔄 Toggling addon:', addonId);
        if (!addonId) {
            console.error('Addon ID is null or undefined');
            return;
        }
        setAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
        console.log('✅ Addon toggled successfully');
    };

    // Componente para el resumen de precios (evita re-renders problemáticos)
    const renderPricingSummary = () => {
        if (!selectedPlan) return null;

        const pricing = calculatePrice(selectedPlan);
        if (!pricing) return null;

        return (
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">{selectedPlan.name} - {membershipTypes[membershipType]?.label}</span>
                        <span className="font-medium">${pricing.basePrice}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        {billingCycle === 'annual' ? 'Facturación anual' : 'Facturación mensual'}
                    </div>
                </div>

                {pricing.addonsTotal > 0 && (
                    <div className="border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Servicios adicionales</span>
                            <span className="font-medium">${pricing.addonsTotal}</span>
                        </div>
                    </div>
                )}

                {billingCycle === 'annual' && pricing.savings > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <span className="text-green-800 font-medium">Ahorro anual</span>
                            <span className="text-green-600 font-bold">${pricing.savings}</span>
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-blue-600">${pricing.finalPrice}</span>
                            <div className="text-sm text-gray-500">
                                {billingCycle === 'annual' ? 'por año' : 'por mes'}
                            </div>
                        </div>
                    </div>

                    {/* Botón Ir a Pagos */}
                    <button
                        onClick={handleSubscribe}
                        disabled={isSubscribing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
                    >
                        {isSubscribing ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Procesando...
                            </div>
                        ) : (
                            'Ir a Pagos 💳'
                        )}
                    </button>
                </div>
            </div>
        );
    };

    const handleSubscribe = async () => {
        if (!selectedPlan) {
            setError('Por favor selecciona un plan antes de continuar.');
            return;
        }

        if (!selectedPlan.price || selectedPlan.price <= 0) {
            setError('El plan seleccionado no tiene un precio válido.');
            return;
        }

        // Validar que el plan tenga un precio válido
        const pricing = calculatePrice(selectedPlan);
        if (!pricing || pricing.finalPrice <= 0) {
            setError('Error al calcular el precio del plan. Por favor, intenta nuevamente.');
            return;
        }

        try {
            setIsSubscribing(true);
            setShowPaymentModal(true);
            setPaymentStep('processing');
            setError(null); // Limpiar errores previos

            const startDate = new Date();
            const expirationDate = new Date();

            if (billingCycle === 'annual') {
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            } else {
                expirationDate.setMonth(expirationDate.getMonth() + 1);
            }

            const subscriptionData = {
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                membershipType,
                billingCycle,
                addons: addons.map(id => availableAddons.find(a => a.id === id)).filter(Boolean),
                startDate: startDate.toISOString(),
                expirationDate: expirationDate.toISOString(),
                totalAmount: pricing.finalPrice
            };

            // Simular procesamiento de pago (2-4 segundos)
            const processingTime = Math.random() * 2000 + 2000;

            // Agregar timeout de seguridad (máximo 10 segundos)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout en el procesamiento')), 10000)
            );

            const processingPromise = new Promise(resolve => setTimeout(resolve, processingTime));

            await Promise.race([processingPromise, timeoutPromise]);

            // Simular 90% de éxito, 10% de error
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
                const response = await membershipsService.subscribeToPlan(selectedPlan.id, subscriptionData);

                if (response.success) {
                    setPaymentStep('success');

                    // Simular procesamiento exitoso de pago
                    setTimeout(() => {
                        try {
                            // Guardar datos de checkout para el proceso de pago
                            localStorage.setItem('checkout_data', JSON.stringify({
                                subscription: response.data,
                                pricing,
                                paymentResult: 'success'
                            }));

                            // Redirigir al historial después del éxito usando navigate
                            navigate('/cliente/historial');
                        } catch (navError) {
                            console.error('Error en la navegación:', navError);
                            setError('Pago procesado exitosamente. Redirigiendo...');
                            // Fallback manual
                            window.location.href = '/cliente/historial';
                        }
                    }, 2000);
                } else {
                    throw new Error('Error en la respuesta del servicio');
                }
            } else {
                setPaymentStep('error');
                setTimeout(() => {
                    setShowPaymentModal(false);
                    setPaymentStep('processing');
                    setIsSubscribing(false);
                }, 3000);
            }
        } catch (err) {
            console.error('Error subscribing to plan:', err);
            setPaymentStep('error');

            // Auto-cerrar el modal después de 5 segundos en caso de error
            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentStep('processing');
                setIsSubscribing(false);
                setError('Error al procesar la suscripción. Por favor, intenta nuevamente.');
            }, 5000);
        }
    };

    // Modal de Pago
    const PaymentModal = () => {
        if (!showPaymentModal) return null;

        const handleCloseModal = () => {
            setShowPaymentModal(false);
            setPaymentStep('processing');
            setIsSubscribing(false);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
                    {/* Botón de cierre */}
                    {paymentStep !== 'processing' && (
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {paymentStep === 'processing' && (
                        <>
                            <div className="flex justify-center mb-6">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Procesando Pago</h3>
                            <p className="text-gray-600">
                                Por favor espera mientras validamos tu información y procesamos tu suscripción...
                            </p>
                        </>
                    )}

                    {paymentStep === 'success' && (
                        <>
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-green-600 mb-4">¡Pago Exitoso!</h3>
                            <p className="text-gray-600 mb-4">
                                Tu suscripción ha sido procesada correctamente.
                                <br />Redirigiendo a tu historial...
                            </p>
                            <div className="text-sm text-gray-500">
                                Plan: {selectedPlan?.name} - {membershipTypes[membershipType].label}
                            </div>
                        </>
                    )}

                    {paymentStep === 'error' && (
                        <>
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-red-600 mb-4">Error en el Pago</h3>
                            <p className="text-gray-600 mb-6">
                                Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentStep('processing');
                                        setIsSubscribing(false);
                                    }}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubscribe}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    disabled={isSubscribing}
                                >
                                    Intentar de Nuevo
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-8"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Cargando Planes</h2>
                    <p className="text-gray-600">Estamos preparando las mejores opciones para ti...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Error al Cargar</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchPlans}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50" style={{
            scrollBehavior: 'smooth',
            minHeight: '100vh',
            // Prevenir auto-scroll del navegador
            scrollPadding: '0px'
        }}>
            <PaymentModal />

            {/* Header Mejorado */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Planes y Membresías</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Elige el plan perfecto para alcanzar tus objetivos de fitness.
                        <span className="text-blue-600 font-semibold"> Entrenamientos ilimitados</span>,
                        equipos de última generación y mucho más.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Plan Selection - Diseño más limpio */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`group relative bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer 
                                transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                                ${selectedPlan?.id === plan.id ? 'ring-4 ring-blue-500 scale-105' : ''}
                                ${plan.isBestSeller ? 'border-2 border-yellow-400' : ''}`}
                            onClick={() => handleSelectPlan(plan)}
                        >
                            {/* Best Seller Badge */}
                            {plan.isBestSeller && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                        ⭐ Más Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Header con gradiente mejorado */}
                            <div className={`relative p-8 text-white overflow-hidden
                                ${plan.id === 'black' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' :
                                    plan.id === 'fit' ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800' :
                                        'bg-gradient-to-br from-green-600 via-green-700 to-green-800'}`}>

                                {/* Patrón de fondo */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45"></div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                                        <div className="text-3xl">
                                            {plan.id === 'black' ? '🏆' : plan.id === 'fit' ? '💪' : '⚡'}
                                        </div>
                                    </div>
                                    <p className="text-sm opacity-90 mb-6 leading-relaxed">{plan.description}</p>
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold">${plan.price}</span>
                                        <span className="text-lg opacity-75 ml-2">/mes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Benefits con animación */}
                            <div className="p-6">
                                <ul className="space-y-3 mb-6">
                                    {plan.benefits.slice(0, 4).map((benefit, index) => (
                                        <li key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300"
                                            style={{ transitionDelay: `${index * 50}ms` }}>
                                            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                                        </li>
                                    ))}
                                    {plan.benefits.length > 4 && (
                                        <li className="text-sm text-gray-500 ml-8 italic">
                                            +{plan.benefits.length - 4} beneficios adicionales
                                        </li>
                                    )}
                                </ul>

                                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform
                                    ${selectedPlan?.id === plan.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                    }`}>
                                    {selectedPlan?.id === plan.id ? '✓ Seleccionado' : 'Seleccionar Plan'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Configuration Panel - Diseño mejorado */}
                {selectedPlan && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-visible mb-8">
                        {/* Header del Panel */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                            <h2 className="text-3xl font-bold mb-2">Personaliza tu membresía</h2>
                            <p className="opacity-90">Configura todos los detalles de tu plan {selectedPlan.name}</p>
                        </div>

                        <div className="p-8" style={{ overflow: 'visible' }}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Left Column - Configuration */}
                                <div className="space-y-8">
                                    {/* Membership Type */}
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                                            Tipo de Membresía
                                        </label>
                                        <div className="space-y-3" style={{ scrollMargin: '0px' }}>
                                            {Object.entries(membershipTypes).map(([key, type]) => (
                                                <label key={key} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg
                                                    ${membershipType === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                                    style={{ scrollMargin: '0px' }}>
                                                    <input
                                                        type="radio"
                                                        name="membershipType"
                                                        value={key}
                                                        checked={membershipType === key}
                                                        onChange={handleMembershipTypeChange}
                                                        className="sr-only"
                                                        style={{ scrollMargin: '0px' }}
                                                    />
                                                    <div className="text-2xl mr-4">{type.icon}</div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-gray-900">{type.label}</div>
                                                        <div className="text-sm text-gray-600">{type.description}</div>
                                                    </div>
                                                    {membershipType === key && (
                                                        <div className="text-blue-600">
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Billing Cycle */}
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                                            Ciclo de Facturación
                                        </label>
                                        <div className="space-y-3" style={{ scrollMargin: '0px' }}>
                                            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg
                                                ${billingCycle === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                                style={{ scrollMargin: '0px' }}>
                                                <input
                                                    type="radio"
                                                    name="billingCycle"
                                                    value="monthly"
                                                    checked={billingCycle === 'monthly'}
                                                    onChange={handleBillingCycleChange}
                                                    className="sr-only"
                                                    style={{ scrollMargin: '0px' }}
                                                />
                                                <div className="text-2xl mr-4">📅</div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">Mensual</div>
                                                    <div className="text-sm text-gray-600">Pago cada mes</div>
                                                </div>
                                                {billingCycle === 'monthly' && (
                                                    <div className="text-blue-600">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </label>

                                            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg
                                                ${billingCycle === 'annual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                                style={{ scrollMargin: '0px' }}>
                                                <input
                                                    type="radio"
                                                    name="billingCycle"
                                                    value="annual"
                                                    checked={billingCycle === 'annual'}
                                                    onChange={handleBillingCycleChange}
                                                    className="sr-only"
                                                    style={{ scrollMargin: '0px' }}
                                                />
                                                <div className="text-2xl mr-4">💰</div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">
                                                        Anual <span className="text-green-600 font-bold">(10% descuento)</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600">Pago una vez al año</div>
                                                </div>
                                                {billingCycle === 'annual' && (
                                                    <div className="text-blue-600">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Add-ons */}
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                                            Servicios Adicionales
                                        </label>
                                        <div className="space-y-3">
                                            {availableAddons.map((addon) => (
                                                <label key={addon.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg
                                                    ${addons.includes(addon.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={addons.includes(addon.id)}
                                                        onChange={() => handleAddonToggle(addon.id)}
                                                        className="sr-only"
                                                    />
                                                    <div className="text-2xl mr-4">{addon.icon}</div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-gray-900">{addon.name}</div>
                                                        <div className="text-sm text-gray-600">{addon.description}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-blue-600">+${addon.price}/mes</div>
                                                        {addons.includes(addon.id) && (
                                                            <div className="text-green-600">
                                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Summary */}
                                <div className="bg-gray-50 rounded-2xl p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumen de tu membresía</h3>
                                    {renderPricingSummary()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanSubscriptionGallery;