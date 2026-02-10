"use client"

import * as React from "react"
import { Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { useAlert } from '@/lib/use-alert'
import { PropertyFormDialog } from "@/components/forms/property-form-dialog"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { useDashboard } from "@/contexts/DashboardContext"

import { PropertyCard } from "./components/PropertyCard"
import { PropertyStats } from "./components/PropertyStats"
import { PropertyFilters } from "./components/PropertyFilters"
import { EmptyState } from "./components/EmptyState"
import { usePropertyActions } from "./hooks/usePropertyActions"
import { usePropertyFilters } from "./hooks/usePropertyFilters"
import type { Property } from "./types"

export default function PropertiesPage() {
  const { properties, userData, tenantData, isLoading, refreshProperties } = useDashboard()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingProperty, setEditingProperty] = React.useState<Property | undefined>(undefined)
  const { alertState, hideAlert } = useAlert()

  const propertyActions = usePropertyActions(refreshProperties)
  const { filteredProperties, stats } = usePropertyFilters(properties, searchTerm)

  const handleCreateProperty = React.useCallback(() => {
    setEditingProperty(undefined)
    setIsDialogOpen(true)
  }, [])

  const handleEditProperty = React.useCallback((property: Property) => {
    setEditingProperty(property)
    setIsDialogOpen(true)
  }, [])

  const handleDialogClose = React.useCallback((open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setEditingProperty(undefined)
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
                Propiedades
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona tus hoteles, posadas y propiedades Airbnb
            </p>
          </div>
          
          <Button 
            className="group gap-2 hover:shadow-lg transition-all duration-300" 
            onClick={handleCreateProperty}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nueva Propiedad
          </Button>
        </div>

        {/* Filters */}
        <PropertyFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Stats */}
        <PropertyStats stats={stats} />

        {/* Properties Grid or Empty State */}
        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-[1600px]">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={property}
                onEdit={handleEditProperty}
                onDelete={propertyActions.handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasSearch={searchTerm !== ""}
            onCreateProperty={handleCreateProperty}
          />
        )}
      </div>

      {/* Dialogs */}
      <PropertyFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={refreshProperties}
        property={editingProperty as any}
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
