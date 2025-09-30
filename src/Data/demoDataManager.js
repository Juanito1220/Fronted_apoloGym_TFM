// Script para inicializar datos de prueba para el módulo de membresías
// Este archivo se puede ejecutar en la consola del navegador para poblar localStorage con datos de ejemplo

const initializeDemoData = () => {
    // Membresía activa de ejemplo
    const sampleMembership = {
        id: "MEMB-2024-001",
        planId: "black",
        planName: "PLAN Black",
        userId: "current-user-id",
        membershipType: "individual",
        billingCycle: "monthly",
        startDate: "2024-10-15T00:00:00.000Z",
        expirationDate: "2024-12-15T00:00:00.000Z",
        status: "active",
        benefits: [
            "Área de peso libre, peso integrado, cardio y clases grupales",
            "Acceso a todas las áreas del gimnasio",
            "Sin cargo por cancelación",
            "Invitar un amigo a entrenar",
            "Sillones de masaje"
        ],
        addons: [
            {
                id: "nutrition",
                name: "Asesoría Nutricional",
                price: 15
            }
        ],
        totalAmount: 44.90,
        paymentId: "PAY-1734567890123",
        activatedAt: "2024-10-15T10:30:00.000Z",
        createdAt: "2024-10-15T10:00:00.000Z"
    };

    // Historial de pagos de ejemplo
    const samplePayments = [
        {
            id: "PAY-1734567890123",
            amount: 44.90,
            currency: "USD",
            method: "card",
            status: "completed",
            planId: "black",
            planName: "PLAN Black",
            customerName: "Juan Pérez",
            customerEmail: "juan.perez@email.com",
            transactionId: "TX-ABC123XYZ",
            receipt: "REC-BLK001",
            processedAt: "2024-10-15T10:30:00.000Z",
            metadata: {
                subtotal: 44.90,
                discount: 0,
                tax: 5.39,
                last4: "4532"
            }
        },
        {
            id: "PAY-1734567890124",
            amount: 44.90,
            currency: "USD",
            method: "transfer",
            status: "completed",
            planId: "black",
            planName: "PLAN Black",
            customerName: "Juan Pérez",
            customerEmail: "juan.perez@email.com",
            transactionId: "TX-DEF456ABC",
            receipt: "REC-BLK002",
            processedAt: "2024-09-15T09:15:00.000Z",
            metadata: {
                subtotal: 44.90,
                discount: 0,
                tax: 5.39
            }
        },
        {
            id: "PAY-1734567890125",
            amount: 21.90,
            currency: "USD",
            method: "card",
            status: "completed",
            planId: "fit",
            planName: "PLAN Fit",
            customerName: "Juan Pérez",
            customerEmail: "juan.perez@email.com",
            transactionId: "TX-GHI789DEF",
            receipt: "REC-FIT003",
            processedAt: "2024-08-15T14:22:00.000Z",
            metadata: {
                subtotal: 21.90,
                discount: 0,
                tax: 2.63,
                last4: "4532"
            }
        }
    ];

    // Historial de asistencia de ejemplo
    const sampleAttendance = [
        {
            fecha: "2024-11-18T00:00:00.000Z",
            actividad: "Entrenamiento General",
            horaEntrada: "07:30",
            horaSalida: "09:15",
            duracion: "1h 45min"
        },
        {
            fecha: "2024-11-16T00:00:00.000Z",
            actividad: "Clase de Spinning",
            horaEntrada: "19:00",
            horaSalida: "20:00",
            duracion: "1h"
        },
        {
            fecha: "2024-11-14T00:00:00.000Z",
            actividad: "Entrenamiento de Fuerza",
            horaEntrada: "18:30",
            horaSalida: "20:00",
            duracion: "1h 30min"
        },
        {
            fecha: "2024-11-12T00:00:00.000Z",
            actividad: "Clase de Yoga",
            horaEntrada: "17:00",
            horaSalida: "18:00",
            duracion: "1h"
        },
        {
            fecha: "2024-11-10T00:00:00.000Z",
            actividad: "Entrenamiento Cardio",
            horaEntrada: "06:00",
            horaSalida: "07:30",
            duracion: "1h 30min"
        },
        {
            fecha: "2024-11-08T00:00:00.000Z",
            actividad: "Entrenamiento General",
            horaEntrada: "08:00",
            horaSalida: "09:30",
            duracion: "1h 30min"
        },
        {
            fecha: "2024-11-06T00:00:00.000Z",
            actividad: "Clase de Zumba",
            horaEntrada: "19:30",
            horaSalida: "20:30",
            duracion: "1h"
        },
        {
            fecha: "2024-11-04T00:00:00.000Z",
            actividad: "Entrenamiento Funcional",
            horaEntrada: "17:45",
            horaSalida: "19:00",
            duracion: "1h 15min"
        }
    ];

    // Guardar en localStorage
    try {
        localStorage.setItem('user_membership', JSON.stringify(sampleMembership));
        localStorage.setItem('demo_pagos', JSON.stringify(samplePayments));
        localStorage.setItem('demo_reservas', JSON.stringify(sampleAttendance));

        console.log('✅ Datos de prueba inicializados correctamente');
        console.log('📊 Membresía activa:', sampleMembership.planName);
        console.log('💳 Pagos registrados:', samplePayments.length);
        console.log('🏃 Visitas registradas:', sampleAttendance.length);

        return {
            success: true,
            message: 'Datos de prueba cargados exitosamente',
            data: {
                membership: sampleMembership,
                payments: samplePayments,
                attendance: sampleAttendance
            }
        };
    } catch (error) {
        console.error('❌ Error al inicializar datos de prueba:', error);
        return {
            success: false,
            message: 'Error al cargar datos de prueba',
            error
        };
    }
};

