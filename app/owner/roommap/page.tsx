"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function OwnerRoomMapPage() {
  const [liveView, setLiveView] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Room Map</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="live-view" checked={liveView} onCheckedChange={setLiveView} />
            <Label htmlFor="live-view">{liveView ? "Live View" : "Today's Logs"}</Label>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Room Map</CardTitle>
          <CardDescription>
            {liveView ? "Real-time view of all rooms with live activity" : "Historical view of today's room activities"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <Eye className="mx-auto h-10 w-10 mb-2" />
            <p>Interactive room map with filters and alert history would be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
