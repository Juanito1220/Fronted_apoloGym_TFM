// Servicios para el módulo de Membresías y Pagos del Cliente
// Simulación de API usando localStorage para persistencia de datos

// ==================== PLANS SERVICE ====================

export const plansService = {
    // RF002: Obtener lista de planes activos disponibles para compra
    async getActivePlans() {
        try {
            // Simulación con localStorage mientras no hay backend
            const mockPlans = [
                {
                    id: "black",
                    name: "PLAN Black",
                    description: "Entrena en cualquiera de nuestros gimnasios en Latinoamérica",
                    price: 29.90,
                    duration: 30, // días
                    benefits: [
                        "Área de peso libre, peso integrado, cardio y clases grupales",
                        "Acceso a todas las áreas del gimnasio",
                        "Sin cargo por cancelación",
                        "Invitar un amigo a entrenar",
                        "Sillones de masaje"
                    ],
                    isActive: true,
                    isBestSeller: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "fit",
                    name: "PLAN Fit",
                    description: "Entrena todo lo que quieras en tu unidad y paga menos",
                    price: 21.90,
                    duration: 30,
                    benefits: [
                        "Área de peso libre, peso integrado, cardio y clases grupales",
                        "Acceso a todas las áreas del gimnasio",
                        "Sin cargo por cancelación"
                    ],
                    isActive: true,
                    isBestSeller: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "smart",
                    name: "PLAN Smart",
                    description: "Entrena cuando quieras en tu gimnasio de elección",
                    price: 25.90,
                    duration: 30,
                    benefits: [
                        "Área de peso libre, peso integrado, cardio y clases grupales",
                        "Acceso a todas las áreas del gimnasio",
                        "Sin cargo por cancelación"
                    ],
                    isActive: true,
                    isBestSeller: false,
                    createdAt: new Date().toISOString()
                }
            ];

            return {
                success: true,
                data: mockPlans.filter(plan => plan.isActive),
                message: 'Planes activos obtenidos exitosamente'
            };
        } catch (error) {
            console.error('Error fetching active plans:', error);
            throw error;
        }
    }
};

// ==================== MEMBERSHIPS SERVICE ====================

export const membershipsService = {
    // RF002: Consultar estado y fecha de vencimiento de la membresía del cliente
    async getMyMembershipStatus() {
        try {
            // Simulación con localStorage
            const mockMembership = localStorage.getItem('user_membership');

            if (!mockMembership) {
                return {
                    success: true,
                    data: null,
                    message: 'No hay membresía activa'
                };
            }

            const membership = JSON.parse(mockMembership);
            const now = new Date();
            const expirationDate = new Date(membership.expirationDate);
            const daysUntilExpiration = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));

            return {
                success: true,
                data: {
                    ...membership,
                    daysUntilExpiration,
                    isExpired: daysUntilExpiration < 0,
                    isExpiringSoon: daysUntilExpiration <= 7 && daysUntilExpiration > 0
                },
                message: 'Estado de membresía obtenido exitosamente'
            };
        } catch (error) {
            console.error('Error fetching membership status:', error);
            throw error;
        }
    },

    // RF003: Iniciar proceso de suscripción a un plan
    async subscribeToPlan(planId, subscriptionData) {
        try {
            // Simulación del proceso de suscripción
            const subscription = {
                id: `SUB-${Date.now()}`,
                planId,
                userId: 'current-user-id',
                startDate: subscriptionData.startDate,
                expirationDate: subscriptionData.expirationDate,
                status: 'pending_payment',
                membershipType: subscriptionData.membershipType,
                billingCycle: subscriptionData.billingCycle,
                addons: subscriptionData.addons || [],
                totalAmount: subscriptionData.totalAmount,
                createdAt: new Date().toISOString()
            };

            // Guardar en localStorage para simulación
            localStorage.setItem('pending_subscription', JSON.stringify(subscription));

            return {
                success: true,
                data: subscription,
                message: 'Suscripción iniciada exitosamente'
            };
        } catch (error) {
            console.error('Error subscribing to plan:', error);
            throw error;
        }
    },

    // Renovar membresía existente
    async renewMembership(planId, renewalData) {
        try {
            const renewal = {
                id: `REN-${Date.now()}`,
                planId,
                userId: 'current-user-id',
                startDate: renewalData.startDate,
                expirationDate: renewalData.expirationDate,
                status: 'pending_payment',
                type: 'renewal',
                totalAmount: renewalData.totalAmount,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('pending_renewal', JSON.stringify(renewal));

            return {
                success: true,
                data: renewal,
                message: 'Renovación iniciada exitosamente'
            };
        } catch (error) {
            console.error('Error renewing membership:', error);
            throw error;
        }
    }
};

