# Panel Administrativo - Dashboard BI para Gimnasio Apolo

## Descripción
Este documento describe la implementación completa del Panel Administrativo con métricas de Business Intelligence (BI Dashboard) para el Gimnasio Apolo, cumpliendo con los requisitos RF008 y RF007.

## Características Implementadas

### 🎯 RF008 - Panel Administrativo con Métricas del Gimnasio

#### Tarjetas de Métricas Clave (KPIs)
- **Ingresos**: Total de ingresos generados basado en historial de pagos
- **Reservas**: Número total de reservas realizadas en el periodo
- **Nuevos Registros**: Cantidad de nuevos usuarios registrados
- **Ocupación/Aforo**: Indicador en tiempo real de ocupación actual del gimnasio

#### Visualizaciones Gráficas
- **Gráfico de Tendencia de Asistencia**: Muestra la asistencia diaria en los últimos 30 días
- **Gráfico Circular de Uso por Salas**: Distribución de reservas por salas del gimnasio
- **Gráfico de Barras de Ingresos Mensuales**: Evolución de ingresos por mes
- **Gráfico de Área de Asistencia por Hora**: Distribución de visitas durante el día

### 📊 RF007 - Generación de Reportes

#### Filtros de Reporte
- **Selector de Rango de Fechas**: DatePicker para seleccionar periodo exacto
- **Tipos de Reporte Disponibles**:
  - Reportes Financieros (ingresos, métodos de pago, transacciones)
  - Reportes de Uso/Asistencia (frecuencia, patrones de visita)

#### Exportación
- **Formato CSV**: Descarga automática de archivos CSV estructurados
- **Datos Incluidos**: Resúmenes ejecutivos y detalles granulares

## Estructura de Archivos

```
src/
├── Componentes/Admin/
│   ├── AdminDashboard.js          # Componente principal del dashboard
│   ├── KPICard.js                 # Tarjetas de métricas
│   ├── TimeRangePicker.js         # Selector de periodo de tiempo
│   ├── OccupancyIndicator.js      # Indicador de ocupación
│   ├── ReportGenerator.js         # Generador de reportes
│   └── Charts/
│       ├── AttendanceTrendChart.js     # Gráfico de tendencia
│       ├── UsagePieChart.js            # Gráfico circular
│       ├── RevenueBarChart.js          # Gráfico de barras
│       └── AttendanceByHourChart.js    # Gráfico por horas
├── Data/Services/
│   └── dashboardService.js        # Servicio de datos para dashboard
├── Data/
│   └── seedData.js               # Generador de datos de prueba
├── Styles/
│   └── dashboard.css             # Estilos específicos del dashboard
└── Paginas/Admin/
    └── reportes.js               # Página principal integrada
```

## Tecnologías Utilizadas

- **React.js 19**: Framework principal
- **Tailwind CSS**: Sistema de estilos
- **Recharts**: Librería de gráficos
- **React DatePicker**: Selector de fechas
- **React Hot Toast**: Notificaciones
- **React Icons**: Iconografía

## APIs Implementadas (Simuladas)

### Dashboard Metrics
```javascript
// GET /api/v1/metrics/dashboard?timeRange=month
dashboardService.getDashboardMetrics('month')
```

### Usage Charts
```javascript
// GET /api/v1/metrics/usage-chart?period=last30days
dashboardService.getUsageChartData('last30days')
```

### Financial Reports
```javascript
// GET /api/v1/reports/financial?start_date=...&end_date=...
dashboardService.generateFinancialReport(startDate, endDate)
```

### Usage Reports
```javascript
// GET /api/v1/reports/usage?start_date=...&end_date=...
dashboardService.generateUsageReport(startDate, endDate)
```

## Funcionalidades del Dashboard

### 📈 Métricas en Tiempo Real
- Actualización automática cada 5 minutos
- Indicadores de cambio porcentual vs. período anterior
- Estados visuales (alto, medio, bajo) para ocupación

### 📊 Gráficos Interactivos
- Tooltips personalizados con información detallada
- Colores coherentes con el sistema de diseño
- Animaciones suaves de carga y transición

### 📋 Generación de Reportes
- Validación de rangos de fechas
- Descarga automática en formato CSV
- Estructura de datos optimizada para análisis

### 🎨 Diseño Responsivo
- Adaptable a dispositivos móviles y desktop
- Grid layout con Tailwind CSS
- Estados de carga elegantes

## Datos Incluidos en Reportes

### Reporte Financiero
- Resumen ejecutivo (total ingresos, transacciones, promedio)
- Detalle de todas las transacciones del período
- Agrupación por método de pago
- Ingresos diarios

### Reporte de Asistencia
- Resumen de visitas y usuarios únicos
- Top usuarios más activos
- Distribución de reservas por sala
- Patrones de asistencia (días de semana vs. fines de semana)
- Distribución por horarios (mañana, tarde, noche)

## Instalación y Configuración

1. **Instalar dependencias**:
```bash
npm install recharts react-datepicker
```

2. **Importar estilos** en tu CSS principal:
```css
@import 'react-datepicker/dist/react-datepicker.css';
```

3. **Inicializar datos de prueba** (opcional):
```javascript
import { seedDashboardData } from './Data/seedData';
seedDashboardData();
```

## Navegación

- Acceso desde el menú de administración: `/admin/reportes`
- Botón de regreso al menú principal integrado
- Header con branding del gimnasio

## Estados de Carga

- Shimmer loading para tarjetas KPI
- Skeletons para gráficos
- Indicadores de progreso para generación de reportes
- Notificaciones toast para feedback de usuario

## Personalización

### Colores de Métricas
- Verde: Ingresos
- Azul: Reservas  
- Púrpura: Nuevos Registros
- Dinámico: Ocupación (rojo/naranja/verde según nivel)

### Períodos de Tiempo Disponibles
- Hoy
- Última Semana
- Mes Actual
- Últimos 30 días

## Rendimiento

- Memoización de componentes pesados
- Debounce en actualizaciones automáticas
- Carga lazy de gráficos
- Optimización de re-renders con useCallback

## Próximas Mejoras

- [ ] Filtros adicionales por sala/instructor
- [ ] Exportación a PDF
- [ ] Comparaciones año sobre año
- [ ] Predicciones basadas en tendencias
- [ ] Alertas automáticas de capacidad
- [ ] Integración con API real del backend

## Soporte

Para cualquier problema o mejora, revisar:
1. Console del navegador para errores de JavaScript
2. Network tab para problemas de datos
3. Logs de la consola para debugging

---

*Dashboard implementado por GitHub Copilot siguiendo las mejores prácticas de React.js y diseño UX/UI moderno.*