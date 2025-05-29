"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaceLogFilters } from "@/components/face-log-filters"
import { FaceLogList } from "@/components/face-log-list"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export default function FaceLogsPage() {
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
          <CardDescription>Chronological log of all face detections</CardDescription>
        </CardHeader>
        <CardContent>
          <FaceLogList date={filterDate} camera={filterCamera} confidence={filterConfidence} type={filterType} />
        </CardContent>
      </Card>
    </div>
  )
}