// Función para limpiar todos los datos de prueba
const clearDemoData = () => {
    try {
        localStorage.removeItem('user_membership');
        localStorage.removeItem('demo_pagos');
        localStorage.removeItem('demo_reservas');
        localStorage.removeItem('pending_subscription');
        localStorage.removeItem('pending_renewal');
        localStorage.removeItem('checkout_data');

        console.log('🧹 Datos de prueba eliminados correctamente');
        return {
            success: true,
            message: 'Datos de prueba eliminados exitosamente'
        };
    } catch (error) {
        console.error('❌ Error al limpiar datos de prueba:', error);
        return {
            success: false,
            message: 'Error al limpiar datos de prueba',
            error
        };
    }
};

// Función para verificar el estado actual de los datos
const checkDemoData = () => {
    const membership = localStorage.getItem('user_membership');
    const payments = localStorage.getItem('demo_pagos');
    const attendance = localStorage.getItem('demo_reservas');

    console.log('📋 Estado actual de los datos:');
    console.log('- Membresía:', membership ? 'Existe' : 'No existe');
    console.log('- Pagos:', payments ? JSON.parse(payments).length + ' registros' : 'No existen');
    console.log('- Asistencia:', attendance ? JSON.parse(attendance).length + ' registros' : 'No existe');

    return {
        hasMembership: !!membership,
        paymentsCount: payments ? JSON.parse(payments).length : 0,
        attendanceCount: attendance ? JSON.parse(attendance).length : 0
    };
};

// Exportar funciones para uso en consola del navegador
if (typeof window !== 'undefined') {
    window.initializeDemoData = initializeDemoData;
    window.clearDemoData = clearDemoData;
    window.checkDemoData = checkDemoData;
}

// Ejecutar automáticamente al cargar el archivo
console.log('🚀 Demo Data Manager cargado');
console.log('📝 Funciones disponibles:');
console.log('- initializeDemoData(): Cargar datos de prueba');
console.log('- clearDemoData(): Limpiar todos los datos');
console.log('- checkDemoData(): Verificar estado actual');

export { initializeDemoData, clearDemoData, checkDemoData };