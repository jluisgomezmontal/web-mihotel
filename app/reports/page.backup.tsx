"use client"

import * as React from "react"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Percent,
  FileText,
  Download,
  Filter,
  Bed,
  CreditCard,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/layout/main-layout"
import { PermissionGuard } from "@/components/guards/PermissionGuard"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { AuthService } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { API_BASE_URL } from '@/lib/api-config'
import { useDashboard } from "@/contexts/DashboardContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportData {
  revenue?: any
  occupancy?: any
  guests?: any
  reservations?: any
  dashboard?: any
}

export default function ReportsPage() {
  const [reportData, setReportData] = React.useState<ReportData>({})
  const [isLoading, setIsLoading] = React.useState(true)
  const [dateRange, setDateRange] = React.useState("30")
  const [period, setPeriod] = React.useState("daily")
  const { userData, tenantData, properties } = useDashboard()

  const loadReports = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const token = AuthService.getToken()
      
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(dateRange))
      const endDate = new Date()

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period
      })

      // Fetch all reports in parallel
      const [revenueRes, occupancyRes, guestsRes, reservationsRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/reports/revenue?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/occupancy?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/guests?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/reservations?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const [revenue, occupancy, guests, reservations, dashboard] = await Promise.all([
        revenueRes.ok ? revenueRes.json() : null,
        occupancyRes.ok ? occupancyRes.json() : null,
        guestsRes.ok ? guestsRes.json() : null,
        reservationsRes.ok ? reservationsRes.json() : null,
        dashboardRes.ok ? dashboardRes.json() : null
      ])

      setReportData({
        revenue: revenue?.data,
        occupancy: occupancy?.data,
        guests: guests?.data,
        reservations: reservations?.data,
        dashboard: dashboard?.data
      })

    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, period])

  React.useEffect(() => {
    loadReports()
  }, [loadReports])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <MainLayout 
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <PermissionGuard permission="canViewReports" route="/reports">
          <DashboardSkeleton />
        </PermissionGuard>
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <PermissionGuard permission="canViewReports" route="/reports">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header with modern design */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Reportes y Analytics
                </h1>
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Análisis completo de ingresos, ocupación y rendimiento del negocio
              </p>
            </div>
            
            <Button className="group gap-2 hover:shadow-lg transition-all duration-300" variant="outline">
              <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Exportar
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] h-11 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px] h-11 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="group h-11 w-11" onClick={loadReports}>
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </div>

        {/* Dashboard Summary Cards */}
        {reportData.dashboard && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Check-ins Hoy</CardTitle>
                <div className="p-2.5 rounded-xl bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)] group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-info)]">{reportData.dashboard.todayCheckIns}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {reportData.dashboard.todayCheckOuts} check-outs programados
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ocupación Actual</CardTitle>
                <div className="p-2.5 rounded-xl bg-[var(--dashboard-success-light)] text-[var(--dashboard-success)] group-hover:scale-110 transition-transform">
                  <Percent className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-success)] tabular-nums">{formatPercent(reportData.dashboard.occupancyRate)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {reportData.dashboard.occupiedRooms}/{reportData.dashboard.totalRooms} habitaciones ocupadas
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--financial-positive)]/10 to-[var(--financial-positive)]/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos del Mes</CardTitle>
                <div className="p-2.5 rounded-xl bg-[var(--financial-positive-light)] text-[var(--financial-positive)] group-hover:scale-110 transition-transform">
                  <DollarSign className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-[var(--financial-positive)] tabular-nums">{formatCurrency(reportData.dashboard.monthlyRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Revenue mensual acumulado
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Huéspedes Activos</CardTitle>
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{reportData.dashboard.activeGuests}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {reportData.dashboard.pendingReservations} reservas pendientes
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Reports Tabs */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">
              <DollarSign className="h-4 w-4 mr-2" />
              Ingresos
            </TabsTrigger>
            <TabsTrigger value="occupancy">
              <Percent className="h-4 w-4 mr-2" />
              Ocupación
            </TabsTrigger>
            <TabsTrigger value="reservations">
              <Calendar className="h-4 w-4 mr-2" />
              Reservas
            </TabsTrigger>
            <TabsTrigger value="guests">
              <Users className="h-4 w-4 mr-2" />
              Huéspedes
            </TabsTrigger>
          </TabsList>

          {/* Revenue Report */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--financial-positive)]/10 to-[var(--financial-positive)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ingresos</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--financial-positive-light)] text-[var(--financial-positive)]">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--financial-positive)] tabular-nums">
                    {reportData.revenue?.totals?.totalRevenue 
                      ? formatCurrency(reportData.revenue.totals.totalRevenue)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reportData.revenue?.totals?.totalPayments || 0} transacciones
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pago Promedio</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)]">
                    <Activity className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--dashboard-info)] tabular-nums">
                    {reportData.revenue?.totals?.avgPayment 
                      ? formatCurrency(reportData.revenue.totals.avgPayment)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por transacción
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Métodos de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.revenue?.methodBreakdown?.map((method: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-sm capitalize font-medium">{method._id || 'N/A'}</span>
                        <Badge variant="secondary" className="tabular-nums">{formatCurrency(method.total)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart Placeholder */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Tendencia de Ingresos
                    </CardTitle>
                    <CardDescription className="mt-1">Ingresos en el período seleccionado</CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Activity className="h-3 w-3" />
                    {reportData.revenue?.revenueData?.length || 0} puntos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-xl bg-gradient-to-br from-muted/20 to-transparent">
                  <div className="text-center text-muted-foreground space-y-3">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                      <TrendingUp className="relative h-16 w-16 mx-auto text-primary/40" />
                    </div>
                    <div>
                      <p className="font-medium">Gráfica de ingresos</p>
                      <p className="text-xs mt-1">
                        Visualización de {reportData.revenue?.revenueData?.length || 0} puntos de datos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Report */}
          <TabsContent value="occupancy" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ocupación Promedio</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--dashboard-success-light)] text-[var(--dashboard-success)]">
                    <Percent className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--dashboard-success)] tabular-nums">
                    {reportData.occupancy?.avgOccupancy 
                      ? formatPercent(reportData.occupancy.avgOccupancy)
                      : "0%"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En {dateRange} días del período
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Habitaciones</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)]">
                    <Bed className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--dashboard-info)]">
                    {reportData.occupancy?.totalRooms || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Habitaciones activas
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Ocupación Diaria
                    </CardTitle>
                    <CardDescription className="mt-1">Porcentaje de ocupación por día</CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {reportData.occupancy?.occupancyByDay?.length || 0} días
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-xl bg-gradient-to-br from-muted/20 to-transparent">
                  <div className="text-center text-muted-foreground space-y-3">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                      <Bed className="relative h-16 w-16 mx-auto text-primary/40" />
                    </div>
                    <div>
                      <p className="font-medium">Gráfica de ocupación</p>
                      <p className="text-xs mt-1">
                        Visualización de {reportData.occupancy?.occupancyByDay?.length || 0} días de datos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Report */}
          <TabsContent value="reservations" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Estancia Promedio</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)]">
                    <Calendar className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--dashboard-info)] tabular-nums">
                    {reportData.reservations?.avgStay?.avgNights?.toFixed(1) || 0} noches
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reportData.reservations?.avgStay?.totalReservations || 0} reservas analizadas
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.reservations?.statusBreakdown?.map((status: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-sm capitalize font-medium">{status._id}</span>
                        <Badge variant="secondary">{status.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Por Fuente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.reservations?.sourceBreakdown?.map((source: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-sm capitalize font-medium">{source._id || 'Directo'}</span>
                        <Badge variant="outline">{source.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservations by Property */}
            {reportData.reservations?.byProperty && reportData.reservations.byProperty.length > 0 && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    Reservas por Propiedad
                  </CardTitle>
                  <CardDescription>Distribución de reservas e ingresos por propiedad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.reservations.byProperty.map((property: any, index: number) => (
                      <div key={index} className="group flex items-center justify-between p-4 border-2 border-muted rounded-xl hover:border-primary/50 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{property.propertyName}</h4>
                            <p className="text-sm text-muted-foreground">{property.count} reservas</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[var(--financial-positive)] tabular-nums">{formatCurrency(property.revenue)}</p>
                          <p className="text-xs text-muted-foreground">Ingresos totales</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Guests Report */}
          <TabsContent value="guests" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Huéspedes</CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.guests?.totalGuests || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registrados en el sistema
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos Huéspedes</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--dashboard-success-light)] text-[var(--dashboard-success)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--dashboard-success)]">
                    {reportData.guests?.newGuests || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En el período seleccionado
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--loyalty-vip)]/10 to-[var(--loyalty-vip)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Huéspedes VIP</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--loyalty-vip-light)] text-[var(--loyalty-vip)]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--loyalty-vip)]">
                    {reportData.guests?.vipGuests || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Con estado premium
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--dashboard-warning)]/10 to-[var(--dashboard-warning)]/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Top Clientes</CardTitle>
                  <div className="p-2 rounded-lg bg-[var(--dashboard-warning-light)] text-[var(--dashboard-warning)]">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[var(--dashboard-warning)]">
                    {reportData.guests?.topGuests?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mejores clientes activos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Guests */}
            {reportData.guests?.topGuests && reportData.guests.topGuests.length > 0 && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Huéspedes Destacados
                  </CardTitle>
                  <CardDescription>Top 10 clientes por gasto total acumulado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.guests.topGuests.map((guest: any, index: number) => (
                      <div key={index} className="group flex items-center justify-between p-4 border-2 border-muted rounded-xl hover:border-primary/50 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold",
                            index === 0 && "bg-[var(--loyalty-vip-light)] text-[var(--loyalty-vip)]",
                            index === 1 && "bg-[var(--loyalty-gold-light)] text-[var(--loyalty-gold)]",
                            index === 2 && "bg-[var(--loyalty-bronze-light)] text-[var(--loyalty-bronze)]",
                            index > 2 && "bg-primary/10 text-primary"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{guest.firstName} {guest.lastName}</p>
                            <p className="text-sm text-muted-foreground">{guest.email}</p>
                          </div>
                          {guest.vipStatus && (
                            <Badge className="ml-2 bg-[var(--loyalty-vip)] hover:bg-[var(--loyalty-vip)]/90">
                              <Sparkles className="h-3 w-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[var(--financial-positive)] tabular-nums">{formatCurrency(guest.totalSpent)}</p>
                          <p className="text-xs text-muted-foreground">{guest.totalStays} estancias</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nationality Distribution */}
            {reportData.guests?.nationalityStats && reportData.guests.nationalityStats.length > 0 && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Distribución por Nacionalidad
                  </CardTitle>
                  <CardDescription>Top 10 nacionalidades de huéspedes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.guests.nationalityStats.map((stat: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium">{stat._id || 'No especificado'}</span>
                        <Badge variant="secondary">{stat.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      </PermissionGuard>
    </MainLayout>
  )
}
