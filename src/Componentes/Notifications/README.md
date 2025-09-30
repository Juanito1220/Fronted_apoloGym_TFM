# Sistema de Notificaciones - RF009

Este documento describe la implementación completa del sistema de notificaciones para Apolo Gym.

## 📋 Funcionalidades Implementadas

### Core Features
- ✅ **Gestión de notificaciones**: Crear, leer, marcar como leída, eliminar
- ✅ **Filtrado avanzado**: Por tipo, estado (leída/no leída), fecha
- ✅ **Preferencias personalizables**: Email, push, frecuencia, horarios de silencio
- ✅ **Interfaz moderna**: Diseño responsivo con Tailwind CSS
- ✅ **Estados en tiempo real**: Conteo de no leídas, actualización automática
- ✅ **API integrada**: Servicio completo con manejo de errores

### Tipos de Notificaciones
1. **Membresía** (`membership`): Renovaciones, vencimientos, cambios de plan
2. **Clases** (`class`): Reservas, cancelaciones, recordatorios
3. **Pagos** (`payment`): Confirmaciones, vencimientos, facturas
4. **Sistema** (`system`): Mantenimiento, actualizaciones, alertas
5. **Promociones** (`promotion`): Ofertas especiales, descuentos

### Niveles de Prioridad
- **Alta** (`high`): Notificaciones urgentes (pagos vencidos, mantenimiento)
- **Media** (`medium`): Recordatorios importantes (próximas clases)
- **Baja** (`low`): Información general (promociones)

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
src/
├── Data/Services/
│   └── notificationService.js      # Servicio API principal
├── hooks/
│   ├── useSystemNotifications.js   # Hook para gestión completa
│   └── useNotifications.js         # Hook existente para toasts
├── Componentes/Notifications/
│   ├── NotificationCenter.js       # Componente principal
│   ├── NotificationCard.js         # Tarjeta individual
│   ├── NotificationFilters.js      # Panel de filtros
│   └── NotificationPreferences.js  # Modal de preferencias
├── Paginas/Cliente/
│   └── notificaciones.js          # Página del cliente
└── Styles/
    └── notificaciones.css          # Estilos específicos
```

### Flujo de Datos

1. **notificationService.js**: Maneja todas las llamadas API
2. **useSystemNotifications.js**: Hook principal que gestiona estado
3. **NotificationCenter.js**: Componente que coordina la interfaz
4. **NotificationCard.js**: Renderiza cada notificación individual

## 🔧 Uso del Sistema

### Hook Principal

```javascript
import { useSystemNotifications } from '../hooks/useSystemNotifications';

const {
  notifications,        // Array de notificaciones
  unreadCount,         // Contador de no leídas
  loading,             // Estado de carga
  error,               // Errores
  markAsRead,          // Marcar como leída
  deleteNotification,  // Eliminar notificación
  applyFilters,        // Aplicar filtros
  updatePreferences    // Actualizar preferencias
} = useSystemNotifications();
```

### Badge de Notificaciones

```javascript
import { useNotificationBadge } from '../hooks/useSystemNotifications';

const unreadCount = useNotificationBadge(); // Solo conteo para badges
```

### Servicio API

```javascript
import { notificationService } from '../Data/Services/notificationService';

// Obtener notificaciones
const response = await notificationService.getClientNotifications({
  type: 'membership',
  read: false
});

// Marcar como leída
await notificationService.markAsRead(notificationId);

