"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Building2, MapPin, Bed, Hotel, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthService } from "@/lib/auth"
import { PropertyFormDialog } from "@/components/forms/property-form-dialog"
import { useAlert } from "@/lib/use-alert"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { useDashboard } from "@/contexts/DashboardContext"

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

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {/* Occupancy Indicator Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" style={{
        background: `linear-gradient(to right, 
          ${occupancyRate >= 80 ? '#22c55e' : occupancyRate >= 60 ? '#eab308' : '#ef4444'} ${occupancyRate}%, 
          #e5e7eb ${occupancyRate}%)`
      }} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {property.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {property.address.city}, {property.address.state}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              {getTypeLabel(property.type)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Visual Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:from-primary/5 group-hover:to-primary/10 transition-all">
          <Building2 className="h-12 w-12 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bed className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Habitaciones</span>
            </div>
            <p className="font-bold text-lg">
              {availableRooms}<span className="text-muted-foreground font-normal text-sm">/{totalRooms}</span>
            </p>
            <p className="text-xs text-muted-foreground">disponibles</p>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ocupación</p>
            <p className={`font-bold text-lg ${getOccupancyColor(occupancyRate)}`}>
              {occupancyRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              {occupiedRooms} ocupadas
            </p>
          </div>
        </div>

        {/* Revenue Section */}
        {property.monthlyRevenue !== undefined && (
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-green-900 dark:text-green-100">Ingresos del mes</span>
              <span className="font-bold text-lg text-green-700 dark:text-green-400">
                ${property.monthlyRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1 font-semibold"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(property)
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            size="sm" 
            className="flex-1 font-semibold"
            onClick={() => router.push(`/properties/${property._id}`)}
          >
            <Building2 className="h-4 w-4 mr-1" />
            Gestionar
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(property)
            }}
          >
            <Trash2 className="h-4 w-4" />
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

      const response = await fetch(`http://localhost:3000/api/properties/${property._id}`, {
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando propiedades...</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Propiedades</h1>
            <p className="text-muted-foreground">
              Gestiona tus hoteles, posadas y propiedades Airbnb
            </p>
          </div>
          
          <Button className="gap-2" onClick={() => {
            setEditingProperty(undefined)
            setIsDialogOpen(true)
          }}>
            <Plus className="h-4 w-4" />
            Nueva Propiedad
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Propiedades
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Habitaciones
              </CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRooms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ocupadas
              </CardTitle>
              <Hotel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupiedRooms}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}% ocupación
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">este mes</p>
            </CardContent>
          </Card>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-[1600px] mx-auto">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property._id} 
                property={property}
                onEdit={(prop) => {
                  console.log(prop)
                  setEditingProperty(prop)
                  setIsDialogOpen(true)
                }}
                onDelete={handleDeleteProperty}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron propiedades' : 'No tienes propiedades registradas'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda' 
                    : 'Comienza agregando tu primera propiedad para gestionar reservas y habitaciones'}
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Propiedad
              </Button>
            </div>
          </Card>
        )}
      </div>

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
