"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Hotel, Building2, Calendar, Users, Star, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: Hotel,
      title: "Gestión Multi-Propiedad",
      description: "Administra hoteles, Airbnb y posadas desde una sola plataforma"
    },
    {
      icon: Calendar,
      title: "Reservas Inteligentes",
      description: "Sistema completo de reservas con check-in/check-out automático"
    },
    {
      icon: Users,
      title: "Multi-Tenant SaaS",
      description: "Cada hotel tiene su espacio privado y seguro"
    },
    {
      icon: Building2,
      title: "Dashboard Analítico",
      description: "KPIs en tiempo real, ocupación e ingresos"
    },
    {
      icon: Shield,
      title: "Seguridad Avanzada",
      description: "Autenticación JWT y aislamiento completo de datos"
    },
    {
      icon: Zap,
      title: "Rápido y Moderno",
      description: "Interfaz elegante con Next.js y Tailwind CSS"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-lg">
              <Hotel className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MiHotel SaaS</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión Hotelera</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push("/auth/login")}>
              Iniciar Sesión
            </Button>
            <Button onClick={() => router.push("/auth/register")}>
              Comenzar Gratis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="px-4 py-2">
            🚀 Sistema Completo de Gestión Hotelera
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Gestiona tu hotel con
            <span className="text-primary block">inteligencia y estilo</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plataforma SaaS moderna para hoteles, posadas y Airbnb. 
            Reservas, check-in/out, analytics y más en una sola aplicación.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push("/auth/login")}
              className="text-lg px-8 py-6"
            >
              <Star className="mr-2 h-5 w-5" />
              Probar Demo
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="text-lg px-8 py-6"
            >
              Ver Dashboard
            </Button>
          </div>

          {/* Demo Credentials */}
          <div className="bg-muted/50 rounded-xl p-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-2">🔑 Credenciales Demo</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> demo@mihotel.com<br />
              <strong>Password:</strong> 123456
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Todo lo que necesitas para gestionar tu hotel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desde reservas hasta analytics, nuestra plataforma tiene todas las herramientas 
            que necesitas para hacer crecer tu negocio hotelero.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-elegant-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 px-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para revolucionar tu hotel?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Únete a cientos de hoteles que ya confían en MiHotel SaaS para 
              gestionar sus reservas, huéspedes y operaciones diarias.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => router.push("/auth/login")}
              className="text-lg px-8 py-6"
            >
              Comenzar Ahora
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p> 2024 MiHotel SaaS. Sistema profesional de gestión hotelera.</p>
        </div>
      </footer>
    </div>
  )
}
