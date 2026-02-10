import { CreditCard, TrendingUp, TrendingDown, DollarSign, Banknote, ArrowLeftRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { PaymentStats } from "../types"

export function PaymentStats({ stats }: { stats: PaymentStats }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pagos</CardTitle>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">transacciones registradas</p>
          </CardContent>
        </Card>
        
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--financial-positive)]/10 to-[var(--financial-positive)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monto Total</CardTitle>
            <div className="p-2.5 rounded-xl bg-[var(--financial-positive-light)] text-[var(--financial-positive)] group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-[var(--financial-positive)] tabular-nums">${stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">ingresos acumulados</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--payment-refund)]/10 to-[var(--payment-refund)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reembolsado</CardTitle>
            <div className="p-2.5 rounded-xl bg-[var(--payment-refund-light)] text-[var(--payment-refund)] group-hover:scale-110 transition-transform">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-[var(--payment-refund)] tabular-nums">${stats.totalRefunded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">devuelto a clientes</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--financial-neutral)]/10 to-[var(--financial-neutral)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monto Neto</CardTitle>
            <div className="p-2.5 rounded-xl bg-[var(--financial-neutral-light)] text-[var(--financial-neutral)] group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-[var(--financial-neutral)] tabular-nums">${stats.netAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">balance final</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--payment-cash)]/10 to-[var(--payment-cash)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efectivo</CardTitle>
            <div className="p-2.5 rounded-xl bg-[var(--payment-cash-light)] text-[var(--payment-cash)] group-hover:scale-110 transition-transform">
              <Banknote className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-[var(--payment-cash)] tabular-nums">${stats.byMethod.cash.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">pagos en efectivo</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--payment-card)]/10 to-[var(--payment-card)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tarjeta</CardTitle>
            <div className="p-2.5 rounded-xl bg-[var(--payment-card-light)] text-[var(--payment-card)] group-hover:scale-110 transition-transform">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-[var(--payment-card)] tabular-nums">${stats.byMethod.card.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">pagos con tarjeta</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--payment-transfer)]/10 to-[var(--payment-transfer)]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transferencia</CardTitle>
            <div className="p-2.5 rounded-xl bg-[var(--payment-transfer-light)] text-[var(--payment-transfer)] group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-[var(--payment-transfer)] tabular-nums">${stats.byMethod.transfer.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">transferencias bancarias</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
