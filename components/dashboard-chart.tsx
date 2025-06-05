"use client"

import { useData } from "@/contexts/data-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function DashboardChart() {
  const { alerts = [], isLoading = false } = useData() || {}

  // Generate chart data from actual alerts with proper null checks
  const generateChartData = () => {
    // Check if alerts is undefined or empty
    if (!Array.isArray(alerts) || alerts.length === 0) {
      return []
    }

    // Group alerts by day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    return last7Days.map((date) => {
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      // Filter alerts for this day with null checks
      const alertsForDay = Array.isArray(alerts)
        ? alerts.filter((alert) => {
            if (!alert || !alert.timestamp) return false
            const alertDate = new Date(alert.timestamp)
            return alertDate >= dayStart && alertDate <= dayEnd
          })
        : []

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        alerts: alertsForDay.length,
        resolved: alertsForDay.filter((a) => a?.status === "Resolved").length,
        open: alertsForDay.filter((a) => a?.status === "Open").length,
      }
    })
  }

  const chartData = generateChartData()

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No Alert Data</p>
          <p className="text-sm">No alerts found to display in the chart</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="alerts" stroke="#8884d8" strokeWidth={2} name="Total Alerts" />
        <Line type="monotone" dataKey="resolved" stroke="#82ca9d" strokeWidth={2} name="Resolved" />
        <Line type="monotone" dataKey="open" stroke="#ff7c7c" strokeWidth={2} name="Open" />
      </LineChart>
    </ResponsiveContainer>
  )
}