// Actualizar preferencias
await notificationService.updateNotificationPreferences(preferences);
```

## 🎨 Interfaz de Usuario

### Vista Principal
- **Header**: Título, estadísticas, acciones principales
- **Sidebar**: Filtros por tipo y estado, estadísticas resumidas
- **Main Content**: Lista/grid de notificaciones con paginación
- **Footer**: Acciones secundarias

### Funcionalidades de UI
- ✅ Vista en lista o grid (toggle)
- ✅ Filtros en tiempo real
- ✅ Búsqueda por texto
- ✅ Ordenamiento por fecha/prioridad
- ✅ Acciones por lote (marcar todas como leídas)
- ✅ Modal de preferencias completo

### Diseño Responsivo
- **Desktop**: Layout de 3 columnas (sidebar + content + acciones)
- **Tablet**: Layout de 2 columnas (filtros colapsibles)
- **Mobile**: Vista de columna única con navegación por tabs

## 🔌 Integración con Backend

### Endpoints Principales
```
GET    /api/notifications              # Listar notificaciones
PUT    /api/notifications/:id/read     # Marcar como leída
DELETE /api/notifications/:id          # Eliminar notificación
PUT    /api/notifications/read-all     # Marcar todas como leídas
GET    /api/notifications/count        # Conteo de no leídas
GET    /api/notifications/preferences  # Obtener preferencias
PUT    /api/notifications/preferences  # Actualizar preferencias
```

### Autenticación
- Interceptors de Axios configurados
- Headers de autorización automáticos
- Manejo de tokens expirados

## 📱 Características Avanzadas

### Sistema de Preferencias
```javascript
{
  email: {
    enabled: true,
    types: { membership: true, class: true, ... }
  },
  push: {
    enabled: true,
    types: { membership: true, class: false, ... }
  },
  frequency: 'immediate', // immediate, daily, weekly
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
}
```

### Filtrado Inteligente
- Filtro combinado por tipo y estado
- Filtros rápidos predefinidos
- Búsqueda en tiempo real
- Persistencia de filtros en sesión

### Estados Visuales
- Indicadores de no leída (punto azul)
- Badges de prioridad con colores
- Iconos por tipo de notificación
- Animaciones de transición suaves

## 🚀 Datos de Prueba (Mock)

El sistema incluye datos mock completos para desarrollo:

### Notificaciones de Ejemplo
- 20+ notificaciones variadas
- Diferentes tipos y prioridades
- Estados de leída/no leída realistas
- Fechas distribuidas en el tiempo

### Preferencias por Defecto
- Email habilitado para tipos principales
- Push configurado conservadoramente
- Frecuencia inmediata
- Sin horarios de silencio inicialmente

## 🔄 Actualización Automática

### Polling de Contadores
- Actualización cada 30 segundos
- Solo conteo de no leídas (optimizado)
- Manejo de errores silencioso

### Estados en Tiempo Real
- Actualización inmediata en acciones del usuario
- Sincronización entre pestañas (localStorage)
- Rollback automático en errores

## 📊 Métricas y Analytics

### Datos Recopilados
- Tiempo de lectura de notificaciones
- Tipos más frecuentes
- Preferencias de canal por usuario
- Tasas de apertura por tipo

### Estadísticas en Interfaz
- Resumen total/leídas/no leídas
- Distribución por tipo
- Filtros activos
- Acciones rápidas basadas en patrones

## 🛡️ Seguridad y Rendimiento

### Seguridad
- Validación de permisos en cada request
- Sanitización de datos de entrada
- Rate limiting en endpoints sensibles
- Logs de auditoría completos

### Rendimiento
- Paginación inteligente
- Lazy loading de imágenes
- Debounce en búsquedas
- Caché local optimizado
- Virtualización para listas grandes

## 🐛 Manejo de Errores

### Estrategias Implementadas
- Fallback a datos mock en errores de API
- Retry automático con backoff exponencial
- Mensajes de error específicos y accionables
- Estados de loading granulares

### UX en Errores
- Botones de reintento prominentes
- Indicadores de estado de conexión
- Modo offline con sincronización posterior
- Notificaciones toast para errores rápidos

## 📈 Futuras Mejoras

### Próximas Funcionalidades
- [ ] Notificaciones push reales (Web Push API)
- [ ] Templates de notificación personalizables
- [ ] Categorías personalizadas por usuario
- [ ] Integración con calendario del sistema
- [ ] Exportación de histórico de notificaciones
- [ ] Notificaciones programadas/recurrentes

### Optimizaciones Técnicas
- [ ] Service Worker para notificaciones offline
- [ ] WebSocket para updates en tiempo real
- [ ] IndexedDB para almacenamiento local
- [ ] Compression de payloads grandes
- [ ] CDN para assets de notificaciones

## 📚 Recursos Adicionales

### Documentación de APIs
- [Notification Web API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
- [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Push Protocol](https://web.dev/push-notifications-web-push-protocol/)

### Bibliotecas Utilizadas
- **React**: Framework base
- **Tailwind CSS**: Estilos y responsive design
- **date-fns**: Formateo de fechas
- **Axios**: Cliente HTTP
- **React Router**: Navegación

---

**Desarrollado para Apolo Gym TFM**  
**Requisito Funcional RF009: Sistema de Notificaciones**  
**Fecha**: Diciembre 2024