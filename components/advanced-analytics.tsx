"use client"

import { useData } from "@/contexts/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AdvancedAnalytics() {
  const { alerts, faceLogs, guests, rooms, isLoading } = useData()

  // Calculate analytics from real data
  const calculateAnalytics = () => {
    // Alert type distribution
    const alertTypes = alerts.reduce(
      (acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const alertTypeData = Object.entries(alertTypes).map(([type, count]) => ({
      name: type,
      value: count,
    }))

    // Face detection accuracy
    const faceDetectionData = faceLogs.reduce(
      (acc, log) => {
        if (log.confidence >= 90) acc.high++
        else if (log.confidence >= 70) acc.medium++
        else acc.low++
        return acc
      },
      { high: 0, medium: 0, low: 0 },
    )

    const confidenceData = [
      { name: "High (90%+)", value: faceDetectionData.high },
      { name: "Medium (70-89%)", value: faceDetectionData.medium },
      { name: "Low (<70%)", value: faceDetectionData.low },
    ]

    // Room occupancy
    const occupiedRooms = rooms.filter((room) => room.status === "Occupied").length
    const occupancyRate = rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0

    // Alert resolution rate
    const resolvedAlerts = alerts.filter((alert) => alert.status === "Resolved").length
    const resolutionRate = alerts.length > 0 ? (resolvedAlerts / alerts.length) * 100 : 0

    // Guest status distribution
    const guestStatusData = guests.reduce(
      (acc, guest) => {
        acc[guest.status] = (acc[guest.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const guestData = Object.entries(guestStatusData).map(([status, count]) => ({
      name: status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: count,
    }))

    // Weekly alert trend
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    const weeklyData = last7Days.map((date) => {
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const alertsForDay = alerts.filter((alert) => {
        const alertDate = new Date(alert.timestamp)
        return alertDate >= dayStart && alertDate <= dayEnd
      })

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        alerts: alertsForDay.length,
        resolved: alertsForDay.filter((a) => a.status === "Resolved").length,
      }
    })

    return {
      alertTypeData,
      confidenceData,
      occupancyRate,
      resolutionRate,
      guestData,
      weeklyData,
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const analytics = calculateAnalytics()

  const hasData = alerts.length > 0 || faceLogs.length > 0 || guests.length > 0 || rooms.length > 0

  if (!hasData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground">
            Analytics will be available once you have data in your Salesforce org.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Alert Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
          <CardDescription>Distribution of security alert types</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.alertTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.alertTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analytics.alertTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No alert data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Face Detection Confidence */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Accuracy</CardTitle>
          <CardDescription>Face detection confidence levels</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.confidenceData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.confidenceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analytics.confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No face detection data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Occupancy */}
      <Card>
        <CardHeader>
          <CardTitle>Room Occupancy</CardTitle>
          <CardDescription>Current hotel occupancy rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{analytics.occupancyRate.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
            </div>
            <Progress value={analytics.occupancyRate} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Occupied: {rooms.filter((r) => r.status === "Occupied").length}</span>
              <span>Total: {rooms.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Resolution Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Resolution Rate</CardTitle>
          <CardDescription>Percentage of resolved security alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{analytics.resolutionRate.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Alerts Resolved</p>
            </div>
            <Progress value={analytics.resolutionRate} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Resolved: {alerts.filter((a) => a.status === "Resolved").length}</span>
              <span>Total: {alerts.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest Status */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Status</CardTitle>
          <CardDescription>Current guest status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.guestData.length > 0 ? (
            <div className="space-y-2">
              {analytics.guestData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Badge variant="outline">{item.value}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No guest data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trend</CardTitle>
          <CardDescription>Alert activity over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.weeklyData.some((d) => d.alerts > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alerts" fill="#8884d8" name="Total Alerts" />
                <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No weekly data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