// ==================== PAYMENTS SERVICE ====================

export const paymentsService = {
    // RF003: Obtener historial de pagos del cliente
    async getPaymentHistory() {
        try {
            // Simulación con localStorage
            const payments = JSON.parse(localStorage.getItem('demo_pagos') || '[]');

            return {
                success: true,
                data: payments,
                message: 'Historial de pagos obtenido exitosamente'
            };
        } catch (error) {
            console.error('Error fetching payment history:', error);
            throw error;
        }
    },

    // RF003: Procesar pago con pasarela (Stripe simulado)
    async processPayment(paymentData) {
        try {
            // Simulación del procesamiento de pago
            const payment = {
                id: `PAY-${Date.now()}`,
                amount: paymentData.amount,
                currency: 'USD',
                method: paymentData.method,
                status: 'completed',
                planId: paymentData.planId,
                planName: paymentData.planName,
                customerName: paymentData.customerName,
                customerEmail: paymentData.customerEmail,
                transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                receipt: `REC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                processedAt: new Date().toISOString(),
                metadata: paymentData.metadata || {}
            };

            // Guardar en localStorage
            const existingPayments = JSON.parse(localStorage.getItem('demo_pagos') || '[]');
            existingPayments.push(payment);
            localStorage.setItem('demo_pagos', JSON.stringify(existingPayments));

            // Activar membresía si el pago fue exitoso
            if (payment.status === 'completed') {
                await this.activateMembership(payment);
            }

            return {
                success: true,
                data: payment,
                message: 'Pago procesado exitosamente'
            };
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    },

    // Activar membresía después del pago exitoso
    async activateMembership(payment) {
        try {
            const subscription = JSON.parse(localStorage.getItem('pending_subscription') || 'null');

            if (subscription) {
                const activeMembership = {
                    ...subscription,
                    status: 'active',
                    paymentId: payment.id,
                    activatedAt: new Date().toISOString()
                };

                localStorage.setItem('user_membership', JSON.stringify(activeMembership));
                localStorage.removeItem('pending_subscription');
            }

            return {
                success: true,
                message: 'Membresía activada exitosamente'
            };
        } catch (error) {
            console.error('Error activating membership:', error);
            throw error;
        }
    },

    // Generar y descargar comprobante de pago
    async downloadReceipt(paymentId) {
        try {
            const payments = JSON.parse(localStorage.getItem('demo_pagos') || '[]');
            const payment = payments.find(p => p.id === paymentId);

            if (!payment) {
                throw new Error('Pago no encontrado');
            }

            // Simulación de descarga de comprobante
            const receiptData = {
                paymentId: payment.id,
                transactionId: payment.transactionId,
                receipt: payment.receipt,
                amount: payment.amount,
                date: payment.processedAt,
                planName: payment.planName,
                customerName: payment.customerName,
                customerEmail: payment.customerEmail
            };

            // En una implementación real, esto generaría un PDF
            const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `comprobante-${payment.receipt}.json`;
            link.click();
            window.URL.revokeObjectURL(url);

            return {
                success: true,
                message: 'Comprobante descargado exitosamente'
            };
        } catch (error) {
            console.error('Error downloading receipt:', error);
            throw error;
        }
    }
};

// ==================== ATTENDANCE SERVICE ====================

export const attendanceService = {
    // Obtener historial de asistencia del cliente
    async getAttendanceHistory() {
        try {
            // Simulación con localStorage
            const attendance = JSON.parse(localStorage.getItem('demo_reservas') || '[]');

            return {
                success: true,
                data: attendance,
                message: 'Historial de asistencia obtenido exitosamente'
            };
        } catch (error) {
            console.error('Error fetching attendance history:', error);
            throw error;
        }
    }
};

// Exportación por defecto con todos los servicios
const membershipServices = {
    plans: plansService,
    memberships: membershipsService,
    payments: paymentsService,
    attendance: attendanceService
};

export default membershipServices;