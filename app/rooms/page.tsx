"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Bed, Building2, Users, DollarSign, Filter, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import { RoomFormDialog } from "@/components/forms/room-form-dialog"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { statusColors, getStatusBarColor, statsColors } from '@/lib/theme-utils'
import { useDashboard } from "@/contexts/DashboardContext"
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

  const getStatusColor = (status: string) => {
    return statusColors.room[status as keyof typeof statusColors.room] || 'bg-muted text-muted-foreground border-border'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Disponible',
      occupied: 'Ocupada',
      reserved: 'Reservada',
      maintenance: 'Mantenimiento',
      cleaning: 'Limpieza'
    }
    return labels[status] || status
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      room: 'Habitación',
      suite: 'Suite',
      apartment: 'Apartamento'
    }
    return labels[type] || type
  }

  return (
    <Card className="hover:shadow-elegant-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bed className="h-4 w-4" />
              {room.nameOrNumber}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs">
              <Building2 className="h-3 w-3" />
              {room.propertyId.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`text-xs ${getStatusColor(room.status)}`}>
            {getStatusLabel(room.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Tipo</p>
            <p className="font-medium">{getTypeLabel(room.type)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Capacidad</p>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <p className="font-medium">
                {room.capacity.adults} adultos
                {room.capacity.children ? `, ${room.capacity.children} niños` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Precio base</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold text-lg">
                {room.pricing.basePrice.toLocaleString()} {room.pricing.currency}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(room)
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => router.push(`/properties/${room.propertyId._id}`)}
          >
            Gestionar
          </Button>
          <Button 
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(room)
            }}
          >
            <Trash2 className="h-4 w-4" />
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando habitaciones...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Habitaciones</h1>
            <p className="text-muted-foreground">
              Gestiona todas las habitaciones de tus propiedades
            </p>
          </div>
          
          <Button className="gap-2" onClick={() => {
            setEditingRoom(undefined)
            setIsDialogOpen(true)
          }}>
            <Plus className="h-4 w-4" />
            Nueva Habitación
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar habitaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Habitaciones
              </CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponibles
              </CardTitle>
              <div className={`h-2 w-2 rounded-full ${statsColors.available.dot}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${statsColors.available.text}`}>{stats.available}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ocupadas
              </CardTitle>
              <div className={`h-2 w-2 rounded-full ${statsColors.occupied.dot}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${statsColors.occupied.text}`}>{stats.occupied}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mantenimiento
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.maintenance}</div>
            </CardContent>
          </Card>
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Bed className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'No se encontraron habitaciones'
                    : 'No tienes habitaciones registradas'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza agregando habitaciones a tus propiedades'}
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
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
