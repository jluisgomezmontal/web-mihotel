import { Calendar, Percent, DollarSign, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "../utils/formatters"
import type { DashboardReport } from "../types"

interface DashboardSummaryProps {
  dashboard: DashboardReport
}

export function DashboardSummary({ dashboard }: DashboardSummaryProps) {
  return (
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
          <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-info)]">{dashboard.todayCheckIns}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {dashboard.todayCheckOuts} check-outs programados
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
          <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-success)] tabular-nums">{formatPercent(dashboard.occupancyRate)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {dashboard.occupiedRooms}/{dashboard.totalRooms} habitaciones ocupadas
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
          <div className="text-3xl font-bold tracking-tight text-[var(--financial-positive)] tabular-nums">{formatCurrency(dashboard.monthlyRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">Revenue mensual acumulado</p>
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
          <div className="text-3xl font-bold tracking-tight">{dashboard.activeGuests}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {dashboard.pendingReservations} reservas pendientes
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
