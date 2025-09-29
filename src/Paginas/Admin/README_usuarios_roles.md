# Sistema de Gestión de Usuarios y Roles

## Descripción General

Este módulo implementa una interfaz completa de gestión de usuarios y roles para el sistema de administración del gimnasio Apolo. Cumple con los requerimientos funcionales RF001 (Registro de usuarios) y RF010 (Búsqueda eficiente de clientes).

## Características Principales

### 1. Interfaz de Usuario Moderna
- **Diseño responsivo** adaptado a diferentes tamaños de pantalla
- **Gradientes y animaciones** para una experiencia visual atractiva
- **Iconografía consistente** para mejorar la usabilidad
- **Paleta de colores** profesional y accesible

### 2. Funcionalidades CRUD Completas

#### **Crear Usuario (RF001)**
- Formulario modal con validaciones en tiempo real
- Campos obligatorios: Nombre, Email, Contraseña, Rol
- Campos opcionales: Teléfono
- Validación de formato de email
- Validación de longitud de contraseña (mínimo 6 caracteres)
- Verificación de email único

#### **Leer/Listar Usuarios**
- Vista de tabla con información clave
- Paginación automática (configurada para 50 usuarios por página)
- Indicadores visuales de estado (activo/inactivo)
- Badges de rol con colores diferenciados

#### **Actualizar Usuario**
- Edición inline de roles mediante dropdown
- Toggle de estado activo/inactivo
- Modal de edición completo para actualizar perfil
- Contraseña opcional en actualizaciones

#### **Eliminar Usuario**
- Eliminación lógica (marca como inactivo)
- Confirmación antes de eliminar
- Conserva datos para auditoría

### 3. Sistema de Búsqueda y Filtros (RF010)

#### **Búsqueda Rápida**
- Campo de búsqueda en tiempo real
- Busca por nombre o email
- Resaltado de resultados
- Botón de limpiar búsqueda

#### **Filtros de Clasificación**
- Filtro por rol: Todos, Clientes, Entrenadores, Administradores
- Combinación de filtros con búsqueda
- Contador de resultados en tiempo real

### 4. Arquitectura de Componentes

```
src/
├── Paginas/Admin/usuarios_roles.js     # Componente principal
├── Componentes/Admin/
│   ├── UserTable.js                    # Tabla de usuarios
│   └── UserModal.js                    # Modal de creación/edición
├── Componentes/NotificationContainer.js # Sistema de notificaciones
├── Data/Services/userService.js        # Servicio API simulado
├── hooks/useNotifications.js           # Hook de notificaciones
├── Data/seedUsers.js                   # Datos de ejemplo
└── Styles/user-management.css          # Estilos específicos
```

### 5. Simulación de API REST

El sistema incluye un servicio completo que simula la integración con el backend:

#### **Endpoints Simulados**
- `GET /api/v1/users` - Listar usuarios con filtros
- `POST /api/v1/users/register` - Registrar nuevo usuario
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario (lógico)
- `PATCH /api/v1/users/:id/status` - Cambiar estado
- `PATCH /api/v1/users/:id/role` - Cambiar rol
- `GET /api/v1/users/stats` - Estadísticas de usuarios

#### **Características de la API**
- **Delay de red simulado** (300-800ms) para realismo
- **Validaciones del lado servidor**
- **Manejo de errores** con códigos HTTP apropiados
- **Respuestas consistentes** con formato JSON
- **Paginación** y filtros
- **Timestamps** automáticos

### 6. Sistema de Notificaciones

#### **Tipos de Notificación**
- ✅ **Éxito** - Operaciones completadas correctamente
- ❌ **Error** - Errores de validación o del servidor
- ⚠️ **Advertencia** - Situaciones que requieren atención
- ℹ️ **Información** - Mensajes informativos

#### **Características**
- **Auto-dismiss** configurable (3 segundos por defecto)
- **Posicionamiento fijo** en la esquina superior derecha
- **Animaciones de entrada** suaves
- **Botón de cierre manual**
- **Gradientes visuales** según el tipo

### 7. Seguridad y Validaciones

