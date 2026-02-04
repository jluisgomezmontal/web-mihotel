"use client"

import * as React from "react"
import { Search, CreditCard, DollarSign, Calendar, MoreVertical, RefreshCw, Banknote, ArrowLeftRight, Sparkles, TrendingUp, TrendingDown, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { AuthService } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { useAlert } from '@/lib/use-alert'
import { API_BASE_URL } from '@/lib/api-config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { PaymentFormDialog } from "@/components/forms/payment-form-dialog"
import { RefundDialog } from "@/components/forms/refund-dialog"
import { useDashboard } from "@/contexts/DashboardContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Payment {
  _id: string
  transactionId: string
  amount: number
  currency: string
  method: string
  status: string
  paymentDate: string
  notes?: string
  reservationId: {
    _id: string
    confirmationNumber: string
    guestId: {
      firstName: string
      lastName: string
      email: string
    }
    roomId: {
      nameOrNumber: string
    }
    propertyId: {
      name: string
    }
  }
  refund: {
    isRefunded: boolean
    refundedAmount: number
    refundReason?: string
  }
  details?: {
    cardLast4?: string
    cardBrand?: string
    transferReference?: string
    bankName?: string
  }
}

interface Reservation {
  _id: string
  confirmationNumber: string
  guestId: {
    firstName: string
    lastName: string
  }
  pricing: {
    totalPrice: number
  }
  paymentSummary: {
    totalPaid: number
    remainingBalance: number
  }
}

const PAYMENT_METHOD_LABELS: Record<string, { label: string; icon: any }> = {
  cash: { label: 'Efectivo', icon: Banknote },
  card: { label: 'Tarjeta', icon: CreditCard },
  transfer: { label: 'Transferencia', icon: ArrowLeftRight }
}

const PAYMENT_STATUS_LABELS: Record<string, { label: string; variant: any }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  partial: { label: 'Parcial', variant: 'default' },
  paid: { label: 'Pagado', variant: 'default' }
}

function PaymentCard({ 
  payment, 
  onRefund,
  onViewDetails
}: { 
  payment: Payment
  onRefund: (payment: Payment) => void
  onViewDetails: (payment: Payment) => void
}) {
  const methodInfo = PAYMENT_METHOD_LABELS[payment.method] || { label: payment.method, icon: CreditCard }
  const statusInfo = PAYMENT_STATUS_LABELS[payment.status] || { label: payment.status, variant: 'default' }
  const MethodIcon = methodInfo.icon

  const availableForRefund = payment.amount - payment.refund.refundedAmount
  
  const methodColors = {
    cash: { color: 'text-[var(--payment-cash)]', bg: 'bg-[var(--payment-cash-light)]', border: 'border-[var(--payment-cash)]/20' },
    card: { color: 'text-[var(--payment-card)]', bg: 'bg-[var(--payment-card-light)]', border: 'border-[var(--payment-card)]/20' },
    transfer: { color: 'text-[var(--payment-transfer)]', bg: 'bg-[var(--payment-transfer-light)]', border: 'border-[var(--payment-transfer)]/20' }
  }
  
  const statusColors = {
    pending: { color: 'text-[var(--payment-pending)]', bg: 'bg-[var(--payment-pending-light)]', border: 'border-[var(--payment-pending)]/20', icon: Clock },
    partial: { color: 'text-[var(--payment-partial)]', bg: 'bg-[var(--payment-partial-light)]', border: 'border-[var(--payment-partial)]/20', icon: AlertCircle },
    paid: { color: 'text-[var(--payment-paid)]', bg: 'bg-[var(--payment-paid-light)]', border: 'border-[var(--payment-paid)]/20', icon: CheckCircle }
  }
  
  const methodColor = methodColors[payment.method as keyof typeof methodColors] || methodColors.card
  const statusColor = statusColors[payment.status as keyof typeof statusColors] || statusColors.paid
  const StatusIcon = statusColor.icon

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Gradiente decorativo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Barra de estado superior */}
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

