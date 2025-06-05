"use client"

import { useData } from "@/contexts/data-context"
import { AlertTriangle, User, Clock, CheckCircle } from "lucide-react"

export function RecentActivity() {
  const { alerts = [], faceLogs = [], guests = [], isLoading = false } = useData() || {}

  // Create a combined activity feed from alerts, face logs, and guests
  const generateActivityFeed = () => {
    const activities = []

    // Add alerts to activities
    if (Array.isArray(alerts)) {
      alerts.forEach((alert) => {
        if (alert && alert.timestamp) {
          activities.push({
            id: `alert-${alert.id}`,
            type: "alert",
            title: `${alert.type} Alert`,
            description: alert.description || "Security alert detected",
            timestamp: new Date(alert.timestamp),
            status: alert.status,
            icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          })
        }
      })
    }

    // Add face logs to activities
    if (Array.isArray(faceLogs)) {
      faceLogs.forEach((log) => {
        if (log && log.timestamp) {
          activities.push({
            id: `facelog-${log.id}`,
            type: "facelog",
            title: `${log.matchType} Detection`,
            description: `Face detected with ${log.confidence}% confidence`,
            timestamp: new Date(log.timestamp),
            icon: <User className="h-4 w-4 text-blue-500" />,
          })
        }
      })
    }

    // Add guest check-ins to activities
    if (Array.isArray(guests)) {
      guests.forEach((guest) => {
        if (guest && guest.checkInDate) {
          activities.push({
            id: `guest-${guest.id}`,
            type: "guest",
            title: "Guest Check-in",
            description: `${guest.name} checked in`,
            timestamp: new Date(guest.checkInDate),
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          })
        }
      })
    }

    // Sort by timestamp (newest first) and take the 10 most recent
    return activities
      .filter((activity) => activity.timestamp && !isNaN(activity.timestamp.getTime()))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  }

  const activities = generateActivityFeed()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No Recent Activity</p>
          <p className="text-sm">No activity data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="mt-0.5">{activity.icon}</div>
          <div className="space-y-1">
            <div className="flex items-center">
              <p className="font-medium text-sm">{activity.title}</p>
              {activity.status && (
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activity.status === "Resolved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : activity.status === "Open"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                  }`}
                >
                  {activity.status}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {activity.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
