"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, CheckCircle, AlertOctagon, User, Clock } from "lucide-react"

type ActivityStatus = "alert" | "resolved" | "escalated" | "info"

interface Activity {
  id: string
  message: string
  timestamp: string
  status: ActivityStatus
  user?: {
    name: string
    avatar: string
  }
}

const activities: Activity[] = [
  {
    id: "1",
    message: "Intruder detected in Office 101",
    timestamp: "2 minutes ago",
    status: "alert",
  },
  {
    id: "2",
    message: "Alert resolved by Sarah",
    timestamp: "15 minutes ago",
    status: "resolved",
    user: {
      name: "Sarah",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "3",
    message: "Unknown person in Storage Room",
    timestamp: "32 minutes ago",
    status: "escalated",
  },
  {
    id: "4",
    message: "New guest checked in at Main Lobby",
    timestamp: "1 hour ago",
    status: "info",
  },
  {
    id: "5",
    message: "Alert resolved by John",
    timestamp: "2 hours ago",
    status: "resolved",
    user: {
      name: "John",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "6",
    message: "System maintenance completed",
    timestamp: "3 hours ago",
    status: "info",
  },
  {
    id: "7",
    message: "Suspicious activity in Conference Room A",
    timestamp: "4 hours ago",
    status: "alert",
  },
]

export function RecentActivity() {
  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case "alert":
        return (
          <Badge variant="destructive" className="ml-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alert
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 ml-2">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 ml-2">
            <AlertOctagon className="h-3 w-3 mr-1" />
            Escalated
          </Badge>
        )
      case "info":
        return (
          <Badge variant="secondary" className="ml-2">
            <User className="h-3 w-3 mr-1" />
            Info
          </Badge>
        )
    }
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
            <div className="rounded-full p-2 bg-muted">
              {activity.status === "alert" && <AlertTriangle className="h-4 w-4 text-destructive" />}
              {activity.status === "resolved" && <CheckCircle className="h-4 w-4 text-green-500" />}
              {activity.status === "escalated" && <AlertOctagon className="h-4 w-4 text-amber-500" />}
              {activity.status === "info" && <User className="h-4 w-4 text-blue-500" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center">
                <p className="text-sm font-medium">{activity.message}</p>
                {getStatusBadge(activity.status)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {activity.timestamp}
              </div>
            </div>
            {activity.user && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
