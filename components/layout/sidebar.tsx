"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthService } from "@/lib/auth"
import { canAccessRoute } from "@/lib/permissions"
import type { User } from "@/types"
import {
  Building2,
  Calendar,
  CreditCard,
  Home,
  Hotel,
  Settings,
  Users,
  Bed,
  UserCheck,
  BarChart3,
  X,
  ChevronLeft,
  Sparkles,
  Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    badge: null,
    requiresPermission: false
  },
  {
    title: "Reservas",
    icon: Calendar,
    href: "/reservations",
    badge: null,
    requiresPermission: true
  },
  {
    title: "Huéspedes",
    icon: UserCheck,
    href: "/guests",
    badge: null,
    requiresPermission: true
  },
  {
    title: "Pagos",
    icon: CreditCard,
    href: "/payments",
    badge: null,
    requiresPermission: true
  },
  {
    title: "Reportes",
    icon: BarChart3,
    href: "/reports",
    badge: null,
    requiresPermission: true
  },
  {
    title: "Habitaciones",
    icon: Bed,
    href: "/rooms",
    badge: null,
    requiresPermission: true
  },
  {
    title: "Propiedades",
    icon: Building2,
    href: "/properties",
    badge: null,
    requiresPermission: true
  },
  {
    title: "Usuarios",
    icon: Users,
    href: "/users",
    badge: null,
    requiresPermission: true
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/settings",
    badge: null,
    requiresPermission: false
  }
]

export function Sidebar({ isCollapsed, onToggle, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname()
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent 
          isCollapsed={false}
          onToggle={() => setIsMobileMenuOpen(false)}
          pathname={pathname}
          isMobile={true}
        />
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-sidebar lg:border-r lg:border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:w-16" : "lg:w-72"
      )}>
        <SidebarContent 
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          pathname={pathname}
          isMobile={false}
        />
      </div>

    </>
  )
}

interface SidebarContentProps {
  isCollapsed: boolean
  onToggle: () => void
  pathname: string
  isMobile: boolean
}

interface UserProfile {
  avatar?: string
  phone?: string
  timezone?: string
}

function SidebarContent({ isCollapsed, onToggle, pathname, isMobile }: SidebarContentProps) {
  const router = useRouter()
  const [user, setUser] = React.useState<User | null>(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  React.useEffect(() => {
    setUser(AuthService.getUser())
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      AuthService.logout()
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground', icon: Crown }
      case 'staff':
        return { label: 'Personal', color: 'bg-gradient-to-r from-[var(--dashboard-info)] to-[var(--dashboard-info)]/80 text-white', icon: Users }
      case 'cleaning':
        return { label: 'Limpieza', color: 'bg-gradient-to-r from-[var(--dashboard-warning)] to-[var(--dashboard-warning)]/80 text-white', icon: Sparkles }
      default:
        return { label: role, color: 'bg-muted text-muted-foreground', icon: Users }
    }
  }

  // Filter menu items based on user permissions
  const accessibleMenuItems = React.useMemo(() => {
    if (!user) return []
    
    return menuItems.filter(item => {
      // If item doesn't require permission check, show it
      if (!item.requiresPermission) return true
      
      // Check if user has access to this route
      return canAccessRoute(user, item.href)
    })
  }, [user])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200",
          isCollapsed && !isMobile && "justify-center"
        )}>
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-110 duration-300">
            <Hotel className="h-6 w-6 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-sidebar-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">MiHotel</span>
              <span className="text-xs text-muted-foreground">Sistema de Gestión</span>
            </div>
          )}
        </div>
        
        {(!isCollapsed || isMobile) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all hover:scale-110"
          >
            {isMobile ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {accessibleMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 hover:shadow-sm",
                isActive 
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md scale-105" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                isCollapsed && !isMobile && "justify-center px-2"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform duration-300",
                isCollapsed && !isMobile && "h-6 w-6",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
