"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Hotel, LogIn } from "lucide-react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AuthService } from "@/lib/auth"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    
    try {
      // Use AuthService for login
      const result = await AuthService.login(data.email, data.password)

      if (result.success && result.data) {
        // Login successful
        const { user, tenant } = result.data

        await Swal.fire({
          title: "¡Bienvenido!",
          text: `Hola ${user.name}, bienvenido a ${tenant.name}`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        })

        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        // Login failed
        let errorMessage = "Credenciales incorrectas"
        
        if (result.errors && Array.isArray(result.errors)) {
          errorMessage = result.errors.map((err: any) => err.message).join(", ")
        } else if (result.message) {
          errorMessage = result.message
        }

        await Swal.fire({
          title: "Error de Autenticación",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Reintentar",
          confirmButtonColor: "hsl(var(--destructive))",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      
      await Swal.fire({
        title: "Error de Conexión",
        text: "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:3000",
        icon: "error",
        confirmButtonText: "Reintentar",
        confirmButtonColor: "hsl(var(--destructive))",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary rounded-2xl shadow-lg mb-4">
            <Hotel className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MiHotel SaaS</h1>
          <p className="text-muted-foreground mt-2">
            Sistema de gestión hotelera
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-elegant-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@hotel.com"
                  {...form.register("email")}
                  className={cn(
                    "transition-all",
                    form.formState.errors.email && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                    className={cn(
                      "pr-10 transition-all",
                      form.formState.errors.password && "border-destructive focus-visible:ring-destructive"
                    )}
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
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Demo Credentials */}
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium text-muted-foreground mb-1">Credenciales de prueba:</p>
                <p className="text-xs">Email: demo@mihotel.com</p>
                <p className="text-xs">Contraseña: 123456</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>

              <CardFooter className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-primary"
                  onClick={() => router.push('/auth/register')}
                >
                  Crear cuenta
                </Button>
              </CardFooter>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 MiHotel SaaS. Sistema profesional de gestión hotelera.
        </div>
      </div>
    </div>
  )
}
