# Reservations Module - Refactored Architecture

## 📁 Estructura del Módulo

```
app/reservations/
├── page.tsx                          # Componente principal (refactorizado)
├── page.backup.tsx                   # Backup del archivo original
├── layout.tsx                        # Layout con DashboardProvider
├── types.ts                          # Interfaces y tipos TypeScript
├── constants.ts                      # Configuraciones y constantes
├── components/                       # Componentes UI reutilizables
│   ├── StatusBadge.tsx              # Badge de estado de reserva
│   ├── PaymentStatusBadge.tsx       # Badge de estado de pago
│   ├── ReservationCard.tsx          # Card individual de reserva
│   ├── ReservationStats.tsx         # Cards de estadísticas
│   ├── ReservationFilters.tsx       # Controles de búsqueda y filtros
│   └── EmptyState.tsx               # Estado vacío
├── hooks/                            # Custom hooks
│   ├── useReservationActions.ts     # Acciones de API (confirm, check-in, etc.)
│   └── useReservationFilters.ts     # Lógica de filtrado y búsqueda
└── utils/                            # Utilidades
    └── reservationMapper.ts          # Transformación de datos

```

## 🎯 Principios de Refactorización Aplicados

### 1. **Separación de Responsabilidades (SRP)**
- **Tipos**: Centralizados en `types.ts`
- **Constantes**: Configuraciones en `constants.ts`
- **Lógica de negocio**: Extraída a custom hooks
- **UI**: Componentes pequeños y enfocados

### 2. **Don't Repeat Yourself (DRY)**
- Configuraciones de estado reutilizables
- Mappers para transformación de datos
- Hooks compartibles entre componentes

### 3. **Single Level of Abstraction**
- Componente principal solo orquesta
- Lógica compleja delegada a hooks
- UI delegada a componentes especializados

### 4. **Composición sobre Herencia**
- Componentes pequeños y componibles
- Props bien definidas
- Fácil de testear y mantener

## 📦 Componentes Extraídos

### **StatusBadge** (`components/StatusBadge.tsx`)
```tsx
<StatusBadge status="confirmed" />
```
- Muestra el estado de la reserva con icono y color
- Usa configuración centralizada de `constants.ts`

### **PaymentStatusBadge** (`components/PaymentStatusBadge.tsx`)
```tsx
<PaymentStatusBadge status="partial" />
```
- Muestra el estado de pago con icono y color
- Reutilizable en diferentes contextos

### **ReservationCard** (`components/ReservationCard.tsx`)
```tsx
<ReservationCard
  reservation={reservation}
  onEdit={handleEdit}
  onDelete={handleDelete}
  // ... más handlers
/>
```
- Card completo con toda la información de la reserva
- Maneja acciones mediante callbacks
- ~230 líneas → componente independiente

### **ReservationStats** (`components/ReservationStats.tsx`)
```tsx
<ReservationStats totalCount={10} statusCounts={counts} />
```
- 5 cards de estadísticas
- Animaciones y efectos hover
- Fácil de reutilizar en dashboard

### **ReservationFilters** (`components/ReservationFilters.tsx`)
```tsx
<ReservationFilters
  searchTerm={term}
  onSearchChange={setTerm}
  statusFilter={filter}
  onStatusFilterChange={setFilter}
  statusCounts={counts}
/>
```
- Barra de búsqueda
- Select de estado con contadores
- Botón de filtros adicionales

### **EmptyState** (`components/EmptyState.tsx`)
```tsx
<EmptyState hasFilters={true} onCreateReservation={handleCreate} />
```
- Muestra mensaje cuando no hay reservas
- Diferencia entre "sin resultados" y "sin datos"
- Call-to-action para crear primera reserva

## 🪝 Custom Hooks

### **useReservationActions** (`hooks/useReservationActions.ts`)
```tsx
const actions = useReservationActions(refreshReservations)

// Usar acciones
actions.handleConfirm(reservationId)
actions.handleCheckIn(reservationId)
actions.handleCheckOut(reservationId)
actions.handleCancel(reservationId)
actions.handleDelete(reservationId)
```

**Responsabilidades:**
- Todas las llamadas a API
- Manejo de confirmaciones
- Manejo de errores
- Loading states
- Success/error alerts

**Beneficios:**
- Lógica reutilizable
- Fácil de testear
- Separada de la UI

### **useReservationFilters** (`hooks/useReservationFilters.ts`)
```tsx
const { filteredReservations, statusCounts } = useReservationFilters(
  reservations,
  searchTerm,
  statusFilter
)
```

**Responsabilidades:**
- Filtrado por búsqueda
- Filtrado por estado
- Cálculo de contadores
- Memoización para performance

**Beneficios:**
- Performance optimizada con `useMemo`
- Lógica de filtrado centralizada
- Fácil de extender con nuevos filtros

