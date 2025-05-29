"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle, AlertOctagon, ArrowUpRight, MessageSquare } from "lucide-react"

interface Alert {
  id: string
  faceImage: string
  roomId: string
  roomName: string
  type: "intruder" | "suspicious" | "unauthorized" | "system"
  timestamp: string
  status: "pending" | "resolved" | "escalated"
  receptionist: string | null
  comments: string[]
}

const alerts: Alert[] = [
  {
    id: "A001",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "R003",
    roomName: "Office 101",
    type: "intruder",
    timestamp: "2 minutes ago",
    status: "pending",
    receptionist: null,
    comments: [],
  },
  {
    id: "A002",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "R002",
    roomName: "Conference Room A",
    type: "suspicious",
    timestamp: "15 minutes ago",
    status: "escalated",
    receptionist: "Sarah",
    comments: ["This person has been loitering for over 30 minutes"],
  },
  {
    id: "A003",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "R004",
    roomName: "Storage Room",
    type: "unauthorized",
    timestamp: "32 minutes ago",
    status: "resolved",
    receptionist: "John",
    comments: ["False alarm, this was a new maintenance worker"],
  },
  {
    id: "A004",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "R001",
    roomName: "Main Lobby",
    type: "suspicious",
    timestamp: "1 hour ago",
    status: "pending",
    receptionist: null,
    comments: [],
  },
  {
    id: "A005",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "R005",
    roomName: "Conference Room B",
    type: "system",
    timestamp: "2 hours ago",
    status: "resolved",
    receptionist: "Sarah",
    comments: ["Camera was temporarily offline, now back online"],
  },
]

interface AlertListProps {
  status?: string | null
  type?: string | null
  room?: string | null
  receptionist?: string | null
}

export function AlertList({ status, type, room, receptionist }: AlertListProps) {
  const { role } = useAuth()
  const [alertsData, setAlertsData] = useState<Alert[]>(alerts)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [comment, setComment] = useState("")
  const [selectedReceptionist, setSelectedReceptionist] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<"comment" | "escalate" | "resolve" | null>(null)

  const filteredAlerts = alertsData.filter((alert) => {
    if (status && alert.status !== status) return false
    if (type && alert.type !== type) return false
    if (room && alert.roomId !== room) return false
    if (receptionist && alert.receptionist !== receptionist) return false
    return true
  })

  const handleOpenDialog = (alert: Alert, action: "comment" | "escalate" | "resolve") => {
    setSelectedAlert(alert)
    setDialogAction(action)
    setComment("")
    setSelectedReceptionist(alert.receptionist || "")
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedAlert(null)
    setDialogAction(null)
    setComment("")
    setSelectedReceptionist("")
  }

  const handleAddComment = () => {
    if (!selectedAlert || !comment.trim()) return

    setAlertsData((prev) =>
      prev.map((alert) =>
        alert.id === selectedAlert.id ? { ...alert, comments: [...alert.comments, comment.trim()] } : alert,
      ),
    )

    handleCloseDialog()
  }

  const handleEscalate = () => {
    if (!selectedAlert) return

    setAlertsData((prev) =>
      prev.map((alert) =>
        alert.id === selectedAlert.id
          ? {
              ...alert,
              status: "escalated",
              receptionist: selectedReceptionist || alert.receptionist,
              comments: comment.trim() ? [...alert.comments, comment.trim()] : alert.comments,
            }
          : alert,
      ),
    )

    handleCloseDialog()
  }

  const handleResolve = () => {
    if (!selectedAlert) return

    setAlertsData((prev) =>
      prev.map((alert) =>
        alert.id === selectedAlert.id
          ? {
              ...alert,
              status: "resolved",
              receptionist: selectedReceptionist || alert.receptionist,
              comments: comment.trim() ? [...alert.comments, comment.trim()] : alert.comments,
            }
          : alert,
      ),
    )

    handleCloseDialog()
  }

  const getTypeLabel = (type: Alert["type"]) => {
    switch (type) {
      case "intruder":
        return "Intruder"
      case "suspicious":
        return "Suspicious Activity"
      case "unauthorized":
        return "Unauthorized Access"
      case "system":
        return "System Alert"
    }
  }

  const getStatusBadge = (status: Alert["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      case "escalated":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            <AlertOctagon className="h-3 w-3 mr-1" />
            Escalated
          </Badge>
        )
    }
  }

  const getDialogTitle = () => {
    switch (dialogAction) {
      case "comment":
        return "Add Comment"
      case "escalate":
        return "Escalate Alert"
      case "resolve":
        return "Resolve Alert"
      default:
        return ""
    }
  }

  const getDialogDescription = () => {
    switch (dialogAction) {
      case "comment":
        return "Add a comment to this alert"
      case "escalate":
        return "Escalate this alert for immediate attention"
      case "resolve":
        return "Mark this alert as resolved"
      default:
        return ""
    }
  }

  const getDialogAction = () => {
    switch (dialogAction) {
      case "comment":
        return handleAddComment
      case "escalate":
        return handleEscalate
      case "resolve":
        return handleResolve
      default:
        return () => {}
    }
  }

  return (
    <div className="space-y-4">
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No alerts match the current filters</div>
      ) : (
        filteredAlerts.map((alert) => (
          <Card key={alert.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-24 h-24 bg-muted flex items-center justify-center">
                  <img
                    src={alert.faceImage || "/placeholder.svg"}
                    alt="Face Detection"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      <h3 className="font-medium">{alert.id}</h3>
                      {getStatusBadge(alert.status)}
                      <Badge variant="outline">{getTypeLabel(alert.type)}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{alert.timestamp}</div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm">
                      <span className="font-medium">Room:</span> {alert.roomName} ({alert.roomId})
                    </p>
                    {alert.receptionist && (
                      <p className="text-sm">
                        <span className="font-medium">Assigned to:</span> {alert.receptionist}
                      </p>
                    )}
                  </div>

                  {alert.comments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Comments:</h4>
                      <ul className="text-sm space-y-1">
                        {alert.comments.map((comment, index) => (
                          <li key={index} className="bg-muted p-2 rounded-md">
                            {comment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(alert, "comment")}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Add Comment
                    </Button>

                    {alert.status !== "escalated" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
                        onClick={() => handleOpenDialog(alert, "escalate")}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Escalate
                      </Button>
                    )}

                    {alert.status !== "resolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                        onClick={() => handleOpenDialog(alert, "resolve")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Alert ID</label>
                  <p className="text-sm">{selectedAlert.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Room</label>
                  <p className="text-sm">{selectedAlert.roomName}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Receptionist</label>
                <Select value={selectedReceptionist} onValueChange={setSelectedReceptionist}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Receptionist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Sarah">Sarah</SelectItem>
                    <SelectItem value="John">John</SelectItem>
                    <SelectItem value="Michael">Michael</SelectItem>
                    <SelectItem value="Emma">Emma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Comment</label>
                <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={getDialogAction()}>
              {dialogAction === "comment"
                ? "Add Comment"
                : dialogAction === "escalate"
                  ? "Escalate"
                  : dialogAction === "resolve"
                    ? "Resolve"
                    : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
