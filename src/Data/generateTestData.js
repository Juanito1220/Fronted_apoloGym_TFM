// src/Data/generateTestData.js
import { addPayment } from './Stores/pagos.store';
import { addBooking } from './Stores/reservas.store';
import { saveUser } from './Stores/usuario.store';

// Función específica para generar datos ricos para el dashboard
export const generateRichTestData = () => {
    console.log('Generando datos de prueba ricos para el dashboard...');

    // Limpiar datos existentes si queremos empezar fresh
    // localStorage.removeItem('payments');
    // localStorage.removeItem('bookings');
    // localStorage.removeItem('attendance');

    const now = new Date();

    // Crear usuarios de prueba si no existen
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let userIds = users.map(u => u.id);

    if (userIds.length < 10) {
        const newUsers = [
            { nombre: 'Juan Pérez', email: 'juan@email.com', rol: 'cliente' },
            { nombre: 'María García', email: 'maria@email.com', rol: 'cliente' },
            { nombre: 'Carlos López', email: 'carlos@email.com', rol: 'cliente' },
            { nombre: 'Ana Martín', email: 'ana@email.com', rol: 'entrenador' },
            { nombre: 'Luis Rodríguez', email: 'luis@email.com', rol: 'cliente' },
            { nombre: 'Sofia Chen', email: 'sofia@email.com', rol: 'cliente' },
            { nombre: 'Miguel Torres', email: 'miguel@email.com', rol: 'cliente' },
            { nombre: 'Laura Vega', email: 'laura@email.com', rol: 'entrenador' },
            { nombre: 'Diego Morales', email: 'diego@email.com', rol: 'cliente' },
            { nombre: 'Carmen Silva', email: 'carmen@email.com', rol: 'cliente' }
        ];

        newUsers.forEach(user => {
            try {
                const newUser = saveUser(user);
                userIds.push(newUser.id);
            } catch (error) {
                console.warn('Error creating user:', error);
                userIds.push(`user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
            }
        });
    }

    // Generar pagos de los últimos 6 meses con patrones realistas
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    if (payments.length < 50) {
        for (let i = 0; i < 180; i++) { // 6 meses
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Más pagos los primeros días del mes (renovaciones)
            const dayOfMonth = date.getDate();
            let paymentProbability = 0.15; // Base 15%
            if (dayOfMonth <= 5) paymentProbability = 0.4; // 40% primeros 5 días
            if (dayOfMonth <= 2) paymentProbability = 0.6; // 60% primeros 2 días

            if (Math.random() < paymentProbability) {
                const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
                const amounts = [30, 50, 80, 120]; // Diferentes planes
                const methods = ['efectivo', 'tarjeta', 'transferencia', 'paypal'];

                const payment = {
                    userId: randomUser,
                    planId: Math.floor(Math.random() * 3) + 1,
                    total: amounts[Math.floor(Math.random() * amounts.length)],
                    method: methods[Math.floor(Math.random() * methods.length)]
                };

                // Establecer timestamp específico
                const paymentWithTs = addPayment(payment);
                // Actualizar el timestamp para que sea de la fecha correcta
                const updatedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
                const lastPayment = updatedPayments[updatedPayments.length - 1];
                if (lastPayment) {
                    lastPayment.ts = date.toISOString();
                    localStorage.setItem('payments', JSON.stringify(updatedPayments));
                }
            }
        }
    }

    // Generar reservas de los últimos 60 días
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const salas = ['Sala Cardio', 'Sala Pesas', 'Sala Grupal', 'Sala Funcional', 'Spinning', 'CrossFit'];

    if (bookings.length < 200) {
        for (let i = 0; i < 60; i++) { // 60 días
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Más reservas en días laborales
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const baseReservas = isWeekend ? 8 : 15;
            const reservasDelDia = Math.floor(Math.random() * 10) + baseReservas;

            for (let j = 0; j < reservasDelDia; j++) {
                const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
                const randomSala = salas[Math.floor(Math.random() * salas.length)];

                // Horarios más populares: mañana (7-10) y tarde (18-21)
                let hora;
                if (Math.random() < 0.4) {
                    hora = Math.floor(Math.random() * 4) + 7; // 7-10 AM
                } else if (Math.random() < 0.7) {
                    hora = Math.floor(Math.random() * 4) + 18; // 6-9 PM
                } else {
                    hora = Math.floor(Math.random() * 14) + 6; // 6 AM - 8 PM
                }

                const booking = {
                    userId: randomUser,
                    fecha: date.toISOString().split('T')[0],
                    hora: `${hora}:${Math.floor(Math.random() * 4) * 15}`, // 15 min intervals
                    sala: randomSala,
                    maquina: `${randomSala} - Equipo ${Math.floor(Math.random() * 5) + 1}`,
                    instructorId: userIds[0]
                };

                const bookingWithTs = addBooking(booking);
                // Actualizar timestamp
                const updatedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                const lastBooking = updatedBookings[updatedBookings.length - 1];
                if (lastBooking) {
                    const bookingTime = new Date(date);
                    bookingTime.setHours(hora, Math.floor(Math.random() * 4) * 15);
                    lastBooking.ts = bookingTime.toISOString();
                    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
                }
            }
        }
    }

    // Generar registros de asistencia (attendance) de los últimos 30 días
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

    if (attendance.length < 500) {
        for (let i = 0; i < 30; i++) { // 30 días
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Patrón de asistencia realista por día de semana
            const dayOfWeek = date.getDay();
            let baseVisitas;
            if (dayOfWeek === 1 || dayOfWeek === 2) baseVisitas = 45; // Lunes/Martes - altos
            else if (dayOfWeek === 6) baseVisitas = 35; // Sábado - alto
            else if (dayOfWeek === 0) baseVisitas = 20; // Domingo - bajo
            else baseVisitas = 30; // Resto - medio

            const visitasDelDia = Math.floor(Math.random() * 20) + baseVisitas;

            // Generar patrones de entrada y salida por horas
            const horasPico = [8, 9, 10, 18, 19, 20]; // Horas pico

            for (let j = 0; j < visitasDelDia; j++) {
                const randomUser = userIds[Math.floor(Math.random() * userIds.length)];

                // Seleccionar hora con mayor probabilidad en horas pico
                let hora;
                if (Math.random() < 0.6) {
                    hora = horasPico[Math.floor(Math.random() * horasPico.length)];
                } else {
                    hora = Math.floor(Math.random() * 15) + 6; // 6 AM - 9 PM
                }

                const minutos = Math.floor(Math.random() * 60);
                const entradaTime = new Date(date);
                entradaTime.setHours(hora, minutos, 0, 0);

                // Crear registro de entrada
                const entradaRecord = {
                    id: `att_${entradaTime.getTime()}_${j}_entrada`,
                    ts: entradaTime.toISOString(),
                    userId: randomUser,
                    action: 'entrada',
                    area: 'recepcion'
                };

                // Crear registro de salida (30min - 3 horas después)
                const salidaTime = new Date(entradaTime);
                const duracion = Math.floor(Math.random() * 150) + 30; // 30-180 min
                salidaTime.setMinutes(salidaTime.getMinutes() + duracion);

                const salidaRecord = {
                    id: `att_${salidaTime.getTime()}_${j}_salida`,
                    ts: salidaTime.toISOString(),
                    userId: randomUser,
                    action: 'salida',
                    area: 'recepcion'
                };

                // Agregar al localStorage directamente para mantener timestamps
                const currentAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
                currentAttendance.push(entradaRecord, salidaRecord);
                localStorage.setItem('attendance', JSON.stringify(currentAttendance));
            }
        }
    }

    console.log('✅ Datos de prueba generados exitosamente:');
    console.log(`- Pagos: ${JSON.parse(localStorage.getItem('payments') || '[]').length}`);
    console.log(`- Reservas: ${JSON.parse(localStorage.getItem('bookings') || '[]').length}`);
    console.log(`- Registros de asistencia: ${JSON.parse(localStorage.getItem('attendance') || '[]').length}`);
    console.log(`- Usuarios: ${JSON.parse(localStorage.getItem('users') || '[]').length}`);
};

// Función para limpiar todos los datos
export const clearAllTestData = () => {
    localStorage.removeItem('payments');
    localStorage.removeItem('bookings');
    localStorage.removeItem('attendance');
    // No eliminar usuarios para mantener las cuentas de login
    console.log('Datos de prueba eliminados');
};

// Auto-ejecutar si no hay suficientes datos
export const autoGenerateIfNeeded = () => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

    if (payments.length < 20 || bookings.length < 50 || attendance.length < 100) {
        console.log('Pocos datos encontrados, generando datos de prueba...');
        generateRichTestData();
    }
};