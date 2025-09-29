// src/Data/seedData.js
import { addPayment } from './Stores/pagos.store';
import { addBooking } from './Stores/reservas.store';
import { saveUser } from './Stores/usuario.store';

// Función para generar datos de prueba para el dashboard
export const seedDashboardData = () => {
    const now = new Date();

    // Usar usuarios existentes o crear algunos básicos
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let userIds = existingUsers.map(u => u.id);

    // Si no hay usuarios, crear algunos básicos
    if (userIds.length === 0) {
        const users = [
            { nombre: 'Juan Pérez', email: 'juan@email.com', rol: 'cliente' },
            { nombre: 'María García', email: 'maria@email.com', rol: 'cliente' },
            { nombre: 'Carlos López', email: 'carlos@email.com', rol: 'cliente' },
            { nombre: 'Ana Martín', email: 'ana@email.com', rol: 'entrenador' },
            { nombre: 'Luis Rodríguez', email: 'luis@email.com', rol: 'cliente' }
        ];

        users.forEach(user => {
            try {
                const newUser = saveUser(user);
                userIds.push(newUser.id);
            } catch (error) {
                console.warn('Error creating user:', error);
                // Crear ID temporal para continuar con los datos de prueba
                userIds.push(`temp_${Date.now()}_${Math.random()}`);
            }
        });
    }

    // Generar pagos de los últimos 3 meses
    for (let i = 0; i < 90; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Probabilidad de pago cada día
        if (Math.random() > 0.7) {
            const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
            const amounts = [30, 50, 80]; // Planes básico, premium, VIP
            const methods = ['efectivo', 'tarjeta', 'transferencia'];

            addPayment({
                userId: randomUser,
                planId: '1',
                total: amounts[Math.floor(Math.random() * amounts.length)],
                method: methods[Math.floor(Math.random() * methods.length)]
            });
        }
    }

    // Generar reservas de los últimos 30 días
    const salas = ['Sala Cardio', 'Sala Pesas', 'Sala Grupal', 'Sala Funcional'];
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Generar varias reservas por día
        const reservasDelDia = Math.floor(Math.random() * 10) + 5;
        for (let j = 0; j < reservasDelDia; j++) {
            const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
            const randomSala = salas[Math.floor(Math.random() * salas.length)];
            const hora = Math.floor(Math.random() * 12) + 8; // Entre 8:00 y 20:00

            addBooking({
                userId: randomUser,
                fecha: date.toISOString().split('T')[0],
                hora: `${hora}:00`,
                sala: randomSala,
                maquina: `Máquina ${Math.floor(Math.random() * 10) + 1}`,
                instructorId: userIds[0] // Usar el primer usuario como instructor
            });
        }
    }

    // Generar registros de asistencia de los últimos 30 días
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Generar múltiples entradas y salidas por día
        const visitasDelDia = Math.floor(Math.random() * 50) + 20;
        for (let j = 0; j < visitasDelDia; j++) {
            const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
            const hora = Math.floor(Math.random() * 14) + 6; // Entre 6:00 y 20:00
            const minutos = Math.floor(Math.random() * 60);

            const timestamp = new Date(date);
            timestamp.setHours(hora, minutos, 0, 0);

            // Entrada
            if (window.db && window.db.push) {
                window.db.push('attendance', {
                    id: `att_${Date.now()}_${j}_entrada`,
                    ts: timestamp.toISOString(),
                    userId: randomUser,
                    action: 'entrada',
                    area: 'recepcion'
                });

                // Salida (1-4 horas después)
                const salidaTime = new Date(timestamp);
                salidaTime.setHours(salidaTime.getHours() + Math.floor(Math.random() * 4) + 1);

                window.db.push('attendance', {
                    id: `att_${Date.now()}_${j}_salida`,
                    ts: salidaTime.toISOString(),
                    userId: randomUser,
                    action: 'salida',
                    area: 'recepcion'
                });
            }
        }
    }

    console.log('Datos de prueba generados exitosamente para el dashboard');
};

// Función para limpiar todos los datos (útil para resetear)
export const clearAllData = () => {
    if (window.db) {
        localStorage.removeItem('users');
        localStorage.removeItem('payments');
        localStorage.removeItem('bookings');
        localStorage.removeItem('attendance');
        console.log('Todos los datos han sido eliminados');
    }
};

// Ejecutar automáticamente al importar si no hay datos
export const initializeDashboardData = () => {
    try {
        const hasUsers = localStorage.getItem('users');
        const hasPayments = localStorage.getItem('payments');

        if (!hasUsers || !hasPayments) {
            console.log('Inicializando datos de prueba para el dashboard...');
            seedDashboardData();
        }
    } catch (error) {
        console.error('Error inicializando datos:', error);
    }
};