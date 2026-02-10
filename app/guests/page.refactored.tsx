/**
 * Guests Page - Refactored
 * Main page component for managing guests
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
import { GuestFormDialog } from "@/components/forms/guest-form-dialog"
import { ReservationFormDialog } from "@/components/forms/reservation-form-dialog"
import { useDashboard } from "@/contexts/DashboardContext"
import { useAlert } from '@/lib/use-alert'

// Local imports - modular architecture
import { GuestCard } from "./components/GuestCard"
import { GuestStats } from "./components/GuestStats"
import { GuestFilters } from "./components/GuestFilters"
import { EmptyState } from "./components/EmptyState"
import { useGuestActions } from "./hooks/useGuestActions"
import { useGuestData } from "./hooks/useGuestData"
import { useGuestFilters } from "./hooks/useGuestFilters"
import { mapGuestsForReservation } from "./utils/guestMapper"
import type { Guest } from "./types"

export default function GuestsPage() {
  // Context
  const { userData, tenantData } = useDashboard()
  const { alertState, hideAlert } = useAlert()
  
  // Local state
  const [searchTerm, setSearchTerm] = React.useState("")
  const [vipFilter, setVipFilter] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingGuest, setEditingGuest] = React.useState<Guest | undefined>(undefined)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = React.useState(false)
  const [selectedGuestForReservation, setSelectedGuestForReservation] = React.useState<string | undefined>(undefined)

  // Custom hooks
  const { guests, properties, rooms, isLoading, loadGuests } = useGuestData()
  const guestActions = useGuestActions(loadGuests)
  const { filteredGuests, stats } = useGuestFilters(guests, searchTerm, vipFilter)

  // Handlers
  const handleCreateGuest = React.useCallback(() => {
    setEditingGuest(undefined)
    setIsDialogOpen(true)
  }, [])

  const handleEditGuest = React.useCallback((guest: Guest) => {
    setEditingGuest(guest)
    setIsDialogOpen(true)
  }, [])

  const handleReserve = React.useCallback((guestId: string) => {
    setSelectedGuestForReservation(guestId)
    setIsReservationDialogOpen(true)
  }, [])

  const handleDialogClose = React.useCallback((open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setEditingGuest(undefined)
  }, [])

  const handleReservationDialogClose = React.useCallback((open: boolean) => {
    setIsReservationDialogOpen(open)
    if (!open) setSelectedGuestForReservation(undefined)
  }, [])

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

  const hasFilters = searchTerm !== "" || vipFilter !== "all"

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
                Huéspedes
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona la información de tus huéspedes y su historial
            </p>
          </div>
          
          <Button 
            className="group gap-2 hover:shadow-lg transition-all duration-300" 
            onClick={handleCreateGuest}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nuevo Huésped
          </Button>
        </div>

        {/* Filters */}
        <GuestFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          vipFilter={vipFilter}
          onVipFilterChange={setVipFilter}
          stats={stats}
        />

        {/* Stats */}
        <GuestStats stats={stats} />

        {/* Guests Grid or Empty State */}
        {filteredGuests.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredGuests.map((guest) => (
              <GuestCard 
                key={guest._id} 
                guest={guest}
                onEdit={handleEditGuest}
                onDelete={guestActions.handleDelete}
                onToggleVIP={guestActions.handleToggleVIP}
                onReserve={handleReserve}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasFilters={hasFilters}
            onCreateGuest={handleCreateGuest}
          />
        )}
      </div>

      {/* Dialogs */}
      <GuestFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={loadGuests}
        guest={editingGuest}
      />

      <ReservationFormDialog
        open={isReservationDialogOpen}
        onOpenChange={handleReservationDialogClose}
        onSuccess={loadGuests}
        properties={properties}
        rooms={rooms}
        guests={mapGuestsForReservation(guests)}
        preselectedGuestId={selectedGuestForReservation}
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
