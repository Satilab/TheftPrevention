"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Settings, Plus } from "lucide-react"
import InteractiveRoomMap from "@/components/interactive-room-map"
import { useData } from "@/contexts/data-context"

export default function RoomMapPage() {
  const { rooms, isLoading } = useData()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading room map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Room Map</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Live View
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Rooms Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No rooms have been configured yet. Add rooms to see them on the map.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rooms
            </Button>
          </CardContent>
        </Card>
      ) : (
        <InteractiveRoomMap />
      )}
    </div>
  )
}
