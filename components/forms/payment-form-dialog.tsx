"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Loader2, CreditCard, Banknote, ArrowLeftRight } from "lucide-react"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import { AlertDialogCustom } from '@/components/ui/alert-dialog-custom'

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

interface PaymentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  reservation?: Reservation
  reservations?: Reservation[]
  preselectedReservationId?: string
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Efectivo', icon: Banknote },
  { value: 'card', label: 'Tarjeta', icon: CreditCard },
  { value: 'transfer', label: 'Transferencia', icon: ArrowLeftRight }
]

export function PaymentFormDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  reservation,
  reservations = [],
  preselectedReservationId
}: PaymentFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const errorRef = React.useRef<HTMLDivElement>(null)
  const { alertState, hideAlert, showError: showAlertError } = useAlert()
  
  const getInitialFormData = () => {
    const selectedReservation = reservation || reservations.find(r => r._id === preselectedReservationId)
    
    return {
      reservationId: reservation?._id || preselectedReservationId || "",
      amount: selectedReservation?.paymentSummary?.remainingBalance || 0,
      currency: "MXN",
      method: "cash",
      paymentDate: new Date().toISOString().split('T')[0],
      notes: "",
      details: {
        cardLast4: "",
        cardBrand: "",
        transferReference: "",
        bankName: ""
      }
    }
  }

  const [formData, setFormData] = React.useState(getInitialFormData())
  const [selectedReservation, setSelectedReservation] = React.useState<Reservation | undefined>(
    reservation || reservations.find(r => r._id === preselectedReservationId)
  )

  React.useEffect(() => {
    if (open) {
      setFormData(getInitialFormData())
      setSelectedReservation(reservation || reservations.find(r => r._id === preselectedReservationId))
      setError(null)
    }
  }, [open, reservation, preselectedReservationId, reservations])

  React.useEffect(() => {
    if (formData.reservationId) {
      const res = reservations.find(r => r._id === formData.reservationId)
      setSelectedReservation(res)
      if (res) {
        setFormData(prev => ({ ...prev, amount: res.paymentSummary.remainingBalance }))
      }
    }
  }, [formData.reservationId, reservations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const payload: any = {
        reservationId: formData.reservationId,
        amount: parseFloat(formData.amount.toString()),
        currency: formData.currency,
        method: formData.method,
        paymentDate: new Date(formData.paymentDate).toISOString(),
        notes: formData.notes || undefined,
        details: {}
      }

      if (formData.method === 'card') {
        payload.details.cardLast4 = formData.details.cardLast4 || undefined
        payload.details.cardBrand = formData.details.cardBrand || undefined
      } else if (formData.method === 'transfer') {
        payload.details.transferReference = formData.details.transferReference || undefined
        payload.details.bankName = formData.details.bankName || undefined
      }

      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        const responseText = await response.text()
        
        let data
        try {
          if (!responseText || responseText.trim() === '') {
            data = { 
              message: 'El servidor no devolvió información del error',
            }
          } else {
            data = JSON.parse(responseText)
          }
        } catch (e) {
          data = { 
            message: 'Error del servidor', 
          }
        }
        
        const errorMessage = data.message || data.error || 'Error al registrar el pago'
        
        await showAlertError('Error al registrar el pago', errorMessage)
        setError(errorMessage)
        
        setTimeout(() => {
          errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    } catch (err) {
      const connectionError = '🌐 Error de conexión\n\nNo se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.'
      
      await showAlertError('Error de conexión', connectionError)
      setError(connectionError)
      
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedMethodIcon = PAYMENT_METHODS.find(m => m.value === formData.method)?.icon || Banknote

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>
              Completa los datos para registrar un nuevo pago
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div ref={errorRef} className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-destructive mb-2">
                      Error al registrar el pago
                    </h3>
                    <div className="text-sm text-destructive/90 whitespace-pre-line leading-relaxed">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!reservation && (
              <div className="space-y-2">
                <Label htmlFor="reservationId">Reservación *</Label>
                <Select
                  value={formData.reservationId}
                  onValueChange={(value) => setFormData({ ...formData, reservationId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una reservación" />
                  </SelectTrigger>
                  <SelectContent>
                    {reservations.map((res) => (
                      <SelectItem key={res._id} value={res._id}>
                        {res.confirmationNumber} - {res.guestId.firstName} {res.guestId.lastName} (Balance: ${res.paymentSummary.remainingBalance.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedReservation && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Huésped:</span>
                  <span className="font-medium">{selectedReservation.guestId.firstName} {selectedReservation.guestId.lastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Reservación:</span>
                  <span className="font-medium">${selectedReservation.pricing.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pagado:</span>
                  <span className="font-medium text-green-600">${selectedReservation.paymentSummary.totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground font-semibold">Balance Pendiente:</span>
                  <span className="font-bold text-lg">${selectedReservation.paymentSummary.remainingBalance.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedReservation?.paymentSummary.remainingBalance}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moneda *</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                    <SelectItem value="USD">USD - Dólar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Método de Pago *</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData({ ...formData, method: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon
                    return (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {formData.method === 'card' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="cardLast4">Últimos 4 dígitos</Label>
                  <Input
                    id="cardLast4"
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={formData.details.cardLast4}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      details: { ...formData.details, cardLast4: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardBrand">Marca de Tarjeta</Label>
                  <Select
                    value={formData.details.cardBrand}
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      details: { ...formData.details, cardBrand: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                      <SelectItem value="discover">Discover</SelectItem>
                      <SelectItem value="other">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {formData.method === 'transfer' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="transferReference">Referencia</Label>
                  <Input
                    id="transferReference"
                    type="text"
                    placeholder="REF123456"
                    value={formData.details.transferReference}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      details: { ...formData.details, transferReference: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Banco</Label>
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="Nombre del banco"
                    value={formData.details.bankName}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      details: { ...formData.details, bankName: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Fecha de Pago *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Notas adicionales sobre el pago..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !formData.reservationId}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar Pago'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
    </>
  )
}
