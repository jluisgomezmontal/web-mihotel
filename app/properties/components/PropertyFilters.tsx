import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PropertyFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function PropertyFilters({ searchTerm, onSearchChange }: PropertyFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o ciudad..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11 border-2 focus:border-primary/50 transition-colors"
        />
      </div>
    </div>
  )
}
