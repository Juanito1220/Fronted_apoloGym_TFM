import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansService } from '../../Data/Services/membershipService';

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
            error
        });
    }, [membershipType, billingCycle, selectedPlan, addons, loading, error]);

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

    // Componente para el resumen de precios - Ultra moderno
    const renderPricingSummary = () => {
        if (!selectedPlan) return null;

        const pricing = calculatePrice(selectedPlan);
        if (!pricing) return null;

        return (
            <div className="space-y-6">
                {/* Plan base */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <span className="font-bold text-gray-900 text-lg">{selectedPlan.name}</span>
                            <div className="text-sm text-gray-600">{membershipTypes[membershipType]?.label}</div>
                        </div>
                        <div className="text-right">
                            <span className="font-black text-xl text-gray-900">${pricing.basePrice}</span>
                            <div className="text-sm text-gray-500">
                                {billingCycle === 'annual' ? 'anual' : 'mensual'}
                            </div>
                        </div>
                    </div>

                    {/* Badge de facturación */}
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {billingCycle === 'annual' ? 'Facturación anual' : 'Facturación mensual'}
                    </div>
                </div>

                {/* Add-ons si existen */}
                {pricing.addonsTotal > 0 && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <span className="font-bold text-gray-900 text-lg">Servicios adicionales</span>
                                <div className="text-sm text-gray-600">{addons.length} servicio{addons.length > 1 ? 's' : ''} seleccionado{addons.length > 1 ? 's' : ''}</div>
                            </div>
                            <span className="font-black text-xl text-gray-900">${pricing.addonsTotal}</span>
                        </div>

                        {/* Lista de addons seleccionados */}
                        <div className="space-y-2">
                            {addons.map(addonId => {
                                const addon = availableAddons.find(a => a.id === addonId);
                                return addon ? (
                                    <div key={addonId} className="flex items-center gap-3 text-sm">
                                        <span className="text-lg">{addon.icon}</span>
                                        <span className="text-gray-700">{addon.name}</span>
                                        <span className="ml-auto font-semibold text-gray-600">+${addon.price}</span>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {/* Ahorro anual */}
                {billingCycle === 'annual' && pricing.savings > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                        <div className="relative flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-sm">💰</span>
                                </div>
                                <div>
                                    <span className="text-green-800 font-bold text-lg">¡Ahorro anual!</span>
                                    <div className="text-sm text-green-700">10% de descuento</div>
                                </div>
                            </div>
                            <span className="text-green-600 font-black text-2xl">${pricing.savings}</span>
                        </div>
                    </div>
                )}

                {/* Total final */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="relative">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-2xl font-black text-gray-900">Total a pagar</span>
                                <div className="text-sm text-gray-600 mt-1">
                                    {billingCycle === 'annual' ? 'Pago único anual' : 'Pago mensual recurrente'}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    ${pricing.finalPrice}
                                </span>
                                <div className="text-sm text-gray-500 font-semibold">
                                    {billingCycle === 'annual' ? 'por año' : 'por mes'}
                                </div>
                            </div>
                        </div>

                        {/* Botón de suscripción ultra moderno */}
                        <button
                            onClick={handleSubscribe}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-black text-lg py-5 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden group"
                        >
                            {/* Efecto de brillo */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>

                            <div className="relative flex items-center justify-center gap-3">
                                <span>🚀 Finalizar Suscripción</span>
                                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </button>

                        {/* Garantía */}
                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Pago 100% seguro • Cancela cuando quieras</span>
                        </div>
                    </div>
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
            // Preparar datos para enviar al componente de pagos
            const checkoutData = {
                subscription: {
                    planId: selectedPlan.id,
                    planName: selectedPlan.name,
                    planDescription: selectedPlan.description || selectedPlan.features?.join(', ') || '',
                    membershipType,
                    billingCycle,
                    addons: addons.map(id => {
                        const addon = availableAddons.find(a => a.id === id);
                        return addon ? {
                            id: addon.id,
                            name: addon.name,
                            price: addon.price,
                            description: addon.description
                        } : null;
                    }).filter(Boolean)
                },
                pricing: {
                    basePrice: pricing.basePrice,
                    addonsTotal: pricing.addonsTotal,
                    totalMonthly: pricing.totalMonthly,
                    finalPrice: pricing.finalPrice,
                    savings: pricing.savings,
                    membershipFactor: membershipTypes[membershipType]?.factor || 1,
                    billingDiscount: billingCycle === 'annual' ? 0.9 : 1
                },
                membershipTypeInfo: membershipTypes[membershipType]
            };

            // Guardar los datos en localStorage para que los recoja el componente de pagos
            localStorage.setItem('checkout_data', JSON.stringify(checkoutData));

            // Redirigir al componente de pagos
            navigate('/cliente/pagos');

        } catch (error) {
            console.error('Error preparando datos de checkout:', error);
            setError('Error al procesar la suscripción. Por favor, intenta nuevamente.');
        }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" style={{
            scrollBehavior: 'smooth',
            scrollPadding: '0px'
        }}>
            <div className="relative">
                {/* Header Ultra Moderno - Simplificado */}
                <div className="relative min-h-[60vh] flex items-center justify-center">
                    {/* Background suave */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-50"></div>

                    <div className="relative max-w-6xl mx-auto px-4 text-center">
                        {/* Badge superior */}
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">¡Ofertas especiales disponibles!</span>
                        </div>

                        {/* Título principal */}
                        <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
                            Planes y<br />
                            <span className="text-blue-600">Membresías</span>
                        </h1>

                        {/* Subtítulo */}
                        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                            Diseñados para <span className="font-bold text-gray-900">transformar tu vida</span>.
                            <br className="hidden md:block" />
                            Entrenamientos ilimitados, tecnología de vanguardia y resultados garantizados.
                        </p>

                        {/* Stats rápidas */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
                            <div className="group cursor-default">
                                <div className="text-3xl font-bold text-blue-600">500+</div>
                                <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Miembros activos</div>
                            </div>
                            <div className="group cursor-default">
                                <div className="text-3xl font-bold text-purple-600">24/7</div>
                                <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Acceso completo</div>
                            </div>
                            <div className="group cursor-default">
                                <div className="text-3xl font-bold text-indigo-600">15+</div>
                                <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Años de experiencia</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16">
                    {/* Plan Selection - Diseño moderno y limpio */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                        {plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer 
                                transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                                ${selectedPlan?.id === plan.id ? 'ring-4 ring-blue-500 scale-105 shadow-2xl' : ''}
                                ${plan.isBestSeller ? 'border-2 border-yellow-400' : 'border border-gray-100'}`}
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

                                {/* Plan Header con nuevo diseño */}
                                <div className={`relative p-8 text-white overflow-hidden
                                ${plan.id === 'black' ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-black' :
                                        plan.id === 'fit' ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700' :
                                            'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700'}`}>

                                    {/* Patrón de fondo mejorado */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-3xl font-black tracking-tight">{plan.name}</h3>
                                            <div className="text-4xl filter drop-shadow-lg">
                                                {plan.id === 'black' ? '🏆' : plan.id === 'fit' ? '💪' : '⚡'}
                                            </div>
                                        </div>
                                        <p className="text-sm opacity-90 mb-8 leading-relaxed">{plan.description}</p>
                                        <div className="flex items-baseline mb-4">
                                            <span className="text-5xl font-black">${plan.price}</span>
                                            <span className="text-xl opacity-75 ml-3">/mes</span>
                                        </div>

                                        {/* Indicador de ahorro */}
                                        {plan.id === 'fit' && (
                                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                                <span className="text-xs font-semibold">🔥 Mejor relación calidad-precio</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Plan Benefits con nuevo diseño */}
                                <div className="p-8">
                                    <ul className="space-y-4 mb-8">
                                        {plan.benefits.slice(0, 4).map((benefit, index) => (
                                            <li key={index} className="flex items-start group-hover:translate-x-2 transition-all duration-500"
                                                style={{ transitionDelay: `${index * 100}ms` }}>
                                                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700 leading-relaxed font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                        {plan.benefits.length > 4 && (
                                            <li className="text-sm text-gray-500 ml-10 italic font-medium">
                                                +{plan.benefits.length - 4} beneficios adicionales
                                            </li>
                                        )}
                                    </ul>

                                    <button className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform
                                    ${selectedPlan?.id === plan.id
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:scale-105 shadow-lg'
                                        }`}>
                                        {selectedPlan?.id === plan.id ? '✓ Plan Seleccionado' : 'Seleccionar Plan'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Configuration Panel - Diseño moderno y limpio */}
                    {selectedPlan && (
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
                            {/* Header del Panel */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 relative">
                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">⚙️</span>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black">Personaliza tu membresía</h2>
                                            <p className="text-white/80 text-lg">Configura tu plan {selectedPlan.name} según tus necesidades</p>
                                        </div>
                                    </div>
                                </div>
                            </div>                            <div className="p-8" style={{ overflow: 'visible' }}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Left Column - Configuration */}
                                    <div className="space-y-8">
                                        {/* Membership Type - Diseño mejorado */}
                                        <div>
                                            <label className="block text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <span className="text-2xl">👥</span>
                                                Tipo de Membresía
                                            </label>
                                            <div className="space-y-4" style={{ scrollMargin: '0px' }}>
                                                {Object.entries(membershipTypes).map(([key, type]) => (
                                                    <label key={key} className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105
                                                    ${membershipType === key ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg' : 'border-gray-200 hover:border-indigo-300 bg-white/50'}`}
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
                                                        <div className="text-3xl mr-5">{type.icon}</div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-gray-900 text-lg">{type.label}</div>
                                                            <div className="text-sm text-gray-600">{type.description}</div>
                                                            <div className="text-xs text-indigo-600 font-semibold mt-1">
                                                                Factor: {type.factor}x
                                                            </div>
                                                        </div>
                                                        {membershipType === key && (
                                                            <div className="text-indigo-600 transform scale-110">
                                                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Billing Cycle - Diseño mejorado */}
                                        <div>
                                            <label className="block text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <span className="text-2xl">💳</span>
                                                Ciclo de Facturación
                                            </label>
                                            <div className="space-y-4" style={{ scrollMargin: '0px' }}>
                                                <label className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105
                                                ${billingCycle === 'monthly' ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg' : 'border-gray-200 hover:border-blue-300 bg-white/50'}`}
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
                                                    <div className="text-3xl mr-5">📅</div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900 text-lg">Mensual</div>
                                                        <div className="text-sm text-gray-600">Pago cada mes - máxima flexibilidad</div>
                                                    </div>
                                                    {billingCycle === 'monthly' && (
                                                        <div className="text-blue-600 transform scale-110">
                                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </label>

                                                <label className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 relative overflow-hidden
                                                ${billingCycle === 'annual' ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg' : 'border-gray-200 hover:border-emerald-300 bg-white/50'}`}
                                                    style={{ scrollMargin: '0px' }}>
                                                    {/* Badge de descuento */}
                                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        10% OFF
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="billingCycle"
                                                        value="annual"
                                                        checked={billingCycle === 'annual'}
                                                        onChange={handleBillingCycleChange}
                                                        className="sr-only"
                                                        style={{ scrollMargin: '0px' }}
                                                    />
                                                    <div className="text-3xl mr-5">💰</div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900 text-lg">
                                                            Anual <span className="text-green-600 font-black">(Ahorra 10%)</span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">Pago una vez al año - mejor precio</div>
                                                    </div>
                                                    {billingCycle === 'annual' && (
                                                        <div className="text-emerald-600 transform scale-110">
                                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        {/* Add-ons - Diseño mejorado */}
                                        <div>
                                            <label className="block text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <span className="text-2xl">✨</span>
                                                Servicios Adicionales
                                            </label>
                                            <div className="space-y-4">
                                                {availableAddons.map((addon) => (
                                                    <label key={addon.id} className={`group flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 relative overflow-hidden
                                                    ${addons.includes(addon.id) ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg' : 'border-gray-200 hover:border-green-300 bg-white/50'}`}>

                                                        {/* Efecto de brillo al seleccionar */}
                                                        {addons.includes(addon.id) && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/30 to-transparent transform -skew-x-12 animate-pulse"></div>
                                                        )}

                                                        <input
                                                            type="checkbox"
                                                            checked={addons.includes(addon.id)}
                                                            onChange={() => handleAddonToggle(addon.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className="text-3xl mr-5 filter drop-shadow-lg">{addon.icon}</div>
                                                        <div className="flex-1 relative">
                                                            <div className="font-bold text-gray-900 text-lg">{addon.name}</div>
                                                            <div className="text-sm text-gray-600 leading-relaxed">{addon.description}</div>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <div className="font-black text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                                +${addon.price}/mes
                                                            </div>
                                                            {addons.includes(addon.id) && (
                                                                <div className="text-green-600 transform scale-110 mt-2 flex justify-center">
                                                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
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

                                    {/* Right Column - Summary Ultra Moderno */}
                                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-lg relative">
                                        <div className="relative">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <span className="text-xl">📄</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900">Resumen de tu membresía</h3>
                                            </div>
                                            {renderPricingSummary()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanSubscriptionGallery;