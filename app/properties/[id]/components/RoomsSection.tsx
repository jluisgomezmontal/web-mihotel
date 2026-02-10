import { Plus, Bed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RoomCard } from "./RoomCard"
import type { Room } from "../types"

interface RoomsSectionProps {
  rooms: Room[]
  onCreateRoom: () => void
  onEditRoom: (room: Room) => void
  onDeleteRoom: (room: Room) => void
}

export function RoomsSection({ rooms, onCreateRoom, onEditRoom, onDeleteRoom }: RoomsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Habitaciones</h2>
          <p className="text-muted-foreground text-sm">
            Gestiona las habitaciones de esta propiedad
          </p>
        </div>
        <Button className="gap-2" onClick={onCreateRoom}>
          <Plus className="h-4 w-4" />
          Nueva Habitación
        </Button>
      </div>

      {rooms.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-[1600px] mx-auto">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onEdit={onEditRoom}
              onDelete={onDeleteRoom}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Bed className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">
                No hay habitaciones registradas
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comienza agregando habitaciones a esta propiedad
              </p>
            </div>
            <Button onClick={onCreateRoom}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Habitación
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
