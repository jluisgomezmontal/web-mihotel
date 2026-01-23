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
  CreditCard
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthService } from "@/lib/auth"
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
        fetch(`http://localhost:3000/api/reports/revenue?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/api/reports/occupancy?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/api/reports/guests?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/api/reports/reservations?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/api/reports/dashboard`, {
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Generando reportes...</p>
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
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportes y Analytics</h1>
            <p className="text-muted-foreground">
              Análisis completo de ingresos, ocupación y rendimiento
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        {reportData.dashboard && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-ins Hoy</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.dashboard.todayCheckIns}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData.dashboard.todayCheckOuts} check-outs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ocupación Actual</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercent(reportData.dashboard.occupancyRate)}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData.dashboard.occupiedRooms}/{reportData.dashboard.totalRooms} habitaciones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportData.dashboard.monthlyRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Revenue mensual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Huéspedes Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.dashboard.activeGuests}</div>
                <p className="text-xs text-muted-foreground">
                  {reportData.dashboard.pendingReservations} pendientes
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
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total de Ingresos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.revenue?.totals?.totalRevenue 
                      ? formatCurrency(reportData.revenue.totals.totalRevenue)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reportData.revenue?.totals?.totalPayments || 0} pagos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Pago Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.revenue?.totals?.avgPayment 
                      ? formatCurrency(reportData.revenue.totals.avgPayment)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por transacción
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Métodos de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.revenue?.methodBreakdown?.map((method: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{method._id || 'N/A'}</span>
                        <Badge variant="secondary">{formatCurrency(method.total)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Ingresos</CardTitle>
                <CardDescription>Ingresos en el período seleccionado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Gráfica de ingresos</p>
                    <p className="text-xs">
                      {reportData.revenue?.revenueData?.length || 0} puntos de datos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Occupancy Report */}
          <TabsContent value="occupancy" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Ocupación Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.occupancy?.avgOccupancy 
                      ? formatPercent(reportData.occupancy.avgOccupancy)
                      : "0%"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En {dateRange} días
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total de Habitaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.occupancy?.totalRooms || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Habitaciones activas
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ocupación Diaria</CardTitle>
                <CardDescription>Porcentaje de ocupación por día</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Bed className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Gráfica de ocupación</p>
                    <p className="text-xs">
                      {reportData.occupancy?.occupancyByDay?.length || 0} días de datos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Report */}
          <TabsContent value="reservations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Estancia Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.reservations?.avgStay?.avgNights?.toFixed(1) || 0} noches
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reportData.reservations?.avgStay?.totalReservations || 0} reservas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.reservations?.statusBreakdown?.map((status: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{status._id}</span>
                        <Badge variant="secondary">{status.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Por Fuente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.reservations?.sourceBreakdown?.map((source: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{source._id || 'Directo'}</span>
                        <Badge variant="outline">{source.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservations by Property */}
            {reportData.reservations?.byProperty && reportData.reservations.byProperty.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reservas por Propiedad</CardTitle>
                  <CardDescription>Distribución de reservas e ingresos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.reservations.byProperty.map((property: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{property.propertyName}</h4>
                          <p className="text-sm text-muted-foreground">{property.count} reservas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(property.revenue)}</p>
                          <p className="text-xs text-muted-foreground">Ingresos</p>
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
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Huéspedes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.guests?.totalGuests || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En el sistema
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Nuevos Huéspedes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.guests?.newGuests || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En el período
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Huéspedes VIP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {reportData.guests?.vipGuests || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estado premium
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Top 10</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.guests?.topGuests?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mejores clientes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Guests */}
            {reportData.guests?.topGuests && reportData.guests.topGuests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Huéspedes Destacados</CardTitle>
                  <CardDescription>Top 10 por gasto total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.guests.topGuests.map((guest: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{guest.firstName} {guest.lastName}</p>
                            <p className="text-sm text-muted-foreground">{guest.email}</p>
                          </div>
                          {guest.vipStatus && (
                            <Badge variant="default" className="ml-2">VIP</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(guest.totalSpent)}</p>
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
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Nacionalidad</CardTitle>
                  <CardDescription>Top 10 nacionalidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.guests.nationalityStats.map((stat: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{stat._id || 'No especificado'}</span>
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
    </MainLayout>
  )
}
