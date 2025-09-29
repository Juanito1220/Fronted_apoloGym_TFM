// src/Data/Services/userService.js
import { db, uid, nowISO } from "../api";

/**
 * Servicio para manejar operaciones de usuarios con simulación de API REST
 * Este servicio simula las llamadas a los endpoints del backend
 */

// Simular delay de red para hacer más realista la experiencia
const simulateNetworkDelay = (min = 300, max = 800) => {
    return new Promise(resolve => {
        const delay = Math.random() * (max - min) + min;
        setTimeout(resolve, delay);
    });
};

// Simular respuesta exitosa de API
const createApiResponse = (data, message = "Operación exitosa") => ({
    success: true,
    data,
    message,
    timestamp: nowISO()
});

// Simular respuesta de error de API
const createApiError = (message, code = 400) => ({
    success: false,
    error: message,
    code,
    timestamp: nowISO()
});

export class UserService {

    /**
     * Listar todos los usuarios con filtros opcionales
     * Simula: GET /api/v1/users
     */
    static async getUsers(filters = {}) {
        await simulateNetworkDelay();

        try {
            let users = db.list("users");

            // Aplicar filtros si existen
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                users = users.filter(user =>
                    user.nombre.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
                );
            }

            if (filters.role && filters.role !== 'todos') {
                users = users.filter(user => user.role === filters.role);
            }

            if (filters.active !== undefined) {
                users = users.filter(user => user.active === filters.active);
            }

            // Simular paginación
            const page = filters.page || 1;
            const limit = filters.limit || 50;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedUsers = users.slice(startIndex, endIndex);

            return createApiResponse({
                users: paginatedUsers,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(users.length / limit),
                    totalUsers: users.length,
                    hasNextPage: endIndex < users.length,
                    hasPrevPage: page > 1
                }
            });

        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            return createApiError("Error interno del servidor", 500);
        }
    }

    /**
     * Crear un nuevo usuario
     * Simula: POST /api/v1/users/register
     */
    static async createUser(userData) {
        await simulateNetworkDelay();

        try {
            // Validaciones básicas
            const validationError = this.validateUserData(userData);
            if (validationError) {
                return createApiError(validationError, 400);
            }

            // Verificar si el email ya existe
            const existingUsers = db.list("users");
            const emailExists = existingUsers.some(user => user.email === userData.email);

            if (emailExists) {
                return createApiError("El email ya está registrado", 409);
            }

            // Crear nuevo usuario
            const newUser = {
                id: uid(),
                ...userData,
                password: this.hashPassword(userData.password), // En producción usar bcrypt
                createdAt: nowISO(),
                updatedAt: nowISO(),
                active: userData.active !== undefined ? userData.active : true
            };

            // Guardar en "base de datos"
            const users = [...existingUsers, newUser];
            db.save("users", users);

            // No devolver la contraseña en la respuesta
            const { password, ...userResponse } = newUser;

            return createApiResponse(userResponse, "Usuario creado exitosamente");

        } catch (error) {
            console.error("Error al crear usuario:", error);
            return createApiError("Error interno del servidor", 500);
        }
    }

    /**
     * Actualizar un usuario existente
     * Simula: PUT /api/v1/users/:id
     */
    static async updateUser(userId, userData) {
        await simulateNetworkDelay();

        try {
            const users = db.list("users");
            const userIndex = users.findIndex(user => user.id === userId);

            if (userIndex === -1) {
                return createApiError("Usuario no encontrado", 404);
            }

            // Si se actualiza el email, verificar que no exista
            if (userData.email && userData.email !== users[userIndex].email) {
                const emailExists = users.some(user =>
                    user.email === userData.email && user.id !== userId
                );

                if (emailExists) {
                    return createApiError("El email ya está en uso", 409);
                }
            }

            // Actualizar usuario
            const updatedUser = {
                ...users[userIndex],
                ...userData,
                updatedAt: nowISO()
            };

            // Si se proporciona nueva contraseña, hashearla
            if (userData.password && userData.password.trim()) {
                updatedUser.password = this.hashPassword(userData.password);
            }

            users[userIndex] = updatedUser;
            db.save("users", users);

            // No devolver la contraseña en la respuesta
            const { password, ...userResponse } = updatedUser;

            return createApiResponse(userResponse, "Usuario actualizado exitosamente");

        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            return createApiError("Error interno del servidor", 500);
        }
    }

    /**
     * Eliminar un usuario (eliminación lógica)
     * Simula: DELETE /api/v1/users/:id
     */
    static async deleteUser(userId) {
        await simulateNetworkDelay();

        try {
            const users = db.list("users");
            console.log('🔍 UserService: Usuarios antes de eliminar:', users.length);

            const userIndex = users.findIndex(user => user.id === userId);
            console.log(`🎯 UserService: Buscando usuario ID ${userId}, índice encontrado:`, userIndex);

            if (userIndex === -1) {
                return createApiError("Usuario no encontrado", 404);
            }

            console.log('👤 UserService: Usuario antes de marcar inactivo:', users[userIndex]);

            // Eliminación lógica - marcar como inactivo
            users[userIndex] = {
                ...users[userIndex],
                active: false,
                deletedAt: nowISO(),
                updatedAt: nowISO()
            };

            console.log('❌ UserService: Usuario después de marcar inactivo:', users[userIndex]);

            db.save("users", users);
            console.log('💾 UserService: Guardado en localStorage, total usuarios:', users.length);

            return createApiResponse(null, "Usuario eliminado exitosamente");

        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return createApiError("Error interno del servidor", 500);
        }
    }

    /**
     * Cambiar el estado activo/inactivo de un usuario
     * Simula: PATCH /api/v1/users/:id/status
     */
    static async toggleUserStatus(userId, active) {
        await simulateNetworkDelay();

        try {
            const users = db.list("users");
            const userIndex = users.findIndex(user => user.id === userId);

            if (userIndex === -1) {
                return createApiError("Usuario no encontrado", 404);
            }

            users[userIndex] = {
                ...users[userIndex],
                active,
                updatedAt: nowISO()
            };

            db.save("users", users);

            const { password, ...userResponse } = users[userIndex];

            return createApiResponse(
                userResponse,
                `Usuario ${active ? 'activado' : 'desactivado'} exitosamente`
            );

        } catch (error) {
            console.error("Error al cambiar estado del usuario:", error);
            return createApiError("Error interno del servidor", 500);
        }
    }

    /**
     * Cambiar el rol de un usuario
     * Simula: PATCH /api/v1/users/:id/role
     */
    static async changeUserRole(userId, newRole) {
        await simulateNetworkDelay();

        try {
            const validRoles = ['cliente', 'entrenador', 'admin'];

            if (!validRoles.includes(newRole)) {
                return createApiError("Rol inválido", 400);
            }

            const users = db.list("users");
            const userIndex = users.findIndex(user => user.id === userId);

            if (userIndex === -1) {
                return createApiError("Usuario no encontrado", 404);
            }

            users[userIndex] = {
                ...users[userIndex],
                role: newRole,
                updatedAt: nowISO()
            };

            db.save("users", users);

            const { password, ...userResponse } = users[userIndex];

            return createApiResponse(userResponse, "Rol actualizado exitosamente");

        } catch (error) {
            console.error("Error al cambiar rol del usuario:", error);
            return createApiError("Error interno del servidor", 500);
        }
    }

    /**
     * Obtener estadísticas de usuarios
     * Simula: GET /api/v1/users/stats
     */
    static async getUserStats() {
        await simulateNetworkDelay();

        try {
            const users = db.list("users");

            const stats = {
                total: users.length,
                active: users.filter(u => u.active).length,
                inactive: users.filter(u => !u.active).length,
                byRole: {
                    cliente: users.filter(u => u.role === 'cliente').length,
                    entrenador: users.filter(u => u.role === 'entrenador').length,
                    admin: users.filter(u => u.role === 'admin').length
                },
                recentSignups: users.filter(u => {
                    const createdAt = new Date(u.createdAt);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return createdAt > thirtyDaysAgo;
                }).length
            };

            return createApiResponse(stats);

        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            return createApiError("Error interno del servidor", 500);
        }
    }

    /**
     * Validar datos de usuario
     */
    static validateUserData(userData) {
        if (!userData.nombre || !userData.nombre.trim()) {
            return "El nombre es obligatorio";
        }

        if (!userData.email || !userData.email.trim()) {
            return "El email es obligatorio";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return "El formato del email no es válido";
        }

        if (!userData.id && (!userData.password || userData.password.length < 6)) {
            return "La contraseña debe tener al menos 6 caracteres";
        }

        const validRoles = ['cliente', 'entrenador', 'admin'];
        if (!validRoles.includes(userData.role)) {
            return "El rol especificado no es válido";
        }

        return null;
    }

    /**
     * Hash simple de contraseña (en producción usar bcrypt)
     */
    static hashPassword(password) {
        // Simulación simple - en producción usar bcrypt
        return `hashed_${password}_${Date.now()}`;
    }
}