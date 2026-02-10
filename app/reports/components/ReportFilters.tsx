import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportFiltersProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
  period: string
  onPeriodChange: (value: string) => void
  onRefresh: () => void
}

export function ReportFilters({
  dateRange,
  onDateRangeChange,
  period,
  onPeriodChange,
  onRefresh
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[180px] h-11 border-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Últimos 7 días</SelectItem>
          <SelectItem value="30">Últimos 30 días</SelectItem>
          <SelectItem value="90">Últimos 90 días</SelectItem>
          <SelectItem value="365">Último año</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={period} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[140px] h-11 border-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Diario</SelectItem>
          <SelectItem value="weekly">Semanal</SelectItem>
          <SelectItem value="monthly">Mensual</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" className="group h-11 w-11" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
      </Button>
    </div>
  )
}
