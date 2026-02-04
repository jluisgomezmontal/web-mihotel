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
  ChevronDown,
  CreditCard,
  Home,
  Hotel,
  Menu,
  Settings,
  Users,
  Bed,
  UserCheck,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  X,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    title: "Propiedades",
    icon: Building2,
    href: "/properties",
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
    title: "Usuarios",
    icon: Users,
    href: "/users",
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

function SidebarContent({ isCollapsed, onToggle, pathname, isMobile }: SidebarContentProps) {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    setUser(AuthService.getUser())
  }, [])

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
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200",
          isCollapsed && !isMobile && "justify-center"
        )}>
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Hotel className="h-6 w-6 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-sidebar-foreground tracking-tight">MiHotel</span>
            </div>
          )}
        </div>
        
        {(!isCollapsed || isMobile) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            {isMobile ? <X className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {accessibleMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                isCollapsed && !isMobile && "justify-center px-2"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && !isMobile && "h-6 w-6")} />
              {(!isCollapsed || isMobile) && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
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
