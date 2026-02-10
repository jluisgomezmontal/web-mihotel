import { Building2, Bed, Hotel, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { PropertyStats as PropertyStatsType } from "../types"

export function PropertyStats({ stats }: { stats: PropertyStatsType }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Propiedades</CardTitle>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Building2 className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">activas</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Habitaciones</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)] group-hover:scale-110 transition-transform">
            <Bed className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-info)]">{stats.totalRooms}</div>
          <p className="text-xs text-muted-foreground mt-1">en todas las propiedades</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-warning)]/10 to-[var(--dashboard-warning)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Habitaciones Ocupadas</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--dashboard-warning-light)] text-[var(--dashboard-warning)] group-hover:scale-110 transition-transform">
            <Hotel className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-warning)]">{stats.occupiedRooms}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-[var(--dashboard-warning)]" />
            <p className="text-xs font-medium text-[var(--dashboard-warning)]">
              {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}% ocupación
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--dashboard-success-light)] text-[var(--dashboard-success)] group-hover:scale-110 transition-transform">
            <DollarSign className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-success)]">${stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">este mes</p>
        </CardContent>
      </Card>
    </div>
  )
}
