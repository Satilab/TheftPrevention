"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaceLogFilters } from "@/components/face-log-filters"
import { FaceLogList } from "@/components/face-log-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Users, AlertTriangle, Eye, Clock } from "lucide-react"

export default function OwnerFaceLogsPage() {
  const [filterDate, setFilterDate] = useState<Date | null>(null)
  const [filterCamera, setFilterCamera] = useState<string | null>(null)
  const [filterConfidence, setFilterConfidence] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)

  const handleResetFilters = () => {
    setFilterDate(null)
    setFilterCamera(null)
    setFilterConfidence(null)
    setFilterType(null)
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
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unknown Faces</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Guests</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-xs text-muted-foreground">92.7% recognition rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Detections</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">All authorized</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary */}
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
              <Badge variant="destructive">8</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm font-medium">Wrong Room Access</p>
                <p className="text-xs text-muted-foreground">Guests in unauthorized areas</p>
              </div>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">5</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm font-medium">After Hours Activity</p>
                <p className="text-xs text-muted-foreground">Detections outside normal hours</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">10</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

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
