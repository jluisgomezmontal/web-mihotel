"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  tenantName?: string
}

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    badge: null
  },
  {
    title: "Propiedades",
    icon: Building2,
    href: "/properties",
    badge: null
  },
  {
    title: "Habitaciones",
    icon: Bed,
    href: "/rooms",
    badge: null
  },
  {
    title: "Reservas",
    icon: Calendar,
    href: "/reservations",
    badge: "new"
  },
  {
    title: "Huéspedes",
    icon: UserCheck,
    href: "/guests",
    badge: null
  },
  {
    title: "Pagos",
    icon: CreditCard,
    href: "/payments",
    badge: null
  },
  {
    title: "Usuarios",
    icon: Users,
    href: "/users",
    badge: null
  },
  {
    title: "Reportes",
    icon: BarChart3,
    href: "/reports",
    badge: null
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/settings",
    badge: null
  }
]

export function Sidebar({ isCollapsed, onToggle, tenantName = "MiHotel" }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent 
          isCollapsed={false}
          onToggle={() => setIsMobileOpen(false)}
          tenantName={tenantName}
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
          tenantName={tenantName}
          pathname={pathname}
          isMobile={false}
        />
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>
    </>
  )
}

interface SidebarContentProps {
  isCollapsed: boolean
  onToggle: () => void
  tenantName: string
  pathname: string
  isMobile: boolean
}

function SidebarContent({ isCollapsed, onToggle, tenantName, pathname, isMobile }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200",
          isCollapsed && !isMobile && "justify-center"
        )}>
          <div className="flex items-center justify-center w-8 h-8 bg-sidebar-primary rounded-lg">
            <Hotel className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">{tenantName}</span>
              <span className="text-xs text-sidebar-foreground/70">Hotel Management</span>
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
            {isMobile ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
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

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-sidebar-foreground/70">Tema</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        )}
        
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            isCollapsed && !isMobile && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5" />
          {(!isCollapsed || isMobile) && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  )
}
