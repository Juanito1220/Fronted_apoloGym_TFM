# Módulo de Rutinas Asignadas - Documentación

## Descripción General

Este módulo implementa la funcionalidad completa de **Rutinas Asignadas** para el rol **CLIENTE** en el sistema de gestión del gimnasio Apolo. Siguiendo las especificaciones del requisito **RF008** y la **Figura 15**, proporciona una interfaz moderna y funcional para que los clientes consulten sus rutinas asignadas, visualicen ejercicios detallados y hagan seguimiento de su progreso.

## Arquitectura del Sistema

### Estructura de Archivos

```
src/
├── Componentes/
│   └── Routines/
│       ├── ActiveRoutineCard.js        # Tarjeta de rutina activa
│       ├── ExerciseDetailModal.js      # Modal de detalles de ejercicio
│       └── ExerciseHistoryList.js      # Lista de ejercicios con historial
├── Data/
│   └── Services/
│       └── routineService.js           # Servicio API de rutinas
├── hooks/
│   └── useRoutines.js                  # Hook personalizado para rutinas
├── Paginas/
│   └── Cliente/
│       └── rutinas.js                  # Página principal de rutinas
└── Styles/
    └── rutinas-asignadas.css           # Estilos específicos del módulo
```

### Flujo de Datos

```
routineService.js → useRoutines.js → Componentes UI → Usuario
     ↑                    ↓
localStorage ←→ Estado Global ←→ Interfaz de Usuario
```

## Componentes Principales

### 1. ActiveRoutineCard

**Propósito**: Muestra la rutina actualmente asignada al cliente con información detallada y controles de progreso.

**Características**:
- Información del entrenador asignado
- Lista de ejercicios con series, repeticiones y pesos
- Seguimiento de progreso en tiempo real
- Marcado de ejercicios completados/no completados
- Estadísticas de progreso visual
- Integración con módulo de progreso físico

**Props**:
```javascript
{
  routine: Object,              // Rutina actual
  routineStats: Object,         // Estadísticas calculadas
  completedExercises: Set,      // Ejercicios completados
  onMarkCompleted: Function,    // Callback para marcar completado
  onMarkUncompleted: Function,  // Callback para desmarcar
  onViewExerciseDetails: Function, // Ver detalles del ejercicio
  isActive: Boolean,            // Estado de la rutina
  daysRemaining: Number         // Días restantes
}
```

### 2. ExerciseDetailModal

**Propósito**: Modal informativo que muestra detalles completos de un ejercicio específico.

**Características**:
- Información técnica detallada
- Instrucciones paso a paso
- Músculos trabajados (primarios y secundarios)
- Consejos de técnica y errores comunes
- Registro de rendimiento (peso, series, RPE)
- Progresiones y variaciones
- Integración con biblioteca de ejercicios

**Pestañas**:
1. **Instrucciones**: Parámetros básicos y descripción
2. **Técnica**: Videos, consejos y errores comunes
3. **Rendimiento**: Registro de datos de entrenamiento

### 3. ExerciseHistoryList

**Propósito**: Lista completa de ejercicios disponibles con historial de entrenamiento.

**Características**:
- Búsqueda y filtrado avanzado
- Ordenación por múltiples criterios
- Historial de sesiones expandible
- Estadísticas de progreso por ejercicio
- Integración con sistema de progreso

**Filtros**:
- Grupo muscular
- Nivel de dificultad
- Equipamiento requerido
- Búsqueda por texto

### 4. useRoutines Hook

**Propósito**: Hook personalizado que gestiona todo el estado relacionado con rutinas.

**Estado Gestionado**:
```javascript
{
  currentRoutine: Object,       // Rutina actual
  allExercises: Array,          // Biblioteca de ejercicios
  exerciseHistory: Object,      // Historial por ejercicio
  completedExercises: Set,      // Ejercicios completados hoy
  routineStats: Object,         // Estadísticas calculadas
  loading: Boolean,             // Estado de carga
  error: String                 // Errores
}
```

**Funciones Principales**:
- `markExerciseCompleted(exerciseId, performanceData)`
- `markExerciseUncompleted(exerciseId)`
- `getExerciseDetails(exerciseId)`
- `calculateRoutineStats()`

### 5. routineService.js

**Propósito**: Servicio que maneja todas las operaciones de datos relacionadas con rutinas.

**API Endpoints**:
```javascript
// Rutina actual del usuario
GET /api/routines/current

// Biblioteca completa de ejercicios
GET /api/exercises

// Detalles específicos de un ejercicio
GET /api/exercises/:id

// Historial de entrenamientos
GET /api/exercises/history

// Guardar progreso de ejercicio
POST /api/exercises/:id/progress
```

## Datos Mock Incluidos

### Rutina de Ejemplo
```javascript
{
  id: "routine_001",
  name: "Rutina de Fuerza - Semana 1",
  description: "Rutina enfocada en desarrollo de fuerza general",
  assignedBy: {
    id: "trainer_002",
    name: "Carlos Ruiz",
    specialization: "Entrenamiento de Fuerza"
  },
  exercises: [
    {
      id: "ex_001",
      exerciseId: "squat_barbell",
      name: "Sentadilla con Barra",
      sets: 4,
      reps: "8-10",
      targetWeight: "80kg",
      restTime: "90s",
      notes: "Descender hasta 90 grados"
    }
    // ... más ejercicios
  ],
  trainingDays: ["Lunes", "Miércoles", "Viernes"],
  difficultyLevel: "Intermedio",
  estimatedDuration: 75,
  startDate: "2024-01-15T00:00:00Z",
  endDate: "2024-02-15T00:00:00Z",
  status: "active"
}
```

