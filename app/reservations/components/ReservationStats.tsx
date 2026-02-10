/**
 * ReservationStats Component
 * Displays reservation statistics cards
 */

import { Calendar, Clock, CheckCircle, User } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { StatusCounts } from "../types"

interface ReservationStatsProps {
  totalCount: number
  statusCounts: StatusCounts
}

export function ReservationStats({ totalCount, statusCounts }: ReservationStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* Total */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Calendar className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{totalCount}</div>
          <p className="text-xs text-muted-foreground mt-1">reservas totales</p>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-pending)]/10 to-[var(--reservation-pending)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--reservation-pending-light)] text-[var(--reservation-pending)] group-hover:scale-110 transition-transform">
            <Clock className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--reservation-pending)]">{statusCounts.pending || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">requieren confirmación</p>
        </CardContent>
      </Card>

      {/* Confirmed */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-confirmed)]/10 to-[var(--reservation-confirmed)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Confirmadas</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--reservation-confirmed-light)] text-[var(--reservation-confirmed)] group-hover:scale-110 transition-transform">
            <CheckCircle className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--reservation-confirmed)]">{statusCounts.confirmed || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">listas para check-in</p>
        </CardContent>
      </Card>

      {/* Checked In */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-checked-in)]/10 to-[var(--reservation-checked-in)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">En Hotel</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--reservation-checked-in-light)] text-[var(--reservation-checked-in)] group-hover:scale-110 transition-transform">
            <User className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--reservation-checked-in)]">{statusCounts.checked_in || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">huéspedes activos</p>
        </CardContent>
      </Card>

      {/* Checked Out */}
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-checked-out)]/10 to-[var(--reservation-checked-out)]/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completadas</CardTitle>
          <div className="p-2.5 rounded-xl bg-[var(--reservation-checked-out-light)] text-[var(--reservation-checked-out)] group-hover:scale-110 transition-transform">
            <CheckCircle className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-[var(--reservation-checked-out)]">{statusCounts.checked_out || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">check-outs realizados</p>
        </CardContent>
      </Card>
    </div>
  )
}
