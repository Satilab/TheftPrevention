"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaceLogFilters } from "@/components/face-log-filters"
import { FaceLogList } from "@/components/face-log-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Users, AlertTriangle, Eye, Clock } from "lucide-react"
import { useData } from "@/contexts/data-context"

export default function OwnerFaceLogsPage() {
  const { faceLogs, isLoading } = useData()
  const [filterDate, setFilterDate] = useState<Date | null>(null)
  const [filterCamera, setFilterCamera] = useState<string | null>(null)
  const [filterConfidence, setFilterConfidence] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)

  // Calculate metrics from actual data
  const totalDetections = faceLogs.length
  const unknownFaces = faceLogs.filter((log) => log.matchType === "Unknown").length
  const registeredGuests = faceLogs.filter((log) => log.matchType === "Guest").length
  const staffDetections = faceLogs.filter((log) => log.matchType === "Staff").length

  const handleResetFilters = () => {
    setFilterDate(null)
    setFilterCamera(null)
    setFilterConfidence(null)
    setFilterType(null)
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

      {/* Summary Cards */}
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
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffDetections}</div>
            <p className="text-xs text-muted-foreground">
              {staffDetections === 0 ? "No staff detections" : "All authorized"}
            </p>
          </CardContent>
        </Card>
      </div>

      {unknownFaces > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800 dark:text-amber-200">Detection Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium">High Confidence Unknown</p>
                  <p className="text-xs text-muted-foreground">Faces detected with &gt;90% confidence</p>
                </div>
                <Badge variant="destructive">
                  {faceLogs.filter((log) => log.matchType === "Unknown" && log.confidence > 90).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Wrong Room Access</p>
                  <p className="text-xs text-muted-foreground">Guests in unauthorized areas</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                  {faceLogs.filter((log) => log.matchType === "Guest" && log.unauthorized).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium">After Hours Activity</p>
                  <p className="text-xs text-muted-foreground">Detections outside normal hours</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {
                    faceLogs.filter((log) => {
                      const hour = log.timestamp.getHours()
                      return hour < 6 || hour > 22
                    }).length
                  }
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Log Filters</CardTitle>
          <CardDescription>Filter face detection logs by date, camera, confidence level, or type</CardDescription>
        </CardHeader>
        <CardContent>
          <FaceLogFilters
            date={filterDate}
            camera={filterCamera}
            confidence={filterConfidence}
            type={filterType}
            onDateChange={setFilterDate}
            onCameraChange={setFilterCamera}
            onConfidenceChange={setFilterConfidence}
            onTypeChange={setFilterType}
            onReset={handleResetFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Face Detection Log</CardTitle>
          <CardDescription>Chronological log of all face detections with anomaly flags</CardDescription>
        </CardHeader>
        <CardContent>
          <FaceLogList date={filterDate} camera={filterCamera} confidence={filterConfidence} type={filterType} />
        </CardContent>
      </Card>
    </div>
  )
}
