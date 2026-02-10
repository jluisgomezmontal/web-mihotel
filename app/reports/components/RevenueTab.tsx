import { DollarSign, Activity, BarChart3, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "../utils/formatters"
import type { RevenueReport } from "../types"

export function RevenueTab({ revenue }: { revenue?: RevenueReport }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--financial-positive)]/10 to-[var(--financial-positive)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ingresos</CardTitle>
            <div className="p-2 rounded-lg bg-[var(--financial-positive-light)] text-[var(--financial-positive)]">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--financial-positive)] tabular-nums">
              {revenue?.totals?.totalRevenue ? formatCurrency(revenue.totals.totalRevenue) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {revenue?.totals?.totalPayments || 0} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pago Promedio</CardTitle>
            <div className="p-2 rounded-lg bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)]">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--dashboard-info)] tabular-nums">
              {revenue?.totals?.avgPayment ? formatCurrency(revenue.totals.avgPayment) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Por transacción</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Métodos de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {revenue?.methodBreakdown?.map((method, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <span className="text-sm capitalize font-medium">{method._id || 'N/A'}</span>
                  <Badge variant="secondary" className="tabular-nums">{formatCurrency(method.total)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Tendencia de Ingresos
              </CardTitle>
              <CardDescription className="mt-1">Ingresos en el período seleccionado</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <Activity className="h-3 w-3" />
              {revenue?.revenueData?.length || 0} puntos
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-xl bg-gradient-to-br from-muted/20 to-transparent">
            <div className="text-center text-muted-foreground space-y-3">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
                <TrendingUp className="relative h-16 w-16 mx-auto text-primary/40" />
              </div>
              <div>
                <p className="font-medium">Gráfica de ingresos</p>
                <p className="text-xs mt-1">
                  Visualización de {revenue?.revenueData?.length || 0} puntos de datos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
