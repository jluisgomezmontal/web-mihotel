/**
 * Reservations Page - Refactored
 * Main page component for managing reservations
 * 
 * Architecture:
 * - Types and interfaces: ./types.ts
 * - Constants and configs: ./constants.ts
 * - UI Components: ./components/*
 * - Custom Hooks: ./hooks/*
 * - Utilities: ./utils/*
 */

"use client"

import * as React from "react"
import { Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { ReservationFormDialog } from "@/components/forms/reservation-form-dialog"
import { PaymentFormDialog } from "@/components/forms/payment-form-dialog"
import { useDashboard } from "@/contexts/DashboardContext"
import { useAlert } from '@/lib/use-alert'

// Local imports - modular architecture
import { ReservationCard } from "./components/ReservationCard"
import { ReservationStats } from "./components/ReservationStats"
import { ReservationFilters } from "./components/ReservationFilters"
import { EmptyState } from "./components/EmptyState"
import { useReservationActions } from "./hooks/useReservationActions"
import { useReservationFilters } from "./hooks/useReservationFilters"
import { mapReservationData, mapReservationForEdit, mapReservationsForPayment } from "./utils/reservationMapper"

export default function ReservationsPage() {
  // Context and hooks
  const { 
    reservations, 
    properties, 
    rooms, 
    guests, 
    userData, 
    tenantData, 
    refreshReservations, 
    refreshRooms, 
    refreshGuests, 
    isLoading 
  } = useDashboard()
  
  const { alertState, hideAlert } = useAlert()
  
  // Local state
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingReservation, setEditingReservation] = React.useState<any>(undefined)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  const [selectedReservationForPayment, setSelectedReservationForPayment] = React.useState<string | undefined>(undefined)

  // Custom hooks
  const reservationActions = useReservationActions(refreshReservations)
  const { filteredReservations, statusCounts } = useReservationFilters(
    reservations,
    searchTerm,
    statusFilter
  )

  // Handlers
  const handleCreateReservation = React.useCallback(() => {
    setEditingReservation(undefined)
    setIsDialogOpen(true)
  }, [])

  const handleEditReservation = React.useCallback((reservation: any) => {
    setEditingReservation(reservation)
    setIsDialogOpen(true)
  }, [])

  const handleRegisterPayment = React.useCallback((reservationId: string) => {
    setSelectedReservationForPayment(reservationId)
    setIsPaymentDialogOpen(true)
  }, [])

  const handleDialogClose = React.useCallback((open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setEditingReservation(undefined)
  }, [])

  const handlePaymentDialogClose = React.useCallback((open: boolean) => {
    setIsPaymentDialogOpen(open)
    if (!open) setSelectedReservationForPayment(undefined)
  }, [])

  const handleReservationSuccess = React.useCallback(() => {
    refreshReservations()
    refreshRooms()
    refreshGuests()
  }, [refreshReservations, refreshRooms, refreshGuests])

  // Loading state
  if (isLoading) {
    return (
      <MainLayout
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <DashboardSkeleton />
      </MainLayout>
    )
  }

  const hasFilters = searchTerm !== "" || statusFilter !== "all"

  return (
    <MainLayout
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Reservas
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona todas las reservas y procesos de check-in/check-out
            </p>
          </div>

          <Button 
            className="group gap-2 hover:shadow-lg transition-all duration-300" 
            onClick={handleCreateReservation}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nueva Reserva
          </Button>
        </div>

        {/* Filters */}
        <ReservationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusCounts={statusCounts}
        />

        {/* Stats */}
        <ReservationStats
          totalCount={reservations.length}
          statusCounts={statusCounts}
        />

        {/* Reservations Grid or Empty State */}
        {filteredReservations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredReservations.map((reservation: any) => (
              <ReservationCard
                key={reservation._id || reservation.id}
                reservation={mapReservationData(reservation)}
                onEdit={() => handleEditReservation(reservation)}
                onDelete={reservationActions.handleDelete}
                onConfirm={reservationActions.handleConfirm}
                onCheckIn={reservationActions.handleCheckIn}
                onCheckOut={reservationActions.handleCheckOut}
                onCancel={reservationActions.handleCancel}
                onRegisterPayment={handleRegisterPayment}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasFilters={hasFilters}
            onCreateReservation={handleCreateReservation}
          />
        )}
      </div>

      {/* Dialogs */}
      <ReservationFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={handleReservationSuccess}
        reservation={editingReservation ? mapReservationForEdit(editingReservation) : undefined}
        properties={properties}
        rooms={rooms}
        guests={guests}
      />

      <PaymentFormDialog
        open={isPaymentDialogOpen}
        onOpenChange={handlePaymentDialogClose}
        onSuccess={refreshReservations}
        reservations={mapReservationsForPayment(reservations)}
        preselectedReservationId={selectedReservationForPayment}
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
