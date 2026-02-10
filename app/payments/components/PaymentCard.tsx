import { Calendar, DollarSign, TrendingDown, CreditCard, ArrowLeftRight, MoreVertical } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_METHOD_COLORS, PAYMENT_STATUS_COLORS } from "../constants"
import type { PaymentCardProps } from "../types"

export function PaymentCard({ payment, onRefund, onViewDetails }: PaymentCardProps) {
  const methodInfo = PAYMENT_METHOD_LABELS[payment.method as keyof typeof PAYMENT_METHOD_LABELS] || { label: payment.method, icon: CreditCard }
  const statusInfo = PAYMENT_STATUS_LABELS[payment.status as keyof typeof PAYMENT_STATUS_LABELS] || { label: payment.status, variant: 'default' }
  const MethodIcon = methodInfo.icon

  const availableForRefund = payment.amount - payment.refund.refundedAmount
  const methodColor = PAYMENT_METHOD_COLORS[payment.method as keyof typeof PAYMENT_METHOD_COLORS] || PAYMENT_METHOD_COLORS.card
  const statusColor = PAYMENT_STATUS_COLORS[payment.status as keyof typeof PAYMENT_STATUS_COLORS] || PAYMENT_STATUS_COLORS.paid
  const StatusIcon = statusColor.icon

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={cn("h-1.5 w-full transition-all duration-500", statusColor.color.replace('text-', 'bg-'))} />
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={cn("p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300", methodColor.bg, methodColor.border, "border")}>
                <MethodIcon className={cn("h-4 w-4", methodColor.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-mono truncate">
                  {payment.transactionId}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", statusColor.color, statusColor.bg, statusColor.border)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                  {payment.refund.isRefunded && (
                    <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", "text-[var(--payment-refund)]", "bg-[var(--payment-refund-light)]", "border-[var(--payment-refund)]/20")}>
                      <TrendingDown className="h-3 w-3" />
                      Reembolsado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(payment.paymentDate).toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="group/btn">
                <MoreVertical className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(payment)}>
                Ver Detalles
              </DropdownMenuItem>
              {payment.status === 'paid' && availableForRefund > 0 && (
                <DropdownMenuItem 
                  onClick={() => onRefund(payment)}
                  className="text-[var(--payment-refund)]"
                >
                  Procesar Reembolso
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        <div className="grid grid-cols-2 gap-3 p-3 bg-gradient-to-br from-[var(--surface-elevated)] to-transparent border border-[var(--border-subtle)] rounded-xl">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Huésped</p>
            <p className="font-semibold text-sm truncate">
              {payment.reservationId.guestId.firstName} {payment.reservationId.guestId.lastName}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reservación</p>
            <p className="font-semibold text-sm font-mono truncate">{payment.reservationId.confirmationNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Habitación</p>
            <p className="font-semibold text-sm truncate">{payment.reservationId.roomId.nameOrNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Propiedad</p>
            <p className="font-semibold text-sm truncate">{payment.reservationId.propertyId.name}</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-[var(--financial-positive-light)] to-transparent border-2 border-[var(--financial-positive)]/30 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--financial-positive)]/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-[var(--financial-positive)]" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Monto</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[var(--financial-positive)] tabular-nums">
                ${payment.amount.toFixed(2)}
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase">{payment.currency}</span>
            </div>
          </div>
          {payment.refund.isRefunded && (
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--payment-refund)]/20">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-[var(--payment-refund)]" />
                <span className="text-sm font-medium text-[var(--payment-refund)]">Reembolsado</span>
              </div>
              <span className="text-xl font-bold text-[var(--payment-refund)] tabular-nums">
                -${payment.refund.refundedAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {payment.method === 'card' && payment.details?.cardLast4 && (
          <div className={cn("p-3 rounded-lg border", methodColor.bg, methodColor.border)}>
            <div className="flex items-center gap-2">
              <CreditCard className={cn("h-4 w-4", methodColor.color)} />
              <span className={cn("text-sm font-semibold", methodColor.color)}>
                {payment.details.cardBrand?.toUpperCase()} •••• {payment.details.cardLast4}
              </span>
            </div>
          </div>
        )}

        {payment.method === 'transfer' && payment.details?.transferReference && (
          <div className={cn("p-3 rounded-lg border", methodColor.bg, methodColor.border)}>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className={cn("h-4 w-4", methodColor.color)} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold", methodColor.color)}>Ref: {payment.details.transferReference}</p>
                {payment.details.bankName && (
                  <p className="text-xs text-muted-foreground">{payment.details.bankName}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {payment.notes && (
          <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
            <p className="text-xs text-muted-foreground italic">{payment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
