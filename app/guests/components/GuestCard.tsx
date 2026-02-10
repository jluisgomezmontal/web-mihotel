/**
 * GuestCard Component
 * Displays individual guest details with actions
 */

import { 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  Edit, 
  Star, 
  Trash2,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { GuestStatusBadge } from "./GuestStatusBadge"
import { getGuestStatus, GUEST_STATUS_CONFIG } from "../constants"
import type { GuestCardProps } from "../types"

export function GuestCard({ guest, onEdit, onDelete, onToggleVIP, onReserve }: GuestCardProps) {
  const currentStatus = getGuestStatus(guest)
  
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Gradiente decorativo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status Indicator Bar */}
      <div className={cn("h-1.5 w-full transition-all duration-500", GUEST_STATUS_CONFIG[currentStatus].barColor)} />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Guest Name & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold">
                  {guest.firstName} {guest.lastName}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <GuestStatusBadge guest={guest} />
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2.5 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
                  <span className="text-sm font-semibold truncate">{guest.phone}</span>
                </div>
              </div>
              {guest.email && (
                <div className="p-2.5 bg-gradient-to-br from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[var(--dashboard-success)]" />
                    <span className="text-sm font-semibold truncate">{guest.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Additional Info */}
        {(guest.nationality || guest.emergencyContact?.name) && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-gradient-to-br from-[var(--surface-elevated)] to-transparent border border-[var(--border-subtle)] rounded-xl min-h-25">
            {guest.nationality && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nacionalidad</p>
                </div>
                <p className="font-semibold text-sm">{guest.nationality}</p>
              </div>
            )}
            {guest.emergencyContact?.name && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[var(--dashboard-danger)]" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Emergencia</p>
                </div>
                <p className="font-semibold text-sm">{guest.emergencyContact.name}</p>
                {guest.emergencyContact.phone && (
                  <p className="text-xs text-muted-foreground">{guest.emergencyContact.phone}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-xl text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estancias</p>
            </div>
            <p className="font-bold text-2xl text-[var(--dashboard-info)]">{guest.totalStays}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-xl text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-[var(--dashboard-success)]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gastado</p>
            </div>
            <p className="font-bold text-lg text-[var(--dashboard-success)]">${guest.totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button 
            variant="default" 
            size="default" 
            onClick={() => onReserve(guest._id)}
            className="group w-full font-semibold hover:shadow-lg transition-all"
          >
            <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Crear Reserva
            <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(guest)}
              className="group flex-1 font-semibold hover:border-primary/50 transition-all"
            >
              <Edit className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Editar
            </Button>
            <Button 
              variant={guest.vipStatus ? "default" : "outline"}
              size="sm" 
              onClick={() => onToggleVIP(guest._id, guest.vipStatus)}
              className={cn(
                "group flex-1 font-semibold transition-all",
                guest.vipStatus ? "bg-[var(--loyalty-vip)] hover:bg-[var(--loyalty-vip)]/90 hover:shadow-lg" : "hover:border-[var(--loyalty-vip)]/50"
              )}
            >
              <Star className={cn("h-4 w-4 mr-1 group-hover:scale-110 transition-transform", guest.vipStatus && "fill-current")} />
              VIP
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(guest._id)}
              className="group text-[var(--dashboard-danger)] hover:text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger)]/10 hover:border-[var(--dashboard-danger)]/50 transition-all"
            >
              <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
