import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionsProps {
  onNewReservation: () => void
  onNewGuest: () => void
  isLoading?: boolean
}

export function QuickActions({ onNewReservation, onNewGuest, isLoading }: QuickActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onNewReservation}
        disabled={isLoading}
        className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Plus className={cn(
          "h-5 w-5 text-primary transition-transform duration-300",
          isLoading ? 'animate-spin' : 'group-hover:rotate-90'
        )} />
        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">Nueva Reserva</span>
      </button>

      <button
        onClick={onNewGuest}
        disabled={isLoading}
        className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--dashboard-info)]/20 bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5 hover:from-[var(--dashboard-info)]/20 hover:to-[var(--dashboard-info)]/10 hover:border-[var(--dashboard-info)]/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Plus className={cn(
          "h-5 w-5 text-[var(--dashboard-info)] transition-transform duration-300",
          isLoading ? 'animate-spin' : 'group-hover:rotate-90'
        )} />
        <span className="font-semibold text-foreground group-hover:text-[var(--dashboard-info)] transition-colors">Registrar Huésped</span>
      </button>
    </div>
  )
}