## 🛠️ Utilidades

### **reservationMapper.ts** (`utils/reservationMapper.ts`)

```tsx
// Mapear datos de API a tipo Reservation
const reservation = mapReservationData(rawData)

// Mapear para edición
const editData = mapReservationForEdit(reservation)

// Mapear para diálogo de pagos
const paymentData = mapReservationsForPayment(reservations)
```

**Funciones:**
- `mapReservationData`: API → Reservation type
- `mapReservationForEdit`: Reservation → Form data
- `mapReservationsForPayment`: Reservations → Payment dialog data

**Beneficios:**
- Transformaciones centralizadas
- Validación de datos
- Manejo de valores por defecto

## 📋 Tipos y Constantes

### **types.ts**
```tsx
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
export type PaymentStatus = 'pending' | 'partial' | 'paid'

export interface Reservation { /* ... */ }
export interface ReservationCardProps { /* ... */ }
export interface StatusCounts { /* ... */ }
```

### **constants.ts**
```tsx
export const RESERVATION_STATUS_CONFIG = {
  pending: { label: 'Pendiente', icon: Clock, color: '...', /* ... */ },
  // ... más estados
}

export const PAYMENT_STATUS_CONFIG = { /* ... */ }
export const STATUS_FILTER_OPTIONS = [ /* ... */ ]
```

## 📊 Comparación: Antes vs Después

### **Antes (page.tsx original)**
- ❌ 951 líneas en un solo archivo
- ❌ Múltiples responsabilidades mezcladas
- ❌ Difícil de mantener y testear
- ❌ Componentes y lógica acoplados
- ❌ Configuraciones duplicadas
- ❌ Difícil de escalar

### **Después (arquitectura refactorizada)**
- ✅ Componente principal: ~200 líneas
- ✅ Responsabilidades separadas
- ✅ Fácil de mantener y testear
- ✅ Componentes reutilizables
- ✅ Configuraciones centralizadas
- ✅ Fácil de escalar

## 🎨 Beneficios de la Refactorización

### **1. Mantenibilidad**
- Cambios localizados en archivos específicos
- Fácil encontrar y modificar funcionalidad
- Menos riesgo de romper código no relacionado

### **2. Testabilidad**
- Hooks testeables independientemente
- Componentes con props claras
- Utilidades puras fáciles de testear

### **3. Reutilización**
- Componentes usables en otros módulos
- Hooks compartibles
- Configuraciones centralizadas

### **4. Escalabilidad**
- Fácil agregar nuevos estados
- Fácil agregar nuevos filtros
- Fácil agregar nuevas acciones

### **5. Legibilidad**
- Código más limpio y organizado
- Nombres descriptivos
- Estructura clara y predecible

### **6. Performance**
- Memoización en hooks
- Re-renders optimizados
- Componentes pequeños y eficientes

## 🚀 Cómo Usar

### **Importar componentes**
```tsx
import { ReservationCard } from './components/ReservationCard'
import { StatusBadge } from './components/StatusBadge'
```

### **Usar hooks**
```tsx
const actions = useReservationActions(refresh)
const { filteredReservations } = useReservationFilters(data, term, filter)
```

### **Usar utilidades**
```tsx
import { mapReservationData } from './utils/reservationMapper'
const reservation = mapReservationData(apiData)
```

## 📝 Notas para Desarrollo Futuro

### **Agregar nuevo estado de reserva:**
1. Actualizar `ReservationStatus` en `types.ts`
2. Agregar configuración en `RESERVATION_STATUS_CONFIG` en `constants.ts`
3. Listo - todos los componentes se actualizan automáticamente

### **Agregar nueva acción:**
1. Crear función en `useReservationActions.ts`
2. Exportar en el return del hook
3. Usar en el componente principal

### **Agregar nuevo filtro:**
1. Agregar lógica en `useReservationFilters.ts`
2. Actualizar `ReservationFilters` component
3. Usar el nuevo valor filtrado

## ✅ Checklist de Calidad

- ✅ Separación de responsabilidades
- ✅ Componentes pequeños (<300 líneas)
- ✅ Hooks reutilizables
- ✅ Tipos TypeScript completos
- ✅ Constantes centralizadas
- ✅ Código DRY
- ✅ Fácil de testear
- ✅ Fácil de mantener
- ✅ Fácil de escalar
- ✅ Documentado

## 🎓 Patrones Aplicados

1. **Container/Presentational Pattern**: Separación de lógica y UI
2. **Custom Hooks Pattern**: Lógica reutilizable
3. **Mapper Pattern**: Transformación de datos
4. **Configuration Pattern**: Constantes centralizadas
5. **Composition Pattern**: Componentes componibles

---

**Refactorizado siguiendo principios SOLID y mejores prácticas de React/TypeScript** 🚀
