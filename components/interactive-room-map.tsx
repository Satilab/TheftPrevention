"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye, AlertTriangle, Users, Clock, Search, Plus } from 'lucide-react'
import { useData } from "@/contexts/data-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface InteractiveRoomMapProps {
  liveView?: boolean
  viewMode?: "grid" | "list"
}

function InteractiveRoomMap({ liveView = true, viewMode = "grid" }: InteractiveRoomMapProps) {
  const { rooms, isLoading, guests } = useData()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return "bg-green-500"
      case "Vacant":
        return "bg-blue-500"
      case "Alerted":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Occupied":
        return "default"
      case "Vacant":
        return "secondary"
      case "Alerted":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Find guest name for a room
  const getGuestName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (!room || !room.guestId) return "None"

    const guest = guests.find((g) => g.id === room.guestId)
    return guest ? guest.name : "Unknown Guest"
  }

  // Calculate last activity time (mock for now, would be from actual logs in real app)
  const getLastActivity = () => {
    const times = ["Just now", "5 min ago", "10 min ago", "30 min ago", "1 hour ago"]
    return times[Math.floor(Math.random() * times.length)]
  }

  const filteredRooms = rooms.filter((room) => {
    // Filter by tab
    if (activeTab === "alerts" && room.status !== "Alerted") return false

    // Filter by status
    if (filterStatus !== "all" && room.status !== filterStatus) return false

    // Filter by search query
    if (
      searchQuery &&
      !room.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !room.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-muted/20 rounded-lg border border-dashed">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No Rooms Available</h3>
          <p className="text-muted-foreground mb-6">
            There are no rooms in the system. Please add rooms through Salesforce or the setup page.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Rooms
          </Button>
        </div>
      </div>
    )
  }

  if (filteredRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-lg border border-dashed">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No Matching Rooms</h3>
          <p className="text-muted-foreground mb-4">No rooms match your current filters.</p>
          <Button
            variant="outline"
            onClick={() => {
              setFilterStatus("all")
              setActiveTab("all")
              setSearchQuery("")
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
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
                <div className="w-full">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Occupied">Occupied</SelectItem>
                      <SelectItem value="Vacant">Vacant</SelectItem>
                      <SelectItem value="Alerted">Alerted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedRoom === room.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Room {room.roomNumber || "Unknown"}</div>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status || "")}`} />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {room.id}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(room.status || "")} className="text-xs capitalize">
                          {room.status || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{room.status === "Occupied" ? "Occupied" : "Empty"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getLastActivity()}</span>
                        </div>
                      </div>

                      {room.status === "Alerted" && (
                        <div className="flex items-center gap-1 text-red-600 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">Security alert active</span>
                        </div>
                      )}

                      <div className="flex gap-2 mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              {liveView ? "Live View" : "View Logs"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Room {room.roomNumber || "Unknown"} Details</DialogTitle>
                              <DialogDescription>Detailed information about this room</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Room Number</p>
                                  <p className="text-sm">{room.roomNumber || "Unknown"}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Status</p>
                                  <div>
                                    <Badge variant={getStatusBadgeVariant(room.status || "")}>
                                      {room.status || "Unknown"}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Current Guest</p>
                                  <p className="text-sm">{getGuestName(room.id)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Last Activity</p>
                                  <p className="text-sm">{getLastActivity()}</p>
                                </div>
                              </div>

                              {room.status === "Alerted" && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Active Alert</p>
                                  <div className="space-y-1">
                                    <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded">
                                      Security alert is active for this room
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <p className="text-sm font-medium">Actions</p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    View Camera Feed
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Check History
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {selectedRoom === room.id && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Room Details</h4>
                          <div className="space-y-1 text-sm">
                            <div>Room Number: {room.roomNumber || "Unknown"}</div>
                            <div>
                              Status: <span className="capitalize">{room.status || "Unknown"}</span>
                            </div>
                            <div>Guest: {getGuestName(room.id)}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-1/4">
                          <h3 className="font-medium">Room {room.roomNumber || "Unknown"}</h3>
                          <Badge variant="outline" className="mt-1">
                            {room.id}
                          </Badge>
                        </div>
                        <div className="p-4 bg-muted/50 flex-1">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Status</p>
                              <div>
                                <Badge variant={getStatusBadgeVariant(room.status || "")}>
                                  {room.status || "Unknown"}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Guest</p>
                              <p>{getGuestName(room.id)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Occupancy</p>
                              <p>{room.status === "Occupied" ? "Occupied" : "Empty"}</p>
                            </div>
                            <div>
                              <p className="font-medium">Last Activity</p>
                              <p>{getLastActivity()}</p>
                            </div>
                          </div>
                          {room.status === "Alerted" && (
                            <div className="mt-2 flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm">Security alert active</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex items-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Room {room.roomNumber || "Unknown"} Details</DialogTitle>
                                <DialogDescription>Detailed information about this room</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Room Number</p>
                                    <p className="text-sm">{room.roomNumber || "Unknown"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <div>
                                      <Badge variant={getStatusBadgeVariant(room.status || "")}>
                                        {room.status || "Unknown"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Current Guest</p>
                                    <p className="text-sm">{getGuestName(room.id)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Last Activity</p>
                                    <p className="text-sm">{getLastActivity()}</p>
                                  </div>
                                </div>

                                {room.status === "Alerted" && (
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">Active Alert</p>
                                    <div className="space-y-1">
                                      <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded">
                                        Security alert is active for this room
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Actions</p>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      View Camera Feed
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Check History
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Export both named and default exports
export { InteractiveRoomMap }
export default InteractiveRoomMap
