"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InteractiveRoomMap } from "@/components/interactive-room-map"
import { useData } from "@/contexts/data-context"
import { EmptyState } from "@/components/empty-state"
import { RefreshButton } from "@/components/refresh-button"

export default function ReceptionistRoomMapPage() {
  const { rooms, loading, refreshData } = useData()
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  const handleRefresh = async () => {
    await refreshData()
    setLastRefreshed(new Date())
  }

  // Initialize with empty array to prevent mapping over undefined
  const safeRooms = rooms || []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Room Map</h1>
        <RefreshButton onClick={handleRefresh} lastRefreshed={lastRefreshed} isLoading={loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Room Map</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : safeRooms.length > 0 ? (
            <InteractiveRoomMap rooms={safeRooms} userRole="receptionist" />
          ) : (
            <EmptyState
              title="No rooms available"
              description="No room data has been found. Please add rooms or check your connection."
              action={{
                label: "Refresh Data",
                onClick: handleRefresh,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
