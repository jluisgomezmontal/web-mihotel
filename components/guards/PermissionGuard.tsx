"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { canAccessRoute, hasPermission, type Permission } from "@/lib/permissions"
import { AlertCircle, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  route?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * PermissionGuard Component
 * Protects content based on user permissions
 * Can check either a specific permission or route access
 */
export function PermissionGuard({
  children,
  permission,
  route,
  fallback,
  redirectTo = "/dashboard"
}: PermissionGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null)
  const user = AuthService.getUser()

  React.useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    let authorized = false

    // Check specific permission if provided
    if (permission) {
      authorized = hasPermission(user, permission)
    }
    // Check route access if provided
    else if (route) {
      authorized = canAccessRoute(user, route)
    }
    // If neither permission nor route provided, allow access
    else {
      authorized = true
    }

    setIsAuthorized(authorized)
  }, [user, permission, route, router])

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Not authorized
  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <ShieldOff className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos para acceder a esta sección
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Permisos insuficientes</p>
                  <p className="text-sm text-muted-foreground">
                    Esta página requiere permisos especiales que tu cuenta no tiene asignados.
                    Contacta a un administrador si necesitas acceso.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Volver
              </Button>
              <Button
                className="flex-1"
                onClick={() => router.push(redirectTo)}
              >
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Authorized - render children
  return <>{children}</>
}

/**
 * Hook to check permissions in components
 */
export function usePermission(permission: Permission): boolean {
  const user = AuthService.getUser()
  return hasPermission(user, permission)
}

/**
 * Hook to check route access in components
 */
export function useRouteAccess(route: string): boolean {
  const user = AuthService.getUser()
  return canAccessRoute(user, route)
}
