"use client"

import * as React from "react"
import { Search, CreditCard, DollarSign, Calendar, MoreVertical, RefreshCw, Banknote, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthService } from "@/lib/auth"
import { useAlert } from "@/lib/use-alert"
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

  return (
    <Card className="hover:shadow-elegant transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-mono">
                {payment.transactionId}
              </CardTitle>
              <Badge variant={statusInfo.variant as any}>
                {statusInfo.label}
              </Badge>
              {payment.refund.isRefunded && (
                <Badge variant="destructive" className="text-xs">
                  Reembolsado
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MethodIcon className="h-3 w-3" />
                <span>{methodInfo.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{new Date(payment.paymentDate).toLocaleDateString('es-MX', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(payment)}>
                Ver Detalles
              </DropdownMenuItem>
              {payment.status === 'paid' && availableForRefund > 0 && (
                <DropdownMenuItem 
                  onClick={() => onRefund(payment)}
                  className="text-destructive"
                >
                  Procesar Reembolso
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Huésped:</span>
            <span className="font-medium">
              {payment.reservationId.guestId.firstName} {payment.reservationId.guestId.lastName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reservación:</span>
            <span className="font-medium font-mono">{payment.reservationId.confirmationNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Habitación:</span>
            <span className="font-medium">{payment.reservationId.roomId.nameOrNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Propiedad:</span>
            <span className="font-medium">{payment.reservationId.propertyId.name}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monto:</span>
            <span className="text-2xl font-bold">
              ${payment.amount.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{payment.currency}</span>
            </span>
          </div>
          {payment.refund.isRefunded && (
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-red-600">Reembolsado:</span>
              <span className="text-red-600 font-semibold">
                -${payment.refund.refundedAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {payment.method === 'card' && payment.details?.cardLast4 && (
          <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
            {payment.details.cardBrand?.toUpperCase()} •••• {payment.details.cardLast4}
          </div>
        )}

        {payment.method === 'transfer' && payment.details?.transferReference && (
          <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
            Ref: {payment.details.transferReference}
            {payment.details.bankName && ` - ${payment.details.bankName}`}
          </div>
        )}

        {payment.notes && (
          <div className="text-xs text-muted-foreground italic border-l-2 pl-2">
            {payment.notes}
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

      const response = await fetch('http://localhost:3000/api/payments?limit=100', {
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

      const response = await fetch('http://localhost:3000/api/reservations?limit=200', {
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div style={{ transition: 'none', animation: 'none' }}>
          <h1 className="text-3xl font-bold tracking-tight" style={{ transition: 'none', animation: 'none' }}>
            Pagos
          </h1>
          <p className="text-muted-foreground" style={{ transition: 'none', animation: 'none' }}>
            Gestiona todos los pagos y reembolsos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, reservación o huésped..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="partial">Parcial</SelectItem>
              <SelectItem value="paid">Pagado</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2" onClick={loadPayments}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Monto Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Reembolsado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRefunded.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Monto Neto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.netAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                Efectivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${stats.byMethod.cash.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Tarjeta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${stats.byMethod.card.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Transferencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${stats.byMethod.transfer.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 text-muted-foreground animate-spin">
                <RefreshCw className="h-12 w-12" />
              </div>
              <p className="text-sm text-muted-foreground">Cargando pagos...</p>
            </div>
          </Card>
        ) : filteredPayments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <Card className="p-12">
            <div className="text-center space-y-4">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron pagos' : 'No tienes pagos registrados'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros' 
                    : 'Comienza registrando tu primer pago para una reservación'}
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
