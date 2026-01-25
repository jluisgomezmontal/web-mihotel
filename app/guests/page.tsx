"use client"

import * as React from "react"
import { Plus, Search, Filter, User, Edit, Trash2, Star, Ban, Phone, Mail, CreditCard, MapPin, Calendar, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { formatDate } from "@/lib/utils"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { GuestFormDialog } from "@/components/forms/guest-form-dialog"
import { ReservationFormDialog } from "@/components/forms/reservation-form-dialog"
import { useDashboard } from "@/contexts/DashboardContext"

interface Guest {
  _id: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone: string
  dateOfBirth?: string
  nationality?: string
  emergencyContact?: {
    name?: string
    relationship?: string
    phone?: string
  }
  vipStatus: boolean
  blacklisted: boolean
  totalStays: number
  totalSpent: number
  loyaltyPoints: number
  notes?: string
  createdAt: string
}

function GuestCard({ guest, onEdit, onDelete, onToggleVIP, onReserve }: { 
  guest: Guest
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
  onToggleVIP: (id: string, currentStatus: boolean) => void
  onReserve: (guestId: string) => void
}) {
  const loyaltyLevel = guest.totalStays >= 10 ? 'gold' : guest.totalStays >= 5 ? 'silver' : 'bronze'
  
  return (
    <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {/* Status Indicator Bar */}
      <div className={`h-1 w-full ${
        guest.blacklisted ? 'bg-red-500' :
        guest.vipStatus ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600' :
        loyaltyLevel === 'gold' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
        loyaltyLevel === 'silver' ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
        'bg-gradient-to-r from-orange-400 to-orange-600'
      }`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Guest Name & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold">
                  {guest.firstName} {guest.lastName}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {guest.vipStatus && (
                    <Badge className="gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 border-0 text-white shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                      VIP
                    </Badge>
                  )}
                  {guest.blacklisted && (
                    <Badge variant="destructive" className="gap-1">
                      <Ban className="h-3 w-3" />
                      Bloqueado
                    </Badge>
                  )}
                  {!guest.vipStatus && !guest.blacklisted && (
                    <Badge variant="outline" className={`gap-1 text-xs ${
                      loyaltyLevel === 'gold' ? 'border-amber-500 text-amber-700 dark:text-amber-400' :
                      loyaltyLevel === 'silver' ? 'border-gray-400 text-gray-700 dark:text-gray-400' :
                      'border-orange-500 text-orange-700 dark:text-orange-400'
                    }`}>
                      {loyaltyLevel === 'gold' ? '🥇 Gold' : loyaltyLevel === 'silver' ? '🥈 Silver' : '🥉 Bronze'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="font-medium text-foreground">{guest.phone}</span>
              </div>
              {guest.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium text-foreground">{guest.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Additional Info */}
        {(guest.nationality || guest.emergencyContact?.name) && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg text-sm">
            {guest.nationality && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nacionalidad</p>
                <p className="font-semibold">{guest.nationality}</p>
              </div>
            )}
            {guest.emergencyContact?.name && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Emergencia</p>
                <p className="font-semibold">{guest.emergencyContact.name}</p>
                {guest.emergencyContact.phone && (
                  <p className="text-xs text-muted-foreground">{guest.emergencyContact.phone}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center space-y-1">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wide">Estancias</p>
            <p className="font-bold text-2xl text-blue-700 dark:text-blue-400">{guest.totalStays}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-center space-y-1">
            <p className="text-xs font-medium text-green-900 dark:text-green-100 uppercase tracking-wide">Gastado</p>
            <p className="font-bold text-lg text-green-700 dark:text-green-400">${guest.totalSpent.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg text-center space-y-1">
            <p className="text-xs font-medium text-purple-900 dark:text-purple-100 uppercase tracking-wide">Puntos</p>
            <p className="font-bold text-2xl text-purple-700 dark:text-purple-400">{guest.loyaltyPoints}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button 
            variant="default" 
            size="default" 
            onClick={() => onReserve(guest._id)}
            className="w-full font-semibold"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Crear Reserva
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(guest)}
              className="flex-1 font-semibold"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button 
              variant={guest.vipStatus ? "default" : "outline"}
              size="sm" 
              onClick={() => onToggleVIP(guest._id, guest.vipStatus)}
              className={`flex-1 font-semibold ${guest.vipStatus ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
            >
              <Star className={`h-4 w-4 mr-1 ${guest.vipStatus ? 'fill-current' : ''}`} />
              {guest.vipStatus ? 'VIP' : 'Hacer VIP'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(guest._id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GuestsPage() {
  const { userData, tenantData } = useDashboard()
  const [guests, setGuests] = React.useState<Guest[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterVIP, setFilterVIP] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingGuest, setEditingGuest] = React.useState<Guest | undefined>(undefined)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = React.useState(false)
  const [selectedGuestForReservation, setSelectedGuestForReservation] = React.useState<string | undefined>(undefined)
  const [properties, setProperties] = React.useState<Array<{ _id: string; name: string }>>([])
  const [rooms, setRooms] = React.useState<Array<{ _id: string; nameOrNumber: string; propertyId: string }>>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { alertState, hideAlert, confirmDelete, showError, showLoading, close, showSuccess } = useAlert()

  const loadGuests = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/guests?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGuests(data.data?.guests || [])
      } else {
        await showError('Error al cargar', 'No se pudieron cargar los huéspedes')
      }
    } catch (err) {
      console.error('Error loading guests:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadPropertiesAndRooms = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const [propertiesRes, roomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/properties?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/rooms?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (propertiesRes.ok) {
        const data = await propertiesRes.json()
        setProperties(data.data?.properties || [])
      }

      if (roomsRes.ok) {
        const data = await roomsRes.json()
        setRooms(data.data?.rooms || [])
      }
    } catch (err) {
      console.error('Error loading properties and rooms:', err)
    }
  }, [])

  React.useEffect(() => {
    loadGuests()
    loadPropertiesAndRooms()
  }, [])

  const handleReserve = (guestId: string) => {
    setSelectedGuestForReservation(guestId)
    setIsReservationDialogOpen(true)
  }

  const handleDelete = async (guestId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar huésped?',
      text: 'Esta acción no se puede deshacer. El huésped será eliminado permanentemente.',
    })

    if (!confirmed) return

    showLoading('Eliminando huésped...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/guests/${guestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        await showSuccess('Huésped eliminado', 'El huésped ha sido eliminado exitosamente')
        loadGuests()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar el huésped')
      }
    } catch (err) {
      close()
      console.error('Error deleting guest:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const handleToggleVIP = async (guestId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    const confirmed = await confirmDelete({
      title: newStatus ? '¿Marcar como VIP?' : '¿Remover estatus VIP?',
      text: newStatus 
        ? 'El huésped será marcado como VIP y recibirá beneficios especiales.'
        : 'Se removerá el estatus VIP del huésped.',
      confirmButtonText: newStatus ? 'Sí, marcar VIP' : 'Sí, remover',
    })

    if (!confirmed) return

    showLoading('Actualizando estatus...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/guests/${guestId}/vip`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vipStatus: newStatus })
      })

      close()

      if (response.ok) {
        await showSuccess(
          'Estatus actualizado', 
          newStatus ? 'Huésped marcado como VIP' : 'Estatus VIP removido'
        )
        loadGuests()
      } else {
        const data = await response.json()
        await showError('Error al actualizar', data.message || 'No se pudo actualizar el estatus')
      }
    } catch (err) {
      close()
      console.error('Error updating VIP status:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const filteredGuests = guests.filter((guest) => {
    const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase()
    const email = guest.email?.toLowerCase() || ''
    const phone = guest.phone.toLowerCase()
    
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase())

    const matchesVIP = 
      filterVIP === "all" || 
      (filterVIP === "vip" && guest.vipStatus) ||
      (filterVIP === "regular" && !guest.vipStatus)

    return matchesSearch && matchesVIP
  })

  const stats = {
    total: guests.length,
    vip: guests.filter(g => g.vipStatus).length,
    regular: guests.filter(g => !g.vipStatus && !g.blacklisted).length,
    blacklisted: guests.filter(g => g.blacklisted).length,
    totalStays: guests.reduce((sum, g) => sum + g.totalStays, 0),
    totalRevenue: guests.reduce((sum, g) => sum + g.totalSpent, 0)
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
            <p className="text-muted-foreground">Cargando huéspedes...</p>
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
            <h1 className="text-3xl font-bold tracking-tight" style={{ transition: 'none', animation: 'none' }}>Huéspedes</h1>
            <p className="text-muted-foreground" style={{ transition: 'none', animation: 'none' }}>
              Gestiona la información de tus huéspedes y su historial
            </p>
          </div>
          
          <Button className="gap-2" onClick={() => {
            setEditingGuest(undefined)
            setIsDialogOpen(true)
          }}>
            <Plus className="h-4 w-4" />
            Nuevo Huésped
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email, teléfono o identificación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterVIP} onValueChange={setFilterVIP}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los huéspedes</SelectItem>
              <SelectItem value="vip">VIP ({stats.vip})</SelectItem>
              <SelectItem value="regular">Regular ({stats.regular})</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Más Filtros
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Huéspedes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">VIP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vip}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Estancias Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStays}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {filteredGuests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-[1600px] mx-auto">
            {filteredGuests.map((guest) => (
              <GuestCard 
                key={guest._id} 
                guest={guest}
                onEdit={(g) => {
                  setEditingGuest(g)
                  setIsDialogOpen(true)
                }}
                onDelete={handleDelete}
                onToggleVIP={handleToggleVIP}
                onReserve={handleReserve}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron huéspedes' : 'No tienes huéspedes registrados'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros' 
                    : 'Comienza agregando tu primer huésped para gestionar reservas'}
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Huésped
              </Button>
            </div>
          </Card>
        )}
      </div>

      <GuestFormDialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsDialogOpen(open)
          if (!open) setEditingGuest(undefined)
        }}
        onSuccess={loadGuests}
        guest={editingGuest}
      />

      <ReservationFormDialog
        open={isReservationDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsReservationDialogOpen(open)
          if (!open) setSelectedGuestForReservation(undefined)
        }}
        onSuccess={() => {
          loadGuests()
        }}
        properties={properties}
        rooms={rooms}
        guests={guests.map(g => ({ _id: g._id, firstName: g.firstName, lastName: g.lastName, email: g.email || '' }))}
        preselectedGuestId={selectedGuestForReservation}
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
