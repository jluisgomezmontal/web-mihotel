"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

interface MainLayoutProps {
  children: React.ReactNode
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
}

export function MainLayout({ children, user, tenant }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed')
      return saved === 'true'
    }
    return false
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newValue = !prev
      localStorage.setItem('sidebarCollapsed', String(newValue))
      return newValue
    })
  }

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [children])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <div className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
        )}>
          <Header
            isCollapsed={sidebarCollapsed}
            user={user}
            tenant={tenant}
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onSidebarToggle={toggleSidebar}
          />
          
          <main className="p-4 lg:p-6 pb-20 lg:pb-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
