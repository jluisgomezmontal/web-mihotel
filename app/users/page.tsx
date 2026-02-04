"use client"

import * as React from "react"
import { Plus, Search, Filter, User, Edit, Trash2, Shield, Key, UserCog, Power, Sparkles, Users, CheckCircle, XCircle, Mail, Phone, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { PermissionGuard } from "@/components/guards/PermissionGuard"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { AuthService } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { useAlert } from '@/lib/use-alert'
import { API_BASE_URL } from '@/lib/api-config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { UserFormDialog } from "@/components/forms/user-form-dialog"
import { UserRoleDialog } from "@/components/forms/user-role-dialog"
import { UserPermissionsDialog } from "@/components/forms/user-permissions-dialog"
import { UserPasswordDialog } from "@/components/forms/user-password-dialog"
import { useDashboard } from "@/contexts/DashboardContext"

interface UserData {
  _id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'cleaning'
  profile: {
    phone?: string
    avatar?: string
    timezone: string
  }
  permissions: {
    canManageProperties: boolean
    canManageUsers: boolean
    canManageReservations: boolean
    canViewReports: boolean
  }
  lastLoginAt?: string
  isActive: boolean
  createdAt: string
}

function UserCard({ 
  user, 
  currentUserId,
  onEdit, 
  onDelete, 
  onChangeRole,
  onChangePermissions,
  onResetPassword,
  onToggleStatus
}: { 
  user: UserData
  currentUserId: string
  onEdit: (user: UserData) => void
  onDelete: (id: string) => void
  onChangeRole: (user: UserData) => void
  onChangePermissions: (user: UserData) => void
  onResetPassword: (user: UserData) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}) {
  const roleColors = {
    admin: { color: 'text-[var(--user-admin)]', bg: 'bg-[var(--user-admin-light)]', border: 'border-[var(--user-admin)]/20', icon: Shield },
    staff: { color: 'text-[var(--user-staff)]', bg: 'bg-[var(--user-staff-light)]', border: 'border-[var(--user-staff)]/20', icon: UserCog },
    cleaning: { color: 'text-[var(--user-cleaning)]', bg: 'bg-[var(--user-cleaning-light)]', border: 'border-[var(--user-cleaning)]/20', icon: User }
  }
  
  const statusColors = {
    active: { color: 'text-[var(--user-active)]', bg: 'bg-[var(--user-active-light)]', border: 'border-[var(--user-active)]/20', icon: CheckCircle },
    inactive: { color: 'text-[var(--user-inactive)]', bg: 'bg-[var(--user-inactive-light)]', border: 'border-[var(--user-inactive)]/20', icon: XCircle }
  }
  
  const roleColor = roleColors[user.role as keyof typeof roleColors] || roleColors.staff
  const statusColor = user.isActive ? statusColors.active : statusColors.inactive
  const RoleIcon = roleColor.icon
  const StatusIcon = statusColor.icon
  
  const isCurrentUser = user._id === currentUserId
  
  const roleLabels = {
    admin: 'Administrador',
    staff: 'Staff',
    cleaning: 'Limpieza'
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Gradiente decorativo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Barra de estado superior */}
      <div className={cn("h-1.5 w-full transition-all duration-500", user.isActive ? 'bg-[var(--user-active)]' : 'bg-[var(--user-inactive)]')} />
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={cn("p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300", roleColor.bg, roleColor.border, "border")}>
                <RoleIcon className={cn("h-4 w-4", roleColor.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base truncate">{user.name}</CardTitle>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", roleColor.color, roleColor.bg, roleColor.border)}>
                    <RoleIcon className="h-3 w-3" />
                    {roleLabels[user.role as keyof typeof roleLabels]}
                  </Badge>
                  <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", statusColor.color, statusColor.bg, statusColor.border)}>
                    <StatusIcon className="h-3 w-3" />
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {isCurrentUser && (
                    <Badge variant="outline" className="text-xs">Tú</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
                <span className="text-muted-foreground truncate">{user.email}</span>
              </div>
              {user.profile.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-[var(--dashboard-success)]" />
                  <span className="text-muted-foreground">{user.profile.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        <div className="p-3 bg-gradient-to-br from-[var(--surface-elevated)] to-transparent border border-[var(--border-subtle)] rounded-xl">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Permisos</p>
          <div className="grid grid-cols-2 gap-2">
            {user.permissions.canManageProperties && (
              <Badge variant="outline" className="text-xs justify-center py-1.5">Propiedades</Badge>
            )}
            {user.permissions.canManageUsers && (
              <Badge variant="outline" className="text-xs justify-center py-1.5">Usuarios</Badge>
            )}
            {user.permissions.canManageReservations && (
              <Badge variant="outline" className="text-xs justify-center py-1.5">Reservas</Badge>
            )}
            {user.permissions.canViewReports && (
              <Badge variant="outline" className="text-xs justify-center py-1.5">Reportes</Badge>
            )}
          </div>
        </div>

        {user.lastLoginAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded-lg">
            <Clock className="h-3.5 w-3.5" />
            <span>Último acceso: {new Date(user.lastLoginAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <Button 
            variant="outline" 
            size="default" 
            onClick={() => onEdit(user)}
            className="group w-full font-semibold hover:border-primary/50 transition-all"
          >
            <Edit className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Editar Usuario
          </Button>
          <div className="grid grid-cols-4 gap-2">
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => onChangeRole(user)}
              disabled={isCurrentUser}
              className="group"
              title="Cambiar rol"
            >
              <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => onChangePermissions(user)}
              className="group"
              title="Gestionar permisos"
            >
              <UserCog className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => onResetPassword(user)}
              className="group"
              title="Restablecer contraseña"
            >
              <Key className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
            <Button 
              variant={user.isActive ? "outline" : "default"}
              size="sm" 
              onClick={() => onToggleStatus(user._id, user.isActive)}
              disabled={isCurrentUser}
              className={cn("group", user.isActive ? "" : "bg-[var(--user-active)] hover:bg-[var(--user-active)]/90")}
              title={user.isActive ? 'Desactivar' : 'Activar'}
            >
              <Power className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(user._id)}
            disabled={isCurrentUser}
            className="group text-[var(--dashboard-danger)] hover:text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger)]/10 hover:border-[var(--dashboard-danger)]/50 transition-all"
          >
            <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Eliminar Usuario
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function UsersPage() {
  const { userData, tenantData } = useDashboard()
  const [users, setUsers] = React.useState<UserData[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterRole, setFilterRole] = React.useState<string>("all")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = React.useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<UserData | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(true)
  const { alertState, hideAlert, confirmDelete, showError, showLoading, close, showSuccess } = useAlert()

  const loadUsers = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/users?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.data?.users || [])
      } else {
        await showError('Error al cargar', 'No se pudieron cargar los usuarios')
      }
    } catch (err) {
      console.error('Error loading users:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (userId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer. El usuario será eliminado permanentemente.',
    })

    if (!confirmed) return

    showLoading('Eliminando usuario...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        await showSuccess('Usuario eliminado', 'El usuario ha sido eliminado exitosamente')
        loadUsers()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar el usuario')
      }
    } catch (err) {
      close()
      console.error('Error deleting user:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    const confirmed = await confirmDelete({
      title: newStatus ? '¿Activar usuario?' : '¿Desactivar usuario?',
      text: newStatus 
        ? 'El usuario podrá acceder nuevamente al sistema.'
        : 'El usuario no podrá acceder al sistema.',
      confirmButtonText: newStatus ? 'Sí, activar' : 'Sí, desactivar',
    })

    if (!confirmed) return

    showLoading('Actualizando estado...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus })
      })

      close()

      if (response.ok) {
        await showSuccess(
          'Estado actualizado', 
          newStatus ? 'Usuario activado exitosamente' : 'Usuario desactivado exitosamente'
        )
        loadUsers()
      } else {
        const data = await response.json()
        await showError('Error al actualizar', data.message || 'No se pudo actualizar el estado')
      }
    } catch (err) {
      close()
      console.error('Error updating user status:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const filteredUsers = users.filter((user) => {
    const name = user.name.toLowerCase()
    const email = user.email.toLowerCase()
    
    const matchesSearch = 
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    cleaning: users.filter(u => u.role === 'cleaning').length,
  }

  if (isLoading) {
    return (
      <MainLayout 
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <PermissionGuard permission="canManageUsers" route="/users">
          <DashboardSkeleton />
        </PermissionGuard>
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <PermissionGuard permission="canManageUsers" route="/users">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header with modern design */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Usuarios
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona los usuarios y permisos de tu organización
            </p>
          </div>
          
          <Button className="group gap-2 hover:shadow-lg transition-all duration-300" onClick={() => {
            setEditingUser(undefined)
            setIsDialogOpen(true)
          }}>
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 border-2 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex gap-4 items-center flex-wrap">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px] h-11 border-2">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="admin">Admin ({stats.admins})</SelectItem>
              <SelectItem value="staff">Staff ({stats.staff})</SelectItem>
              <SelectItem value="cleaning">Limpieza ({stats.cleaning})</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] h-11 border-2">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos ({stats.active})</SelectItem>
              <SelectItem value="inactive">Inactivos ({stats.inactive})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards with modern design */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">usuarios registrados</p>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--user-active)]/10 to-[var(--user-active)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--user-active-light)] text-[var(--user-active)] group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--user-active)]">{stats.active}</div>
              <p className="text-xs text-muted-foreground mt-1">usuarios activos</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--user-admin)]/10 to-[var(--user-admin)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Administradores</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--user-admin-light)] text-[var(--user-admin)] group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--user-admin)]">{stats.admins}</div>
              <p className="text-xs text-muted-foreground mt-1">con permisos completos</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--user-staff)]/10 to-[var(--user-staff)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Staff</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--user-staff-light)] text-[var(--user-staff)] group-hover:scale-110 transition-transform">
                <UserCog className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--user-staff)]">{stats.staff}</div>
              <p className="text-xs text-muted-foreground mt-1">personal operativo</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredUsers.map((user) => (
              <UserCard 
                key={user._id} 
                user={user}
                currentUserId={userData?._id || ''}
                onEdit={(u) => {
                  setEditingUser(u)
                  setIsDialogOpen(true)
                }}
                onDelete={handleDelete}
                onChangeRole={(u) => {
                  setEditingUser(u)
                  setIsRoleDialogOpen(true)
                }}
                onChangePermissions={(u) => {
                  setEditingUser(u)
                  setIsPermissionsDialogOpen(true)
                }}
                onResetPassword={(u) => {
                  setEditingUser(u)
                  setIsPasswordDialogOpen(true)
                }}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-md p-16">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <Users className="relative mx-auto h-20 w-20 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all' ? 'No se encontraron usuarios' : 'No tienes usuarios registrados'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
                    : 'Comienza agregando tu primer usuario para gestionar el equipo y asignar permisos'}
                </p>
              </div>
              {!searchTerm && filterRole === 'all' && filterStatus === 'all' && (
                <Button className="group gap-2 hover:shadow-lg transition-all" size="lg" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  Crear Primer Usuario
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsDialogOpen(open)
          if (!open) setEditingUser(undefined)
        }}
        onSuccess={loadUsers}
        user={editingUser}
      />

      <UserRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsRoleDialogOpen(open)
          if (!open) setEditingUser(undefined)
        }}
        onSuccess={loadUsers}
        user={editingUser}
      />

      <UserPermissionsDialog
        open={isPermissionsDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsPermissionsDialogOpen(open)
          if (!open) setEditingUser(undefined)
        }}
        onSuccess={loadUsers}
        user={editingUser}
      />

      <UserPasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsPasswordDialogOpen(open)
          if (!open) setEditingUser(undefined)
        }}
        onSuccess={loadUsers}
        user={editingUser}
      />
      <AlertDialogCustom
        open={alertState.open}
        onOpenChange={hideAlert}
        type={alertState.type}
        title={alertState.title}
        description={alertState.description}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
        showCancel={alertState.showCancel}
      />
      </PermissionGuard>
    </MainLayout>
  )
}
