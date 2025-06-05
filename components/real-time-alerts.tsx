"use client"

import { useData } from "@/contexts/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, ArrowUpRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function RealTimeAlerts() {
  const { alerts = [], isLoading = false, resolveAlert } = useData() || {}
  const { toast } = useToast()

  // Get the most recent alerts
  const recentAlerts = Array.isArray(alerts)
    ? alerts
        .filter((alert) => alert && alert.timestamp)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
    : []

  const handleResolveAlert = async (alertId: string) => {
    try {
      await resolveAlert(alertId, "Resolved by owner")
      toast({
        title: "Alert Resolved",
        description: "The alert has been marked as resolved.",
      })
    } catch (error) {
      toast({
        title: "Failed to Resolve",
        description: "Could not resolve the alert. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!recentAlerts || recentAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-time Alerts</CardTitle>
          <CardDescription>No active alerts at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium">All Clear</p>
            <p className="text-sm text-muted-foreground">No security alerts detected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recentAlerts.map((alert) => (
        <Card key={alert.id} className="overflow-hidden">
          <div
            className={`h-1 ${
              alert.severity === "critical"
                ? "bg-red-500"
                : alert.severity === "high"
                  ? "bg-orange-500"
                  : alert.severity === "medium"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
            }`}
          />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  {alert.type} Alert
                </CardTitle>
                <CardDescription>{alert.location}</CardDescription>
              </div>
              <Badge
                variant={
                  alert.status === "Resolved"
                    ? "outline"
                    : alert.status === "Open"
                      ? "destructive"
                      : alert.status === "Escalated"
                        ? "default"
                        : "secondary"
                }
              >
                {alert.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">{alert.description}</p>
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(alert.timestamp).toLocaleString()}
              </div>
              {alert.status !== "Resolved" && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleResolveAlert(alert.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
