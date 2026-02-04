"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Bed, Building2, Users, DollarSign, Filter, Edit, Trash2, Sparkles, ArrowRight, Home, CheckCircle2, AlertCircle, Wrench, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import { RoomFormDialog } from "@/components/forms/room-form-dialog"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { useDashboard } from "@/contexts/DashboardContext"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Room {
  _id: string
  propertyId: {
    _id: string
    name: string
    address: {
      city: string
    }
  }
  nameOrNumber: string
  type: string
  capacity: {
    adults: number
    children?: number
  }
  pricing: {
    basePrice: number
    currency: string
  }
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved'
  amenities?: string[]
  description?: string
  isActive: boolean
}

function RoomCard({ room, onEdit, onDelete }: { room: Room, onEdit: (room: Room) => void, onDelete: (room: Room) => void }) {
  const router = useRouter()

  const getStatusConfig = (status: string) => {
    const configs = {
      available: {
        color: 'text-[var(--room-available)]',
        bg: 'bg-[var(--room-available-light)]',
        border: 'border-[var(--room-available)]/20',
        icon: CheckCircle2,
        label: 'Disponible',
        barColor: 'bg-[var(--room-available)]'
      },
      occupied: {
        color: 'text-[var(--room-occupied)]',
        bg: 'bg-[var(--room-occupied-light)]',
        border: 'border-[var(--room-occupied)]/20',
        icon: AlertCircle,
        label: 'Ocupada',
        barColor: 'bg-[var(--room-occupied)]'
      },
      reserved: {
        color: 'text-[var(--room-reserved)]',
        bg: 'bg-[var(--room-reserved-light)]',
        border: 'border-[var(--room-reserved)]/20',
        icon: CheckCircle2,
        label: 'Reservada',
        barColor: 'bg-[var(--room-reserved)]'
      },
      maintenance: {
        color: 'text-[var(--room-maintenance)]',
        bg: 'bg-[var(--room-maintenance-light)]',
        border: 'border-[var(--room-maintenance)]/20',
        icon: Wrench,
        label: 'Mantenimiento',
        barColor: 'bg-[var(--room-maintenance)]'
      },
      cleaning: {
        color: 'text-[var(--room-cleaning)]',
        bg: 'bg-[var(--room-cleaning-light)]',
        border: 'border-[var(--room-cleaning)]/20',
        icon: Loader2,
        label: 'Limpieza',
        barColor: 'bg-[var(--room-cleaning)]'
      }
    }
    return configs[status as keyof typeof configs] || configs.available
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      room: 'Habitación',
      suite: 'Suite',
      apartment: 'Apartamento'
    }
    return labels[type] || type
  }

  const statusConfig = getStatusConfig(room.status)
  const StatusIcon = statusConfig.icon

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status indicator bar */}
      <div className={cn("h-1.5 w-full", statusConfig.barColor)} />
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                <Bed className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {room.nameOrNumber}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs mt-0.5">
                  <Building2 className="h-3 w-3" />
                  {room.propertyId.name}
                </CardDescription>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-semibold px-2.5 py-1 border",
              statusConfig.color,
              statusConfig.bg,
              statusConfig.border
            )}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 relative">
        {/* Type and Capacity Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-xl space-y-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-[var(--dashboard-info)]/10 rounded-lg">
                <Home className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Tipo</span>
            </div>
            <p className="font-bold text-sm text-[var(--dashboard-info)]">{getTypeLabel(room.type)}</p>
          </div>
          
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-warning-light)] to-transparent border border-[var(--dashboard-warning)]/20 rounded-xl space-y-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-[var(--dashboard-warning)]/10 rounded-lg">
                <Users className="h-3.5 w-3.5 text-[var(--dashboard-warning)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Capacidad</span>
            </div>
            <p className="font-bold text-sm text-[var(--dashboard-warning)]">
              {room.capacity.adults} {room.capacity.adults === 1 ? 'adulto' : 'adultos'}
              {room.capacity.children ? ` + ${room.capacity.children}` : ''}
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="p-3 bg-gradient-to-r from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-xl hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[var(--dashboard-success)]/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-[var(--dashboard-success)]" />
              </div>
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Precio base / noche</span>
            </div>
            <span className="font-bold text-lg text-[var(--dashboard-success)]">
              ${room.pricing.basePrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1 font-semibold group/btn hover:border-primary/50 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(room)
            }}
          >
            <Edit className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Editar
          </Button>
          <Button 
            size="sm" 
            className="flex-1 font-semibold group/btn hover:shadow-lg transition-all"
            onClick={() => router.push(`/properties/${room.propertyId._id}`)}
          >
            Gestionar
            <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="text-[var(--dashboard-danger)] hover:text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger-light)] hover:border-[var(--dashboard-danger)]/30 transition-all group/btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(room)
            }}
          >
            <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [rooms, setRooms] = React.useState<Room[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingRoom, setEditingRoom] = React.useState<Room | undefined>(undefined)
  const [properties, setProperties] = React.useState<Array<{ _id: string; name: string }>>([])
  const { alertState, hideAlert, confirmDelete, showError, showLoading, close } = useAlert()
  const { refreshRooms: refreshDashboardRooms, refreshProperties: refreshDashboardProperties, userData, tenantData } = useDashboard()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const loadRooms = React.useCallback(async () => {
    try {
      setIsLoading(true)
      
      const token = AuthService.getToken()
      
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`${API_BASE_URL}/rooms?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const roomsArray = data.data?.rooms || data.rooms || []
        setRooms(Array.isArray(roomsArray) ? roomsArray : [])
        
        // Actualizar también el contexto global para que otras páginas vean los cambios
        await refreshDashboardRooms()
      } else if (response.status === 401) {
        AuthService.clearAuth()
        window.location.href = '/auth/login'
      } else {
        setError('Error al cargar las habitaciones')
      }
    } catch (err) {
      console.error('Error loading rooms:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, typeFilter, searchTerm, refreshDashboardRooms, refreshDashboardProperties])

  const loadProperties = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const propertiesArray = data.data?.properties || data.properties || []
        setProperties(Array.isArray(propertiesArray) ? propertiesArray : [])
      }
    } catch (err) {
      console.error('Error loading properties:', err)
    }
  }, [])

  React.useEffect(() => {
    if (!isMounted) return
    loadRooms()
    loadProperties()
  }, [isMounted, loadRooms, loadProperties])

  const handleDeleteRoom = async (room: Room) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar habitación?',
      text: `Se eliminará permanentemente la habitación "${room.nameOrNumber}". Esta acción no se puede deshacer.`,
    })

    if (!confirmed) return

    showLoading('Eliminando habitación...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/rooms/${room._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        loadRooms()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar la habitación')
      }
    } catch (err) {
      close()
      console.error('Error deleting room:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const filteredRooms = Array.isArray(rooms) ? rooms : []

  const stats = {
    total: filteredRooms.length,
    available: filteredRooms.filter(r => r.status === 'available').length,
    occupied: filteredRooms.filter(r => r.status === 'occupied').length,
    maintenance: filteredRooms.filter(r => r.status === 'maintenance').length,
  }

  if (isLoading) {
    return (
      <MainLayout 
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <DashboardSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header with modern design */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Habitaciones
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona todas las habitaciones de tus propiedades
            </p>
          </div>
          
          <Button 
            className="group gap-2 hover:shadow-lg transition-all duration-300" 
            onClick={() => {
              setEditingRoom(undefined)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nueva Habitación
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 border-2 focus:border-primary/50 transition-colors"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-11 border-2">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="occupied">Ocupada</SelectItem>
              <SelectItem value="reserved">Reservada</SelectItem>
              <SelectItem value="maintenance">Mantenimiento</SelectItem>
              <SelectItem value="cleaning">Limpieza</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] h-11 border-2">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="room">Habitación</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
              <SelectItem value="apartment">Apartamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards with modern design */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Habitaciones
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Bed className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">en todas las propiedades</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--room-available)]/10 to-[var(--room-available)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponibles
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--room-available-light)] text-[var(--room-available)] group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--room-available)]">{stats.available}</div>
              <p className="text-xs text-muted-foreground mt-1">listas para reservar</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--room-occupied)]/10 to-[var(--room-occupied)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ocupadas
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--room-occupied-light)] text-[var(--room-occupied)] group-hover:scale-110 transition-transform">
                <AlertCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--room-occupied)]">{stats.occupied}</div>
              <p className="text-xs text-muted-foreground mt-1">actualmente en uso</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--room-maintenance)]/10 to-[var(--room-maintenance)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mantenimiento
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--room-maintenance-light)] text-[var(--room-maintenance)] group-hover:scale-110 transition-transform">
                <Wrench className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--room-maintenance)]">{stats.maintenance}</div>
              <p className="text-xs text-muted-foreground mt-1">requieren atención</p>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard 
                key={room._id} 
                room={room}
                onEdit={(room) => {
                  setEditingRoom(room)
                  setIsDialogOpen(true)
                }}
                onDelete={handleDeleteRoom}
              />
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-md p-16">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <Bed className="relative mx-auto h-20 w-20 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'No se encontraron habitaciones'
                    : 'No tienes habitaciones registradas'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
                    : 'Comienza agregando habitaciones a tus propiedades para gestionar reservas y disponibilidad'}
                </p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="group gap-2 hover:shadow-lg transition-all"
                size="lg"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Crear Primera Habitación
              </Button>
            </div>
          </Card>
        )}
      </div>

      <RoomFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingRoom(undefined)
        }}
        onSuccess={loadRooms}
        properties={properties}
        room={editingRoom as any}
      />
      <AlertDialogCustom
        open={alertState.open}
        onOpenChange={hideAlert}
        type={alertState.type}
        title={alertState.title}
        description={alertState.description}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
        showCancel={alertState.showCancel}
      />
    </MainLayout>
  )
}
