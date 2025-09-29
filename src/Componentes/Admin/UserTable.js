// src/Componentes/Admin/UserTable.js
import React from 'react';

const UserTable = ({
    users,
    onEdit,
    onDelete,
    onToggleActive,
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleFilterChange
}) => {

    const getRoleBadge = (role) => {
        const labels = {
            admin: 'Administrador',
            entrenador: 'Entrenador',
            cliente: 'Cliente'
        };

        return (
            <span className={`role-badge role-${role}`}>
                {labels[role]}
            </span>
        );
    };

    return (
        <div>
            {/* Filtros y búsqueda */}
            <div className="user-filters">
                <div className="filter-left">
                    <select
                        value={roleFilter}
                        onChange={(e) => onRoleFilterChange(e.target.value)}
                        className="role-filter"
                    >
                        <option value="todos">Todos los roles</option>
                        <option value="cliente">Clientes</option>
                        <option value="entrenador">Entrenadores</option>
                        <option value="admin">Administradores</option>
                    </select>

                    <div className="results-count">
                        {users.length} usuario(s) encontrado(s)
                    </div>
                </div>

                <div className="filter-right">
                    <div className="search-input-container-wide">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="search-input-wide"
                        />
                        <div className="search-actions">
                            {searchTerm && (
                                <button
                                    onClick={() => onSearchChange("")}
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

            {/* Tabla */}
            <div className="user-table-container">
                <table className="user-table">
                    <thead className="table-header">
                        <tr>
                            <th className="table-th">Nombre Completo</th>
                            <th className="table-th">Email</th>
                            <th className="table-th">Rol</th>
                            <th className="table-th">Estado</th>
                            <th className="table-th">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`table-row ${index % 2 === 0 ? '' : 'alt-row'}`}
                            >
                                <td className="table-td">
                                    <div className="user-info">
                                        <div className="user-name">{user.nombre}</div>
                                        {user.telefono && (
                                            <div className="user-phone">{user.telefono}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="table-td">{user.email}</td>
                                <td className="table-td">{getRoleBadge(user.role)}</td>
                                <td className="table-td">
                                    <label className="status-toggle">
                                        <input
                                            type="checkbox"
                                            checked={!!user.active}
                                            onChange={(e) => onToggleActive(user.id, e.target.checked)}
                                            className="status-checkbox"
                                        />
                                        <span className={`status-label ${user.active ? 'status-active' : 'status-inactive'}`}>
                                            {user.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </label>
                                </td>
                                <td className="table-td">
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="btn-edit"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(user.id)}
                                            className="btn-delete"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td className="table-td empty-state" colSpan={5}>
                                    <div>
                                        <div className="empty-icon">👥</div>
                                        {searchTerm || roleFilter !== 'todos'
                                            ? 'No se encontraron usuarios que coincidan con los filtros'
                                            : 'No hay usuarios registrados aún'
                                        }
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};



export default UserTable;