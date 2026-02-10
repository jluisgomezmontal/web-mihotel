# Guests Module - Refactored Architecture

## 📁 Estructura del Módulo

```
app/guests/
├── page.tsx                          # Componente principal (refactorizado)
├── page.backup.tsx                   # Backup del archivo original
├── layout.tsx                        # Layout con DashboardProvider
├── types.ts                          # Interfaces y tipos TypeScript
├── constants.ts                      # Configuraciones y constantes
├── components/                       # Componentes UI reutilizables
│   ├── GuestStatusBadge.tsx         # Badge de estado del huésped
│   ├── GuestCard.tsx                # Card individual de huésped
│   ├── GuestStats.tsx               # Cards de estadísticas
│   ├── GuestFilters.tsx             # Controles de búsqueda y filtros
│   └── EmptyState.tsx               # Estado vacío
├── hooks/                            # Custom hooks
│   ├── useGuestActions.ts           # Acciones de API (delete, toggle VIP)
│   ├── useGuestData.ts              # Carga de datos
│   └── useGuestFilters.ts           # Lógica de filtrado y búsqueda
└── utils/                            # Utilidades
    └── guestMapper.ts                # Transformación de datos
```

## 🎯 Comparación: Antes vs Después

### **Antes (page.tsx original)**
- ❌ **651 líneas** en un solo archivo
- ❌ Lógica de negocio mezclada con UI
- ❌ Difícil de mantener y testear
- ❌ Componentes acoplados
- ❌ Configuraciones duplicadas

### **Después (arquitectura refactorizada)**
- ✅ **Componente principal: ~170 líneas**
- ✅ **13 archivos modulares** organizados
- ✅ Responsabilidades separadas
- ✅ Componentes reutilizables
- ✅ Fácil de mantener y escalar

## 📦 Componentes Extraídos

### **GuestStatusBadge** (`components/GuestStatusBadge.tsx`)
```tsx
<GuestStatusBadge guest={guest} />
```
- Muestra el estado del huésped (VIP, Bloqueado, Gold, Silver, Bronze)
- Lógica centralizada para determinar el badge correcto
- Usa configuración de `constants.ts`

### **GuestCard** (`components/GuestCard.tsx`)
```tsx
<GuestCard
  guest={guest}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleVIP={handleToggleVIP}
  onReserve={handleReserve}
/>
```
- Card completo con información del huésped
- Estadísticas de estancias y gastos
- Botones de acción con animaciones
- ~180 líneas → componente independiente

### **GuestStats** (`components/GuestStats.tsx`)
```tsx
<GuestStats stats={stats} />
```
- 4 cards de estadísticas
- Total huéspedes, VIP, estancias totales, ingresos
- Animaciones hover y efectos visuales

### **GuestFilters** (`components/GuestFilters.tsx`)
```tsx
<GuestFilters
  searchTerm={term}
  onSearchChange={setTerm}
  vipFilter={filter}
  onVipFilterChange={setFilter}
  stats={stats}
/>
```
- Barra de búsqueda por nombre, email, teléfono
- Select de filtro VIP con contadores
- Botón de filtros adicionales

### **EmptyState** (`components/EmptyState.tsx`)
```tsx
<EmptyState hasFilters={true} onCreateGuest={handleCreate} />
```
- Mensaje cuando no hay huéspedes
- Diferencia entre "sin resultados" y "sin datos"
- Call-to-action para crear primer huésped

## 🪝 Custom Hooks

### **useGuestActions** (`hooks/useGuestActions.ts`)
```tsx
const actions = useGuestActions(loadGuests)

// Usar acciones
actions.handleDelete(guestId)
actions.handleToggleVIP(guestId, currentStatus)
```

**Responsabilidades:**
- ✅ Eliminar huésped
- ✅ Toggle estatus VIP
- ✅ Manejo de confirmaciones
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Success/error alerts

### **useGuestData** (`hooks/useGuestData.ts`)
```tsx
const { guests, properties, rooms, isLoading, loadGuests } = useGuestData()
```

**Responsabilidades:**
- ✅ Carga de huéspedes desde API
- ✅ Carga de propiedades y habitaciones
- ✅ Estado de loading
- ✅ Manejo de errores
- ✅ Auto-carga en mount

### **useGuestFilters** (`hooks/useGuestFilters.ts`)
```tsx
const { filteredGuests, stats } = useGuestFilters(
  guests,
  searchTerm,
  vipFilter
)
```

**Responsabilidades:**
- ✅ Filtrado por búsqueda (nombre, email, teléfono)
- ✅ Filtrado por tipo (VIP, regular)
- ✅ Cálculo de estadísticas
- ✅ Memoización para performance

## 🛠️ Utilidades

### **guestMapper.ts** (`utils/guestMapper.ts`)

```tsx
// Mapear huéspedes para diálogo de reservas
const guestsForReservation = mapGuestsForReservation(guests)

// Formatear nombre completo
const fullName = formatGuestName(guest)

// Verificar info de contacto completa
const hasContact = hasCompleteContactInfo(guest)

// Calcular valor de vida del cliente
const ltv = calculateLifetimeValue(guest)

// Obtener estado para mostrar
const status = getGuestDisplayStatus(guest)
```

**Funciones:**
- `mapGuestsForReservation`: Guests → Reservation dialog data
- `formatGuestName`: Formatea nombre completo
- `hasCompleteContactInfo`: Verifica contacto completo
- `calculateLifetimeValue`: Calcula LTV
- `getGuestDisplayStatus`: Obtiene estado display

