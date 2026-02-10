/**
 * GuestFilters Component
 * Search and filter controls for guests
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
import type { GuestStats } from "../types"

interface GuestFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  vipFilter: string
  onVipFilterChange: (value: string) => void
  stats: GuestStats
}

export function GuestFilters({
  searchTerm,
  onSearchChange,
  vipFilter,
  onVipFilterChange,
  stats
}: GuestFiltersProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11 border-2 focus:border-primary/50 transition-colors"
        />
      </div>
      
      <Select value={vipFilter} onValueChange={onVipFilterChange}>
        <SelectTrigger className="w-[180px] h-11 border-2">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los huéspedes</SelectItem>
          <SelectItem value="vip">VIP ({stats.vip})</SelectItem>
          <SelectItem value="regular">Regular ({stats.regular})</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="gap-2 h-11 border-2">
        <Filter className="h-4 w-4" />
        Más Filtros
      </Button>
    </div>
  )
}
