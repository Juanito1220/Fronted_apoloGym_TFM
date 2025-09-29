// src/Paginas/Admin/usuarios_roles.js
import React, { useState, useEffect, useMemo } from "react";
import UserTable from "../../Componentes/Admin/UserTable.js";
import UserModal from "../../Componentes/Admin/UserModal.js";
import {
  listUsers,
} from "../../Data/Stores/usuario.store";
import { audit } from "../../Data/Stores/audit.store";
import { UserService } from "../../Data/Services/userService.js";
import { useNotifications } from "../../hooks/useNotifications.js";
import { seedUsersData } from "../../Data/seedUsers.js";
import toast from 'react-hot-toast';
import "../../Styles/admin.css";
import "../../Styles/user-management.css"; export default function UsuariosRoles() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    showSuccess,
    showError
  } = useNotifications();

  // Cargar usuarios al inicio
  useEffect(() => {
    // Crear usuarios de ejemplo si no existen
    seedUsersData();
    loadUsers();
  }, []);

  // Monitor para debug - ver cuando cambia el array de usuarios
  useEffect(() => {
    console.log('👥 Estado users cambió. Total:', users.length);
    users.forEach((u, i) => console.log(`  ${i + 1}. ${u.nombre} (active: ${u.active})`));
  }, [users]);

  const loadUsers = () => {
    // Forzar recarga desde localStorage
    const freshUsers = listUsers();
    console.log('🔄 Cargando usuarios desde store:', freshUsers.length, 'usuarios');
    freshUsers.forEach(u => console.log(`  - ${u.nombre} (${u.email}) active: ${u.active}`));
    setUsers([...freshUsers]); // Crear nuevo array para forzar re-render
  };

  // Filtrar y buscar usuarios
  const filteredUsers = useMemo(() => {
    const result = users.filter(user => {
      // Diferenciar entre eliminados (deletedAt existe) y desactivados (active: false)
      const isNotDeleted = !user.deletedAt; // Solo ocultar usuarios eliminados físicamente
      console.log(`🔍 Usuario ${user.nombre}: active=${user.active}, deletedAt=${user.deletedAt}, mostrar=${isNotDeleted}`);

      const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "todos" || user.role === roleFilter;
      return isNotDeleted && matchesSearch && matchesRole;
    });
    console.log('👥 Total usuarios:', users.length, 'Activos mostrados:', result.length);
    return result;
  }, [users, searchTerm, roleFilter]);

  const handleSave = async (userData) => {
    setLoading(true);
    try {
      let response;

      if (userData.id) {
        // Actualizar usuario existente
        response = await UserService.updateUser(userData.id, userData);
      } else {
        // Crear nuevo usuario
        response = await UserService.createUser(userData);
      }

      if (response.success) {
        // El UserService ya guardó los datos, solo recargar la lista
        loadUsers();

        audit(userData.id ? "USER_UPDATE" : "USER_CREATE", {
          id: userData.id || response.data.id,
          email: userData.email,
          role: userData.role,
        });

        setShowModal(false);
        setEditingUser(null);

        // Mostrar notificación de éxito
        showSuccess(response.message);
      } else {
        // Manejar errores de la API
        showError(`Error: ${response.error}`);
      }

    } catch (error) {
      console.error("Error al guardar usuario:", error);
      showError("Error inesperado al guardar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    console.log('✏️ handleEdit llamado con usuario:', user);
    console.log('📋 ID del usuario:', user?.id);
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    console.log('🚨 handleDelete llamado con ID:', id);

    // Usar una confirmación más simple con toast
    toast((t) => (
      <span className="flex items-center gap-2">
        <span>¿Eliminar usuario?</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600 transition-colors"
          onClick={() => {
            toast.dismiss(t.id);
            performDelete(id);
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
      </span>
    ), { duration: 8000 });
  };

  const performDelete = async (id) => {
    try {
      console.log('🗑️ Eliminando usuario con ID:', id);
      const response = await UserService.deleteUser(id);
      console.log('📝 Respuesta del servicio:', response);

      if (response.success) {
        // Pequeño delay para asegurar que localStorage se actualice
        setTimeout(() => {
          loadUsers();
          console.log('📋 Lista recargada después de eliminar ID:', id);
        }, 100);

        audit("USER_DELETE", { id });
        showSuccess(response.message);
      } else {
        showError(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      showError("Error inesperado al eliminar el usuario");
    }
  };

  const toggleActiveRow = async (id, checked) => {
    try {
      const response = await UserService.toggleUserStatus(id, checked);

      if (response.success) {
        // El UserService ya actualizó los datos, solo recargar la lista
        loadUsers();
        audit("USER_SET_ACTIVE", { id, active: checked });
        showSuccess(response.message);
      } else {
        showError(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      showError("Error inesperado al cambiar el estado del usuario");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div className="admin-content">
      <div className="container page user-management">
        {/* Header */}
        <div className="user-header">
          <h2 className="user-title">
            Gestión de Usuarios y Roles
          </h2>
          <button
            className="btn-create-user"
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
          >
            + Registrar Nuevo Usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={toggleActiveRow}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
        />

        {/* Modal de creación/edición */}
        <UserModal
          show={showModal}
          onClose={handleCloseModal}
          onSave={handleSave}
          user={editingUser}
          loading={loading}
        />

      </div>
    </div>
  );
}


