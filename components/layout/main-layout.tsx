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
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
        
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
        )}>
          <Header
            isCollapsed={sidebarCollapsed}
            user={user}
            tenant={tenant}
          />
          
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
