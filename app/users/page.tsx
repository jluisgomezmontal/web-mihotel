"use client"

import * as React from "react"
import { Plus, Search, Filter, User, Edit, Trash2, Shield, Key, UserCog, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthService } from '@/lib/auth'
import { statusColors } from '@/lib/theme-utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAlert } from "@/lib/use-alert"
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
  const getRoleBadge = (role: string) => {
    const roleColors = statusColors.role[role as keyof typeof statusColors.role]
    if (roleColors) {
      return <Badge className={roleColors}>{role === 'admin' ? 'Admin' : role === 'staff' ? 'Staff' : 'Limpieza'}</Badge>
    }
    return <Badge variant="outline">{role}</Badge>
  }

  const isCurrentUser = user._id === currentUserId

  return (
    <Card className="hover:shadow-elegant transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{user.name}</CardTitle>
              {getRoleBadge(user.role)}
              {!user.isActive && (
                <Badge variant="destructive">Inactivo</Badge>
              )}
              {isCurrentUser && (
                <Badge variant="outline" className="text-xs">Tú</Badge>
              )}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{user.email}</span>
              </div>
              {user.profile.phone && (
                <div className="flex items-center gap-2">
                  <span>{user.profile.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <p className="font-medium text-muted-foreground">Permisos:</p>
          <div className="grid grid-cols-2 gap-2">
            {user.permissions.canManageProperties && (
              <Badge variant="outline" className="text-xs justify-center">Propiedades</Badge>
            )}
            {user.permissions.canManageUsers && (
              <Badge variant="outline" className="text-xs justify-center">Usuarios</Badge>
            )}
            {user.permissions.canManageReservations && (
              <Badge variant="outline" className="text-xs justify-center">Reservas</Badge>
            )}
            {user.permissions.canViewReports && (
              <Badge variant="outline" className="text-xs justify-center">Reportes</Badge>
            )}
          </div>
        </div>

        {user.lastLoginAt && (
          <div className="text-xs text-muted-foreground border-t pt-3">
            Último acceso: {new Date(user.lastLoginAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}

        <div className="flex gap-2 pt-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(user)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => onChangeRole(user)}
            disabled={isCurrentUser}
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => onChangePermissions(user)}
          >
            <UserCog className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => onResetPassword(user)}
          >
            <Key className="h-4 w-4" />
          </Button>
          <Button 
            variant={user.isActive ? "outline" : "default"}
            size="sm" 
            onClick={() => onToggleStatus(user._id, user.isActive)}
            disabled={isCurrentUser}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(user._id)}
            disabled={isCurrentUser}
          >
            <Trash2 className="h-4 w-4" />
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

      const response = await fetch('http://localhost:3000/api/users?limit=100', {
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

      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
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

      const response = await fetch(`http://localhost:3000/api/users/${userId}/status`, {
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando usuarios...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between transition-none">
          <div className="transition-none">
            <h1 className="text-3xl font-bold tracking-tight transition-none">Usuarios</h1>
            <p className="text-muted-foreground transition-none">
              Gestiona los usuarios y permisos de tu organización
            </p>
          </div>
          
          <Button className="gap-2" onClick={() => {
            setEditingUser(undefined)
            setIsDialogOpen(true)
          }}>
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos ({stats.active})</SelectItem>
              <SelectItem value="inactive">Inactivos ({stats.inactive})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Administradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.staff}</div>
            </CardContent>
          </Card>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <Card className="p-12">
            <div className="text-center space-y-4">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron usuarios' : 'No tienes usuarios registrados'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros' 
                    : 'Comienza agregando tu primer usuario para gestionar el equipo'}
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Usuario
              </Button>
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
    </MainLayout>
  )
}
