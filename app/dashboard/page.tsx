"use client"

import * as React from "react"
import { 
  Building2, 
  Bed, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

function KPICard({ title, value, change, icon: Icon, description, variant = 'default' }: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-chart-1/20 bg-chart-1/5'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
      case 'destructive':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
      default:
        return ''
    }
  }

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change !== undefined || description) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            {change !== undefined && (
              <span className={`flex items-center ${
                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                <TrendingUp className="mr-1 h-3 w-3" />
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ReservationItemProps {
  guest: string
  room: string
  checkIn: string
  checkOut: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out'
  nights: number
  amount: number
}

function ReservationItem({ guest, room, checkIn, checkOut, status, nights, amount }: ReservationItemProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', label: 'Pendiente' }
      case 'confirmed':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', label: 'Confirmada' }
      case 'checked_in':
        return { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20', label: 'Check-in' }
      case 'checked_out':
        return { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', label: 'Check-out' }
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', label: 'Desconocido' }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{guest}</p>
          <Badge variant="outline" className="text-xs">
            {room}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {checkIn} - {checkOut} • {nights} noche{nights !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium">${amount.toLocaleString()}</p>
          <div className={`flex items-center gap-1 text-xs ${statusConfig.color}`}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [userData, setUserData] = React.useState<any>(null)
  const [tenantData, setTenantData] = React.useState<any>(null)
  const [properties, setProperties] = React.useState<any[]>([])
  const [reservations, setReservations] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isMounted) return

    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Get user and tenant data from localStorage
        const user = localStorage.getItem('user_data')
        const tenant = localStorage.getItem('tenant_data')
        const token = localStorage.getItem('auth_token')
        
        if (user) setUserData(JSON.parse(user))
        if (tenant) setTenantData(JSON.parse(tenant))

        // Fetch real data from API
        if (token) {
            try {
              // Fetch properties
              const propertiesRes = await fetch('http://localhost:3000/api/properties', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              })
              
              if (propertiesRes.ok) {
                const propertiesData = await propertiesRes.json()
                setProperties(propertiesData.data || [])
              }

              // Fetch today's reservations
              const today = new Date().toISOString().split('T')[0]
              const reservationsRes = await fetch(`http://localhost:3000/api/reservations?checkInDate=${today}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              })
              
              if (reservationsRes.ok) {
                const reservationsData = await reservationsRes.json()
                setReservations(reservationsData.data || [])
              }
            } catch (apiError) {
              console.error('Error fetching dashboard data:', apiError)
            }
        }
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [isMounted])

  // Calculate KPIs from real data
  const kpis = React.useMemo(() => {
    if (!Array.isArray(properties) || !Array.isArray(reservations)) {
      return {
        occupancyRate: 0,
        totalRooms: 0,
        availableRooms: 0,
        todayCheckIns: 0,
        todayCheckOuts: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        averageRate: 0
      }
    }

    const totalRooms = properties.reduce((sum, prop) => sum + (prop.totalRooms || 0), 0)
    const occupiedRooms = properties.reduce((sum, prop) => sum + (prop.occupiedRooms || 0), 0)
    const availableRooms = totalRooms - occupiedRooms
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
    
    const todayCheckIns = reservations.filter(r => r.status === 'confirmed').length
    const todayCheckOuts = reservations.filter(r => r.status === 'checked_in').length
    
    return {
      occupancyRate,
      totalRooms,
      availableRooms,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageRate: 0
    }
  }, [properties, reservations])

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout 
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando datos del dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Cargando...", email: "", role: "admin" }}
      tenant={tenantData || { name: "Cargando...", type: "hotel" }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general de tu hotel - {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Ocupación"
            value={`${kpis.occupancyRate}%`}
            change={5.2}
            icon={Building2}
            description="vs mes pasado"
            variant="success"
          />
          <KPICard
            title="Habitaciones Disponibles"
            value={kpis.availableRooms}
            icon={Bed}
            description={`de ${kpis.totalRooms} total`}
          />
          <KPICard
            title="Check-ins Hoy"
            value={kpis.todayCheckIns}
            icon={Calendar}
            description="llegadas programadas"
            variant="warning"
          />
          <KPICard
            title="Ingresos del Mes"
            value={`$${kpis.monthlyRevenue.toLocaleString()}`}
            change={12.3}
            icon={DollarSign}
            description="vs mes pasado"
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Reservations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reservas de Hoy</CardTitle>
                <CardDescription>
                  Check-ins, check-outs y reservas pendientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservations.length > 0 ? (
                  <>
                    {reservations.map((reservation: any, index: number) => (
                      <ReservationItem
                        key={reservation._id || index}
                        guest={`${reservation.guestId?.firstName || ''} ${reservation.guestId?.lastName || ''}`}
                        room={reservation.roomId?.nameOrNumber || 'N/A'}
                        checkIn={new Date(reservation.dates?.checkInDate).toLocaleDateString('es-ES')}
                        checkOut={new Date(reservation.dates?.checkOutDate).toLocaleDateString('es-ES')}
                        status={reservation.status}
                        nights={reservation.dates?.nights || 0}
                        amount={reservation.pricing?.totalPrice || 0}
                      />
                    ))}
                    <div className="pt-4">
                      <Button variant="outline" className="w-full" onClick={() => window.location.href = '/reservations'}>
                        Ver Todas las Reservas
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay reservas para hoy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      No tienes check-ins o check-outs programados para hoy
                    </p>
                    <Button onClick={() => window.location.href = '/reservations'}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Todas las Reservas
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Room Status */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de Habitaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ocupadas</span>
                    <span className="font-medium">{kpis.totalRooms - kpis.availableRooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Disponibles</span>
                    <span className="font-medium text-green-600">{kpis.availableRooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Limpieza</span>
                    <span className="font-medium text-yellow-600">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mantenimiento</span>
                    <span className="font-medium text-red-600">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Nueva Reserva
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Registrar Huésped
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bed className="mr-2 h-4 w-4" />
                  Gestionar Habitaciones
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Ingresos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hoy</span>
                  <span className="font-medium">${kpis.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Este mes</span>
                  <span className="font-medium">${kpis.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tarifa promedio</span>
                  <span className="font-medium">${kpis.averageRate}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
