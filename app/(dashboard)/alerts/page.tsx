"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertFilters } from "@/components/alert-filters"
import { AlertList } from "@/components/alert-list"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export default function AlertsPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterRoom, setFilterRoom] = useState<string | null>(null)
  const [filterReceptionist, setFilterReceptionist] = useState<string | null>(null)

  const handleResetFilters = () => {
    setFilterStatus(null)
    setFilterType(null)
    setFilterRoom(null)
    setFilterReceptionist(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Filters</CardTitle>
              <CardDescription>Filter alerts by status, type, room, or receptionist</CardDescription>
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
              <CardTitle>Alert List</CardTitle>
              <CardDescription>All security alerts with details and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status={filterStatus} type={filterType} room={filterRoom} receptionist={filterReceptionist} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Alerts</CardTitle>
              <CardDescription>Alerts that require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status="pending" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Alerts</CardTitle>
              <CardDescription>Alerts that have been resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status="resolved" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escalated Alerts</CardTitle>
              <CardDescription>Alerts that have been escalated</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertList status="escalated" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
