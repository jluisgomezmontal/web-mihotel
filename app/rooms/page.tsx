"use client"

import * as React from "react"
import { Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { useAlert } from '@/lib/use-alert'
import { RoomFormDialog } from "@/components/forms/room-form-dialog"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { useDashboard } from "@/contexts/DashboardContext"

import { RoomCard } from "./components/RoomCard"
import { RoomStats } from "./components/RoomStats"
import { RoomFilters } from "./components/RoomFilters"
import { EmptyState } from "./components/EmptyState"
import { useRoomData } from "./hooks/useRoomData"
import { useRoomActions } from "./hooks/useRoomActions"
import { useRoomStatusActions } from "./hooks/useRoomStatusActions"
import type { Room } from "./types"

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingRoom, setEditingRoom] = React.useState<Room | undefined>(undefined)
  const { alertState, hideAlert, showError, showLoading, showSuccess } = useAlert()
  const { userData, tenantData } = useDashboard()

  const { rooms, properties, isLoading, loadRooms } = useRoomData(statusFilter, typeFilter, searchTerm)
  const roomActions = useRoomActions(loadRooms)
  const roomStatusActions = useRoomStatusActions(loadRooms, {
    showError,
    showLoading,
    close: hideAlert,
    showSuccess,
  })

  const stats = React.useMemo(() => ({
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  }), [rooms])

  const handleCreateRoom = React.useCallback(() => {
    setEditingRoom(undefined)
    setIsDialogOpen(true)
  }, [])

  const handleEditRoom = React.useCallback((room: Room) => {
    setEditingRoom(room)
    setIsDialogOpen(true)
  }, [])

  const handleDialogClose = React.useCallback((open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setEditingRoom(undefined)
  }, [])

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

  const hasFilters = searchTerm !== "" || statusFilter !== "all" || typeFilter !== "all"

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
                Habitaciones
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona todas las habitaciones de tus propiedades
            </p>
          </div>
          
          <Button 
            className="group gap-2 hover:shadow-lg transition-all duration-300" 
            onClick={handleCreateRoom}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nueva Habitación
          </Button>
        </div>

        {/* Filters */}
        <RoomFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />

        {/* Stats */}
        <RoomStats stats={stats} />

        {/* Rooms Grid or Empty State */}
        {rooms.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard 
                key={room._id} 
                room={room}
                onEdit={handleEditRoom}
                onDelete={roomActions.handleDelete}
                onStatusChange={roomStatusActions.handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasFilters={hasFilters}
            onCreateRoom={handleCreateRoom}
          />
        )}
      </div>

      <RoomFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={loadRooms}
        properties={properties}
        room={editingRoom as any}
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
