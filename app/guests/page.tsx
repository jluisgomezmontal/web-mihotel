"use client"

import * as React from "react"
import { Plus, Search, Filter, User, Edit, Trash2, Star, Ban, Phone, Mail, CreditCard, MapPin, Calendar, UserCheck, Sparkles, ArrowRight, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { formatDate, cn } from "@/lib/utils"
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
  
  const statusConfig = {
    blacklisted: { barColor: 'bg-[var(--guest-blacklisted)]' },
    vip: { barColor: 'bg-[var(--loyalty-vip)]' },
    gold: { barColor: 'bg-[var(--loyalty-gold)]' },
    silver: { barColor: 'bg-[var(--loyalty-silver)]' },
    bronze: { barColor: 'bg-[var(--loyalty-bronze)]' }
  }
  
  const currentStatus = guest.blacklisted ? 'blacklisted' : guest.vipStatus ? 'vip' : loyaltyLevel
  
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Gradiente decorativo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status Indicator Bar */}
      <div className={cn("h-1.5 w-full transition-all duration-500", statusConfig[currentStatus].barColor)} />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Guest Name & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold">
                  {guest.firstName} {guest.lastName}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {guest.vipStatus && (
                    <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", "text-[var(--loyalty-vip)]", "bg-[var(--loyalty-vip-light)]", "border-[var(--loyalty-vip)]/20")}>
                      <Star className="h-3 w-3 fill-current" />
                      VIP
                    </Badge>
                  )}
                  {guest.blacklisted && (
                    <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", "text-[var(--guest-blacklisted)]", "bg-[var(--guest-blacklisted-light)]", "border-[var(--guest-blacklisted)]/20")}>
                      <Ban className="h-3 w-3" />
                      Bloqueado
                    </Badge>
                  )}
                  {!guest.vipStatus && !guest.blacklisted && (
                    <Badge className={cn(
                      "gap-1.5 text-xs font-semibold px-2.5 py-1 border",
                      loyaltyLevel === 'gold' ? "text-[var(--loyalty-gold)] bg-[var(--loyalty-gold-light)] border-[var(--loyalty-gold)]/20" :
                      loyaltyLevel === 'silver' ? "text-[var(--loyalty-silver)] bg-[var(--loyalty-silver-light)] border-[var(--loyalty-silver)]/20" :
                      "text-[var(--loyalty-bronze)] bg-[var(--loyalty-bronze-light)] border-[var(--loyalty-bronze)]/20"
                    )}>
                      <Award className="h-3 w-3" />
                      {loyaltyLevel === 'gold' ? 'Gold' : loyaltyLevel === 'silver' ? 'Silver' : 'Bronze'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2.5 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
                  <span className="text-sm font-semibold truncate">{guest.phone}</span>
                </div>
              </div>
              {guest.email && (
                <div className="p-2.5 bg-gradient-to-br from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[var(--dashboard-success)]" />
                    <span className="text-sm font-semibold truncate">{guest.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Additional Info */}
        {(guest.nationality || guest.emergencyContact?.name) && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-gradient-to-br from-[var(--surface-elevated)] to-transparent border border-[var(--border-subtle)] rounded-xl">
            {guest.nationality && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nacionalidad</p>
                </div>
                <p className="font-semibold text-sm">{guest.nationality}</p>
              </div>
            )}
            {guest.emergencyContact?.name && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[var(--dashboard-danger)]" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Emergencia</p>
                </div>
                <p className="font-semibold text-sm">{guest.emergencyContact.name}</p>
                {guest.emergencyContact.phone && (
                  <p className="text-xs text-muted-foreground">{guest.emergencyContact.phone}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-xl text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estancias</p>
            </div>
            <p className="font-bold text-2xl text-[var(--dashboard-info)]">{guest.totalStays}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-xl text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-[var(--dashboard-success)]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gastado</p>
            </div>
            <p className="font-bold text-lg text-[var(--dashboard-success)]">${guest.totalSpent.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-[var(--loyalty-vip-light)] to-transparent border border-[var(--loyalty-vip)]/20 rounded-xl text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-1">
              <Award className="h-3.5 w-3.5 text-[var(--loyalty-vip)]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Puntos</p>
            </div>
            <p className="font-bold text-2xl text-[var(--loyalty-vip)]">{guest.loyaltyPoints}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button 
            variant="default" 
            size="default" 
            onClick={() => onReserve(guest._id)}
            className="group w-full font-semibold hover:shadow-lg transition-all"
          >
            <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Crear Reserva
            <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(guest)}
              className="group flex-1 font-semibold hover:border-primary/50 transition-all"
            >
              <Edit className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Editar
            </Button>
            <Button 
              variant={guest.vipStatus ? "default" : "outline"}
              size="sm" 
              onClick={() => onToggleVIP(guest._id, guest.vipStatus)}
              className={cn(
                "group flex-1 font-semibold transition-all",
                guest.vipStatus ? "bg-[var(--loyalty-vip)] hover:bg-[var(--loyalty-vip)]/90 hover:shadow-lg" : "hover:border-[var(--loyalty-vip)]/50"
              )}
            >
              <Star className={cn("h-4 w-4 mr-1 group-hover:scale-110 transition-transform", guest.vipStatus && "fill-current")} />
              {guest.vipStatus ? 'VIP' : 'VIP'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(guest._id)}
              className="group text-[var(--dashboard-danger)] hover:text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger)]/10 hover:border-[var(--dashboard-danger)]/50 transition-all"
            >
              <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
                Huéspedes
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona la información de tus huéspedes y su historial
            </p>
          </div>
          
          <Button 
            className="group gap-2 hover:shadow-lg transition-all duration-300" 
            onClick={() => {
              setEditingGuest(undefined)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nuevo Huésped
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 border-2 focus:border-primary/50 transition-colors"
            />
          </div>
          
          <Select value={filterVIP} onValueChange={setFilterVIP}>
            <SelectTrigger className="w-[180px] h-11 border-2">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los huéspedes</SelectItem>
              <SelectItem value="vip">VIP ({stats.vip})</SelectItem>
              <SelectItem value="regular">Regular ({stats.regular})</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 h-11 border-2">
            <Filter className="h-4 w-4" />
            Más Filtros
          </Button>
        </div>

        {/* Stats Cards with modern design */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Huéspedes</CardTitle>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <User className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">registrados en total</p>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--loyalty-vip)]/10 to-[var(--loyalty-vip)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">VIP</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--loyalty-vip-light)] text-[var(--loyalty-vip)] group-hover:scale-110 transition-transform">
                <Star className="h-5 w-5 fill-current" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--loyalty-vip)]">{stats.vip}</div>
              <p className="text-xs text-muted-foreground mt-1">huéspedes premium</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Estancias Totales</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)] group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-info)]">{stats.totalStays}</div>
              <p className="text-xs text-muted-foreground mt-1">visitas acumuladas</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--dashboard-success-light)] text-[var(--dashboard-success)] group-hover:scale-110 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-success)]">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">generados por huéspedes</p>
            </CardContent>
          </Card>
        </div>

        {/* Guests Grid */}
        {filteredGuests.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
          <Card className="border-none shadow-md p-16">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <User className="relative mx-auto h-20 w-20 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {searchTerm || filterVIP !== 'all' ? 'No se encontraron huéspedes' : 'No tienes huéspedes registrados'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchTerm || filterVIP !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
                    : 'Comienza agregando tu primer huésped para gestionar reservas y construir tu base de clientes'}
                </p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="group gap-2 hover:shadow-lg transition-all"
                size="lg"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
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
