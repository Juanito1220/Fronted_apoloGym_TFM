// src/Data/seedUsers.js
import { db, uid, nowISO } from "./api";

/**
 * Función para generar usuarios de ejemplo para demostrar la funcionalidad
 */
export const seedUsersData = () => {
    const existingUsers = db.list("users");

    // Si ya hay usuarios, no agregar más
    if (existingUsers.length > 0) {
        return existingUsers;
    }

    const sampleUsers = [
        {
            id: uid(),
            nombre: "Juan Carlos Pérez",
            email: "juan.perez@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 612 345 678",
            role: "admin",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "María González López",
            email: "maria.gonzalez@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 622 456 789",
            role: "entrenador",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "Carlos Rodríguez",
            email: "carlos.rodriguez@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 633 567 890",
            role: "entrenador",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "Ana Martínez",
            email: "ana.martinez@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 644 678 901",
            role: "cliente",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "Luis Fernández",
            email: "luis.fernandez@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 655 789 012",
            role: "cliente",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "Elena Santos",
            email: "elena.santos@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 666 890 123",
            role: "cliente",
            active: false,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "Roberto García",
            email: "roberto.garcia@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 677 901 234",
            role: "cliente",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "Patricia López",
            email: "patricia.lopez@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 688 012 345",
            role: "cliente",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "David Hernández",
            email: "david.hernandez@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 699 123 456",
            role: "entrenador",
            active: false,
            createdAt: nowISO(),
            updatedAt: nowISO()
        },
        {
            id: uid(),
            nombre: "Carmen Ruiz",
            email: "carmen.ruiz@email.com",
            password: "hashed_123456_" + Date.now(),
            telefono: "+34 610 234 567",
            role: "cliente",
            active: true,
            createdAt: nowISO(),
            updatedAt: nowISO()
        }
    ];

    // Guardar usuarios de ejemplo
    db.save("users", sampleUsers);
    console.log(`✅ Se han creado ${sampleUsers.length} usuarios de ejemplo`);

    return sampleUsers;
};

/**
 * Limpiar todos los usuarios (útil para testing)
 */
export const clearUsersData = () => {
    db.save("users", []);
    console.log("🗑️ Todos los usuarios han sido eliminados");
};

/**
 * Obtener estadísticas rápidas de usuarios
 */
export const getUsersStats = () => {
    const users = db.list("users");

    return {
        total: users.length,
        active: users.filter(u => u.active).length,
        inactive: users.filter(u => !u.active).length,
        roles: {
            admin: users.filter(u => u.role === 'admin').length,
            entrenador: users.filter(u => u.role === 'entrenador').length,
            cliente: users.filter(u => u.role === 'cliente').length
        }
    };
};