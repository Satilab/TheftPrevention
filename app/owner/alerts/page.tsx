"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertFilters } from "@/components/alert-filters"
import { AlertList } from "@/components/alert-list"
import { VoiceAlertList } from "@/components/voice-alert-list"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Mic, Shield, Bell, AlertTriangle } from "lucide-react"
import { useData } from "@/contexts/data-context"

export default function OwnerAlertsPage() {
  const { alerts, audioLogs, isLoading } = useData()
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterRoom, setFilterRoom] = useState<string | null>(null)
  const [filterReceptionist, setFilterReceptionist] = useState<string | null>(null)

  // Calculate metrics from actual data
  const pendingAlerts = alerts.filter((a) => a.status === "Open").length
  const escalatedAlerts = alerts.filter((a) => a.status === "Escalated").length
  const voiceAlerts = audioLogs.filter((a) => a.flagged).length
  const resolvedToday = alerts.filter(
    (a) => a.status === "Resolved" && a.timestamp.toDateString() === new Date().toDateString(),
  ).length

  const handleResetFilters = () => {
    setFilterStatus(null)
    setFilterType(null)
    setFilterRoom(null)
    setFilterReceptionist(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Security Alerts & Voice Monitoring</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">{pendingAlerts}</span>
              <span className="text-sm text-muted-foreground">Pending Alerts</span>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">{escalatedAlerts}</span>
              <span className="text-sm text-muted-foreground">Escalated</span>
            </div>
            <Bell className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{voiceAlerts}</span>
              <span className="text-sm text-muted-foreground">Voice Alerts</span>
            </div>
            <Mic className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">{resolvedToday}</span>
              <span className="text-sm text-muted-foreground">Resolved Today</span>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="security">Security Alerts</TabsTrigger>
          <TabsTrigger value="voice">Voice Recordings</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Filters</CardTitle>
              <CardDescription>Filter all alerts by status, type, room, or receptionist</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertFilters
                status={filterStatus}
                type={filterType}
                room={filterRoom}
                receptionist={filterReceptionist}
                onStatusChange={setFilterStatus}
                onTypeChange={setFilterType}
                onRoomChange={setFilterRoom}
                onReceptionistChange={setFilterReceptionist}
                onReset={handleResetFilters}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Alert List</CardTitle>
              <CardDescription>All security alerts with details and escalation options</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status={filterStatus} type={filterType} room={filterRoom} receptionist={filterReceptionist} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Recording Analysis</CardTitle>
              <CardDescription>AI-analyzed voice interactions with sentiment and concern detection</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceAlertList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Filters</CardTitle>
              <CardDescription>Filter security alerts by status, type, room, or receptionist</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertFilters
                status={filterStatus}
                type={filterType}
                room={filterRoom}
                receptionist={filterReceptionist}
                onStatusChange={setFilterStatus}
                onTypeChange={setFilterType}
                onRoomChange={setFilterRoom}
                onReceptionistChange={setFilterReceptionist}
                onReset={handleResetFilters}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Alert List</CardTitle>
              <CardDescription>All security alerts with details and escalation options</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status={filterStatus} type={filterType} room={filterRoom} receptionist={filterReceptionist} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-800 dark:text-blue-200">Voice Recording Monitoring</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Monitor all voice interactions between receptionists and guests. AI analysis flags concerning
                conversations for your review.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{audioLogs.length}</p>
                  <p className="text-sm text-muted-foreground">Today's Recordings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{voiceAlerts}</p>
                  <p className="text-sm text-muted-foreground">Flagged Conversations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {audioLogs.filter((a) => a.flagged && a.escalated).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Escalated Issues</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {audioLogs.filter((a) => a.flagged && a.resolved).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Recording Analysis</CardTitle>
              <CardDescription>AI-analyzed voice interactions with sentiment and concern detection</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceAlertList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escalated Alerts</CardTitle>
              <CardDescription>Alerts that require immediate owner attention</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status="Escalated" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Successfully handled security alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status="Resolved" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
