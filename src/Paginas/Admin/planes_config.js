import React, { useState, useEffect, useMemo } from "react";
import { toast } from 'react-hot-toast';
import planService from "../../Data/Services/planService";
import PlanModal from "../../Componentes/Admin/PlanModal";
import PlanTable from "../../Componentes/Admin/PlanTable";
import "../../Styles/user-management.css";

export default function PlanesConfig() {
  // Estados principales
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Cargar planes al montar el componente
  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    try {
      setLoading(true);
      const response = await planService.fetchPlans(true); // Incluir inactivos
      if (response.success) {
        setPlanes(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar los planes');
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado y búsqueda
  const filteredPlanes = useMemo(() => {
    let result = planes;

    // Filtrar por estado
    if (filterEstado !== 'todos') {
      result = result.filter(plan => plan.estado === filterEstado);
    }

    // Buscar por término
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(plan =>
        plan.nombre.toLowerCase().includes(term) ||
        plan.beneficios.some(beneficio => beneficio.toLowerCase().includes(term))
      );
    }

    return result;
  }, [planes, searchTerm, filterEstado]);

  // Handlers para acciones CRUD
  const handleCreate = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Confirmación con toast personalizado
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>¿Eliminar este plan?</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600 transition-colors"
          onClick={async () => {
            toast.dismiss(t.id);
            await performDelete(id);
          }}
        >
          Sí, eliminar
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancelar
        </button>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const performDelete = async (id) => {
    try {
      setLoading(true);
      await planService.deletePlan(id);
      await loadPlanes(); // Recargar lista
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (planData) => {
    try {
      setLoading(true);

      if (editingPlan) {
        await planService.updatePlan(editingPlan.id, planData);
      } else {
        await planService.createPlan(planData);
      }

      setShowModal(false);
      setEditingPlan(null);
      await loadPlanes(); // Recargar lista
    } catch (error) {
      console.error('Error saving plan:', error);
      // El error ya se maneja en el service con toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="container page user-management">
        {/* Header */}
        <div className="user-header">
          <h2 className="user-title">
            Gestión de Planes de Membresía
          </h2>
          <button
            className="btn-create-user"
            onClick={handleCreate}
            disabled={loading}
          >
            + Crear Nuevo Plan
          </button>
        </div>      {/* Filtros y Búsqueda */}
        <div className="user-filters">
          <div className="filter-left">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="role-filter"
            >
              <option value="todos">Todos los planes</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="eliminado">Eliminados</option>
            </select>

            <div className="results-count">
              {filteredPlanes.length} plan(es) encontrado(s)
            </div>
          </div>

          <div className="filter-right">
            <div className="search-input-container-wide">
              <input
                type="text"
                placeholder="Buscar por nombre o beneficios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-wide"
              />
              <div className="search-actions">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="clear-search-btn"
                  >
                    ×
                  </button>
                )}
                <div className="search-icon-right">🔍</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Planes */}
        <PlanTable
          planes={filteredPlanes}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchTerm={searchTerm}
        />

        {/* Modal de Crear/Editar */}
        {showModal && (
          <PlanModal
            plan={editingPlan}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingPlan(null);
            }}
          />
        )}

      </div>
    </div>
  );
}
