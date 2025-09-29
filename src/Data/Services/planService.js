// Servicio para manejo de Planes de Membresía
import { toast } from 'react-hot-toast';

// Simulación de API REST con localStorage
class PlanService {
    constructor() {
        this.baseUrl = '/api/v1/plans';
        this.storageKey = 'apolo_gym_plans';
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultPlans = [
                {
                    id: '1',
                    nombre: 'Plan Básico',
                    precio: 30.00,
                    duracion: 30,
                    beneficios: [
                        'Acceso al gimnasio durante horario normal',
                        'Uso de equipos de cardio y pesas',
                        'Vestuarios y duchas'
                    ],
                    estado: 'activo',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    nombre: 'Plan Premium',
                    precio: 50.00,
                    duracion: 30,
                    beneficios: [
                        'Acceso ilimitado 24/7',
                        'Uso completo de instalaciones',
                        'Clases grupales incluidas',
                        'Asesoría nutricional básica',
                        'Vestuarios premium'
                    ],
                    estado: 'activo',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '3',
                    nombre: 'Plan VIP',
                    precio: 80.00,
                    duracion: 30,
                    beneficios: [
                        'Todos los beneficios Premium',
                        'Entrenador personal (2 sesiones/mes)',
                        'Plan nutricional personalizado',
                        'Acceso a sauna y jacuzzi',
                        'Estacionamiento preferencial'
                    ],
                    estado: 'activo',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultPlans));
        }
    }

    // Simular delay de red
    async simulateNetworkDelay() {
        const delay = Math.random() * 500 + 300; // 300-800ms
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    getPlans() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    savePlans(plans) {
        localStorage.setItem(this.storageKey, JSON.stringify(plans));
    }

    // Listar todos los planes (GET /api/v1/plans)
    async fetchPlans(includeInactive = true) {
        console.log('🔄 PlanService: Obteniendo lista de planes...');
        await this.simulateNetworkDelay();

        try {
            const plans = this.getPlans();
            const filteredPlans = includeInactive ? plans : plans.filter(plan => plan.estado === 'activo');

            console.log(`✅ PlanService: ${filteredPlans.length} planes obtenidos`, filteredPlans);
            return {
                success: true,
                data: filteredPlans,
                message: 'Planes obtenidos exitosamente'
            };
        } catch (error) {
            console.error('❌ PlanService: Error al obtener planes', error);
            throw new Error('Error al obtener los planes');
        }
    }

    // Crear nuevo plan (POST /api/v1/plans)
    async createPlan(planData) {
        console.log('🔄 PlanService: Creando nuevo plan...', planData);
        await this.simulateNetworkDelay();

        try {
            const plans = this.getPlans();

            // Validaciones
            if (!planData.nombre?.trim()) {
                throw new Error('El nombre del plan es requerido');
            }

            if (!planData.precio || planData.precio <= 0) {
                throw new Error('El precio debe ser mayor a 0');
            }

            if (!planData.duracion || planData.duracion <= 0) {
                throw new Error('La duración debe ser mayor a 0');
            }

            // Verificar duplicados
            const existingPlan = plans.find(plan =>
                plan.nombre.toLowerCase().trim() === planData.nombre.toLowerCase().trim()
            );

            if (existingPlan) {
                throw new Error('Ya existe un plan con ese nombre');
            }

            const newPlan = {
                id: this.generateId(),
                nombre: planData.nombre.trim(),
                precio: parseFloat(planData.precio),
                duracion: parseInt(planData.duracion),
                beneficios: Array.isArray(planData.beneficios) ? planData.beneficios : [],
                estado: planData.estado || 'activo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            plans.push(newPlan);
            this.savePlans(plans);

            console.log('✅ PlanService: Plan creado exitosamente', newPlan);
            toast.success(`Plan "${newPlan.nombre}" creado exitosamente`);

            return {
                success: true,
                data: newPlan,
                message: 'Plan creado exitosamente'
            };
        } catch (error) {
            console.error('❌ PlanService: Error al crear plan', error);
            toast.error(error.message);
            throw error;
        }
    }

    // Actualizar plan existente (PUT /api/v1/plans/:id)
    async updatePlan(id, planData) {
        console.log('🔄 PlanService: Actualizando plan...', { id, planData });
        await this.simulateNetworkDelay();

        try {
            const plans = this.getPlans();
            const planIndex = plans.findIndex(plan => plan.id === id);

            if (planIndex === -1) {
                throw new Error('Plan no encontrado');
            }

            // Validaciones
            if (!planData.nombre?.trim()) {
                throw new Error('El nombre del plan es requerido');
            }

            if (!planData.precio || planData.precio <= 0) {
                throw new Error('El precio debe ser mayor a 0');
            }

            if (!planData.duracion || planData.duracion <= 0) {
                throw new Error('La duración debe ser mayor a 0');
            }

            // Verificar duplicados (excluyendo el plan actual)
            const existingPlan = plans.find(plan =>
                plan.id !== id &&
                plan.nombre.toLowerCase().trim() === planData.nombre.toLowerCase().trim()
            );

            if (existingPlan) {
                throw new Error('Ya existe otro plan con ese nombre');
            }

            const updatedPlan = {
                ...plans[planIndex],
                nombre: planData.nombre.trim(),
                precio: parseFloat(planData.precio),
                duracion: parseInt(planData.duracion),
                beneficios: Array.isArray(planData.beneficios) ? planData.beneficios : [],
                estado: planData.estado || 'activo',
                updatedAt: new Date().toISOString()
            };

            plans[planIndex] = updatedPlan;
            this.savePlans(plans);

            console.log('✅ PlanService: Plan actualizado exitosamente', updatedPlan);
            toast.success(`Plan "${updatedPlan.nombre}" actualizado exitosamente`);

            return {
                success: true,
                data: updatedPlan,
                message: 'Plan actualizado exitosamente'
            };
        } catch (error) {
            console.error('❌ PlanService: Error al actualizar plan', error);
            toast.error(error.message);
            throw error;
        }
    }

    // Eliminar plan (DELETE /api/v1/plans/:id) - Eliminación lógica
    async deletePlan(id) {
        console.log('🔄 PlanService: Eliminando plan...', { id });
        await this.simulateNetworkDelay();

        try {
            const plans = this.getPlans();
            const planIndex = plans.findIndex(plan => plan.id === id);

            if (planIndex === -1) {
                throw new Error('Plan no encontrado');
            }

            const planToDelete = plans[planIndex];

            // Eliminación lógica - cambiar estado a 'eliminado'
            planToDelete.estado = 'eliminado';
            planToDelete.deletedAt = new Date().toISOString();
            planToDelete.updatedAt = new Date().toISOString();

            plans[planIndex] = planToDelete;
            this.savePlans(plans);

            console.log('✅ PlanService: Plan eliminado exitosamente', planToDelete);
            toast.success(`Plan "${planToDelete.nombre}" eliminado exitosamente`);

            return {
                success: true,
                data: planToDelete,
                message: 'Plan eliminado exitosamente'
            };
        } catch (error) {
            console.error('❌ PlanService: Error al eliminar plan', error);
            toast.error(error.message);
            throw error;
        }
    }

    // Reactivar plan eliminado
    async reactivatePlan(id) {
        console.log('🔄 PlanService: Reactivando plan...', { id });
        await this.simulateNetworkDelay();

        try {
            const plans = this.getPlans();
            const planIndex = plans.findIndex(plan => plan.id === id);

            if (planIndex === -1) {
                throw new Error('Plan no encontrado');
            }

            const planToReactivate = plans[planIndex];
            planToReactivate.estado = 'activo';
            delete planToReactivate.deletedAt;
            planToReactivate.updatedAt = new Date().toISOString();

            plans[planIndex] = planToReactivate;
            this.savePlans(plans);

            console.log('✅ PlanService: Plan reactivado exitosamente', planToReactivate);
            toast.success(`Plan "${planToReactivate.nombre}" reactivado exitosamente`);

            return {
                success: true,
                data: planToReactivate,
                message: 'Plan reactivado exitosamente'
            };
        } catch (error) {
            console.error('❌ PlanService: Error al reactivar plan', error);
            toast.error(error.message);
            throw error;
        }
    }

    // Búsqueda de planes
    async searchPlans(query, filters = {}) {
        console.log('🔄 PlanService: Buscando planes...', { query, filters });
        await this.simulateNetworkDelay();

        try {
            let plans = this.getPlans();

            // Filtrar por estado
            if (filters.estado && filters.estado !== 'todos') {
                plans = plans.filter(plan => plan.estado === filters.estado);
            }

            // Búsqueda por texto
            if (query?.trim()) {
                const searchTerm = query.toLowerCase().trim();
                plans = plans.filter(plan =>
                    plan.nombre.toLowerCase().includes(searchTerm) ||
                    plan.beneficios.some(beneficio => beneficio.toLowerCase().includes(searchTerm))
                );
            }

            // Filtrar por rango de precios
            if (filters.precioMin !== undefined) {
                plans = plans.filter(plan => plan.precio >= filters.precioMin);
            }
            if (filters.precioMax !== undefined) {
                plans = plans.filter(plan => plan.precio <= filters.precioMax);
            }

            console.log(`✅ PlanService: ${plans.length} planes encontrados`);

            return {
                success: true,
                data: plans,
                message: `${plans.length} planes encontrados`
            };
        } catch (error) {
            console.error('❌ PlanService: Error en búsqueda', error);
            throw error;
        }
    }
}

// Instancia singleton
const planService = new PlanService();
export default planService;