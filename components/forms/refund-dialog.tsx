"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertTriangle } from "lucide-react"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import { AlertDialogCustom } from '@/components/ui/alert-dialog-custom'

interface Payment {
  _id: string
  transactionId: string
  amount: number
  currency: string
  method: string
  refund: {
    isRefunded: boolean
    refundedAmount: number
  }
}

interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  payment?: Payment
}

export function RefundDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  payment
}: RefundDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const errorRef = React.useRef<HTMLDivElement>(null)
  const { alertState, hideAlert, showError: showAlertError, confirmDelete } = useAlert()
  
  const availableForRefund = payment ? payment.amount - payment.refund.refundedAmount : 0

  const getInitialFormData = () => ({
    amount: availableForRefund,
    reason: ""
  })

  const [formData, setFormData] = React.useState(getInitialFormData())

  React.useEffect(() => {
    if (open && payment) {
      setFormData({
        amount: availableForRefund,
        reason: ""
      })
      setError(null)
    }
  }, [open, payment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const confirmed = await confirmDelete({
      title: '¿Procesar reembolso?',
      text: `Se reembolsará $${formData.amount.toFixed(2)} ${payment?.currency}. Esta acción no se puede deshacer.`,
      confirmButtonText: 'Sí, procesar reembolso',
    })

    if (!confirmed) return

    setIsLoading(true)
    setError(null)

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const payload = {
        amount: parseFloat(formData.amount.toString()),
        reason: formData.reason || undefined
      }

      const response = await fetch(`${API_BASE_URL}/payments/${payment?._id}/refund`, {
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
        
        const errorMessage = data.message || data.error || 'Error al procesar el reembolso'
        
        await showAlertError('Error al procesar el reembolso', errorMessage)
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

  if (!payment) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Procesar Reembolso
            </DialogTitle>
            <DialogDescription>
              Completa los datos para procesar el reembolso del pago
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
                      Error al procesar el reembolso
                    </h3>
                    <div className="text-sm text-destructive/90 whitespace-pre-line leading-relaxed">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID Transacción:</span>
                <span className="font-medium font-mono">{payment.transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monto Original:</span>
                <span className="font-medium">${payment.amount.toFixed(2)} {payment.currency}</span>
              </div>
              {payment.refund.isRefunded && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ya Reembolsado:</span>
                  <span className="font-medium text-red-600">${payment.refund.refundedAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground font-semibold">Disponible para Reembolso:</span>
                <span className="font-bold text-lg">${availableForRefund.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto a Reembolsar *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={availableForRefund}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Máximo: ${availableForRefund.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo del Reembolso *</Label>
              <Textarea
                id="reason"
                placeholder="Describe el motivo del reembolso..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-1">Advertencia</p>
                  <p>Esta acción no se puede deshacer. El reembolso se procesará inmediatamente y se actualizará el balance de la reservación.</p>
                </div>
              </div>
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
              <Button 
                type="submit" 
                disabled={isLoading || formData.amount <= 0 || formData.amount > availableForRefund}
                variant="destructive"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Procesar Reembolso'
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
