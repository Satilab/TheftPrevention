"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Search, RefreshCw, Send, Paperclip, CheckCircle, Clock, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Mock escalation data
const escalationData = [
  {
    id: "E001",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "101",
    alertType: "unregistered",
    timestamp: "2023-05-29T14:30:00",
    status: "pending",
    ownerNote: "This person was not registered but entered Room 101. Please verify identity.",
    response: "",
  },
  {
    id: "E002",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "203",
    alertType: "suspicious",
    timestamp: "2023-05-29T15:45:00",
    status: "responded",
    ownerNote: "Person loitering in hallway near Room 203 for over 30 minutes.",
    response: "This was a hotel maintenance worker fixing the AC units. I've verified their ID badge.",
  },
  {
    id: "E003",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "305",
    alertType: "wrong-room",
    timestamp: "2023-05-28T12:15:00",
    status: "reviewed",
    ownerNote: "Guest from Room 302 entered Room 305. Please check if this was authorized.",
    response: "Guest was confused about their room number. I've escorted them to the correct room.",
  },
  {
    id: "E004",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "402",
    alertType: "late-entry",
    timestamp: "2023-05-28T23:20:00",
    status: "pending",
    ownerNote: "Guest entered hotel after midnight without checking in at reception.",
    response: "",
  },
  {
    id: "E005",
    faceImage: "/placeholder.svg?height=80&width=80",
    roomId: "204",
    alertType: "multiple-rooms",
    timestamp: "2023-05-27T13:20:00",
    status: "reviewed",
    ownerNote: "Same person detected in Rooms 204 and 206 within 5 minutes.",
    response: "This was the housekeeping staff cleaning both rooms. Schedule verified.",
  },
]

type EscalationStatus = "pending" | "responded" | "reviewed"
type AlertType = "unregistered" | "suspicious" | "wrong-room" | "late-entry" | "multiple-rooms" | "tailgating"

interface Escalation {
  id: string
  faceImage: string
  roomId: string
  alertType: AlertType
  timestamp: string
  status: EscalationStatus
  ownerNote: string
  response: string
}

