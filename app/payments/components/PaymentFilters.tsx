import { Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaymentFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterMethod: string
  onMethodChange: (value: string) => void
  filterStatus: string
  onStatusChange: (value: string) => void
  onRefresh: () => void
}

export function PaymentFilters({
  searchTerm,
  onSearchChange,
  filterMethod,
  onMethodChange,
  filterStatus,
  onStatusChange,
  onRefresh
}: PaymentFiltersProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, reservación o huésped..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 border-2 focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Select value={filterMethod} onValueChange={onMethodChange}>
          <SelectTrigger className="w-[180px] h-11 border-2">
            <SelectValue placeholder="Método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los métodos</SelectItem>
            <SelectItem value="cash">Efectivo</SelectItem>
            <SelectItem value="card">Tarjeta</SelectItem>
            <SelectItem value="transfer">Transferencia</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px] h-11 border-2">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="partial">Parcial</SelectItem>
            <SelectItem value="paid">Pagado</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="group gap-2 h-11 border-2" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          Actualizar
        </Button>
      </div>
    </>
  )
}
