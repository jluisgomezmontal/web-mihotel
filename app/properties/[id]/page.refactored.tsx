"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { useAlert } from '@/lib/use-alert'
import { RoomFormDialog } from "@/components/forms/room-form-dialog"
import { PropertyFormDialog } from "@/components/forms/property-form-dialog"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"

import { PropertyHeader } from "./components/PropertyHeader"
import { PropertyInfo } from "./components/PropertyInfo"
import { RoomsSection } from "./components/RoomsSection"
import { usePropertyDetail } from "./hooks/usePropertyDetail"
import { usePropertyActions } from "./hooks/usePropertyActions"
import type { Room } from "./types"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [isRoomDialogOpen, setIsRoomDialogOpen] = React.useState(false)
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = React.useState(false)
  const [editingRoom, setEditingRoom] = React.useState<Room | undefined>(undefined)
  const { alertState, hideAlert } = useAlert()

  const {
    property,
    rooms,
    isLoading,
    error,
    userData,
    tenantData,
    loadPropertyDetails,
    loadRooms
  } = usePropertyDetail(propertyId)

  const propertyActions = usePropertyActions(propertyId, loadRooms)

  const roomStats = React.useMemo(() => ({
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
  }), [rooms])

  const handleCreateRoom = React.useCallback(() => {
    setEditingRoom(undefined)
    setIsRoomDialogOpen(true)
  }, [])

  const handleEditRoom = React.useCallback((room: Room) => {
    setEditingRoom(room as any)
    setIsRoomDialogOpen(true)
  }, [])

  const handleRoomDialogClose = React.useCallback((open: boolean) => {
    setIsRoomDialogOpen(open)
    if (!open) setEditingRoom(undefined)
  }, [])

  if (isLoading) {
    return (
      <MainLayout 
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando detalles...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !property) {
    return (
      <MainLayout 
        user={userData || { name: "Usuario", email: "", role: "admin" }}
        tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Error al cargar la propiedad</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => router.push('/properties')}>
              Volver a Propiedades
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6">
        <PropertyHeader
          property={property}
          onEdit={() => setIsPropertyDialogOpen(true)}
          onDelete={() => propertyActions.handleDeleteProperty(property)}
        />

        <PropertyInfo property={property} roomStats={roomStats} />

        <RoomsSection
          rooms={rooms}
          onCreateRoom={handleCreateRoom}
          onEditRoom={handleEditRoom}
          onDeleteRoom={propertyActions.handleDeleteRoom}
        />
      </div>

      <RoomFormDialog
        open={isRoomDialogOpen}
        onOpenChange={handleRoomDialogClose}
        onSuccess={loadRooms}
        propertyId={propertyId}
        room={editingRoom}
      />

      <PropertyFormDialog
        open={isPropertyDialogOpen}
        onOpenChange={setIsPropertyDialogOpen}
        onSuccess={loadPropertyDetails}
        property={property}
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