### Biblioteca de Ejercicios
```javascript
{
  exerciseId: "squat_barbell",
  name: "Sentadilla con Barra",
  description: "Ejercicio fundamental para desarrollo de piernas",
  muscleGroup: "Piernas",
  primaryMuscles: ["Cuádriceps", "Glúteos"],
  secondaryMuscles: ["Isquiotibiales", "Core"],
  difficulty: "Intermedio",
  equipment: "Barra y Discos",
  instructions: [
    "Coloca la barra sobre los trapecios",
    "Separa los pies al ancho de hombros",
    "Desciende flexionando rodillas y caderas",
    "Mantén el pecho erguido",
    "Asciende empujando con los talones"
  ],
  techniqueTips: [
    "Mantén las rodillas alineadas con los pies",
    "No dejes que las rodillas se vayan hacia adentro",
    "Respira profundo antes de descender"
  ],
  commonMistakes: [
    "Inclinar demasiado el torso hacia adelante",
    "No descender lo suficiente",
    "Levantar los talones del suelo"
  ]
}
```

## Integración con Otros Módulos

### Módulo de Progreso Físico
- Los datos de rendimiento se sincronizan automáticamente
- Las estadísticas de ejercicios alimentan los gráficos de progreso
- El historial de entrenamiento se comparte entre módulos

### Sistema de Notificaciones
- Alertas por rutinas próximas a vencer
- Recordatorios de días de entrenamiento
- Notificaciones de nuevas rutinas asignadas

### Gestión de Usuarios
- Validación de rol CLIENTE
- Información del entrenador asignado
- Historial de asignaciones

## Características Técnicas

### Responsive Design
- Optimizado para dispositivos móviles
- Grillas adaptables con Tailwind CSS
- Navegación touch-friendly

### Performance
- Lazy loading de detalles de ejercicios
- Paginación en listas largas
- Optimización de re-renders con React.memo

### Accesibilidad
- Navegación por teclado completa
- Lectores de pantalla compatibles
- Contraste de colores WCAG AA

### Estado Offline
- Cache local con localStorage
- Sincronización cuando vuelve la conexión
- Indicadores de estado de conectividad

## Extensibilidad

### Futuras Mejoras Planeadas
1. **Videos de Ejercicios**: Integración con biblioteca de videos
2. **Rutinas Personalizadas**: Permite al cliente crear rutinas propias
3. **Comparar Rutinas**: Análisis comparativo entre rutinas
4. **Exportar Datos**: Exportación a PDF/Excel
5. **Integración Wearables**: Sincronización con dispositivos fitness

### Puntos de Extensión
```javascript
// Hooks personalizables
const useRoutines = (customOptions = {}) => {
  // Configuración personalizable
}

// Servicios modulares
export const routineService = {
  // APIs extensibles
}

// Componentes composables
<ActiveRoutineCard
  customActions={[]} // Acciones personalizadas
  customStats={[]}   // Estadísticas adicionales
/>
```

## Testing

### Test Cases Principales
1. **Carga de Rutina**: Verificar carga correcta de rutina asignada
2. **Marcar Completado**: Validar funcionalidad de marcar ejercicios
3. **Filtros**: Testear filtros y búsqueda en biblioteca
4. **Responsive**: Verificar funcionalidad en diferentes tamaños
5. **Error Handling**: Manejo de errores de API

### Comandos de Testing
```bash
# Tests unitarios
npm test src/hooks/useRoutines.test.js

# Tests de integración
npm test src/Componentes/Routines/

# Tests E2E
npm run test:e2e routines
```

## Troubleshooting

### Problemas Comunes

**1. No se carga la rutina asignada**
- Verificar que el usuario tenga rol CLIENTE
- Confirmar que existe una rutina activa asignada
- Revisar la consola por errores de API

**2. El progreso no se guarda**
- Verificar conectividad a internet
- Confirmar que localStorage no esté lleno
- Revisar permisos de almacenamiento

**3. Los filtros no funcionan**
- Limpiar cache del navegador
- Verificar que los datos mock se cargan correctamente
- Revisar la consola por errores JavaScript

### Logs de Debug
```javascript
// Activar logs detallados
localStorage.setItem('debug_routines', 'true');

// Ver estado del hook
console.log('Routine State:', useRoutines.getState());

// Verificar datos mock
console.log('Mock Data:', routineService.getMockData());
```

## Contribución

### Estándares de Código
- ESLint + Prettier para formateo
- Nomenclatura en español para interfaz de usuario
- Comentarios en español para lógica de negocio
- PropTypes para validación de props

### Pull Request Checklist
- [ ] Tests unitarios incluidos
- [ ] Documentación actualizada
- [ ] Responsive design verificado
- [ ] Accesibilidad validada
- [ ] Performance optimizada

## Conclusión

Este módulo de Rutinas Asignadas proporciona una experiencia completa y moderna para que los clientes del gimnasio Apolo gestionen sus rutinas de entrenamiento. La arquitectura modular permite fácil mantenimiento y extensión futura, mientras que la integración con otros módulos del sistema asegura una experiencia de usuario coherente y eficiente.