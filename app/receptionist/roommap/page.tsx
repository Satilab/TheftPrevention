"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { InteractiveRoomMap } from "@/components/interactive-room-map"

export default function RoomMapPage() {
  const { refreshAllData, isLoading, lastRefresh } = useData()

  const handleRefresh = async () => {
    await refreshAllData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Map</h1>
          <p className="text-muted-foreground">Interactive view of all hotel rooms and their current status</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <InteractiveRoomMap liveView={true} />
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Room List</CardTitle>
              <CardDescription>All rooms in list format</CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveRoomMap liveView={false} viewMode="list" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastRefresh && (
        <div className="text-xs text-muted-foreground text-right">Last updated: {lastRefresh.toLocaleTimeString()}</div>
      )}
    </div>
  )
}