## 📋 Tipos y Constantes

### **types.ts**
```tsx
export type LoyaltyLevel = 'gold' | 'silver' | 'bronze'
export type GuestStatus = 'blacklisted' | 'vip' | LoyaltyLevel

export interface Guest { /* ... */ }
export interface GuestCardProps { /* ... */ }
export interface GuestStats { /* ... */ }
export interface GuestFilters { /* ... */ }
```

### **constants.ts**
```tsx
export const GUEST_STATUS_CONFIG = {
  blacklisted: { barColor: '...', label: '...', /* ... */ },
  vip: { /* ... */ },
  gold: { /* ... */ },
  silver: { /* ... */ },
  bronze: { /* ... */ }
}

export const LOYALTY_THRESHOLDS = {
  GOLD: 10,
  SILVER: 5,
  BRONZE: 0
}

// Funciones helper
export function getLoyaltyLevel(totalStays: number): LoyaltyLevel
export function getGuestStatus(guest): GuestStatus
```

## 🎨 Componente Principal Refactorizado

### **`page.tsx`** (Antes: 651 líneas → Ahora: ~170 líneas)

```tsx
export default function GuestsPage() {
  // Context
  const { userData, tenantData } = useDashboard()
  
  // Local state
  const [searchTerm, setSearchTerm] = useState("")
  const [vipFilter, setVipFilter] = useState("all")
  
  // Custom hooks
  const { guests, properties, rooms, isLoading, loadGuests } = useGuestData()
  const guestActions = useGuestActions(loadGuests)
  const { filteredGuests, stats } = useGuestFilters(guests, searchTerm, vipFilter)

  // Handlers simples
  const handleCreateGuest = useCallback(() => { ... }, [])
  const handleEditGuest = useCallback((guest) => { ... }, [])

  return (
    <MainLayout>
      {/* Header */}
      <div>...</div>

      {/* Filters */}
      <GuestFilters {...filterProps} />

      {/* Stats */}
      <GuestStats stats={stats} />

      {/* Grid o Empty State */}
      {filteredGuests.length > 0 ? (
        <div className="grid">
          {filteredGuests.map(guest => (
            <GuestCard
              key={guest._id}
              guest={guest}
              onEdit={handleEditGuest}
              {...guestActions}
            />
          ))}
        </div>
      ) : (
        <EmptyState hasFilters={...} onCreateGuest={...} />
      )}

      {/* Dialogs */}
      <GuestFormDialog {...} />
      <ReservationFormDialog {...} />
      <AlertDialogCustom {...} />
    </MainLayout>
  )
}
```

## 🚀 Beneficios de la Refactorización

### **1. Mantenibilidad** ⭐⭐⭐⭐⭐
- Cambios localizados
- Fácil encontrar funcionalidad
- Menos riesgo de bugs

### **2. Testabilidad** ⭐⭐⭐⭐⭐
- Hooks testeables
- Componentes aislados
- Utilidades puras

### **3. Reutilización** ⭐⭐⭐⭐⭐
- Componentes compartibles
- Hooks reutilizables
- Configuraciones centralizadas

### **4. Escalabilidad** ⭐⭐⭐⭐⭐
- Fácil agregar filtros
- Fácil agregar acciones
- Fácil agregar estados

### **5. Performance** ⭐⭐⭐⭐⭐
- Memoización optimizada
- Re-renders minimizados
- Componentes eficientes

## 📝 Cómo Extender el Módulo

### **Agregar nuevo nivel de lealtad:**
1. Actualizar `LoyaltyLevel` en `types.ts`
2. Agregar configuración en `GUEST_STATUS_CONFIG` en `constants.ts`
3. Actualizar `LOYALTY_THRESHOLDS`
4. ✅ Listo - componentes se actualizan automáticamente

### **Agregar nueva acción:**
1. Crear función en `useGuestActions.ts`
2. Exportar en el return del hook
3. Usar en el componente principal

### **Agregar nuevo filtro:**
1. Agregar lógica en `useGuestFilters.ts`
2. Actualizar `GuestFilters` component
3. Usar el nuevo valor filtrado

## 🎓 Patrones Aplicados

1. ✅ **Container/Presentational Pattern**
2. ✅ **Custom Hooks Pattern**
3. ✅ **Mapper Pattern**
4. ✅ **Configuration Pattern**
5. ✅ **Composition Pattern**
6. ✅ **Single Responsibility Principle**
7. ✅ **Don't Repeat Yourself**
8. ✅ **Separation of Concerns**

## ✅ Archivos Generados

1. ✅ `types.ts` - Interfaces TypeScript
2. ✅ `constants.ts` - Configuraciones y helpers
3. ✅ `components/GuestStatusBadge.tsx`
4. ✅ `components/GuestCard.tsx`
5. ✅ `components/GuestStats.tsx`
6. ✅ `components/GuestFilters.tsx`
7. ✅ `components/EmptyState.tsx`
8. ✅ `hooks/useGuestActions.ts`
9. ✅ `hooks/useGuestData.ts`
10. ✅ `hooks/useGuestFilters.ts`
11. ✅ `utils/guestMapper.ts`
12. ✅ `page.tsx` - Refactorizado
13. ✅ `page.backup.tsx` - Backup del original
14. ✅ `README.md` - Documentación completa

---

**Refactorizado siguiendo principios SOLID y mejores prácticas de React/TypeScript** 🚀