export default function EscalationsPage() {
  const { toast } = useToast()
  const [escalations, setEscalations] = useState<Escalation[]>(escalationData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null)
  const [responseText, setResponseText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredEscalations = escalations.filter(
    (escalation) =>
      escalation.roomId.includes(searchQuery) ||
      escalation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getAlertTypeLabel(escalation.alertType).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmitResponse = (escalation: Escalation) => {
    if (!responseText.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setEscalations((prev) =>
        prev.map((e) =>
          e.id === escalation.id
            ? {
                ...e,
                status: "responded",
                response: responseText.trim(),
              }
            : e,
        ),
      )
      setIsSubmitting(false)
      setSelectedEscalation(null)
      setResponseText("")

      toast({
        title: "Response Submitted",
        description: `Your response to escalation ${escalation.id} has been submitted.`,
      })
    }, 1500)
  }

  const getAlertTypeLabel = (type: AlertType) => {
    switch (type) {
      case "unregistered":
        return "Unregistered Face"
      case "suspicious":
        return "Suspicious Activity"
      case "wrong-room":
        return "Wrong Room Entry"
      case "late-entry":
        return "Late Entry"
      case "multiple-rooms":
        return "Multiple Room Access"
      case "tailgating":
        return "Tailgating"
    }
  }

  const getAlertTypeIcon = (type: AlertType) => {
    switch (type) {
      case "unregistered":
      case "wrong-room":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "suspicious":
      case "tailgating":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "late-entry":
      case "multiple-rooms":
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusBadge = (status: EscalationStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">Pending</Badge>
      case "responded":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Responded
          </Badge>
        )
      case "reviewed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Reviewed
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Escalation Inbox</h1>
        <p className="text-muted-foreground">Manage and respond to security alerts assigned to you</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by room, ID, or type..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Escalations</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Escalations</CardTitle>
              <CardDescription>All security alerts assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEscalations.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <AlertCircle className="mx-auto h-10 w-10 mb-2" />
                    <p>No escalations found matching your search criteria</p>
                  </div>
                ) : (
                  filteredEscalations.map((escalation) => (
                    <Card key={escalation.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-32 h-32 bg-muted flex items-center justify-center">
                            <img
                              src={escalation.faceImage || "/placeholder.svg"}
                              alt="Face Detection"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <div className="flex items-center gap-2 mb-2 md:mb-0">
                                <div className="flex items-center">
                                  {getAlertTypeIcon(escalation.alertType)}
                                  <h3 className="font-medium ml-2">{escalation.id}</h3>
                                </div>
                                {getStatusBadge(escalation.status)}
                                <Badge variant="outline">{getAlertTypeLabel(escalation.alertType)}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Room {escalation.roomId} | {formatDate(escalation.timestamp)}
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm font-medium">Owner's Note:</p>
                              <p className="text-sm bg-muted p-2 rounded-md">{escalation.ownerNote}</p>
                            </div>

                            {escalation.response && (
                              <div className="mb-4">
                                <p className="text-sm font-medium">Your Response:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.response}</p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {escalation.status === "pending" ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button>
                                      <Send className="mr-2 h-4 w-4" />
                                      Respond
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Respond to Escalation</DialogTitle>
                                      <DialogDescription>
                                        Provide details about this security alert and how it was addressed.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium">Escalation ID</p>
                                          <p className="text-sm">{escalation.id}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Room</p>
                                          <p className="text-sm">{escalation.roomId}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Alert Type</p>
                                          <p className="text-sm">{getAlertTypeLabel(escalation.alertType)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Timestamp</p>
                                          <p className="text-sm">{formatDate(escalation.timestamp)}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium mb-2">Your Response</p>
                                        <Textarea
                                          placeholder="Explain how you addressed this alert..."
                                          value={responseText}
                                          onChange={(e) => setResponseText(e.target.value)}
                                          rows={5}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium mb-2">Attach File (Optional)</p>
                                        <div className="flex items-center gap-2">
                                          <Button variant="outline" type="button" className="w-full">
                                            <Paperclip className="mr-2 h-4 w-4" />
                                            Attach ID Scan or Evidence
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleSubmitResponse(escalation)}
                                        disabled={isSubmitting || !responseText.trim()}
                                      >
                                        {isSubmitting ? (
                                          <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                          </>
                                        ) : (
                                          <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Submit Response
                                          </>
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <Button variant="outline" disabled>
                                  {escalation.status === "responded" ? (
                                    <>
                                      <Clock className="mr-2 h-4 w-4" />
                                      Awaiting Review
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Reviewed
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Escalations</CardTitle>
              <CardDescription>Alerts that require your response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEscalations.filter((e) => e.status === "pending").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CheckCircle className="mx-auto h-10 w-10 mb-2" />
                    <p>No pending escalations</p>
                  </div>
                ) : (
                  filteredEscalations
                    .filter((e) => e.status === "pending")
                    .map((escalation) => (
                      <Card key={escalation.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-32 h-32 bg-muted flex items-center justify-center">
                              <img
                                src={escalation.faceImage || "/placeholder.svg"}
                                alt="Face Detection"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div className="flex items-center gap-2 mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    {getAlertTypeIcon(escalation.alertType)}
                                    <h3 className="font-medium ml-2">{escalation.id}</h3>
                                  </div>
                                  {getStatusBadge(escalation.status)}
                                  <Badge variant="outline">{getAlertTypeLabel(escalation.alertType)}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Room {escalation.roomId} | {formatDate(escalation.timestamp)}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Owner's Note:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.ownerNote}</p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button>
                                      <Send className="mr-2 h-4 w-4" />
                                      Respond
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Respond to Escalation</DialogTitle>
                                      <DialogDescription>
                                        Provide details about this security alert and how it was addressed.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium">Escalation ID</p>
                                          <p className="text-sm">{escalation.id}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Room</p>
                                          <p className="text-sm">{escalation.roomId}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Alert Type</p>
                                          <p className="text-sm">{getAlertTypeLabel(escalation.alertType)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Timestamp</p>
                                          <p className="text-sm">{formatDate(escalation.timestamp)}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium mb-2">Your Response</p>
                                        <Textarea
                                          placeholder="Explain how you addressed this alert..."
                                          value={responseText}
                                          onChange={(e) => setResponseText(e.target.value)}
                                          rows={5}
                                        />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium mb-2">Attach File (Optional)</p>
                                        <div className="flex items-center gap-2">
                                          <Button variant="outline" type="button" className="w-full">
                                            <Paperclip className="mr-2 h-4 w-4" />
                                            Attach ID Scan or Evidence
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleSubmitResponse(escalation)}
                                        disabled={isSubmitting || !responseText.trim()}
                                      >
                                        {isSubmitting ? (
                                          <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                          </>
                                        ) : (
                                          <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Submit Response
                                          </>
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responded">
          <Card>
            <CardHeader>
              <CardTitle>Responded Escalations</CardTitle>
              <CardDescription>Alerts you've responded to that are awaiting owner review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEscalations.filter((e) => e.status === "responded").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No responded escalations</p>
                  </div>
                ) : (
                  filteredEscalations
                    .filter((e) => e.status === "responded")
                    .map((escalation) => (
                      <Card key={escalation.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-32 h-32 bg-muted flex items-center justify-center">
                              <img
                                src={escalation.faceImage || "/placeholder.svg"}
                                alt="Face Detection"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div className="flex items-center gap-2 mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    {getAlertTypeIcon(escalation.alertType)}
                                    <h3 className="font-medium ml-2">{escalation.id}</h3>
                                  </div>
                                  {getStatusBadge(escalation.status)}
                                  <Badge variant="outline">{getAlertTypeLabel(escalation.alertType)}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Room {escalation.roomId} | {formatDate(escalation.timestamp)}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Owner's Note:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.ownerNote}</p>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Your Response:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.response}</p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" disabled>
                                  <Clock className="mr-2 h-4 w-4" />
                                  Awaiting Review
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewed">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Escalations</CardTitle>
              <CardDescription>Alerts that have been reviewed by the owner</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEscalations.filter((e) => e.status === "reviewed").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No reviewed escalations</p>
                  </div>
                ) : (
                  filteredEscalations
                    .filter((e) => e.status === "reviewed")
                    .map((escalation) => (
                      <Card key={escalation.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-32 h-32 bg-muted flex items-center justify-center">
                              <img
                                src={escalation.faceImage || "/placeholder.svg"}
                                alt="Face Detection"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div className="flex items-center gap-2 mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    {getAlertTypeIcon(escalation.alertType)}
                                    <h3 className="font-medium ml-2">{escalation.id}</h3>
                                  </div>
                                  {getStatusBadge(escalation.status)}
                                  <Badge variant="outline">{getAlertTypeLabel(escalation.alertType)}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Room {escalation.roomId} | {formatDate(escalation.timestamp)}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Owner's Note:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.ownerNote}</p>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Your Response:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.response}</p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" disabled>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Reviewed
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
