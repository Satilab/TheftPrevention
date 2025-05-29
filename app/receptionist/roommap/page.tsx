"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, Clock, AlertTriangle, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Room {
  id: string
  name: string
  type: "standard" | "suite" | "deluxe"
  status: "occupied" | "vacant" | "alert" | "maintenance"
  guest: string | null
  occupancy: number
  lastActivity: string
  alertCount: number
}

const roomsData: Room[] = [
  {
    id: "101",
    name: "Standard Room 101",
    type: "standard",
    status: "occupied",
    guest: "John Smith",
    occupancy: 2,
    lastActivity: "5 min ago",
    alertCount: 0,
  },
  {
    id: "102",
    name: "Standard Room 102",
    type: "standard",
    status: "vacant",
    guest: null,
    occupancy: 0,
    lastActivity: "2 hours ago",
    alertCount: 0,
  },
  {
    id: "103",
    name: "Standard Room 103",
    type: "standard",
    status: "alert",
    guest: "Emily Johnson",
    occupancy: 1,
    lastActivity: "1 min ago",
    alertCount: 2,
  },
  {
    id: "201",
    name: "Deluxe Room 201",
    type: "deluxe",
    status: "occupied",
    guest: "Michael Brown",
    occupancy: 3,
    lastActivity: "15 min ago",
    alertCount: 0,
  },
  {
    id: "202",
    name: "Deluxe Room 202",
    type: "deluxe",
    status: "maintenance",
    guest: null,
    occupancy: 0,
    lastActivity: "4 hours ago",
    alertCount: 0,
  },
  {
    id: "203",
    name: "Deluxe Room 203",
    type: "deluxe",
    status: "occupied",
    guest: "Sarah Wilson",
    occupancy: 2,
    lastActivity: "30 min ago",
    alertCount: 0,
  },
  {
    id: "301",
    name: "Suite 301",
    type: "suite",
    status: "vacant",
    guest: null,
    occupancy: 0,
    lastActivity: "6 hours ago",
    alertCount: 0,
  },
  {
    id: "302",
    name: "Suite 302",
    type: "suite",
    status: "occupied",
    guest: "David Lee",
    occupancy: 4,
    lastActivity: "10 min ago",
    alertCount: 0,
  },
]

export default function RoomMapPage() {
  const [rooms] = useState<Room[]>(roomsData)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

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

  const getStatusBadge = (status: Room["status"]) => {
    switch (status) {
      case "occupied":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Occupied</Badge>
      case "vacant":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Vacant</Badge>
      case "alert":
        return <Badge variant="destructive">Alert</Badge>
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Maintenance</Badge>
        )
    }
  }

  const getTypeColor = (type: Room["type"]) => {
    switch (type) {
      case "standard":
        return "border-gray-300"
      case "deluxe":
        return "border-blue-300"
      case "suite":
        return "border-purple-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Map</h1>
          <p className="text-muted-foreground">Interactive view of all hotel rooms and their current status</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${getTypeColor(room.type)} ${
                  selectedRoom?.id === room.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Room {room.id}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(room.status)}
                    <Badge variant="outline" className="text-xs capitalize">
                      {room.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {room.guest && (
                    <div className="text-sm">
                      <span className="font-medium">Guest:</span> {room.guest}
                    </div>
                  )}

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

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Room {room.id} Details</DialogTitle>
                        <DialogDescription>Detailed information about this room</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Room Type</p>
                            <p className="text-sm capitalize">{room.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <div>{getStatusBadge(room.status)}</div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Current Guest</p>
                            <p className="text-sm">{room.guest || "None"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Occupancy</p>
                            <p className="text-sm">{room.occupancy} people</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Last Activity</p>
                            <p className="text-sm">{room.lastActivity}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Active Alerts</p>
                            <p className="text-sm">{room.alertCount}</p>
                          </div>
                        </div>

                        {room.alertCount > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Recent Alerts</p>
                            <div className="space-y-1">
                              <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded">
                                Unregistered person detected - 5 min ago
                              </div>
                              <div className="text-sm bg-yellow-50 dark:bg-yellow-950 p-2 rounded">
                                Suspicious activity - 15 min ago
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Recent Activity Log</p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            <div className="text-sm bg-muted p-2 rounded">Guest entered room - 5 min ago</div>
                            <div className="text-sm bg-muted p-2 rounded">Housekeeping completed - 2 hours ago</div>
                            <div className="text-sm bg-muted p-2 rounded">Guest checked in - 4 hours ago</div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Room List</CardTitle>
              <CardDescription>All rooms in list format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-1/4">
                          <h3 className="font-medium">Room {room.id}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{room.type}</p>
                        </div>
                        <div className="p-4 bg-muted/50 flex-1">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Status</p>
                              <div>{getStatusBadge(room.status)}</div>
                            </div>
                            <div>
                              <p className="font-medium">Guest</p>
                              <p>{room.guest || "None"}</p>
                            </div>
                            <div>
                              <p className="font-medium">Occupancy</p>
                              <p>{room.occupancy} people</p>
                            </div>
                            <div>
                              <p className="font-medium">Last Activity</p>
                              <p>{room.lastActivity}</p>
                            </div>
                          </div>
                          {room.alertCount > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm">{room.alertCount} active alert(s)</span>
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
                                <DialogTitle>Room {room.id} Details</DialogTitle>
                                <DialogDescription>Detailed information about this room</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Room Type</p>
                                    <p className="text-sm capitalize">{room.type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <div>{getStatusBadge(room.status)}</div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Current Guest</p>
                                    <p className="text-sm">{room.guest || "None"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Occupancy</p>
                                    <p className="text-sm">{room.occupancy} people</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Last Activity</p>
                                    <p className="text-sm">{room.lastActivity}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Active Alerts</p>
                                    <p className="text-sm">{room.alertCount}</p>
                                  </div>
                                </div>

                                {room.alertCount > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">Recent Alerts</p>
                                    <div className="space-y-1">
                                      <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded">
                                        Unregistered person detected - 5 min ago
                                      </div>
                                      <div className="text-sm bg-yellow-50 dark:bg-yellow-950 p-2 rounded">
                                        Suspicious activity - 15 min ago
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Recent Activity Log</p>
                                  <div className="space-y-1 max-h-32 overflow-y-auto">
                                    <div className="text-sm bg-muted p-2 rounded">Guest entered room - 5 min ago</div>
                                    <div className="text-sm bg-muted p-2 rounded">
                                      Housekeeping completed - 2 hours ago
                                    </div>
                                    <div className="text-sm bg-muted p-2 rounded">Guest checked in - 4 hours ago</div>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
