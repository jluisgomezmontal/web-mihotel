"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Building2, MapPin, Bed, Hotel, Edit, Trash2, DollarSign, TrendingUp, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { PermissionGuard } from "@/components/guards/PermissionGuard"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import { PropertyFormDialog } from "@/components/forms/property-form-dialog"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { useDashboard } from "@/contexts/DashboardContext"
import { cn } from "@/lib/utils"

interface Property {
  _id: string
  name: string
  type: 'hotel' | 'airbnb' | 'posada'
  address: {
    street?: string
    city: string
    state: string
    country: string
    zipCode?: string
  }
  totalRooms: number
  availableRooms?: number
  occupiedRooms?: number
  monthlyRevenue?: number
  isActive: boolean
}

function PropertyCard({ 
  property, 
  onEdit, 
  onDelete 
}: { 
  property: Property
  onEdit: (property: Property) => void
  onDelete: (property: Property) => void
}) {
  const router = useRouter()
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'Hotel'
      case 'airbnb': return 'Airbnb'
      case 'posada': return 'Posada'
      default: return type
    }
  }

  const totalRooms = property.totalRooms || 0
  const availableRooms = property.availableRooms || 0
  const occupiedRooms = property.occupiedRooms || 0
  const occupancyRate = totalRooms > 0 
    ? Math.round((occupiedRooms / totalRooms) * 100) 
    : 0

  const getOccupancyVariant = (rate: number) => {
    if (rate >= 80) return 'success'
    if (rate >= 60) return 'warning'
    return 'danger'
  }

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'text-[var(--dashboard-success)]'
    if (rate >= 60) return 'text-[var(--dashboard-warning)]'
    return 'text-[var(--dashboard-danger)]'
  }

  const getOccupancyBg = (rate: number) => {
    if (rate >= 80) return 'bg-[var(--dashboard-success-light)] border-[var(--dashboard-success)]/20'
    if (rate >= 60) return 'bg-[var(--dashboard-warning-light)] border-[var(--dashboard-warning)]/20'
    return 'bg-[var(--dashboard-danger-light)] border-[var(--dashboard-danger)]/20'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return Hotel
      case 'airbnb': return Building2
      case 'posada': return Building2
      default: return Building2
    }
  }

  const TypeIcon = getTypeIcon(property.type)

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Occupancy Indicator Bar with gradient */}
      <div className="h-1.5 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--dashboard-success)] via-[var(--dashboard-warning)] to-[var(--dashboard-danger)] opacity-20" />
        <div 
          className={cn(
            "h-full transition-all duration-500",
            occupancyRate >= 80 ? "bg-[var(--dashboard-success)]" :
            occupancyRate >= 60 ? "bg-[var(--dashboard-warning)]" :
            "bg-[var(--dashboard-danger)]"
          )}
          style={{ width: `${occupancyRate}%` }}
        />
      </div>
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative p-3 bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TypeIcon className="h-6 w-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {property.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.address.city}, {property.address.state}
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className="text-xs font-semibold px-2.5 py-1"
            >
              {getTypeLabel(property.type)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 relative">
        {/* Visual Placeholder with enhanced design */}
        <div className="aspect-video bg-gradient-to-br from-muted via-muted/80 to-muted/50 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/5 transition-all duration-500">
          <Building2 className="h-16 w-16 text-muted-foreground/30 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="backdrop-blur-sm bg-background/80 border-primary/20">
              {totalRooms} habitaciones
            </Badge>
          </div>
        </div>

        {/* Stats Grid with modern design */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-xl space-y-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-[var(--dashboard-info)]/10 rounded-lg">
                <Bed className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disponibles</span>
            </div>
            <p className="font-bold text-2xl text-[var(--dashboard-info)]">
              {availableRooms}
            </p>
            <p className="text-xs text-muted-foreground">
              de {totalRooms} total
            </p>
          </div>
          
          <div className={cn(
            "p-3 rounded-xl space-y-1.5 border hover:shadow-md transition-shadow",
            getOccupancyBg(occupancyRate)
          )}>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "p-1.5 rounded-lg",
                occupancyRate >= 80 ? "bg-[var(--dashboard-success)]/10" :
                occupancyRate >= 60 ? "bg-[var(--dashboard-warning)]/10" :
                "bg-[var(--dashboard-danger)]/10"
              )}>
                <TrendingUp className={cn("h-3.5 w-3.5", getOccupancyColor(occupancyRate))} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ocupación</span>
            </div>
            <p className={cn("font-bold text-2xl", getOccupancyColor(occupancyRate))}>
              {occupancyRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              {occupiedRooms} ocupadas
            </p>
          </div>
        </div>

        {/* Revenue Section with enhanced design */}
        {property.monthlyRevenue !== undefined && (
          <div className="p-3 bg-gradient-to-r from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--dashboard-success)]/10 rounded-lg">
                  <DollarSign className="h-4 w-4 text-[var(--dashboard-success)]" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">Ingresos del mes</span>
              </div>
              <span className="font-bold text-lg text-[var(--dashboard-success)]">
                ${property.monthlyRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons with enhanced design */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1 font-semibold group/btn hover:border-primary/50 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(property)
            }}
          >
            <Edit className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Editar
          </Button>
          <Button 
            size="sm" 
            className="flex-1 font-semibold group/btn hover:shadow-lg transition-all"
            onClick={() => router.push(`/properties/${property._id}`)}
          >
            <Building2 className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Gestionar
            <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="text-[var(--dashboard-danger)] hover:text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger-light)] hover:border-[var(--dashboard-danger)]/30 transition-all group/btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(property)
            }}
          >
            <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PropertiesPage() {
  const { properties, userData, tenantData, isLoading, error, refreshProperties } = useDashboard()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingProperty, setEditingProperty] = React.useState<Property | undefined>(undefined)
  const { alertState, hideAlert, confirmDelete, showError, showLoading, close } = useAlert()

  const handleDeleteProperty = async (property: Property) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar propiedad?',
      text: `Se eliminará permanentemente la propiedad "${property.name}" y todas sus habitaciones asociadas. Esta acción no se puede deshacer.`,
    })

    if (!confirmed) return

    showLoading('Eliminando propiedad...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/properties/${property._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        refreshProperties()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar la propiedad')
      }
    } catch (err) {
      close()
      console.error('Error deleting property:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const filteredProperties = Array.isArray(properties) 
    ? properties.filter((property: Property) =>
        property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  const propertiesArray = Array.isArray(properties) ? properties : []
  const stats = {
    total: propertiesArray.length,
    totalRooms: propertiesArray.reduce((sum, p) => sum + (p.totalRooms || 0), 0),
    occupiedRooms: propertiesArray.reduce((sum, p) => sum + (p.occupiedRooms || 0), 0),
    totalRevenue: propertiesArray.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0)
  }

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
        {/* Header with modern design */}
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
            onClick={() => {
              setEditingProperty(undefined)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nueva Propiedad
          </Button>
        </div>

        {/* Search bar with enhanced design */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 border-2 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Stats Cards with modern design */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Propiedades
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Building2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">activas</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-info)]/10 to-[var(--dashboard-info)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Habitaciones
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--dashboard-info-light)] text-[var(--dashboard-info)] group-hover:scale-110 transition-transform">
                <Bed className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-info)]">{stats.totalRooms}</div>
              <p className="text-xs text-muted-foreground mt-1">en todas las propiedades</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-warning)]/10 to-[var(--dashboard-warning)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Habitaciones Ocupadas
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--dashboard-warning-light)] text-[var(--dashboard-warning)] group-hover:scale-110 transition-transform">
                <Hotel className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-warning)]">{stats.occupiedRooms}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-[var(--dashboard-warning)]" />
                <p className="text-xs font-medium text-[var(--dashboard-warning)]">
                  {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}% ocupación
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--dashboard-success)]/10 to-[var(--dashboard-success)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos Totales
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--dashboard-success-light)] text-[var(--dashboard-success)] group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--dashboard-success)]">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-[1600px]">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={property}
                onEdit={(prop) => {
                  setEditingProperty(prop)
                  setIsDialogOpen(true)
                }}
                onDelete={handleDeleteProperty}
              />
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-md p-16">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <Building2 className="relative mx-auto h-20 w-20 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {searchTerm ? 'No se encontraron propiedades' : 'No tienes propiedades registradas'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros' 
                    : 'Comienza agregando tu primera propiedad para gestionar reservas y habitaciones de manera eficiente'}
                </p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="group gap-2 hover:shadow-lg transition-all"
                size="lg"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Crear Primera Propiedad
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <PropertyFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingProperty(undefined)
        }}
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
