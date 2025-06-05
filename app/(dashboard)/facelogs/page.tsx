"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Eye, Users, AlertTriangle, Shield } from "lucide-react"
import { FaceLogFilters } from "@/components/face-log-filters"
import { FaceLogList } from "@/components/face-log-list"
import { useData } from "@/contexts/data-context"

export default function FaceLogsPage() {
  const { faceLogs, isLoading } = useData()

  // Calculate real metrics from actual data
  const totalDetections = faceLogs.length
  const unknownFaces = faceLogs.filter((log) => log.matchType === "Unknown").length
  const registeredGuests = faceLogs.filter((log) => log.matchType === "Guest").length
  const staffDetections = faceLogs.filter((log) => log.matchType === "Staff").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading face detection logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Face Detection Logs</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Detections Today</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDetections}</div>
            <p className="text-xs text-muted-foreground">
              {totalDetections === 0 ? "No detections yet" : "Face detections recorded"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unknown Faces</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unknownFaces}</div>
            <p className="text-xs text-muted-foreground">
              {unknownFaces === 0 ? "No unknown faces" : "Requires investigation"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Guests</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredGuests}</div>
            <p className="text-xs text-muted-foreground">
              {registeredGuests === 0 ? "No guest detections" : "Guest detections"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Detections</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffDetections}</div>
            <p className="text-xs text-muted-foreground">
              {staffDetections === 0 ? "No staff detections" : "All authorized"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <FaceLogFilters />
        <FaceLogList />
      </div>
    </div>
  )
}
