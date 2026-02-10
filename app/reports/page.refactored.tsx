"use client"

import * as React from "react"
import { Download, Sparkles, DollarSign, Percent, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/layout/main-layout"
import { PermissionGuard } from "@/components/guards/PermissionGuard"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { useDashboard } from "@/contexts/DashboardContext"

import { DashboardSummary } from "./components/DashboardSummary"
import { ReportFilters } from "./components/ReportFilters"
import { RevenueTab } from "./components/RevenueTab"
import { useReportData } from "./hooks/useReportData"

export default function ReportsPage() {
  const [dateRange, setDateRange] = React.useState("30")
  const [period, setPeriod] = React.useState("daily")
  const { userData, tenantData } = useDashboard()

  const { reportData, isLoading, loadReports } = useReportData(dateRange, period)

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
          {/* Header */}
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
          <ReportFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            period={period}
            onPeriodChange={setPeriod}
            onRefresh={loadReports}
          />

          {/* Dashboard Summary */}
          {reportData.dashboard && (
            <DashboardSummary dashboard={reportData.dashboard} />
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

            <TabsContent value="revenue">
              <RevenueTab revenue={reportData.revenue} />
            </TabsContent>

            <TabsContent value="occupancy">
              <div className="text-center py-12 text-muted-foreground">
                Contenido de ocupación (mantener original por ahora)
              </div>
            </TabsContent>

            <TabsContent value="reservations">
              <div className="text-center py-12 text-muted-foreground">
                Contenido de reservas (mantener original por ahora)
              </div>
            </TabsContent>

            <TabsContent value="guests">
              <div className="text-center py-12 text-muted-foreground">
                Contenido de huéspedes (mantener original por ahora)
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PermissionGuard>
    </MainLayout>
  )
}
