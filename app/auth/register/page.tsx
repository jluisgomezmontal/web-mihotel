"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Hotel, ArrowLeft } from "lucide-react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { API_BASE_URL } from "@/lib/api-config"

// Validation schema for registration
const registerSchema = z.object({
  // User fields
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    
    try {
      // Call registration endpoint with correct payload structure
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant: {
            name: `Cuenta de ${data.firstName} ${data.lastName}`,
            type: 'hotel',
            plan: 'basic',
            settings: {
              currency: 'USD',
              timezone: 'America/Mexico_City',
              language: 'es'
            }
          },
          admin: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
            profile: {
              phone: data.phone,
              timezone: 'America/Mexico_City'
            }
          }
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Registration successful
        await Swal.fire({
          title: "¡Cuenta Creada!",
          text: `Bienvenido a MiHotel, ${data.firstName}. Tu cuenta ha sido creada exitosamente. Ahora puedes agregar tus propiedades hoteleras.`,
          icon: "success",
          confirmButtonText: "Continuar",
          confirmButtonColor: "hsl(var(--primary))",
        })

        // Redirect to login page
        router.push('/auth/login?registered=true')
      } else {
        // Registration failed
        let errorMessage = "Ocurrió un error durante el registro"
        
        if (result.errors && Array.isArray(result.errors)) {
          errorMessage = result.errors.map((err: any) => err.message).join(", ")
        } else if (result.message) {
          errorMessage = result.message
        }

        await Swal.fire({
          title: "Error de Registro",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Reintentar",
          confirmButtonColor: "hsl(var(--destructive))",
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      await Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose",
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "hsl(var(--destructive))",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg">
              <Hotel className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MiHotel SaaS</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestión Hotelera</p>
            </div>
          </div>
          
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Únete a MiHotel y comienza a gestionar tus propiedades, reservas y huéspedes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    {...form.register("firstName")}
                    className={form.formState.errors.firstName ? "border-destructive" : ""}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Tu apellido"
                    {...form.register("lastName")}
                    className={form.formState.errors.lastName ? "border-destructive" : ""}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...form.register("email")}
                    className={form.formState.errors.email ? "border-destructive" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+52 998 123 4567"
                    {...form.register("phone")}
                    className={form.formState.errors.phone ? "border-destructive" : ""}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      {...form.register("password")}
                      className={form.formState.errors.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      {...form.register("confirmPassword")}
                      className={form.formState.errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>


            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-primary"
              onClick={() => router.push('/auth/login')}
            >
              Iniciar Sesión
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