export default function PaymentsPage() {
  const { userData, tenantData } = useDashboard()
  const [payments, setPayments] = React.useState<Payment[]>([])
  const [reservations, setReservations] = React.useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterMethod, setFilterMethod] = React.useState<string>("all")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(true)
  const { alertState, hideAlert, showError, showSuccess } = useAlert()

  const loadPayments = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/payments?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.data?.payments || [])
      } else {
        await showError('Error al cargar', 'No se pudieron cargar los pagos')
      }
    } catch (err) {
      console.error('Error loading payments:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadReservations = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/reservations?limit=200`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Filter reservations with pending balance and active status
        const reservationsWithBalance = (data.data?.reservations || []).filter(
          (r: Reservation) => {
            const hasBalance = r.paymentSummary?.remainingBalance > 0
            return hasBalance
          }
        )
        console.log('📋 Loaded reservations with balance:', reservationsWithBalance.length)
        setReservations(reservationsWithBalance)
      }
    } catch (err) {
      console.error('Error loading reservations:', err)
    }
  }, [])

  React.useEffect(() => {
    loadPayments()
    loadReservations()
  }, [])

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsRefundDialogOpen(true)
  }

  const handleViewDetails = async (payment: Payment) => {
    await showSuccess(
      'Detalles del Pago',
      `ID: ${payment.transactionId}\nMonto: $${payment.amount} ${payment.currency}\nMétodo: ${PAYMENT_METHOD_LABELS[payment.method]?.label}\nFecha: ${new Date(payment.paymentDate).toLocaleDateString('es-MX')}`
    )
  }

  const filteredPayments = React.useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reservationId.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${payment.reservationId.guestId.firstName} ${payment.reservationId.guestId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMethod = filterMethod === "all" || payment.method === filterMethod
      const matchesStatus = filterStatus === "all" || payment.status === filterStatus

      return matchesSearch && matchesMethod && matchesStatus
    })
  }, [payments, searchTerm, filterMethod, filterStatus])

  const stats = React.useMemo(() => {
    const total = payments.length
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalRefunded = payments.reduce((sum, p) => sum + p.refund.refundedAmount, 0)
    const netAmount = totalAmount - totalRefunded
    const byMethod = {
      cash: payments.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),
      card: payments.filter(p => p.method === 'card').reduce((sum, p) => sum + p.amount, 0),
      transfer: payments.filter(p => p.method === 'transfer').reduce((sum, p) => sum + p.amount, 0)
    }

    return { total, totalAmount, totalRefunded, netAmount, byMethod }
  }, [payments])

  if (isLoading) {
    return (
      <MainLayout>
        <DashboardSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header with modern design */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Pagos
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona todos los pagos y reembolsos
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, reservación o huésped..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 border-2 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <Select value={filterMethod} onValueChange={setFilterMethod}>
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

          <Select value={filterStatus} onValueChange={setFilterStatus}>
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

          <Button variant="outline" className="group gap-2 h-11 border-2" onClick={loadPayments}>
            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards with modern design */}
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

        {/* Payment Methods Breakdown */}
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

        {/* Payments Grid */}
        {filteredPayments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredPayments.map((payment) => (
              <PaymentCard 
                key={payment._id} 
                payment={payment}
                onRefund={handleRefund}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-md p-16">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <DollarSign className="relative mx-auto h-20 w-20 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {searchTerm || filterMethod !== 'all' || filterStatus !== 'all' ? 'No se encontraron pagos' : 'No tienes pagos registrados'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchTerm || filterMethod !== 'all' || filterStatus !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
                    : 'Los pagos se registran automáticamente cuando se procesan transacciones en las reservaciones'}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <PaymentFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          loadPayments()
          loadReservations()
        }}
        reservations={reservations}
      />

      <RefundDialog
        open={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
        onSuccess={loadPayments}
        payment={selectedPayment}
      />

      <AlertDialogCustom
        open={alertState.open}
        onOpenChange={hideAlert}
        type={alertState.type}
        title={alertState.title}
        description={alertState.description}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
        showCancel={alertState.showCancel}
      />
    </MainLayout>
  )
}
