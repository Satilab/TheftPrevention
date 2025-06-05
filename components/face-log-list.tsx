"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useData } from "@/contexts/data-context"
import { FaceLogFilters } from "./face-log-filters"

export function FaceLogList() {
  const { faceLogs, isLoading } = useData()
  const [filter, setFilter] = useState({
    matchType: "all",
    confidence: 0,
    dateRange: "all",
  })

  // Apply filters
  const filteredLogs = faceLogs.filter((log) => {
    if (filter.matchType !== "all" && log.matchType !== filter.matchType) {
      return false
    }
    if (log.confidence < filter.confidence) {
      return false
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (filteredLogs.length === 0) {
    return (
      <div className="space-y-4">
        <FaceLogFilters onFilterChange={setFilter} />
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground">No face logs found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or create some test data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <FaceLogFilters onFilterChange={setFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  {log.matchType === "Guest" && "Guest Detection"}
                  {log.matchType === "Staff" && "Staff Detection"}
                  {log.matchType === "Unknown" && "Unknown Person"}
                </CardTitle>
                <Badge
                  variant={
                    log.matchType === "Unknown" ? "destructive" : log.matchType === "Staff" ? "outline" : "default"
                  }
                >
                  {log.matchType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {log.faceImageUrl ? (
                  <img
                    src={log.faceImageUrl || "/placeholder.svg"}
                    alt="Face detection"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">No image available</div>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span>{log.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{log.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{log.roomId || "Unknown"}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
