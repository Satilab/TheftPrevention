"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, Users, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FaceLog {
  id: string
  faceImage: string
  camera: string
  room: string
  timestamp: string
  type: "staff" | "guest" | "unknown" | "visitor"
  confidence: number
  personName?: string
  personId?: string
  anomalyFlags: string[]
  notes?: string
}

const faceLogsData: FaceLog[] = [
  {
    id: "FL001",
    faceImage: "/placeholder.svg?height=80&width=80",
    camera: "CAM001",
    room: "Main Lobby",
    timestamp: "2023-05-29T16:45:00",
    type: "unknown",
    confidence: 95,
    anomalyFlags: ["High confidence unknown face", "After hours access"],
    notes: "Unregistered person detected in lobby after 10 PM",
  },
  {
    id: "FL002",
    faceImage: "/placeholder.svg?height=80&width=80",
    camera: "CAM003",
    room: "Office 101",
    timestamp: "2023-05-29T16:30:00",
    type: "guest",
    confidence: 98,
    personName: "John Smith",
    personId: "G001",
    anomalyFlags: ["Wrong room access"],
    notes: "Guest accessed room not assigned to them",
  },
  {
    id: "FL003",
    faceImage: "/placeholder.svg?height=80&width=80",
    camera: "CAM002",
    room: "Conference Room A",
    timestamp: "2023-05-29T16:15:00",
    type: "staff",
    confidence: 99,
    personName: "Sarah Johnson",
    personId: "S001",
    anomalyFlags: [],
    notes: "Authorized staff access",
  },
  {
    id: "FL004",
    faceImage: "/placeholder.svg?height=80&width=80",
    camera: "CAM005",
    room: "Conference Room B",
    timestamp: "2023-05-29T16:00:00",
    type: "guest",
    confidence: 97,
    personName: "Emily Johnson",
    personId: "G002",
    anomalyFlags: [],
    notes: "Normal guest access to meeting room",
  },
  {
    id: "FL005",
    faceImage: "/placeholder.svg?height=80&width=80",
    camera: "CAM004",
    room: "Storage Room",
    timestamp: "2023-05-29T15:45:00",
    type: "unknown",
    confidence: 88,
    anomalyFlags: ["Restricted area access", "Medium confidence unknown"],
    notes: "Unknown person in restricted storage area",
  },
  {
    id: "FL006",
    faceImage: "/placeholder.svg?height=80&width=80",
    camera: "CAM006",
    room: "Office 102",
    timestamp: "2023-05-29T15:30:00",
    type: "visitor",
    confidence: 92,
    personName: "Michael Brown",
    personId: "V001",
    anomalyFlags: ["Unescorted visitor"],
    notes: "Visitor without staff escort",
  },
]

interface FaceLogListProps {
  date?: Date | null
  camera?: string | null
  confidence?: number | null
  type?: string | null
}

export function FaceLogList({ date, camera, confidence, type }: FaceLogListProps) {
  const [faceLogs] = useState<FaceLog[]>(faceLogsData)

  const filteredLogs = faceLogs.filter((log) => {
    if (date && new Date(log.timestamp).toDateString() !== date.toDateString()) return false
    if (camera && !log.camera.includes(camera)) return false
    if (confidence && log.confidence < confidence) return false
    if (type && log.type !== type) return false
    return true
  })

  const getTypeIcon = (type: FaceLog["type"]) => {
    switch (type) {
      case "staff":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "guest":
        return <Users className="h-4 w-4 text-green-500" />
      case "unknown":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "visitor":
        return <Eye className="h-4 w-4 text-purple-500" />
    }
  }

  const getTypeBadge = (type: FaceLog["type"]) => {
    switch (type) {
      case "staff":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Staff</Badge>
      case "guest":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Guest</Badge>
      case "unknown":
        return <Badge variant="destructive">Unknown</Badge>
      case "visitor":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Visitor</Badge>
    }
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">High</Badge>
    } else if (confidence >= 80) {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Medium</Badge>
    } else {
      return <Badge variant="destructive">Low</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {filteredLogs.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Eye className="mx-auto h-10 w-10 mb-2" />
          <p>No face detection logs found matching your criteria</p>
        </div>
      ) : (
        filteredLogs.map((log) => (
          <Card key={log.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-24 h-24 bg-muted flex items-center justify-center">
                  <img
                    src={log.faceImage || "/placeholder.svg"}
                    alt="Face Detection"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      {getTypeIcon(log.type)}
                      <h3 className="font-medium">{log.id}</h3>
                      {getTypeBadge(log.type)}
                      {getConfidenceBadge(log.confidence)}
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <p className="font-medium">Camera</p>
                      <p>{log.camera}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{log.room}</p>
                    </div>
                    <div>
                      <p className="font-medium">Confidence</p>
                      <p>{log.confidence}%</p>
                    </div>
                    <div>
                      <p className="font-medium">Person</p>
                      <p>{log.personName || "Unknown"}</p>
                    </div>
                  </div>

                  {log.anomalyFlags.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Anomaly Flags:</p>
                      <div className="flex flex-wrap gap-1">
                        {log.anomalyFlags.map((flag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {log.notes && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm bg-muted p-2 rounded">{log.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Face Detection Details</DialogTitle>
                          <DialogDescription>Detailed information about this detection event</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={log.faceImage || "/placeholder.svg"}
                              alt="Face Detection"
                              className="h-24 w-24 object-cover rounded"
                            />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(log.type)}
                                {getTypeBadge(log.type)}
                                {getConfidenceBadge(log.confidence)}
                              </div>
                              <p className="text-sm">
                                <span className="font-medium">Detection ID:</span> {log.id}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Confidence:</span> {log.confidence}%
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Camera</p>
                              <p className="text-sm">{log.camera}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm">{log.room}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Timestamp</p>
                              <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Person ID</p>
                              <p className="text-sm">{log.personId || "Unknown"}</p>
                            </div>
                          </div>

                          {log.personName && (
                            <div>
                              <p className="text-sm font-medium">Identified Person</p>
                              <p className="text-sm">{log.personName}</p>
                            </div>
                          )}

                          {log.anomalyFlags.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Anomaly Flags</p>
                              <div className="space-y-1">
                                {log.anomalyFlags.map((flag, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm">{flag}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {log.notes && (
                            <div>
                              <p className="text-sm font-medium mb-2">Additional Notes</p>
                              <p className="text-sm bg-muted p-3 rounded">{log.notes}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {log.anomalyFlags.length > 0 && (
                      <Button size="sm" variant="outline" className="border-amber-500 text-amber-500">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Investigate
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
  )
}
