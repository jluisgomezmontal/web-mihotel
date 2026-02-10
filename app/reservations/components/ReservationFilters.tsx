/**
 * ReservationFilters Component
 * Search and filter controls for reservations
 */

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { StatusCounts } from "../types"

interface ReservationFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  statusCounts: StatusCounts
}

export function ReservationFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts
}: ReservationFiltersProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por huésped, confirmación o habitación..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11 border-2 focus:border-primary/50 transition-colors"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[200px] h-11 border-2">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="pending">Pendiente ({statusCounts.pending || 0})</SelectItem>
          <SelectItem value="confirmed">Confirmada ({statusCounts.confirmed || 0})</SelectItem>
          <SelectItem value="checked_in">Check-in ({statusCounts.checked_in || 0})</SelectItem>
          <SelectItem value="checked_out">Check-out ({statusCounts.checked_out || 0})</SelectItem>
          <SelectItem value="cancelled">Cancelada ({statusCounts.cancelled || 0})</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="gap-2 h-11 border-2">
        <Filter className="h-4 w-4" />
        Más Filtros
      </Button>
    </div>
  )
}
