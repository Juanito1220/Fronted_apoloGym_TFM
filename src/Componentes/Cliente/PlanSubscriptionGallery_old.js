import React, { useState, useEffect } from 'react';
import { plansService, membershipsService } from '../../Data/Services/membershipService';

const PlanSubscriptionGallery = () => {
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

    // Tipos de membresía con factores de precio
    const membershipTypes = {
        individual: { label: 'Individual', factor: 1, description: 'Para una persona', icon: '👤' },
        duo: { label: 'Dúo', factor: 1.7, description: 'Para dos personas', icon: '👥' },
        familiar: { label: 'Familiar', factor: 2.5, description: 'Para toda la familia (hasta 4 personas)', icon: '👨‍👩‍👧‍👦' },
        estudiante: { label: 'Estudiante', factor: 0.8, description: 'Descuento especial para estudiantes', icon: '🎓' }
    };

    // Add-ons disponibles
    const availableAddons = [
        { id: 'nutrition', name: 'Asesoría Nutricional', price: 15, description: 'Consultas mensuales con nutricionista', icon: '🥗' },
        { id: 'personal_trainer', name: 'Entrenador Personal', price: 80, description: '4 sesiones mensuales', icon: '💪' },
        { id: 'massage', name: 'Masajes Terapéuticos', price: 25, description: '2 sesiones mensuales', icon: '💆‍♀️' },
        { id: 'supplements', name: 'Suplementos Premium', price: 30, description: 'Pack mensual de suplementos', icon: '💊' }
    ];

    useEffect(() => {
        fetchPlans();
    }, []);

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

    const calculatePrice = (basePlan) => {
        if (!basePlan) return 0;

        const membershipFactor = membershipTypes[membershipType].factor;
        const billingDiscount = billingCycle === 'annual' ? 0.9 : 1; // 10% descuento anual
        const addonsTotal = addons.reduce((sum, addonId) => {
            const addon = availableAddons.find(a => a.id === addonId);
            return sum + (addon ? addon.price : 0);
        }, 0);

        const basePrice = basePlan.price * membershipFactor;
        const totalMonthly = basePrice + addonsTotal;
        const finalPrice = totalMonthly * billingDiscount;

        return {
            basePrice,
            addonsTotal,
            totalMonthly,
            finalPrice: billingCycle === 'annual' ? finalPrice * 12 : finalPrice,
            savings: billingCycle === 'annual' ? (totalMonthly * 12) - (finalPrice * 12) : 0
        };
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handleAddonToggle = (addonId) => {
        setAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const handleSubscribe = async () => {
        if (!selectedPlan) return;

        try {
            setIsSubscribing(true);
            setShowPaymentModal(true);
            setPaymentStep('processing');

            const pricing = calculatePrice(selectedPlan);
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
                addons: addons.map(id => availableAddons.find(a => a.id === id)),
                startDate: startDate.toISOString(),
                expirationDate: expirationDate.toISOString(),
                totalAmount: pricing.finalPrice
            };

            // Simular procesamiento de pago (2-4 segundos)
            const processingTime = Math.random() * 2000 + 2000;
            await new Promise(resolve => setTimeout(resolve, processingTime));

            // Simular 90% de éxito, 10% de error
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
                const response = await membershipsService.subscribeToPlan(selectedPlan.id, subscriptionData);
                
                if (response.success) {
                    setPaymentStep('success');
                    
                    // Simular procesamiento exitoso de pago
                    setTimeout(() => {
                        // Guardar datos de checkout para el proceso de pago
                        localStorage.setItem('checkout_data', JSON.stringify({
                            subscription: response.data,
                            pricing,
                            paymentResult: 'success'
                        }));
                        
                        // Redirigir al historial después del éxito
                        window.location.href = '/cliente/historial';
                    }, 2000);
                }
            } else {
                setPaymentStep('error');
                setTimeout(() => {
                    setShowPaymentModal(false);
                    setPaymentStep('processing');
                }, 3000);
            }
        } catch (err) {
            console.error('Error subscribing to plan:', err);
            setPaymentStep('error');
            setTimeout(() => {
                setShowPaymentModal(false);
                setPaymentStep('processing');
                setError('Error al procesar la suscripción');
            }, 3000);
        } finally {
            setIsSubscribing(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                                            style={{transitionDelay: `${index * 50}ms`}}>
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
                                {plan.benefits.slice(0, 4).map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{benefit}</span>
                                    </li>
                                ))}
                                {plan.benefits.length > 4 && (
                                    <li className="text-sm text-gray-500 ml-8">
                                        +{plan.benefits.length - 4} beneficios más
                                    </li>
                                )}
                            </ul>

                            <button
                                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${selectedPlan?.id === plan.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {selectedPlan?.id === plan.id ? 'Seleccionado' : 'Seleccionar Plan'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Configuration Panel */}
            {selectedPlan && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personaliza tu membresía</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Configuration */}
                        <div className="space-y-6">
                            {/* Membership Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Membresía</label>
                                <div className="space-y-2">
                                    {Object.entries(membershipTypes).map(([key, type]) => (
                                        <label key={key} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="membershipType"
                                                value={key}
                                                checked={membershipType === key}
                                                onChange={(e) => setMembershipType(e.target.value)}
                                                className="mr-3"
                                            />
                                            <div>
                                                <div className="font-medium">{type.label}</div>
                                                <div className="text-sm text-gray-500">{type.description}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Billing Cycle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Ciclo de Facturación</label>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="billingCycle"
                                            value="monthly"
                                            checked={billingCycle === 'monthly'}
                                            onChange={(e) => setBillingCycle(e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">Mensual</div>
                                            <div className="text-sm text-gray-500">Pago cada mes</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="billingCycle"
                                            value="annual"
                                            checked={billingCycle === 'annual'}
                                            onChange={(e) => setBillingCycle(e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">Anual <span className="text-green-600 font-bold">(10% descuento)</span></div>
                                            <div className="text-sm text-gray-500">Pago una vez al año</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Add-ons */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Servicios Adicionales</label>
                                <div className="space-y-2">
                                    {availableAddons.map((addon) => (
                                        <label key={addon.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={addons.includes(addon.id)}
                                                onChange={() => handleAddonToggle(addon.id)}
                                                className="mr-3"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{addon.name}</div>
                                                <div className="text-sm text-gray-500">{addon.description}</div>
                                            </div>
                                            <div className="font-bold text-blue-600">+${addon.price}/mes</div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de tu membresía</h3>

                            {(() => {
                                const pricing = calculatePrice(selectedPlan);
                                return (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>{selectedPlan.name} - {membershipTypes[membershipType].label}</span>
                                            <span>${pricing.basePrice.toFixed(2)}/mes</span>
                                        </div>

                                        {addons.length > 0 && (
                                            <>
                                                {addons.map(addonId => {
                                                    const addon = availableAddons.find(a => a.id === addonId);
                                                    return (
                                                        <div key={addonId} className="flex justify-between text-sm">
                                                            <span>• {addon.name}</span>
                                                            <span>${addon.price}/mes</span>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        )}

                                        <div className="border-t pt-3">
                                            <div className="flex justify-between">
                                                <span>Total mensual</span>
                                                <span>${pricing.totalMonthly.toFixed(2)}</span>
                                            </div>

                                            {billingCycle === 'annual' && (
                                                <>
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Descuento anual (10%)</span>
                                                        <span>-${pricing.savings.toFixed(2)}</span>
                                                    </div>
                                                </>
                                            )}

                                            <div className="flex justify-between text-lg font-bold text-blue-600 mt-2 pt-2 border-t">
                                                <span>Total a pagar</span>
                                                <span>${pricing.finalPrice.toFixed(2)} {billingCycle === 'annual' ? '/año' : '/mes'}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <button
                                onClick={handleSubscribe}
                                disabled={isSubscribing}
                                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubscribing ? 'Procesando...' : 'Proceder al Pago'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanSubscriptionGallery;