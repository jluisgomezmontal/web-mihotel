import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { KPI_VARIANT_STYLES } from "../constants"
import type { KPICardProps } from "../types"

export function KPICard({ title, value, change, icon: Icon, description, variant = 'default', trend }: KPICardProps) {
  const styles = KPI_VARIANT_STYLES[variant]
  
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="h-3 w-3" />
    if (trend === 'down') return <ArrowDownRight className="h-3 w-3" />
    return <Activity className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-[var(--dashboard-success)]'
    if (trend === 'down') return 'text-[var(--dashboard-danger)]'
    return 'text-muted-foreground'
  }

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      styles.card
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2.5 rounded-xl transition-all duration-300", styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {(change !== undefined || description) && (
          <div className="flex items-center justify-between text-xs">
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 font-medium px-2 py-1 rounded-md bg-background/50",
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span>{change > 0 ? '+' : ''}{change}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
