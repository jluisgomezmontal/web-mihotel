import { Bed, CheckCircle2, AlertCircle, Wrench } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { RoomStats as RoomStatsType } from "../types"

export function RoomStats({ stats }: { stats: RoomStatsType }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Habitaciones</CardTitle>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Bed className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">en todas las propiedades</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--room-available)]/10 to-[var(--room-available)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Disponibles</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--room-available-light)] text-[var(--room-available)] group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--room-available)]">{stats.available}</div>
          <p className="text-xs text-muted-foreground mt-1">listas para reservar</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--room-occupied)]/10 to-[var(--room-occupied)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ocupadas</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--room-occupied-light)] text-[var(--room-occupied)] group-hover:scale-110 transition-transform">
            <AlertCircle className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--room-occupied)]">{stats.occupied}</div>
          <p className="text-xs text-muted-foreground mt-1">actualmente en uso</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--room-maintenance)]/10 to-[var(--room-maintenance)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Mantenimiento</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--room-maintenance-light)] text-[var(--room-maintenance)] group-hover:scale-110 transition-transform">
            <Wrench className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--room-maintenance)]">{stats.maintenance}</div>
          <p className="text-xs text-muted-foreground mt-1">requieren atención</p>
        </CardContent>
      </Card>
    </div>
  )
}
