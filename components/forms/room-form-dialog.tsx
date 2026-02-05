"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { Loader2, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { AMENITIES_LIST } from "@/const"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

const roomFormSchema = z.object({
  propertyId: z.string().min(1, "Debes seleccionar una propiedad"),
  nameOrNumber: z.string()
    .min(1, "El nombre o número es requerido")
    .max(50, "No puede exceder 50 caracteres")
    .trim(),
  type: z.enum(["room", "suite", "apartment"], {
    errorMap: () => ({ message: "Debes seleccionar un tipo de habitación" })
  }),
  description: z.string().max(500, "No puede exceder 500 caracteres").optional(),
  capacity: z.object({
    adults: z.number()
      .int("Debe ser un número entero")
      .min(1, "Mínimo 1 adulto")
      .max(20, "Máximo 20 adultos"),
    children: z.number()
      .int("Debe ser un número entero")
      .min(0, "No puede ser negativo")
      .max(10, "Máximo 10 niños")
  }),
  pricing: z.object({
    basePrice: z.number()
      .positive("El precio debe ser mayor a 0")
      .min(0.01, "El precio mínimo es 0.01"),
    currency: z.string().length(3, "Debe ser un código de 3 letras"),
    extraAdultPrice: z.number().min(0, "No puede ser negativo"),
    extraChildPrice: z.number().min(0, "No puede ser negativo")
  }),
  status: z.enum(["available", "maintenance", "cleaning", "occupied"]),
  amenities: z.array(z.string()).optional()
})

type RoomFormValues = z.infer<typeof roomFormSchema>

interface Room {
  _id?: string
  propertyId: string
  nameOrNumber: string
  type: string
  description?: string
  capacity: {
    adults: number
    children?: number
  }
  pricing: {
    basePrice: number
    currency: string
    extraAdultPrice?: number
    extraChildPrice?: number
  }
  status: string
  amenities?: string[]
}

interface RoomFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  propertyId?: string
  properties?: Array<{ _id: string; name: string }>
  room?: Room
}

export function RoomFormDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  propertyId,
  properties = [],
  room
}: RoomFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const isEditMode = !!room

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      propertyId: propertyId || "",
      nameOrNumber: "",
      type: "room",
      description: "",
      capacity: {
        adults: 2,
        children: 0,
      },
      pricing: {
        basePrice: 0,
        currency: "MXN",
        extraAdultPrice: 0,
        extraChildPrice: 0,
      },
      status: "available",
      amenities: [],
    }
  })

  React.useEffect(() => {
    if (open && room) {
      form.reset({
        propertyId: typeof room.propertyId === 'string' ? room.propertyId : (room.propertyId as any)?._id || room.propertyId,
        nameOrNumber: room.nameOrNumber,
        type: room.type as any,
        description: room.description || "",
        capacity: {
          adults: room.capacity.adults,
          children: room.capacity.children || 0,
        },
        pricing: {
          basePrice: room.pricing.basePrice,
          currency: room.pricing.currency,
          extraAdultPrice: room.pricing.extraAdultPrice || 0,
          extraChildPrice: room.pricing.extraChildPrice || 0,
        },
        status: room.status as any,
        amenities: room.amenities || [],
      })
    } else if (open && !room) {
      form.reset({
        propertyId: propertyId || "",
        nameOrNumber: "",
        type: "room",
        description: "",
        capacity: {
          adults: 2,
          children: 0,
        },
        pricing: {
          basePrice: 0,
          currency: "MXN",
          extraAdultPrice: 0,
          extraChildPrice: 0,
        },
        status: "available",
        amenities: [],
      })
    }
    setError(null)
  }, [open, room, propertyId, form])

  const onSubmit = async (data: RoomFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const url = isEditMode 
        ? `${API_BASE_URL}/rooms/${room._id}`
        : `${API_BASE_URL}/rooms`
      
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
        form.reset()
      } else {
        setError(responseData.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la habitación`)
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} room:`, err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = form.getValues('amenities') || []
    const isSelected = currentAmenities.includes(amenityId)
    
    form.setValue(
      'amenities',
      isSelected
        ? currentAmenities.filter(a => a !== amenityId)
        : [...currentAmenities, amenityId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Habitación' : 'Nueva Habitación'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Actualiza la información de la habitación'
              : 'Completa los campos requeridos (*) para registrar una nueva habitación'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {!propertyId && properties.length > 0 && (
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Propiedad *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una propiedad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property._id} value={property._id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nameOrNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre/Número *</FormLabel>
                      <FormControl>
                        <Input placeholder="101, Suite Presidencial, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Habitación *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="room">Habitación</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="apartment">Apartamento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción de la habitación..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Máximo 500 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Capacidad</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity.adults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adultos *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity.children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niños</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Precios</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricing.basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Base *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricing.currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MXN">MXN</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Amenidades</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecciona las amenidades disponibles en esta habitación
                </p>
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                  {Object.entries(AMENITIES_LIST).map(([category, amenities]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-primary">{category}</h4>
                      <div className="grid grid-cols-2 gap-3 pl-2">
                        {amenities.map((amenity) => (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity.id}
                              checked={form.watch('amenities')?.includes(amenity.id) || false}
                              onCheckedChange={() => toggleAmenity(amenity.id)}
                            />
                            <label
                              htmlFor={amenity.id}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {amenity.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {form.watch('amenities') && form.watch('amenities')!.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{form.watch('amenities')!.length}</span> amenidad{form.watch('amenities')!.length !== 1 ? 'es' : ''} seleccionada{form.watch('amenities')!.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Inicial</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="maintenance">Mantenimiento</SelectItem>
                        <SelectItem value="cleaning">Limpieza</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Actualizar Habitación' : 'Crear Habitación'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
