"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Eye, Mic, Clock, MapPin, User, Play, Pause, Volume2, Camera, Zap } from "lucide-react"

interface RealTimeAlert {
  id: string
  type: "intrusion" | "suspicious" | "voice" | "system" | "motion"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  location: string
  description: string
  status: "active" | "acknowledged" | "resolved"
  assignedTo?: string
  confidence: number
  imageUrl?: string
  audioUrl?: string
}

const mockAlerts: RealTimeAlert[] = [
  {
    id: "RT001",
    type: "intrusion",
    severity: "critical",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    location: "Parking Garage - Level B1",
    description: "Unauthorized person detected in restricted area",
    status: "active",
    confidence: 94,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "RT002",
    type: "voice",
    severity: "high",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    location: "Reception Desk",
    description: "Aggressive tone detected in guest conversation",
    status: "acknowledged",
    assignedTo: "Sarah",
    confidence: 87,
    audioUrl: "#",
  },
  {
    id: "RT003",
    type: "motion",
    severity: "medium",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    location: "Conference Room A",
    description: "Motion detected after hours",
    status: "active",
    confidence: 76,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "RT004",
    type: "suspicious",
    severity: "medium",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    location: "Main Lobby",
    description: "Person loitering for extended period",
    status: "acknowledged",
    assignedTo: "John",
    confidence: 82,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "RT005",
    type: "system",
    severity: "low",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    location: "Camera Network",
    description: "Camera 12 connectivity issue resolved",
    status: "resolved",
    confidence: 100,
  },
]

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>(mockAlerts)
  const [isLive, setIsLive] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<RealTimeAlert | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate new alert occasionally
      if (Math.random() < 0.1) {
        const newAlert: RealTimeAlert = {
          id: `RT${Date.now()}`,
          type: ["intrusion", "suspicious", "voice", "motion", "system"][Math.floor(Math.random() * 5)] as any,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          timestamp: new Date(),
          location: ["Lobby", "Parking", "Conference Room B", "Storage", "Reception"][Math.floor(Math.random() * 5)],
          description: "New security event detected",
          status: "active",
          confidence: Math.floor(Math.random() * 30) + 70,
          imageUrl: "/placeholder.svg?height=100&width=100",
        }
        setAlerts((prev) => [newAlert, ...prev].slice(0, 20))
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [isLive])

  const getAlertIcon = (type: RealTimeAlert["type"]) => {
    switch (type) {
      case "intrusion":
        return <AlertTriangle className="h-4 w-4" />
      case "suspicious":
        return <Eye className="h-4 w-4" />
      case "voice":
        return <Mic className="h-4 w-4" />
      case "motion":
        return <Zap className="h-4 w-4" />
      case "system":
        return <Shield className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: RealTimeAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
    }
  }

  const getSeverityBadge = (severity: RealTimeAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const getStatusBadge = (status: RealTimeAlert["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "acknowledged":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Acknowledged</Badge>
      case "resolved":
        return <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`
    }
    return `${minutes}m ago`
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active")
  const acknowledgedAlerts = alerts.filter((alert) => alert.status === "acknowledged")
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Real-time Security Alerts</h2>
          <p className="text-muted-foreground">Live monitoring of security events across the hotel</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2"
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isLive ? "Live" : "Paused"}
          </Button>
          <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-2xl font-bold text-amber-600">{acknowledgedAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Acknowledged</div>
            </div>
            <Eye className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{alerts.filter((a) => a.type === "voice").length}</div>
              <div className="text-sm text-muted-foreground">Voice Alerts</div>
            </div>
            <Mic className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Live Alert Feed</CardTitle>
              <CardDescription>Real-time security events as they happen</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className={`w-1 h-full rounded-full ${getSeverityColor(alert.severity)}`} />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <span className="font-medium">{alert.id}</span>
                            {getSeverityBadge(alert.severity)}
                            {getStatusBadge(alert.status)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              {alert.confidence}% confidence
                            </div>
                            {alert.assignedTo && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {alert.assignedTo}
                              </div>
                            )}
                          </div>
                        </div>
                        {alert.imageUrl && (
                          <div className="flex gap-2">
                            <img
                              src={alert.imageUrl || "/placeholder.svg"}
                              alt="Alert evidence"
                              className="w-16 h-16 object-cover rounded border"
                            />
                            {alert.audioUrl && (
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Volume2 className="h-3 w-3" />
                                Play Audio
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Alerts requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border-red-200 bg-red-50 dark:bg-red-950"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="w-1 h-full rounded-full bg-red-500" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <span className="font-medium">{alert.id}</span>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              {alert.confidence}% confidence
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="outline">
                            Assign
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledged">
          <Card>
            <CardHeader>
              <CardTitle>Acknowledged Alerts</CardTitle>
              <CardDescription>Alerts currently being handled</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {acknowledgedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border-amber-200 bg-amber-50 dark:bg-amber-950"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="w-1 h-full rounded-full bg-amber-500" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <span className="font-medium">{alert.id}</span>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </div>
                            {alert.assignedTo && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Assigned to {alert.assignedTo}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">
                            Resolve
                          </Button>
                          <Button size="sm" variant="outline">
                            Escalate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Successfully handled security events</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {resolvedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border-green-200 bg-green-50 dark:bg-green-950"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <div className="w-1 h-full rounded-full bg-green-500" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <span className="font-medium">{alert.id}</span>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </div>
                            {alert.assignedTo && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Resolved by {alert.assignedTo}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
