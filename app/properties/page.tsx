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
import { useSweetAlert } from "@/lib/use-sweet-alert"

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
  const occupiedRooms = property.occupiedRooms || 0
  const availableRooms = totalRooms - occupiedRooms
  const occupancyRate = totalRooms > 0 
    ? Math.round((occupiedRooms / totalRooms) * 100) 
    : 0

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="hover:shadow-elegant-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {property.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {property.address.city}, {property.address.state}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {getTypeLabel(property.type)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bed className="h-3 w-3" />
              <span>Habitaciones</span>
            </div>
            <p className="font-medium">
              {availableRooms}/{totalRooms}
              <span className="text-muted-foreground ml-1">disponibles</span>
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-muted-foreground">Ocupación</p>
            <p className={`font-medium ${getOccupancyColor(occupancyRate)}`}>
              {occupancyRate}%
            </p>
          </div>
        </div>

        {property.monthlyRevenue !== undefined && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ingresos del mes</span>
              <span className="font-semibold">${property.monthlyRevenue.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1"
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
            className="flex-1"
            onClick={() => router.push(`/properties/${property._id}`)}
          >
            Gestionar
          </Button>
          <Button 
            variant="destructive"
            size="sm"
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
  const [searchTerm, setSearchTerm] = React.useState("")
  const [properties, setProperties] = React.useState<Property[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userData, setUserData] = React.useState<any>(null)
  const [tenantData, setTenantData] = React.useState<any>(null)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingProperty, setEditingProperty] = React.useState<Property | undefined>(undefined)
  const { confirmDelete, showError, showLoading, close } = useSweetAlert()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const loadProperties = React.useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Get user and tenant data
      const user = AuthService.getUser()
      const tenant = AuthService.getTenant()
      const token = AuthService.getToken()
      
      setUserData(user)
      setTenantData(tenant)
      
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('http://localhost:3000/api/properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        // La API devuelve { success: true, data: { properties: [...], pagination: {...} } }
        const propertiesArray = data.data?.properties || data.properties || []
        setProperties(Array.isArray(propertiesArray) ? propertiesArray : [])
      } else if (response.status === 401) {
        AuthService.clearAuth()
        window.location.href = '/auth/login'
      } else {
        setError('Error al cargar las propiedades')
      }
    } catch (err) {
      console.error('Error loading properties:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (!isMounted) return
    loadProperties()
  }, [isMounted, loadProperties])

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
        loadProperties()
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        onSuccess={loadProperties}
        property={editingProperty as any}
      />
    </MainLayout>
  )
}
