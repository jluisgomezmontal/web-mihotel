"use client"

import * as React from "react"
import { Building2, Bed, Calendar, DollarSign, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { useDashboard } from "@/contexts/DashboardContext"
import { cn } from "@/lib/utils"
import { ReservationFormDialog } from "@/components/forms/reservation-form-dialog"
import { GuestFormDialog } from "@/components/forms/guest-form-dialog"

import { HeroSection } from "./components/HeroSection"
import { KPICard } from "./components/KPICard"
import { QuickActions } from "./components/QuickActions"
import { TodaysReservations } from "./components/TodaysReservations"
import { RevenueSummary } from "./components/RevenueSummary"
import { useDashboardMetrics } from "./hooks/useDashboardMetrics"
import { useTodaysReservations } from "./hooks/useTodaysReservations"

export default function DashboardPage() {
  const { properties, reservations, rooms, guests, userData, tenantData, isLoading, refreshAll } = useDashboard()
  const [reservationDialogOpen, setReservationDialogOpen] = React.useState(false)
  const [guestDialogOpen, setGuestDialogOpen] = React.useState(false)

  const { kpis, metricsLoading, fetchDashboardMetrics } = useDashboardMetrics(properties, reservations, rooms)
  const todaysReservations = useTodaysReservations(reservations)

  React.useEffect(() => {
    refreshAll()
    fetchDashboardMetrics()
  }, [])

  const handleRefresh = async () => {
    await Promise.all([refreshAll(), fetchDashboardMetrics()])
  }

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
        {/* Hero Section */}
        <HeroSection
          userName={userData?.name || "Usuario"}
          tenantName={tenantData?.name || "Mi Hotel"}
        />

        {/* Quick Actions & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <QuickActions
            onNewReservation={() => setReservationDialogOpen(true)}
            onNewGuest={() => setGuestDialogOpen(true)}
            isLoading={isLoading}
          />
          
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
          <div className="lg:col-span-2">
            <TodaysReservations
              reservations={todaysReservations}
              totalReservations={reservations.length}
            />
          </div>

          <div className="space-y-4 lg:space-y-6">
            <RevenueSummary metrics={kpis} />
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
