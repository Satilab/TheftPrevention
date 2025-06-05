"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, AlertTriangle, Users, Clock, Plus } from "lucide-react"
import { useData } from "@/contexts/data-context"

interface RoomMapProps {
  liveView?: boolean
}

export const RoomMap = ({ liveView = true }: RoomMapProps) => {
  const { rooms, isLoading } = useData()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return "bg-green-500"
      case "Alerted":
        return "bg-red-500"
      case "Vacant":
        return "bg-blue-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Occupied":
        return "default"
      case "Alerted":
        return "destructive"
      case "Vacant":
        return "secondary"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="w-full h-full">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
            <p className="text-muted-foreground">No rooms found</p>
            <p className="text-sm text-muted-foreground mt-2">Add rooms to see them on the map</p>
            <Button className="mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Rooms
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRoom === room.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {room.id}
                </Badge>
                <Badge variant={getStatusBadgeVariant(room.status)} className="text-xs">
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{room.status === "Occupied" ? "Occupied" : "Empty"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Just now</span>
                </div>
              </div>

              {room.status === "Alerted" && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Security alert active</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  {liveView ? "Live View" : "View Logs"}
                </Button>
              </div>

              {selectedRoom === room.id && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Room Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Room Number: {room.roomNumber}</div>
                    <div>
                      Status: <span className="capitalize">{room.status}</span>
                    </div>
                    {room.guestId && <div>Guest ID: {room.guestId}</div>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RoomMap
