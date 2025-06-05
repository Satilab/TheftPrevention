"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle } from "lucide-react"

// Define the Room interface to match what we get from Salesforce
interface Room {
  Id?: string
  Name?: string
  Room_Number__c?: string
  Room_Type__c?: string
  Status__c?: string
  Floor__c?: string
  Has_Alert__c?: boolean
  Last_Cleaned__c?: string
  Guest_Name__c?: string
}

interface InteractiveRoomMapProps {
  rooms: Room[]
  userRole?: "owner" | "receptionist"
}

// Helper function to get status color
const getStatusColor = (status: string | undefined) => {
  if (!status) return "bg-gray-200"

  const statusLower = status.toLowerCase()
  if (statusLower.includes("occupied")) return "bg-blue-500"
  if (statusLower.includes("vacant") && statusLower.includes("clean")) return "bg-green-500"
  if (statusLower.includes("vacant") && statusLower.includes("dirty")) return "bg-yellow-500"
  if (statusLower.includes("maintenance")) return "bg-purple-500"
  if (statusLower.includes("out of order")) return "bg-red-500"
  return "bg-gray-200"
}

// Export both as named and default export to ensure compatibility
export function InteractiveRoomMap({ rooms = [], userRole = "owner" }: InteractiveRoomMapProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterFloor, setFilterFloor] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("grid")

  // Ensure rooms is an array before filtering
  const safeRooms = Array.isArray(rooms) ? rooms : []

  // Get unique values for filters
  const uniqueStatuses = [...new Set(safeRooms.map((room) => room.Status__c).filter(Boolean))]
  const uniqueFloors = [...new Set(safeRooms.map((room) => room.Floor__c).filter(Boolean))]
  const uniqueTypes = [...new Set(safeRooms.map((room) => room.Room_Type__c).filter(Boolean))]

  // Filter rooms based on search and filters
  const filteredRooms = safeRooms.filter((room) => {
    const matchesSearch =
      !searchTerm ||
      (room.Room_Number__c && room.Room_Number__c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.Guest_Name__c && room.Guest_Name__c.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = !filterStatus || room.Status__c === filterStatus
    const matchesFloor = !filterFloor || room.Floor__c === filterFloor
    const matchesType = !filterType || room.Room_Type__c === filterType

    return matchesSearch && matchesStatus && matchesFloor && matchesType
  })

  const handleResetFilters = () => {
    setSearchTerm("")
    setFilterStatus(null)
    setFilterFloor(null)
    setFilterType(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search rooms or guests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by Status
            </label>
            <select
              id="status-filter"
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={filterStatus || ""}
              onChange={(e) => setFilterStatus(e.target.value || null)}
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="floor-filter" className="sr-only">
              Filter by Floor
            </label>
            <select
              id="floor-filter"
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={filterFloor || ""}
              onChange={(e) => setFilterFloor(e.target.value || null)}
            >
              <option value="">All Floors</option>
              {uniqueFloors.map((floor) => (
                <option key={floor} value={floor}>
                  {floor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type-filter" className="sr-only">
              Filter by Type
            </label>
            <select
              id="type-filter"
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={filterType || ""}
              onChange={(e) => setFilterType(e.target.value || null)}
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredRooms.map((room) => (
              <Card key={room.Id || room.Room_Number__c} className="overflow-hidden">
                <div className={`h-2 ${getStatusColor(room.Status__c)}`} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{room.Room_Number__c || "No Number"}</h3>
                      <p className="text-sm text-muted-foreground">{room.Room_Type__c || "Unknown Type"}</p>
                    </div>
                    {room.Has_Alert__c && <AlertCircle className="h-5 w-5 text-red-500" />}
                  </div>

                  <div className="mt-2">
                    <Badge variant={room.Status__c?.toLowerCase().includes("vacant") ? "outline" : "default"}>
                      {room.Status__c || "Unknown Status"}
                    </Badge>
                  </div>

                  {room.Guest_Name__c && <p className="mt-2 text-sm truncate">{room.Guest_Name__c}</p>}

                  {userRole === "owner" && room.Last_Cleaned__c && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last cleaned: {new Date(room.Last_Cleaned__c).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Room</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Guest</th>
                  {userRole === "owner" && <th className="p-2 text-left">Last Cleaned</th>}
                  <th className="p-2 text-left">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.Id || room.Room_Number__c} className="border-b">
                    <td className="p-2">{room.Room_Number__c || "No Number"}</td>
                    <td className="p-2">{room.Room_Type__c || "Unknown"}</td>
                    <td className="p-2">
                      <Badge variant={room.Status__c?.toLowerCase().includes("vacant") ? "outline" : "default"}>
                        {room.Status__c || "Unknown"}
                      </Badge>
                    </td>
                    <td className="p-2">{room.Guest_Name__c || "-"}</td>
                    {userRole === "owner" && (
                      <td className="p-2">
                        {room.Last_Cleaned__c ? new Date(room.Last_Cleaned__c).toLocaleDateString() : "-"}
                      </td>
                    )}
                    <td className="p-2">
                      {room.Has_Alert__c ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add default export for compatibility
export default InteractiveRoomMap
