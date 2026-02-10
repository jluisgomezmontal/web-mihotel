import { DollarSign, Users, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardMetrics } from "../types"

interface RevenueSummaryProps {
  metrics: DashboardMetrics
}

export function RevenueSummary({ metrics }: RevenueSummaryProps) {
  return (
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
          <span className="font-bold text-[var(--dashboard-success)]">${metrics.totalRevenue.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <span className="text-sm font-medium">Este mes</span>
          <span className="font-bold text-primary">${metrics.monthlyRevenue.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border mt-4">
          <span className="text-sm font-medium">Tarifa promedio</span>
          <span className="font-semibold">${metrics.averageRate.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <span className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Huéspedes activos
          </span>
          <Badge variant="secondary" className="font-bold">{metrics.activeGuests}</Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--dashboard-warning-light)] border border-[var(--dashboard-warning)]/20">
          <span className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Reservas pendientes
          </span>
          <Badge variant="outline" className="font-bold text-[var(--dashboard-warning)] bg-background border-[var(--dashboard-warning)]/30">
            {metrics.pendingReservations}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
