"use client"

import * as React from "react"
import { Plus, Search, Filter, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Reservation {
  id: string
  confirmationNumber: string
  guest: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  property: {
    name: string
  }
  room: {
    nameOrNumber: string
    type: string
  }
  dates: {
    checkInDate: string
    checkOutDate: string
    nights: number
  }
  guests: {
    adults: number
    children: number
  }
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  pricing: {
    totalPrice: number
    currency: string
  }
  paymentStatus: 'pending' | 'partial' | 'paid'
  source: string
  createdAt: string
}

function StatusBadge({ status }: { status: Reservation['status'] }) {
  const config = {
    pending: { label: 'Pendiente', variant: 'warning' as const, icon: Clock },
    confirmed: { label: 'Confirmada', variant: 'success' as const, icon: CheckCircle },
    checked_in: { label: 'Check-in', variant: 'info' as const, icon: User },
    checked_out: { label: 'Check-out', variant: 'secondary' as const, icon: CheckCircle },
    cancelled: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle }
  }

  const { label, variant, icon: Icon } = config[status]

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

function PaymentStatusBadge({ status }: { status: Reservation['paymentStatus'] }) {
  const config = {
    pending: { label: 'Pendiente', variant: 'warning' as const },
    partial: { label: 'Parcial', variant: 'info' as const },
    paid: { label: 'Pagado', variant: 'success' as const }
  }

  const { label, variant } = config[status]

  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  )
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const handleCheckIn = () => {
    // TODO: Implement check-in logic with SweetAlert2 confirmation
    console.log('Check-in reservation:', reservation.id)
  }

  const handleCheckOut = () => {
    // TODO: Implement check-out logic with SweetAlert2 confirmation
    console.log('Check-out reservation:', reservation.id)
  }

  const handleCancel = () => {
    // TODO: Implement cancellation logic with SweetAlert2 confirmation
    console.log('Cancel reservation:', reservation.id)
  }

  return (
    <Card className="hover:shadow-elegant transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {reservation.guest.firstName} {reservation.guest.lastName}
              </CardTitle>
              <StatusBadge status={reservation.status} />
              <PaymentStatusBadge status={reservation.paymentStatus} />
            </div>
            <CardDescription className="space-y-1">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">#{reservation.confirmationNumber}</span>
                <span>•</span>
                <span>{reservation.room.nameOrNumber} ({reservation.room.type})</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {reservation.guest.email} • {reservation.guest.phone}
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dates and Duration */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Check-in</p>
            <p className="font-medium">{formatDate(reservation.dates.checkInDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Check-out</p>
            <p className="font-medium">{formatDate(reservation.dates.checkOutDate)}</p>
          </div>
        </div>

        {/* Guests and Pricing */}
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-muted-foreground">Huéspedes: </span>
            <span className="font-medium">
              {reservation.guests.adults} adulto{reservation.guests.adults !== 1 ? 's' : ''}
              {reservation.guests.children > 0 && `, ${reservation.guests.children} niño${reservation.guests.children !== 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(reservation.pricing.totalPrice)}</p>
            <p className="text-xs text-muted-foreground">{reservation.dates.nights} noche{reservation.dates.nights !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {reservation.status === 'confirmed' && (
            <Button size="sm" onClick={handleCheckIn} className="flex-1">
              Check-in
            </Button>
          )}
          {reservation.status === 'checked_in' && (
            <Button size="sm" onClick={handleCheckOut} className="flex-1">
              Check-out
            </Button>
          )}
          {['pending', 'confirmed'].includes(reservation.status) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              className="text-destructive hover:text-destructive"
            >
              Cancelar
            </Button>
          )}
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReservationsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [reservations, setReservations] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userData, setUserData] = React.useState<any>(null)
  const [tenantData, setTenantData] = React.useState<any>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isMounted) return

    const loadReservations = async () => {
      try {
        setIsLoading(true)
        
        const token = localStorage.getItem('auth_token')
        const user = localStorage.getItem('user_data')
        const tenant = localStorage.getItem('tenant_data')
        
        if (user) setUserData(JSON.parse(user))
        if (tenant) setTenantData(JSON.parse(tenant))
        
        if (!token) {
          window.location.href = '/auth/login'
          return
        }

        const response = await fetch('http://localhost:3000/api/reservations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const data = await response.json()
          setReservations(data.data || [])
        } else if (response.status === 401) {
          localStorage.clear()
          window.location.href = '/auth/login'
        } else {
          setError('Error al cargar las reservas')
        }
      } catch (err) {
        console.error('Error loading reservations:', err)
        setError('Error de conexión con el servidor')
      } finally {
        setIsLoading(false)
      }
    }

    loadReservations()
  }, [isMounted])

  if (isLoading) {
    return (
      <MainLayout 
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando reservas...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const filteredReservations = reservations.filter((reservation: any) => {
    const guestName = `${reservation.guestId?.firstName || ''} ${reservation.guestId?.lastName || ''}`.toLowerCase()
    const confirmationNumber = reservation.confirmationNumber?.toLowerCase() || ''
    const roomNumber = reservation.roomId?.nameOrNumber?.toLowerCase() || ''
    
    const matchesSearch = 
      guestName.includes(searchTerm.toLowerCase()) ||
      confirmationNumber.includes(searchTerm.toLowerCase()) ||
      roomNumber.includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    return reservations.reduce((acc: any, reservation: any) => {
      acc[reservation.status] = (acc[reservation.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const statusCounts = getStatusCounts()

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
            <p className="text-muted-foreground">
              Gestiona todas las reservas y procesos de check-in/check-out
            </p>
          </div>
          
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Reserva
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por huésped, confirmación o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente ({statusCounts.pending || 0})</option>
            <option value="confirmed">Confirmada ({statusCounts.confirmed || 0})</option>
            <option value="checked_in">Check-in ({statusCounts.checked_in || 0})</option>
            <option value="checked_out">Check-out ({statusCounts.checked_out || 0})</option>
            <option value="cancelled">Cancelada ({statusCounts.cancelled || 0})</option>
          </select>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Más Filtros
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Confirmadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.confirmed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">En Hotel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.checked_in || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.checked_out || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Grid or Empty State */}
        {filteredReservations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReservations.map((reservation: any) => (
              <ReservationCard 
                key={reservation._id || reservation.id} 
                reservation={{
                  id: reservation._id,
                  confirmationNumber: reservation.confirmationNumber,
                  guest: {
                    firstName: reservation.guestId?.firstName || '',
                    lastName: reservation.guestId?.lastName || '',
                    email: reservation.guestId?.email || '',
                    phone: reservation.guestId?.phone || ''
                  },
                  property: { name: reservation.propertyId?.name || 'N/A' },
                  room: { 
                    nameOrNumber: reservation.roomId?.nameOrNumber || 'N/A', 
                    type: reservation.roomId?.type || 'N/A' 
                  },
                  dates: {
                    checkInDate: reservation.dates?.checkInDate || '',
                    checkOutDate: reservation.dates?.checkOutDate || '',
                    nights: reservation.dates?.nights || 0
                  },
                  guests: {
                    adults: reservation.guests?.adults || 0,
                    children: reservation.guests?.children || 0
                  },
                  status: reservation.status,
                  pricing: {
                    totalPrice: reservation.pricing?.totalPrice || 0,
                    currency: reservation.pricing?.currency || 'USD'
                  },
                  paymentStatus: reservation.paymentStatus || 'pending',
                  source: reservation.source || 'direct',
                  createdAt: reservation.createdAt
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron reservas' : 'No tienes reservas registradas'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros' 
                    : 'Comienza creando tu primera reserva para gestionar check-ins y check-outs'}
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Reserva
              </Button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
