/**
 * GuestStats Component
 * Displays guest statistics cards
 */

import { User, Star, TrendingUp, CreditCard } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { GuestStats as GuestStatsType } from "../types"

interface GuestStatsProps {
  stats: GuestStatsType
}

export function GuestStats({ stats }: GuestStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Guests */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Huéspedes</CardTitle>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <User className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">registrados en total</p>
        </CardContent>
      </Card>
      
      {/* VIP Guests */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--loyalty-vip)]/10 to-[var(--loyalty-vip)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">VIP</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--loyalty-vip-light)] text-[var(--loyalty-vip)] group-hover:scale-110 transition-transform">
            <Star className="h-5 w-5 fill-current" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--loyalty-vip)]">{stats.vip}</div>
          <p className="text-xs text-muted-foreground mt-1">huéspedes premium</p>
        </CardContent>
      </Card>

      {/* Total Stays */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estancias Totales</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)] group-hover:scale-110 transition-transform">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-info)]">{stats.totalStays}</div>
          <p className="text-xs text-muted-foreground mt-1">visitas acumuladas</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--dashboard-success-light)] text-[var(--dashboard-success)] group-hover:scale-110 transition-transform">
            <CreditCard className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-success)]">${stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">generados por huéspedes</p>
        </CardContent>
      </Card>
    </div>
  )
}
