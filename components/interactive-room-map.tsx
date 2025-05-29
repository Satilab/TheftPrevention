"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye, AlertTriangle, Users, Clock, Search } from "lucide-react"

interface Room {
  id: string
  name: string
  type: "standard" | "suite" | "conference" | "storage" | "lobby"
  status: "occupied" | "vacant" | "alert" | "maintenance"
  occupancy: number
  lastActivity: string
  alertCount: number
  floor: number
}

const rooms: Room[] = [
  {
    id: "101",
    name: "Standard Room 101",
    type: "standard",
    status: "occupied",
    occupancy: 2,
    lastActivity: "2 min ago",
    alertCount: 0,
    floor: 1,
  },
  {
    id: "102",
    name: "Standard Room 102",
    type: "standard",
    status: "vacant",
    occupancy: 0,
    lastActivity: "1 hour ago",
    alertCount: 0,
    floor: 1,
  },
  {
    id: "103",
    name: "Standard Room 103",
    type: "standard",
    status: "alert",
    occupancy: 1,
    lastActivity: "1 min ago",
    alertCount: 2,
    floor: 1,
  },
  {
    id: "201",
    name: "Suite 201",
    type: "suite",
    status: "occupied",
    occupancy: 3,
    lastActivity: "5 min ago",
    alertCount: 0,
    floor: 2,
  },
  {
    id: "202",
    name: "Suite 202",
    type: "suite",
    status: "alert",
    occupancy: 2,
    lastActivity: "30 sec ago",
    alertCount: 1,
    floor: 2,
  },
  {
    id: "L1",
    name: "Main Lobby",
    type: "lobby",
    status: "occupied",
    occupancy: 8,
    lastActivity: "1 min ago",
    alertCount: 0,
    floor: 1,
  },
  {
    id: "C1",
    name: "Conference Room",
    type: "conference",
    status: "occupied",
    occupancy: 12,
    lastActivity: "10 min ago",
    alertCount: 0,
    floor: 1,
  },
  {
    id: "S1",
    name: "Storage Room",
    type: "storage",
    status: "maintenance",
    occupancy: 1,
    lastActivity: "1 hour ago",
    alertCount: 0,
    floor: 0,
  },
]

interface InteractiveRoomMapProps {
  liveView?: boolean
}

export default function InteractiveRoomMap({ liveView = true }: InteractiveRoomMapProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterFloor, setFilterFloor] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "occupied":
        return "bg-green-500"
      case "vacant":
        return "bg-blue-500"
      case "alert":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadgeVariant = (status: Room["status"]) => {
    switch (status) {
      case "occupied":
        return "default"
      case "vacant":
        return "secondary"
      case "alert":
        return "destructive"
      case "maintenance":
        return "warning"
      default:
        return "outline"
    }
  }

  const filteredRooms = rooms.filter((room) => {
    // Filter by tab
    if (activeTab === "alerts" && room.alertCount === 0) return false

    // Filter by type
    if (filterType !== "all" && room.type !== filterType) return false

    // Filter by status
    if (filterStatus !== "all" && room.status !== filterStatus) return false

    // Filter by floor
    if (filterFloor !== "all" && room.floor !== Number.parseInt(filterFloor)) return false

    // Filter by search query
    if (
      searchQuery &&
      !room.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !room.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true
  })

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Rooms</TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Alerts Only
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="bg-card rounded-lg p-4 mb-4 border">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rooms..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-1 gap-2">
                <div className="w-1/3">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="lobby">Lobby</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/3">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-1/3">
                  <Select value={filterFloor} onValueChange={setFilterFloor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Floors</SelectItem>
                      <SelectItem value="0">Ground Floor</SelectItem>
                      <SelectItem value="1">First Floor</SelectItem>
                      <SelectItem value="2">Second Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedRoom === room.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{room.name}</div>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {room.id}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(room.status)} className="text-xs capitalize">
                          {room.status}
                        </Badge>
                        {room.type === "suite" && (
                          <Badge variant="secondary" className="text-xs">
                            Suite
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
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
                        <div className="flex items-center gap-1 text-red-600 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">{room.alertCount} alert(s)</span>
                        </div>
                      )}

                      <div className="flex gap-2 mt-2">
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
                            <div>Floor: {room.floor === 0 ? "Ground" : room.floor}</div>
                            <div>Current Occupancy: {room.occupancy}</div>
                            <div>Last Activity: {room.lastActivity}</div>
                            {room.alertCount > 0 && (
                              <div className="text-red-600">Active Alerts: {room.alertCount}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No rooms match your filters. Try adjusting your search criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
