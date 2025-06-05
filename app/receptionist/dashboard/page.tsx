"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, LogOut, AlertTriangle, CheckCircle } from "lucide-react"
import { useData } from "@/contexts/data-context"

export default function ReceptionistDashboard() {
  const { guests, alerts, isLoading } = useData()

  // Calculate metrics from actual data
  const todayGuests = guests.filter((g) => g.status === "checked-in").length
  const pendingCheckouts = guests.filter(
    (g) => g.status === "checked-in" && g.checkOutDate === new Date().toISOString().split("T")[0],
  ).length
  const activeAlerts = alerts.filter((a) => a.status === "Open").length
  const myTasks = alerts.filter((a) => a.assignedTo === "Current User" && a.status === "acknowledged").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guests Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayGuests}</div>
            <p className="text-xs text-muted-foreground">
              {todayGuests === 0 ? "No guests checked in" : "Currently checked in"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Checkouts</CardTitle>
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCheckouts}</div>
            <p className="text-xs text-muted-foreground">
              {pendingCheckouts === 0 ? "No pending checkouts" : "Due today"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {activeAlerts === 0 ? "No active alerts" : "Requiring attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTasks}</div>
            <p className="text-xs text-muted-foreground">{myTasks === 0 ? "No assigned tasks" : "Assigned to me"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
