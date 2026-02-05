"use client"

import * as React from "react"
import { Bell, ChevronDown, Moon, Sun, User, LogOut, Settings, Building2, Menu, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutDialog } from "@/components/ui/logout-dialog"
import { AuthService } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface HeaderProps {
  isCollapsed: boolean
  user?: {
    name: string
    email: string
    role: string
    avatar?: string
  }
  tenant?: {
    name: string
    type: string
  }
  notifications?: number
  onMobileMenuToggle?: () => void
}

export function Header({ 
  isCollapsed, 
  user = { name: "Usuario Demo", email: "demo@mihotel.com", role: "admin" },
  tenant = { name: "Hotel Paradise", type: "hotel" },
  notifications = 3,
  onMobileMenuToggle
}: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Clear auth data
      AuthService.logout()
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to login
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
      case 'staff':
        return 'bg-gradient-to-r from-[var(--dashboard-info)] to-[var(--dashboard-info)]/80 text-white'
      case 'cleaning':
        return 'bg-gradient-to-r from-[var(--dashboard-warning)] to-[var(--dashboard-warning)]/80 text-white'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6 w-full">
        {/* Left side - Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 hover:scale-110 transition-all duration-300"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 relative hover:scale-110 transition-all duration-300"
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
              >
                {notifications > 9 ? "9+" : notifications}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-9 gap-2 px-2 transition-all hover:bg-accent hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 duration-300"
              >
                <Avatar className="h-7 w-7 ring-2 ring-primary/10 transition-all hover:ring-primary/30">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex lg:flex-col lg:items-start lg:text-left">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user.role === 'admin' ? 'Administrador' : user.role === 'staff' ? 'Personal' : 'Limpieza'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 flex-1">
                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground leading-none">{user.email}</p>
                    <Badge className={cn("w-fit text-xs mt-1", getRoleBadgeColor(user.role))}>
                      {user.role === 'admin' ? 'Administrador' : user.role === 'staff' ? 'Personal' : 'Limpieza'}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem 
                className="cursor-pointer group hover:bg-primary/5 transition-colors py-2.5"
                onClick={() => router.push('/settings')}
              >
                <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem 
                className="cursor-pointer text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger-light)] hover:text-[var(--dashboard-danger)] transition-colors py-2.5 group"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout Dialog */}
          <LogoutDialog
            open={logoutDialogOpen}
            onOpenChange={setLogoutDialogOpen}
            onConfirm={handleLogout}
            isLoading={isLoggingOut}
          />
        </div>
      </div>
    </header>
  )
}
