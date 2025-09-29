# Sistema de Control de Aforo - Apolo Gym

## 🚀 Características Principales

### ✅ Cumplimiento del Requerimiento RF006
- **Control de Aforo en Tiempo Real**: Monitoreo continuo de la ocupación de todas las salas
- **Verificación de Asistencia**: Sistema de check-in/check-out para registrar entradas y salidas
- **Alertas Automáticas**: Notificaciones cuando las salas alcanzan 80% y 100% de capacidad
- **Actualización Automática**: Polling cada 5 segundos para datos en tiempo real

### 🏗️ Arquitectura del Sistema

```
src/
├── Componentes/
│   ├── AforoDashboard.js          # Dashboard principal con métricas visuales
│   ├── RegistroAcceso.js          # Formulario de check-in/check-out
│   ├── HistorialActividad.js      # Historial de movimientos
│   ├── IndicadorTiempoReal.js     # Estado en tiempo real para recepcionistas
│   ├── ConfiguracionAforo.js      # Configuración de capacidades
│   └── NotificacionesAforo.js     # Notificaciones push en tiempo real
├── hooks/
│   └── useAforo.js               # Hook personalizado para lógica de aforo
├── Data/Stores/
│   └── aforo.store.js            # Almacenamiento y lógica de negocio
└── Styles/
    └── aforo.css                 # Estilos específicos con animaciones
```

## 🎯 Funcionalidades por Rol

### 👨‍💼 Administrador
- **Dashboard Completo**: Vista general con métricas y estado de todas las salas
- **Configuración**: Ajuste de capacidades máximas por sala
- **Reportes**: Estadísticas de ocupación y actividad diaria
- **Alertas**: Notificaciones críticas y de advertencia

### 👩‍💻 Recepcionista
- **Registro Rápido**: Interface simplificada para check-in/check-out
- **Indicadores Visuales**: Estado en tiempo real de cada sala
- **Validaciones**: Prevención de errores y duplicados
- **Atajos**: Soporte para códigos de barras y atajos de teclado

## 🚦 Sistema de Alertas

### 🟢 Estado Normal (< 80% capacidad)
- Indicador verde
- Entrada permitida sin restricciones

### 🟡 Alerta de Advertencia (80-99% capacidad)
- Indicador amarillo/naranja
- Notificación de precaución
- Entrada aún permitida

### 🔴 Estado Crítico (100% capacidad)
- Indicador rojo
- Bloqueo automático de nuevas entradas
- Notificación crítica inmediata

## 🛠️ Reglas de Negocio Implementadas

### Validaciones de Entrada
1. **ID Usuario Obligatorio**: No se permite check-in sin identificación
2. **Capacidad Máxima**: Bloqueo automático al alcanzar el límite
3. **Doble Entrada**: Prevención de múltiples check-ins del mismo usuario
4. **Validación de Sala**: Verificación de sala existente

### Validaciones de Salida
1. **Check-in Previo**: Verificación de entrada previa antes de permitir salida
2. **Doble Salida**: Prevención de múltiples check-outs
3. **Historial**: Registro cronológico de todos los movimientos

### Configuración Dinámica
- **Capacidades Personalizables**: Ajuste por sala según normativas
- **Nuevas Salas**: Adición dinámica de espacios
- **Umbrales de Alerta**: Configurables por tipo de espacio

## 🎨 Diseño y UX

### Responsive Design
- **Mobile-First**: Optimizado para tablets y dispositivos móviles
- **Tailwind CSS**: Framework de utilidades para diseño consistente
- **Animaciones**: Transiciones suaves y feedback visual

### Accesibilidad
- **Contraste**: Colores que cumplen estándares WCAG
- **Navegación**: Soporte completo para teclado
- **Indicadores**: Señales visuales claras para diferentes estados

### Tiempo Real
- **Polling Inteligente**: Actualización automática cada 5 segundos
- **Notificaciones Push**: Alertas instantáneas para cambios críticos
- **Estado Visual**: Indicadores animados para mostrar actividad en vivo

## 📊 Métricas y Monitoreo

### Dashboard Principal
- **Ocupación Global**: Porcentaje total del gimnasio
- **Estado por Sala**: Información detallada individual
- **Tendencias**: Gráficos circulares de progreso
- **Alertas Activas**: Resumen de salas en estado crítico

### Estadísticas Diarias
- **Entradas del Día**: Total de check-ins
- **Salidas del Día**: Total de check-outs
- **Pico de Ocupación**: Máximo alcanzado
- **Actividad por Sala**: Desglose detallado

## 🔧 Configuración Inicial

### Capacidades Predeterminadas
```javascript
Principal: 50 personas
Cardio: 25 personas
Pesas: 30 personas
Funcional: 20 personas
Spinning: 15 personas
```

### Datos de Prueba
El sistema incluye datos de prueba automáticos:
- 8 usuarios en diferentes salas
- Actividad reciente simulada
- Configuración base de capacidades

## 🚀 Cómo Usar

### Para Administradores
1. **Dashboard**: Accede desde el panel admin → Control de Aforo
2. **Configuración**: Click en "Configurar" para ajustar capacidades
3. **Monitoreo**: Usa la pestaña "Dashboard" para vista general
4. **Historial**: Pestaña "Historial" para revisar actividad

### Para Recepcionistas
1. **Registro**: Pestaña "Registro de Accesos"
2. **Escanear/Escribir**: ID del usuario en el campo principal
3. **Seleccionar Sala**: Dropdown con salas disponibles
4. **Acción**: Botón verde (Entrada) o rojo (Salida)
5. **Verificar**: Panel lateral muestra estado en tiempo real

### Atajos de Teclado
- **Enter**: Registrar entrada rápida
- **Tab**: Cambiar entre campos
- **Esc**: Limpiar formulario (futuro)

## 🔄 Flujo de Operación

```
1. Usuario llega al gimnasio
   ↓
2. Recepcionista escanea/escribe ID
   ↓
3. Selecciona sala destino
   ↓
4. Sistema valida capacidad
   ↓
5. Si OK: Registra entrada
   Si NO: Muestra alerta
   ↓
6. Actualización en tiempo real
   ↓
7. Notificaciones si es necesario
```

## 🎯 Beneficios Implementados

### Operativos
- **Automatización**: Reducción de errores manuales
- **Eficiencia**: Registro rápido y fluido
- **Control**: Cumplimiento automático de límites
- **Trazabilidad**: Historial completo de movimientos

### Seguridad
- **Capacidad Controlada**: Cumplimiento de normativas
- **Alertas Preventivas**: Notificaciones antes de alcanzar límites
- **Validaciones**: Múltiples checks para prevenir errores
- **Auditoria**: Registro temporal de todas las acciones

### Usuario Final
- **Experiencia Fluida**: Interface intuitiva y rápida
- **Feedback Visual**: Indicadores claros de estado
- **Información Transparente**: Disponibilidad visible en tiempo real
- **Acceso Garantizado**: Sistema confiable y consistente

## 🔮 Preparado para Futuras Mejoras

### Integraciones API
- Estructura preparada para conexión con backend real
- Endpoints definidos y documentados
- Manejo de errores robusto

### Funcionalidades Adicionales
- Sistema de reservas por horarios
- Integración con membresías
- Reportes avanzados y analytics
- Notificaciones móviles

---

**Estado**: ✅ Completamente funcional con datos mockeados
**Tecnologías**: React.js, Tailwind CSS, Hooks personalizados
**Responsive**: ✅ Optimizado para móviles y desktop
**Tiempo Real**: ✅ Polling automático cada 5 segundos
**Alertas**: ✅ Sistema completo de notificaciones