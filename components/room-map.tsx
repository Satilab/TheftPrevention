"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, AlertTriangle, Users, Clock } from "lucide-react"

interface Room {
  id: string
  name: string
  type: "office" | "lobby" | "conference" | "storage"
  status: "active" | "inactive" | "alert"
  occupancy: number
  lastActivity: string
  alertCount: number
}

const rooms: Room[] = [
  {
    id: "R001",
    name: "Main Lobby",
    type: "lobby",
    status: "active",
    occupancy: 12,
    lastActivity: "2 min ago",
    alertCount: 0,
  },
  {
    id: "R002",
    name: "Conference Room A",
    type: "conference",
    status: "active",
    occupancy: 8,
    lastActivity: "5 min ago",
    alertCount: 1,
  },
  {
    id: "R003",
    name: "Office 101",
    type: "office",
    status: "alert",
    occupancy: 1,
    lastActivity: "1 min ago",
    alertCount: 3,
  },
  {
    id: "R004",
    name: "Storage Room",
    type: "storage",
    status: "inactive",
    occupancy: 0,
    lastActivity: "2 hours ago",
    alertCount: 0,
  },
  {
    id: "R005",
    name: "Conference Room B",
    type: "conference",
    status: "active",
    occupancy: 4,
    lastActivity: "10 min ago",
    alertCount: 0,
  },
  {
    id: "R006",
    name: "Office 102",
    type: "office",
    status: "active",
    occupancy: 2,
    lastActivity: "3 min ago",
    alertCount: 0,
  },
]

interface RoomMapProps {
  liveView?: boolean
}

const RoomMap = ({ liveView = true }: RoomMapProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "alert":
        return "bg-red-500"
      case "inactive":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadgeVariant = (status: Room["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "alert":
        return "destructive"
      case "inactive":
        return "secondary"
      default:
        return "secondary"
    }
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
                <CardTitle className="text-lg">{room.name}</CardTitle>
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
                  <span>{room.occupancy} people</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{room.lastActivity}</span>
                </div>
              </div>

              {room.alertCount > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{room.alertCount} alert(s)</span>
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
                    <div>
                      Type: <span className="capitalize">{room.type}</span>
                    </div>
                    <div>
                      Status: <span className="capitalize">{room.status}</span>
                    </div>
                    <div>Current Occupancy: {room.occupancy}</div>
                    <div>Last Activity: {room.lastActivity}</div>
                    {room.alertCount > 0 && <div className="text-red-600">Active Alerts: {room.alertCount}</div>}
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
