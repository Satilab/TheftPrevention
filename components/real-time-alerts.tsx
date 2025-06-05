"use client"

import { useData } from "@/contexts/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react"

export function RealTimeAlerts() {
  const { alerts, isLoading, refreshAllData } = useData()

  // Filter for recent alerts (last 24 hours)
  const recentAlerts = alerts.filter((alert) => {
    const alertTime = new Date(alert.timestamp)
    const now = new Date()
    const timeDiff = now.getTime() - alertTime.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    return hoursDiff <= 24
  })

  const getAlertPriority = (alert: any) => {
    if (alert.type === "Intruder") return "high"
    if (alert.type === "Mismatch") return "medium"
    return "low"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-950"
      case "medium":
        return "border-amber-500 bg-amber-50 dark:bg-amber-950"
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-950"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-amber-500" />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} min ago`
    return `${hours} hours ago`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Real-time Alerts</h3>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Real-time Alerts (Last 24h)</h3>
        <Button variant="outline" size="sm" onClick={refreshAllData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {recentAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Recent Alerts</h3>
            <p className="text-muted-foreground">
              No security alerts in the last 24 hours. All systems are operating normally.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recentAlerts.slice(0, 5).map((alert) => {
            const priority = getAlertPriority(alert)
            return (
              <Card key={alert.id} className={`border-l-4 ${getPriorityColor(priority)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(alert.status)}
                      <div>
                        <p className="font-medium text-sm">{alert.type} Alert</p>
                        <p className="text-xs text-muted-foreground">{alert.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          alert.status === "Open"
                            ? "destructive"
                            : alert.status === "Resolved"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {alert.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(alert.timestamp)}</p>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{alert.description}</p>
                  {alert.confidence && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Confidence: {alert.confidence}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {recentAlerts.length > 5 && (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  +{recentAlerts.length - 5} more alerts in the last 24 hours
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
