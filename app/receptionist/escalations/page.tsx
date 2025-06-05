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
import { useData } from "@/contexts/data-context"

export default function EscalationsPage() {
  const { toast } = useToast()
  const { alerts, updateAlert, isConnectedToSalesforce } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingAlerts, setProcessingAlerts] = useState<Record<string, boolean>>({})

  const filteredEscalations = alerts.filter(
    (alert) =>
      (alert.location && alert.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.type && alert.type.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSubmitResponse = async (alertId: string) => {
    if (!responseText.trim()) return

    setProcessingAlerts((prev) => ({ ...prev, [alertId]: true }))
    setIsSubmitting(true)

    try {
      console.log("🔄 Submitting response for alert:", alertId)

      // Update the alert with the response - use "Responded" instead of "responded"
      await updateAlert(alertId, {
        status: "Responded",
        receptionistComment: responseText.trim(),
      })

      setSelectedEscalation(null)
      setResponseText("")

      toast({
        title: "Response Submitted",
        description: `Your response to escalation ${alertId} has been submitted${isConnectedToSalesforce ? " and synced to Salesforce" : ""}.`,
      })
    } catch (error) {
      console.error("❌ Response submission error:", error)
      toast({
        title: "Submission Failed",
        description: `Failed to submit response. ${error instanceof Error ? error.message : "Please try again."}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setProcessingAlerts((prev) => ({ ...prev, [alertId]: false }))
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "Intruder":
        return "Unregistered Face"
      case "Mismatch":
        return "Suspicious Activity"
      case "Tailgating":
        return "Tailgating"
      default:
        return type
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "Intruder":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "Mismatch":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "Tailgating":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge variant="destructive">Pending</Badge>
      case "Responded":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Responded
          </Badge>
        )
      case "Resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Reviewed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Escalation Inbox</h1>
        <p className="text-muted-foreground">Manage and respond to security alerts assigned to you</p>
        {!isConnectedToSalesforce && (
          <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Not connected to Salesforce. Changes will only be saved locally.</span>
          </div>
        )}
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
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Escalations</TabsTrigger>
          <TabsTrigger value="Open">Pending</TabsTrigger>
          <TabsTrigger value="Responded">Responded</TabsTrigger>
          <TabsTrigger value="Resolved">Reviewed</TabsTrigger>
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
                              src={
                                escalation.faceLogId
                                  ? `/placeholder.svg?height=128&width=128&query=face`
                                  : "/placeholder.svg"
                              }
                              alt="Face Detection"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <div className="flex items-center gap-2 mb-2 md:mb-0">
                                <div className="flex items-center">
                                  {getAlertTypeIcon(escalation.type)}
                                  <h3 className="font-medium ml-2">{escalation.id}</h3>
                                </div>
                                {getStatusBadge(escalation.status)}
                                <Badge variant="outline">{getAlertTypeLabel(escalation.type)}</Badge>
                                {escalation.salesforceId && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    SF
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {escalation.location} | {formatDate(escalation.timestamp)}
                              </div>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm font-medium">Description:</p>
                              <p className="text-sm bg-muted p-2 rounded-md">{escalation.description}</p>
                            </div>

                            {escalation.receptionistComment && (
                              <div className="mb-4">
                                <p className="text-sm font-medium">Your Response:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.receptionistComment}</p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {escalation.status === "Open" ? (
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
                                          <p className="text-sm font-medium">Location</p>
                                          <p className="text-sm">{escalation.location}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Alert Type</p>
                                          <p className="text-sm">{getAlertTypeLabel(escalation.type)}</p>
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
                                        onClick={() => handleSubmitResponse(escalation.id)}
                                        disabled={isSubmitting || !responseText.trim()}
                                      >
                                        {processingAlerts[escalation.id] ? (
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
                                  {escalation.status === "Responded" ? (
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

        <TabsContent value="Open">
          <Card>
            <CardHeader>
              <CardTitle>Pending Escalations</CardTitle>
              <CardDescription>Alerts that require your response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEscalations.filter((e) => e.status === "Open").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CheckCircle className="mx-auto h-10 w-10 mb-2" />
                    <p>No pending escalations</p>
                  </div>
                ) : (
                  filteredEscalations
                    .filter((e) => e.status === "Open")
                    .map((escalation) => (
                      <Card key={escalation.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-32 h-32 bg-muted flex items-center justify-center">
                              <img
                                src={
                                  escalation.faceLogId
                                    ? `/placeholder.svg?height=128&width=128&query=face`
                                    : "/placeholder.svg"
                                }
                                alt="Face Detection"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div className="flex items-center gap-2 mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    {getAlertTypeIcon(escalation.type)}
                                    <h3 className="font-medium ml-2">{escalation.id}</h3>
                                  </div>
                                  {getStatusBadge(escalation.status)}
                                  <Badge variant="outline">{getAlertTypeLabel(escalation.type)}</Badge>
                                  {escalation.salesforceId && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      SF
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {escalation.location} | {formatDate(escalation.timestamp)}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Description:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.description}</p>
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
                                          <p className="text-sm font-medium">Location</p>
                                          <p className="text-sm">{escalation.location}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Alert Type</p>
                                          <p className="text-sm">{getAlertTypeLabel(escalation.type)}</p>
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
                                        onClick={() => handleSubmitResponse(escalation.id)}
                                        disabled={isSubmitting || !responseText.trim()}
                                      >
                                        {processingAlerts[escalation.id] ? (
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

        <TabsContent value="Responded">
          <Card>
            <CardHeader>
              <CardTitle>Responded Escalations</CardTitle>
              <CardDescription>Alerts that have been responded to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEscalations.filter((e) => e.status === "Responded").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <AlertCircle className="mx-auto h-10 w-10 mb-2" />
                    <p>No responded escalations</p>
                  </div>
                ) : (
                  filteredEscalations
                    .filter((e) => e.status === "Responded")
                    .map((escalation) => (
                      <Card key={escalation.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-32 h-32 bg-muted flex items-center justify-center">
                              <img
                                src={
                                  escalation.faceLogId
                                    ? `/placeholder.svg?height=128&width=128&query=face`
                                    : "/placeholder.svg"
                                }
                                alt="Face Detection"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div className="flex items-center gap-2 mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    {getAlertTypeIcon(escalation.type)}
                                    <h3 className="font-medium ml-2">{escalation.id}</h3>
                                  </div>
                                  {getStatusBadge(escalation.status)}
                                  <Badge variant="outline">{getAlertTypeLabel(escalation.type)}</Badge>
                                  {escalation.salesforceId && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      SF
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {escalation.location} | {formatDate(escalation.timestamp)}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Description:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.description}</p>
                              </div>

                              {escalation.receptionistComment && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium">Your Response:</p>
                                  <p className="text-sm bg-muted p-2 rounded-md">{escalation.receptionistComment}</p>
                                </div>
                              )}

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

        <TabsContent value="Resolved">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Escalations</CardTitle>
              <CardDescription>Alerts that have been reviewed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEscalations.filter((e) => e.status === "Resolved").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <CheckCircle className="mx-auto h-10 w-10 mb-2" />
                    <p>No reviewed escalations</p>
                  </div>
                ) : (
                  filteredEscalations
                    .filter((e) => e.status === "Resolved")
                    .map((escalation) => (
                      <Card key={escalation.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-32 h-32 bg-muted flex items-center justify-center">
                              <img
                                src={
                                  escalation.faceLogId
                                    ? `/placeholder.svg?height=128&width=128&query=face`
                                    : "/placeholder.svg"
                                }
                                alt="Face Detection"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div className="flex items-center gap-2 mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    {getAlertTypeIcon(escalation.type)}
                                    <h3 className="font-medium ml-2">{escalation.id}</h3>
                                  </div>
                                  {getStatusBadge(escalation.status)}
                                  <Badge variant="outline">{getAlertTypeLabel(escalation.type)}</Badge>
                                  {escalation.salesforceId && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      SF
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {escalation.location} | {formatDate(escalation.timestamp)}
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium">Description:</p>
                                <p className="text-sm bg-muted p-2 rounded-md">{escalation.description}</p>
                              </div>

                              {escalation.receptionistComment && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium">Your Response:</p>
                                  <p className="text-sm bg-muted p-2 rounded-md">{escalation.receptionistComment}</p>
                                </div>
                              )}

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
    </div>
  )
}
