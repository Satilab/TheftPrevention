"use client"

import type React from "react"

import { useData } from "@/contexts/data-context"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Users, Camera, Mic } from "lucide-react"

export function RecentActivity() {
  const { alerts, faceLogs, guests, audioLogs, isLoading } = useData()

  // Combine all activities and sort by timestamp
  const generateRecentActivity = () => {
    const activities: Array<{
      id: string
      type: "alert" | "face_log" | "guest" | "audio_log"
      timestamp: Date
      description: string
      status?: string
      icon: React.ReactNode
    }> = []

    // Add alerts
    alerts.forEach((alert) => {
      activities.push({
        id: alert.id,
        type: "alert",
        timestamp: alert.timestamp,
        description: `${alert.type} alert in ${alert.location}`,
        status: alert.status,
        icon: <AlertTriangle className="h-4 w-4" />,
      })
    })

    // Add face logs
    faceLogs.forEach((log) => {
      activities.push({
        id: log.id,
        type: "face_log",
        timestamp: log.timestamp,
        description: `${log.matchType} detected in ${log.roomId || "unknown location"}`,
        icon: <Camera className="h-4 w-4" />,
      })
    })

    // Add guest activities (check-ins/check-outs)
    guests.forEach((guest) => {
      if (guest.checkInDate) {
        activities.push({
          id: `${guest.id}_checkin`,
          type: "guest",
          timestamp: new Date(guest.checkInDate),
          description: `${guest.name} checked in to room ${guest.roomNumber}`,
          status: "checked-in",
          icon: <Users className="h-4 w-4" />,
        })
      }
      if (guest.checkOutDate && guest.status === "checked-out") {
        activities.push({
          id: `${guest.id}_checkout`,
          type: "guest",
          timestamp: new Date(guest.checkOutDate),
          description: `${guest.name} checked out from room ${guest.roomNumber}`,
          status: "checked-out",
          icon: <Users className="h-4 w-4" />,
        })
      }
    })

    // Add audio logs
    audioLogs.forEach((log) => {
      activities.push({
        id: log.id,
        type: "audio_log",
        timestamp: log.timestamp,
        description: `Voice recording from ${log.guestName || "unknown guest"}`,
        status: log.flagged ? "flagged" : "normal",
        icon: <Mic className="h-4 w-4" />,
      })
    })

    // Sort by timestamp (most recent first) and take last 10
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)
  }

  const recentActivity = generateRecentActivity()

  const getStatusBadge = (type: string, status?: string) => {
    switch (type) {
      case "alert":
        switch (status) {
          case "Open":
            return <Badge variant="destructive">Open</Badge>
          case "Resolved":
            return (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Resolved
              </Badge>
            )
          case "Escalated":
            return (
              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                Escalated
              </Badge>
            )
          default:
            return <Badge variant="outline">{status}</Badge>
        }
      case "guest":
        switch (status) {
          case "checked-in":
            return (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Check-in
              </Badge>
            )
          case "checked-out":
            return (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Check-out
              </Badge>
            )
          default:
            return <Badge variant="outline">{status}</Badge>
        }
      case "audio_log":
        return status === "flagged" ? (
          <Badge variant="destructive">Flagged</Badge>
        ) : (
          <Badge variant="outline">Normal</Badge>
        )
      case "face_log":
        return <Badge variant="outline">Detection</Badge>
      default:
        return null
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recentActivity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
        <p className="text-muted-foreground text-sm">No recent security events or guest activities to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{activity.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
              {getStatusBadge(activity.type, activity.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