#### **Validaciones Frontend**
- Formato de email válido
- Longitud mínima de contraseña
- Campos obligatorios
- Prevención de duplicados

#### **Simulación de Seguridad Backend**
- Hash de contraseñas (simulado)
- Verificación de email único
- Validación de roles permitidos
- Sanitización de datos

### 8. Datos de Ejemplo

El sistema incluye 10 usuarios de ejemplo con diferentes roles:
- **1 Administrador** - Juan Carlos Pérez
- **3 Entrenadores** - María, Carlos, David
- **6 Clientes** - Ana, Luis, Elena, Roberto, Patricia, Carmen

## Roles y Permisos

### **Administrador**
- Color: Rojo (#dc2626)
- Permisos: Gestión completa del sistema

### **Entrenador**
- Color: Verde (#059669)
- Permisos: Gestión de rutinas y clientes asignados

### **Cliente**
- Color: Azul (#2563eb)
- Permisos: Acceso a servicios del gimnasio

## Responsive Design

El sistema está optimizado para diferentes dispositivos:

### **Desktop (>768px)**
- Layout de dos columnas para filtros y resultados
- Tabla completa con todas las columnas visibles
- Botones de acción horizontales

### **Mobile (<768px)**
- Layout de una columna
- Controles de filtro apilados verticalmente
- Botones de acción apilados
- Texto y espaciado optimizado para touch

## Uso del Sistema

### **Para Administradores**

1. **Acceder al módulo** desde el panel de administración
2. **Buscar usuarios** utilizando el campo de búsqueda
3. **Filtrar por rol** usando el dropdown de filtros
4. **Crear nuevo usuario** haciendo clic en "Registrar Nuevo Usuario"
5. **Editar usuario** haciendo clic en el botón "Editar"
6. **Cambiar estado** usando el checkbox en la columna Estado
7. **Eliminar usuario** haciendo clic en el botón "Eliminar"

### **Flujo de Trabajo Típico**

1. **Registro de Cliente Nuevo**
   - Completar formulario con datos personales
   - Asignar rol apropiado
   - Establecer contraseña inicial
   - Activar cuenta inmediatamente

2. **Gestión de Entrenadores**
   - Crear cuenta con rol "entrenador"
   - Proporcionar datos de contacto
   - Configurar acceso a herramientas de entrenamiento

3. **Mantenimiento de Usuarios**
   - Revisar usuarios inactivos periódicamente
   - Actualizar información de contacto
   - Gestionar cambios de rol según necesidades

## Integración con el Sistema

### **Auditoría**
Todas las acciones quedan registradas en el sistema de auditoría:
- `USER_CREATE` - Creación de usuario
- `USER_UPDATE` - Actualización de datos
- `USER_DELETE` - Eliminación lógica
- `USER_SET_ACTIVE` - Cambio de estado
- `USER_SET_ROLE` - Cambio de rol

### **Almacenamiento**
- **LocalStorage** para demostración y desarrollo
- **Preparado para API REST** real en producción
- **Migración sencilla** cambiando el servicio de datos

## Consideraciones de Producción

### **Seguridad**
- Implementar autenticación JWT
- Usar bcrypt para hash de contraseñas
- Validar permisos en cada operación
- Implementar rate limiting

### **Performance**
- Paginación del lado servidor
- Índices de base de datos en campos de búsqueda
- Caché para consultas frecuentes
- Lazy loading de componentes

### **Escalabilidad**
- Separar servicios por dominio
- Implementar búsqueda con Elasticsearch
- Usar CDN para assets estáticos
- Monitoreo y logging centralizados

## Tecnologías Utilizadas

- **React 18** - Librería de interfaz de usuario
- **CSS3** - Estilos con gradientes y animaciones
- **LocalStorage** - Persistencia de datos local
- **Hooks personalizados** - Lógica reutilizable
- **Componentes modulares** - Arquitectura escalable

Este sistema proporciona una base sólida y profesional para la gestión de usuarios en el gimnasio Apolo, con capacidades de crecimiento para futuras necesidades del negocio.