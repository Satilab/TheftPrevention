"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  ArrowUpRight,
  MessageSquare,
  Play,
  Pause,
  FileAudio,
} from "lucide-react"
import { useData } from "@/contexts/data-context"

export function VoiceAlertList() {
  const { audioLogs, isLoading } = useData()
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [comment, setComment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<"comment" | "escalate" | "resolve" | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleOpenDialog = (alert: any, action: "comment" | "escalate" | "resolve") => {
    setSelectedAlert(alert)
    setDialogAction(action)
    setComment("")
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedAlert(null)
    setDialogAction(null)
    setComment("")
  }

  const handleAddComment = () => {
    if (!selectedAlert || !comment.trim()) return
    handleCloseDialog()
  }

  const handleEscalate = () => {
    if (!selectedAlert) return
    handleCloseDialog()
  }

  const handleResolve = () => {
    if (!selectedAlert) return
    handleCloseDialog()
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control audio playback
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "negative":
        return <Badge variant="destructive">Negative</Badge>
      case "neutral":
        return <Badge variant="outline">Neutral</Badge>
      case "positive":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Positive
          </Badge>
        )
      default:
        return <Badge variant="outline">{sentiment}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
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
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDialogTitle = () => {
    switch (dialogAction) {
      case "comment":
        return "Add Comment"
      case "escalate":
        return "Escalate Voice Alert"
      case "resolve":
        return "Resolve Voice Alert"
      default:
        return ""
    }
  }

  const getDialogDescription = () => {
    switch (dialogAction) {
      case "comment":
        return "Add a comment to this voice alert"
      case "escalate":
        return "Escalate this voice alert for immediate attention"
      case "resolve":
        return "Mark this voice alert as resolved"
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (audioLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileAudio className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No voice recordings found</h3>
        <p className="text-muted-foreground mb-6">Voice recordings will appear here when they are captured</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {audioLogs.map((log) => (
        <Card key={log.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-24 h-24 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
              </div>
              <div className="flex-1 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <div className="flex items-center gap-2 mb-2 md:mb-0">
                    <h3 className="font-medium">{log.id}</h3>
                    {getStatusBadge(log.status)}
                    {getSentimentBadge(log.sentiment)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.timestamp.toLocaleString()} • {log.duration}s
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Guest:</span> {log.guestName || "Unknown"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Receptionist:</span> {log.receptionist || "Unknown"}
                  </p>
                  {log.keywords && log.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {log.keywords.map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {log.comments && log.comments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Comments:</h4>
                    <ul className="text-sm space-y-1">
                      {log.comments.map((comment: string, index: number) => (
                        <li key={index} className="bg-muted p-2 rounded-md">
                          {comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(log, "comment")}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Comment
                  </Button>

                  {log.status !== "escalated" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
                      onClick={() => handleOpenDialog(log, "escalate")}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Escalate
                    </Button>
                  )}

                  {log.status !== "resolved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                      onClick={() => handleOpenDialog(log, "resolve")}
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
                  <label className="text-sm font-medium">Guest</label>
                  <p className="text-sm">{selectedAlert.guestName || "Unknown"}</p>
                </div>
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
