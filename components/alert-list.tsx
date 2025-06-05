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
import { AlertTriangle, CheckCircle, AlertOctagon, ArrowUpRight, MessageSquare, Inbox } from "lucide-react"
import { useData } from "@/contexts/data-context"

interface AlertListProps {
  status?: string | null
  type?: string | null
  room?: string | null
  receptionist?: string | null
}

export function AlertList({ status, type, room, receptionist }: AlertListProps) {
  const { role } = useAuth()
  const { alerts, resolveAlert } = useData()
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [comment, setComment] = useState("")
  const [selectedReceptionist, setSelectedReceptionist] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<"comment" | "escalate" | "resolve" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredAlerts = alerts.filter((alert) => {
    if (status && alert.status !== status) return false
    if (type && alert.type !== type) return false
    if (room && alert.location !== room) return false
    if (receptionist && alert.assignedTo !== receptionist) return false
    return true
  })

  const handleOpenDialog = (alert: any, action: "comment" | "escalate" | "resolve") => {
    setSelectedAlert(alert)
    setDialogAction(action)
    setComment("")
    setSelectedReceptionist(alert.assignedTo || "")
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

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Update the alert with the new comment
      // This would be handled by the data context in a real implementation
      setIsSubmitting(false)
      handleCloseDialog()
    }, 1000)
  }

  const handleEscalate = () => {
    if (!selectedAlert) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Update the alert status to escalated
      // This would be handled by the data context in a real implementation
      setIsSubmitting(false)
      handleCloseDialog()
    }, 1000)
  }

  const handleResolve = () => {
    if (!selectedAlert) return

    setIsSubmitting(true)

    // Call the resolveAlert function from the data context
    resolveAlert(selectedAlert.id, comment).then(() => {
      setIsSubmitting(false)
      handleCloseDialog()
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Intruder":
        return "Intruder"
      case "Mismatch":
        return "Face Mismatch"
      case "Tailgating":
        return "Tailgating"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Open
          </Badge>
        )
      case "Resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      case "Escalated":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            <AlertOctagon className="h-3 w-3 mr-1" />
            Escalated
          </Badge>
        )
      case "Responded":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <MessageSquare className="h-3 w-3 mr-1" />
            Responded
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
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

  // If there are no alerts, show an empty state
  if (filteredAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No alerts found</h3>
        <p className="text-muted-foreground mb-6">
          {status || type || room || receptionist
            ? "No alerts match your current filters"
            : "There are no security alerts to display"}
        </p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredAlerts.map((alert) => (
        <Card key={alert.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-24 h-24 bg-muted flex items-center justify-center">
                <img
                  src={alert.faceImageUrl || "/placeholder.svg?height=80&width=80"}
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
                  <div className="text-sm text-muted-foreground">
                    {alert.location} | {alert.timestamp.toLocaleString()}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Description:</span> {alert.description}
                  </p>
                  {alert.assignedTo && (
                    <p className="text-sm">
                      <span className="font-medium">Assigned to:</span> {alert.assignedTo}
                    </p>
                  )}
                </div>

                {alert.receptionistComment && (
                  <div className="mb-4">
                    <p className="text-sm font-medium">Receptionist Comment:</p>
                    <p className="text-sm bg-muted p-2 rounded-md">{alert.receptionistComment}</p>
                  </div>
                )}

                {alert.ownerReview && (
                  <div className="mb-4">
                    <p className="text-sm font-medium">Owner Review:</p>
                    <p className="text-sm bg-muted p-2 rounded-md">{alert.ownerReview}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(alert, "comment")}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>

                  {alert.status !== "Escalated" && alert.status !== "Resolved" && (
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

                  {alert.status !== "Resolved" && (
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
      ))}

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
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-sm">{selectedAlert.location}</p>
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
            <Button onClick={getDialogAction()} disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : dialogAction === "comment"
                  ? "Add Comment"
                  : dialogAction === "escalate"
                    ? "Escalate"
                    : "Resolve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
