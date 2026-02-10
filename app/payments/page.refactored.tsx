"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { useAlert } from '@/lib/use-alert'
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { PaymentFormDialog } from "@/components/forms/payment-form-dialog"
import { RefundDialog } from "@/components/forms/refund-dialog"
import { useDashboard } from "@/contexts/DashboardContext"

import { PaymentCard } from "./components/PaymentCard"
import { PaymentStats } from "./components/PaymentStats"
import { PaymentFilters } from "./components/PaymentFilters"
import { EmptyState } from "./components/EmptyState"
import { usePaymentData } from "./hooks/usePaymentData"
import { usePaymentFilters } from "./hooks/usePaymentFilters"
import { PAYMENT_METHOD_LABELS } from "./constants"
import type { Payment } from "./types"

export default function PaymentsPage() {
  const { userData, tenantData } = useDashboard()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterMethod, setFilterMethod] = React.useState<string>("all")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | undefined>(undefined)
  const { alertState, hideAlert, showError, showSuccess } = useAlert()

  const { payments, reservations, isLoading, loadPayments, loadReservations } = usePaymentData()
  const { filteredPayments, stats } = usePaymentFilters(payments, searchTerm, filterMethod, filterStatus)

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsRefundDialogOpen(true)
  }

  const handleViewDetails = async (payment: Payment) => {
    await showSuccess(
      'Detalles del Pago',
      `ID: ${payment.transactionId}\nMonto: $${payment.amount} ${payment.currency}\nMétodo: ${PAYMENT_METHOD_LABELS[payment.method as keyof typeof PAYMENT_METHOD_LABELS]?.label}\nFecha: ${new Date(payment.paymentDate).toLocaleDateString('es-MX')}`
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <DashboardSkeleton />
      </MainLayout>
    )
  }

  const hasFilters = searchTerm !== "" || filterMethod !== "all" || filterStatus !== "all"

  return (
    <MainLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
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

        {/* Filters */}
        <PaymentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterMethod={filterMethod}
          onMethodChange={setFilterMethod}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          onRefresh={loadPayments}
        />

        {/* Stats */}
        <PaymentStats stats={stats} />

        {/* Payments Grid or Empty State */}
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
          <EmptyState hasFilters={hasFilters} />
        )}
      </div>

      {/* Dialogs */}
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
