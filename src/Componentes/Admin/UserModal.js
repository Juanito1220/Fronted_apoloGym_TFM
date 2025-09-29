// src/Componentes/Admin/UserModal.js
import React, { useState, useEffect } from 'react';

const UserModal = ({
    show,
    onClose,
    onSave,
    user = null,
    loading = false
}) => {
    const [form, setForm] = useState({
        id: '',
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        role: 'cliente',
        active: true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        console.log('🎯 UserModal useEffect ejecutado');
        console.log('👤 Usuario recibido:', user);
        console.log('📄 Show modal:', show);

        if (show) { // Solo actualizar cuando el modal se muestre
            if (user && user.id) {
                console.log('✅ Poblando formulario con usuario existente');
                console.log('🆔 ID del usuario:', user.id);
                console.log('📋 Datos completos:', user);
                setForm({
                    id: user.id,
                    nombre: user.nombre || '',
                    email: user.email || '',
                    password: '',
                    telefono: user.telefono || '',
                    role: user.role || 'cliente',
                    active: user.active !== false
                });
            } else {
                console.log('🆕 Formulario para nuevo usuario');
                setForm({
                    id: '',
                    nombre: '',
                    email: '',
                    password: '',
                    telefono: '',
                    role: 'cliente',
                    active: true,
                });
            }
            setErrors({});
        }
    }, [user, show]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!form.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'El formato del email no es válido';
        }

        if (!form.id && !form.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria para nuevos usuarios';
        }

        if (form.password && form.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(form);
        }
    };

    if (!show) return null;

    return (
        <div style={modalOverlay} onClick={onClose}>
            <div style={modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                        {(() => {
                            const title = form.id ? "Editar Usuario" : "Registrar Nuevo Usuario";
                            console.log('🏷️ Título del modal:', title, '(form.id:', form.id, ')');
                            return title;
                        })()}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#6b7280'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Nombre Completo *</label>
                            <input
                                type="text"
                                value={form.nombre}
                                onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.nombre ? '#dc2626' : '#d1d5db'
                                }}
                                placeholder="Ingrese el nombre completo"
                            />
                            {errors.nombre && (
                                <div style={errorStyle}>{errors.nombre}</div>
                            )}
                        </div>

                        <div>
                            <label style={labelStyle}>Email *</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.email ? '#dc2626' : '#d1d5db'
                                }}
                                placeholder="ejemplo@correo.com"
                            />
                            {errors.email && (
                                <div style={errorStyle}>{errors.email}</div>
                            )}
                        </div>

                        <div>
                            <label style={labelStyle}>
                                {form.id ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.password ? '#dc2626' : '#d1d5db'
                                }}
                                placeholder="Mínimo 6 caracteres"
                            />
                            {errors.password && (
                                <div style={errorStyle}>{errors.password}</div>
                            )}
                        </div>

                        <div>
                            <label style={labelStyle}>Teléfono</label>
                            <input
                                type="tel"
                                value={form.telefono}
                                onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
                                style={inputStyle}
                                placeholder="Número de contacto"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Rol del Usuario *</label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                                style={inputStyle}
                            >
                                <option value="cliente">Cliente</option>
                                <option value="entrenador">Entrenador</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#374151'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={form.active}
                                    onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))}
                                    style={{ accentColor: '#2563eb' }}
                                />
                                Usuario activo
                            </label>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end',
                        marginTop: '24px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 20px',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white',
                                color: '#374151',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '12px 20px',
                                border: 'none',
                                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                                color: 'white',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? 'Guardando...' : (form.id ? 'Actualizar' : 'Crear Usuario')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Estilos
const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const modalContent = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
};

const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px"
};

const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s"
};

const errorStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "4px",
    fontWeight: "500"
};

export default UserModal;