"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Bed, Users, DollarSign, MapPin, Clock, Phone, Mail, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthService } from "@/lib/auth"
import { RoomFormDialog } from "@/components/forms/room-form-dialog"
import { PropertyFormDialog } from "@/components/forms/property-form-dialog"
import { useSweetAlert } from "@/lib/use-sweet-alert"

interface Property {
  _id: string
  name: string
  type: string
  description?: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode?: string
  }
  contact?: {
    phone?: string
    email?: string
  }
  timezone: string
  checkInTime: string
  checkOutTime: string
  amenities?: string[]
  isActive: boolean
}

interface Room {
  _id: string
  propertyId: string
  nameOrNumber: string
  type: string
  capacity: {
    adults: number
    children?: number
  }
  pricing: {
    basePrice: number
    currency: string
  }
  status: string
  amenities?: string[]
  isActive: boolean
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = React.useState<Property | null>(null)
  const [rooms, setRooms] = React.useState<Room[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [userData, setUserData] = React.useState<any>(null)
  const [tenantData, setTenantData] = React.useState<any>(null)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = React.useState(false)
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = React.useState(false)
  const [editingRoom, setEditingRoom] = React.useState<Room | undefined>(undefined)
  const { confirmDelete, showError, showLoading, close } = useSweetAlert()

  const loadPropertyDetails = React.useCallback(async () => {
      try {
        setIsLoading(true)
        
        const user = AuthService.getUser()
        const tenant = AuthService.getTenant()
        const token = AuthService.getToken()
        
        setUserData(user)
        setTenantData(tenant)
        
        if (!token) {
          window.location.href = '/auth/login'
          return
        }

        // Load property details
        const propertyResponse = await fetch(`http://localhost:3000/api/properties/${propertyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (propertyResponse.ok) {
          const propertyData = await propertyResponse.json()
          setProperty(propertyData.data?.property || null)
        } else if (propertyResponse.status === 401) {
          AuthService.clearAuth()
          window.location.href = '/auth/login'
          return
        } else {
          setError('Error al cargar la propiedad')
          return
        }

        // Load rooms for this property
        const roomsResponse = await fetch(`http://localhost:3000/api/rooms/property/${propertyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (roomsResponse.ok) {
          const roomsData = await roomsResponse.json()
          const roomsArray = roomsData.data?.rooms || roomsData.rooms || []
          setRooms(Array.isArray(roomsArray) ? roomsArray : [])
        }

      } catch (err) {
        console.error('Error loading property details:', err)
        setError('Error de conexión con el servidor')
      } finally {
        setIsLoading(false)
      }
    }, [propertyId])

  const loadRooms = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const roomsResponse = await fetch(`http://localhost:3000/api/rooms/property/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json()
        const roomsArray = roomsData.data?.rooms || roomsData.rooms || []
        setRooms(Array.isArray(roomsArray) ? roomsArray : [])
      }
    } catch (err) {
      console.error('Error loading rooms:', err)
    }
  }, [propertyId])

  React.useEffect(() => {
    if (propertyId) {
      loadPropertyDetails()
    }
  }, [propertyId, loadPropertyDetails])

  const handleDeleteProperty = async () => {
    if (!property) return

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

      const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        router.push('/properties')
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

  const handleDeleteRoom = async (room: Room) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar habitación?',
      text: `Se eliminará permanentemente la habitación "${room.nameOrNumber}". Esta acción no se puede deshacer.`,
    })

    if (!confirmed) return

    showLoading('Eliminando habitación...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/rooms/${room._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        loadRooms()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar la habitación')
      }
    } catch (err) {
      close()
      console.error('Error deleting room:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'occupied': return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'reserved': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'maintenance': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'cleaning': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Disponible',
      occupied: 'Ocupada',
      reserved: 'Reservada',
      maintenance: 'Mantenimiento',
      cleaning: 'Limpieza'
    }
    return labels[status] || status
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      room: 'Habitación',
      suite: 'Suite',
      apartment: 'Apartamento'
    }
    return labels[type] || type
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

  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/properties')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {property.address.street}, {property.address.city}, {property.address.state}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsPropertyDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Editar Propiedad
            </Button>
            <Button 
              variant="destructive" 
              className="gap-2"
              onClick={handleDeleteProperty}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {property.contact?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{property.contact.phone}</span>
                </div>
              )}
              {property.contact?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{property.contact.email}</span>
                </div>
              )}
              {!property.contact?.phone && !property.contact?.email && (
                <p className="text-sm text-muted-foreground">No hay información de contacto</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Horarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Check-in:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{property.checkInTime}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Check-out:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{property.checkOutTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estadísticas de Habitaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold text-lg">{roomStats.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Disponibles:</span>
                <span className="font-medium text-green-600">{roomStats.available}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ocupadas:</span>
                <span className="font-medium text-red-600">{roomStats.occupied}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {property.description && (
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{property.description}</p>
            </CardContent>
          </Card>
        )}

        {property.amenities && property.amenities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Amenidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, idx) => (
                  <Badge key={idx} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Habitaciones</h2>
              <p className="text-muted-foreground text-sm">
                Gestiona las habitaciones de esta propiedad
              </p>
            </div>
            <Button className="gap-2" onClick={() => {
              setEditingRoom(undefined)
              setIsRoomDialogOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Nueva Habitación
            </Button>
          </div>

          {rooms.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Card key={room._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Bed className="h-4 w-4" />
                          {room.nameOrNumber}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {getTypeLabel(room.type)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(room.status)}`}>
                        {getStatusLabel(room.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Capacidad</span>
                      </div>
                      <span className="font-medium">
                        {room.capacity.adults} adultos
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Precio</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">
                          {room.pricing.basePrice} {room.pricing.currency}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setEditingRoom(room as any)
                          setIsRoomDialogOpen(true)
                        }}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDeleteRoom(room)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <Bed className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    No hay habitaciones registradas
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comienza agregando habitaciones a esta propiedad
                  </p>
                </div>
                <Button onClick={() => {
                  setEditingRoom(undefined)
                  setIsRoomDialogOpen(true)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Habitación
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <RoomFormDialog
        open={isRoomDialogOpen}
        onOpenChange={(open) => {
          setIsRoomDialogOpen(open)
          if (!open) setEditingRoom(undefined)
        }}
        onSuccess={loadRooms}
        propertyId={propertyId}
        room={editingRoom}
      />

      <PropertyFormDialog
        open={isPropertyDialogOpen}
        onOpenChange={setIsPropertyDialogOpen}
        onSuccess={loadPropertyDetails}
        property={property || undefined}
      />
    </MainLayout>
  )
}
