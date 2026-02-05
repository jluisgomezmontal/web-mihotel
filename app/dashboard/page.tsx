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
  XCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Plus,
  UserPlus
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { useDashboard } from "@/contexts/DashboardContext"
import { API_BASE_URL } from "@/lib/api-config"
import { AuthService } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { ReservationFormDialog } from "@/components/forms/reservation-form-dialog"
import { GuestFormDialog } from "@/components/forms/guest-form-dialog"

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger'
  trend?: 'up' | 'down' | 'neutral'
}

function KPICard({ title, value, change, icon: Icon, description, variant = 'default', trend }: KPICardProps) {
  const getVariantStyles = () => {
    const baseStyles = "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    
    switch (variant) {
      case 'success':
        return `${baseStyles} border-[var(--dashboard-success)]/20 bg-gradient-to-br from-[var(--gradient-success-from)]/10 to-[var(--gradient-success-to)]/5 hover:from-[var(--gradient-success-from)]/15 hover:to-[var(--gradient-success-to)]/10`
      case 'warning':
        return `${baseStyles} border-[var(--dashboard-warning)]/20 bg-gradient-to-br from-[var(--gradient-warning-from)]/10 to-[var(--gradient-warning-to)]/5 hover:from-[var(--gradient-warning-from)]/15 hover:to-[var(--gradient-warning-to)]/10`
      case 'info':
        return `${baseStyles} border-[var(--dashboard-info)]/20 bg-gradient-to-br from-[var(--gradient-info-from)]/10 to-[var(--gradient-info-to)]/5 hover:from-[var(--gradient-info-from)]/15 hover:to-[var(--gradient-info-to)]/10`
      case 'danger':
        return `${baseStyles} border-[var(--dashboard-danger)]/20 bg-gradient-to-br from-[var(--dashboard-danger)]/10 to-[var(--dashboard-danger-light)]/5 hover:from-[var(--dashboard-danger)]/15 hover:to-[var(--dashboard-danger-light)]/10`
      default:
        return `${baseStyles} bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5 hover:from-[var(--gradient-primary-from)]/15 hover:to-[var(--gradient-primary-to)]/10`
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-[var(--dashboard-success)] bg-[var(--dashboard-success-light)] group-hover:scale-110'
      case 'warning':
        return 'text-[var(--dashboard-warning)] bg-[var(--dashboard-warning-light)] group-hover:scale-110'
      case 'info':
        return 'text-[var(--dashboard-info)] bg-[var(--dashboard-info-light)] group-hover:scale-110'
      case 'danger':
        return 'text-[var(--dashboard-danger)] bg-[var(--dashboard-danger-light)] group-hover:scale-110'
      default:
        return 'text-primary bg-primary/10 group-hover:scale-110'
    }
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="h-3 w-3" />
    if (trend === 'down') return <ArrowDownRight className="h-3 w-3" />
    return <Activity className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-[var(--dashboard-success)]'
    if (trend === 'down') return 'text-[var(--dashboard-danger)]'
    return 'text-muted-foreground'
  }

  return (
    <Card className={getVariantStyles()}>
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2.5 rounded-xl transition-all duration-300",
          getIconStyles()
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {(change !== undefined || description) && (
          <div className="flex items-center justify-between text-xs">
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 font-medium px-2 py-1 rounded-md bg-background/50",
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span>{change > 0 ? '+' : ''}{change}%</span>
              </div>
            )}
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
        return { 
          icon: Clock, 
          color: 'text-[var(--dashboard-warning)]', 
          bg: 'bg-[var(--dashboard-warning-light)]',
          border: 'border-[var(--dashboard-warning)]/20',
          label: 'Pendiente' 
        }
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          color: 'text-[var(--dashboard-success)]', 
          bg: 'bg-[var(--dashboard-success-light)]',
          border: 'border-[var(--dashboard-success)]/20',
          label: 'Confirmada' 
        }
      case 'checked_in':
        return { 
          icon: CheckCircle, 
          color: 'text-[var(--dashboard-info)]', 
          bg: 'bg-[var(--dashboard-info-light)]',
          border: 'border-[var(--dashboard-info)]/20',
          label: 'Check-in' 
        }
      case 'checked_out':
        return { 
          icon: XCircle, 
          color: 'text-muted-foreground', 
          bg: 'bg-muted',
          border: 'border-border',
          label: 'Check-out' 
        }
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-muted-foreground', 
          bg: 'bg-muted',
          border: 'border-border',
          label: 'Desconocido' 
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="group relative flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all duration-300 hover:border-primary/30 bg-card hover:bg-[var(--card-hover)]">
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      <div className="relative flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground">{guest}</p>
          <Badge variant="secondary" className="text-xs font-medium">
            <Bed className="h-3 w-3 mr-1" />
            {room}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{checkIn} - {checkOut}</span>
          <span className="text-xs">•</span>
          <span className="font-medium">{nights} noche{nights !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="relative flex items-center gap-4">
        <div className="text-right space-y-1">
          <p className="text-lg font-bold text-foreground">${amount.toLocaleString()}</p>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium border",
              statusConfig.color,
              statusConfig.bg,
              statusConfig.border
            )}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { properties, reservations, rooms, guests, userData, tenantData, isLoading, error, refreshAll } = useDashboard()
  const [dashboardMetrics, setDashboardMetrics] = React.useState<any>(null)
  const [metricsLoading, setMetricsLoading] = React.useState(true)
  const [reservationDialogOpen, setReservationDialogOpen] = React.useState(false)
  const [guestDialogOpen, setGuestDialogOpen] = React.useState(false)

  // Fetch dashboard metrics from backend
  const fetchDashboardMetrics = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/reports/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardMetrics(data.data)
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err)
    } finally {
      setMetricsLoading(false)
    }
  }, [])

  // Refrescar datos cada vez que se navega al dashboard
  React.useEffect(() => {
    refreshAll()
    fetchDashboardMetrics()
  }, [])

  // Manual refresh handler
  const handleRefresh = async () => {
    setMetricsLoading(true)
    await Promise.all([refreshAll(), fetchDashboardMetrics()])
  }

  // Filter today's reservations (check-ins and check-outs)
  const todaysReservations = React.useMemo(() => {
    const reservationsArray = Array.isArray(reservations) ? reservations : []
    const today = new Date().toISOString().split('T')[0]
    
    return reservationsArray.filter(r => {
      if (!r.dates?.checkInDate && !r.dates?.checkOutDate) return false
      
      const checkInDate = r.dates?.checkInDate ? new Date(r.dates.checkInDate).toISOString().split('T')[0] : null
      const checkOutDate = r.dates?.checkOutDate ? new Date(r.dates.checkOutDate).toISOString().split('T')[0] : null
      
      return checkInDate === today || checkOutDate === today
    }).sort((a, b) => {
      // Sort by check-in date first
      const aCheckIn = a.dates?.checkInDate ? new Date(a.dates.checkInDate).getTime() : 0
      const bCheckIn = b.dates?.checkInDate ? new Date(b.dates.checkInDate).getTime() : 0
      return aCheckIn - bCheckIn
    })
  }, [reservations])

  // Calculate KPIs from real data combining backend metrics and context data
  const kpis = React.useMemo(() => {
    const roomsArray = Array.isArray(rooms) ? rooms : []
    const reservationsArray = Array.isArray(reservations) ? reservations : []

    // Use backend metrics if available, otherwise calculate from context
    if (dashboardMetrics) {
      // Count rooms by status from context
      const cleaningRooms = roomsArray.filter(r => r.status === 'cleaning').length
      const maintenanceRooms = roomsArray.filter(r => r.status === 'maintenance').length
      
      // Calculate today's revenue from reservations
      const today = new Date().toISOString().split('T')[0]
      const todayRevenue = reservationsArray
        .filter(r => {
          if (!r.dates?.checkInDate) return false
          const checkInDate = new Date(r.dates.checkInDate).toISOString().split('T')[0]
          return checkInDate === today
        })
        .reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0)

      const averageRate = reservationsArray.length > 0
        ? Math.round(reservationsArray.reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0) / reservationsArray.length)
        : 0

      return {
        occupancyRate: dashboardMetrics.occupancyRate || 0,
        totalRooms: dashboardMetrics.totalRooms || 0,
        availableRooms: dashboardMetrics.availableRooms || 0,
        occupiedRooms: dashboardMetrics.occupiedRooms || 0,
        cleaningRooms,
        maintenanceRooms,
        todayCheckIns: dashboardMetrics.todayCheckIns || 0,
        todayCheckOuts: dashboardMetrics.todayCheckOuts || 0,
        totalRevenue: todayRevenue,
        monthlyRevenue: dashboardMetrics.monthlyRevenue || 0,
        averageRate,
        pendingReservations: dashboardMetrics.pendingReservations || 0,
        activeGuests: dashboardMetrics.activeGuests || 0
      }
    }

    // Fallback to context data if backend metrics not available
    const propertiesArray = Array.isArray(properties) ? properties : []
    const totalRooms = propertiesArray.reduce((sum, prop) => sum + (prop.totalRooms || 0), 0)
    const availableRooms = propertiesArray.reduce((sum, prop) => sum + (prop.availableRooms || 0), 0)
    const occupiedRooms = propertiesArray.reduce((sum, prop) => sum + (prop.occupiedRooms || 0), 0)
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
    
    const today = new Date().toISOString().split('T')[0]
    const todayCheckIns = reservationsArray.filter(r => {
      if (!r.dates?.checkInDate) return false
      const checkInDate = new Date(r.dates.checkInDate).toISOString().split('T')[0]
      return checkInDate === today
    }).length
    
    const todayCheckOuts = reservationsArray.filter(r => {
      if (!r.dates?.checkOutDate) return false
      const checkOutDate = new Date(r.dates.checkOutDate).toISOString().split('T')[0]
      return checkOutDate === today
    }).length

    const monthlyRevenue = reservationsArray
      .filter(r => {
        if (!r.dates?.checkInDate) return false
        const checkIn = new Date(r.dates.checkInDate)
        const now = new Date()
        return checkIn.getMonth() === now.getMonth() && 
               checkIn.getFullYear() === now.getFullYear()
      })
      .reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0)

    const todayRevenue = reservationsArray
      .filter(r => {
        if (!r.dates?.checkInDate) return false
        const checkInDate = new Date(r.dates.checkInDate).toISOString().split('T')[0]
        return checkInDate === today
      })
      .reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0)

    const averageRate = reservationsArray.length > 0
      ? Math.round(reservationsArray.reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0) / reservationsArray.length)
      : 0

    const cleaningRooms = roomsArray.filter(r => r.status === 'cleaning').length
    const maintenanceRooms = roomsArray.filter(r => r.status === 'maintenance').length
    const pendingReservations = reservationsArray.filter(r => r.status === 'pending').length
    const activeGuests = reservationsArray.filter(r => r.status === 'checked_in').length
    
    return {
      occupancyRate,
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      maintenanceRooms,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue: todayRevenue,
      monthlyRevenue,
      averageRate,
      pendingReservations,
      activeGuests
    }
  }, [properties, reservations, rooms, dashboardMetrics])

  // Show loading state with skeleton
  if (isLoading || metricsLoading) {
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
      user={userData || { name: "Cargando...", email: "", role: "admin" }}
      tenant={tenantData || { name: "Cargando...", type: "hotel" }}
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={handleRefresh}
              disabled={metricsLoading}
              className="group hover:border-primary/50 transition-all duration-300"
            >
              <RefreshCw className={cn(
                "mr-2 h-4 w-4 transition-transform duration-300",
                metricsLoading ? 'animate-spin' : 'group-hover:rotate-180'
              )} />
              Actualizar
            </Button>
          </div>

          {/* Quick Actions - Header Area */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setReservationDialogOpen(true)}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className={cn(
                "h-5 w-5 text-primary transition-transform duration-300",
                isLoading ? 'animate-spin' : 'group-hover:rotate-90'
              )} />
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">Nueva Reserva</span>
            </button>

            <button
              onClick={() => setGuestDialogOpen(true)}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--dashboard-info)]/20 bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5 hover:from-[var(--dashboard-info)]/20 hover:to-[var(--dashboard-info)]/10 hover:border-[var(--dashboard-info)]/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className={cn(
                "h-5 w-5 text-[var(--dashboard-info)] transition-transform duration-300",
                isLoading ? 'animate-spin' : 'group-hover:rotate-90'
              )} />
              <span className="font-semibold text-foreground group-hover:text-[var(--dashboard-info)] transition-colors">Registrar Huésped</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Ocupación"
            value={`${kpis.occupancyRate}%`}
            icon={Building2}
            description={`${kpis.occupiedRooms}/${kpis.totalRooms} habitaciones`}
            variant={kpis.occupancyRate >= 80 ? "success" : kpis.occupancyRate >= 50 ? "warning" : "info"}
            trend={kpis.occupancyRate >= 70 ? "up" : kpis.occupancyRate >= 40 ? "neutral" : "down"}
            change={kpis.occupancyRate >= 80 ? 12 : kpis.occupancyRate >= 50 ? 5 : -3}
          />
          <KPICard
            title="Habitaciones Disponibles"
            value={kpis.availableRooms}
            icon={Bed}
            description={`${kpis.totalRooms} total`}
            variant="info"
            trend="neutral"
          />
          <KPICard
            title="Check-ins Hoy"
            value={kpis.todayCheckIns}
            icon={Calendar}
            description={`${kpis.todayCheckOuts} check-outs`}
            variant="warning"
            trend={kpis.todayCheckIns > 0 ? "up" : "neutral"}
          />
          <KPICard
            title="Ingresos del Mes"
            value={`$${kpis.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="acumulado mensual"
            variant="success"
            trend="up"
            change={8.5}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Reservations */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Reservas de Hoy
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Check-ins, check-outs y reservas pendientes
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
                    {todaysReservations.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaysReservations.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {todaysReservations.slice(0, 5).map((reservation: any, index: number) => (
                        <ReservationItem
                          key={reservation._id || index}
                          guest={`${reservation.guestId?.firstName || ''} ${reservation.guestId?.lastName || ''}`}
                          room={reservation.roomId?.nameOrNumber || 'N/A'}
                          checkIn={new Date(reservation.dates?.checkInDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                          checkOut={new Date(reservation.dates?.checkOutDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                          status={reservation.status}
                          nights={reservation.dates?.nights || 0}
                          amount={reservation.pricing?.totalPrice || 0}
                        />
                      ))}
                    </div>
                    {todaysReservations.length > 5 && (
                      <div className="flex items-center justify-center py-3 border-t">
                        <Badge variant="outline" className="text-xs">
                          +{todaysReservations.length - 5} reservas más para hoy
                        </Badge>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <Button 
                        variant="ghost" 
                        className="w-full group hover:bg-primary/5 transition-colors duration-300" 
                        onClick={() => window.location.href = '/reservations'}
                      >
                        <span className="flex items-center gap-2">
                          Ver Todas las Reservas
                          <Badge variant="secondary" className="group-hover:bg-primary/10 transition-colors">
                            {reservations.length}
                          </Badge>
                        </span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 px-4">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                      <Calendar className="relative mx-auto h-16 w-16 text-primary/40" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No hay reservas para hoy</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      No tienes check-ins o check-outs programados para hoy
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/reservations'}
                      className="group"
                    >
                      <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      Ver Todas las Reservas
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-4 lg:space-y-6">
            {/* Revenue Summary */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Resumen de Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5 border border-[var(--dashboard-success)]/20">
                  <span className="text-sm font-medium">Hoy</span>
                  <span className="font-bold text-[var(--dashboard-success)]">${kpis.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <span className="text-sm font-medium">Este mes</span>
                  <span className="font-bold text-primary">${kpis.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border mt-4">
                  <span className="text-sm font-medium">Tarifa promedio</span>
                  <span className="font-semibold">${kpis.averageRate.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Huéspedes activos
                  </span>
                  <Badge variant="secondary" className="font-bold">{kpis.activeGuests}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--dashboard-warning-light)] border border-[var(--dashboard-warning)]/20">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Reservas pendientes
                  </span>
                  <Badge variant="outline" className="font-bold text-[var(--dashboard-warning)] bg-background border-[var(--dashboard-warning)]/30">
                    {kpis.pendingReservations}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReservationFormDialog
        open={reservationDialogOpen}
        onOpenChange={setReservationDialogOpen}
        onSuccess={() => {
          setReservationDialogOpen(false)
          refreshAll()
          fetchDashboardMetrics()
        }}
        properties={properties}
        rooms={rooms}
        guests={guests}
      />

      <GuestFormDialog
        open={guestDialogOpen}
        onOpenChange={setGuestDialogOpen}
        onSuccess={() => {
          setGuestDialogOpen(false)
          refreshAll()
        }}
      />
    </MainLayout>
  )
}
