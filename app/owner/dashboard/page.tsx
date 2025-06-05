"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, AlertTriangle, CheckCircle, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { DashboardChart } from "@/components/dashboard-chart"
import { RecentActivity } from "@/components/recent-activity"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { ConnectionDebug } from "@/components/connection-debug"

export default function OwnerDashboard() {
  const {
    guests,
    alerts,
    rooms,
    faceLogs,
    isLoading,
    isInitialLoad,
    lastRefresh,
    isConnectedToSalesforce,
    salesforceError,
    refreshAllData,
  } = useData()

  // Calculate metrics with null checks
  const totalGuests = guests?.length || 0
  const intrusionsDetected = alerts?.filter((alert) => alert.type === "Intruder")?.length || 0
  const alertsResolved = alerts?.filter((alert) => alert.status === "Resolved")?.length || 0
  const openEscalations = alerts?.filter((alert) => alert.status === "Escalated")?.length || 0

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Owner Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={isConnectedToSalesforce ? "default" : "destructive"} className="flex items-center gap-1">
            {isConnectedToSalesforce ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnectedToSalesforce ? "Live" : "Offline"}
          </Badge>
          {lastRefresh && (
            <span className="text-xs text-muted-foreground">Updated: {lastRefresh.toLocaleTimeString()}</span>
          )}
          <Button variant="outline" size="sm" onClick={refreshAllData} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>

      {salesforceError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Salesforce Error:</span>
              <span className="text-sm">{salesforceError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {isInitialLoad ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500" />
            <p className="text-lg font-medium">Loading Salesforce Data...</p>
            <p className="text-sm text-muted-foreground">Connecting to your data source</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Guests Today</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGuests}</div>
                <p className="text-xs text-muted-foreground">
                  {totalGuests > 0 ? "Active guests in system" : "No guests found"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intrusions Detected</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{intrusionsDetected}</div>
                <p className="text-xs text-muted-foreground">
                  {intrusionsDetected > 0 ? "Security incidents" : "No intrusions detected"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alertsResolved}</div>
                <p className="text-xs text-muted-foreground">
                  {alertsResolved > 0 ? "Successfully handled" : "No resolved alerts"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Escalations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openEscalations}</div>
                <p className="text-xs text-muted-foreground">
                  {openEscalations > 0 ? "Require attention" : "No open escalations"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="alerts">Real-time Alerts</TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Alerts Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DashboardChart alerts={alerts || []} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest security events and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivity alerts={alerts || []} faceLogs={faceLogs || []} guests={guests || []} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <AdvancedAnalytics
                alerts={alerts || []}
                guests={guests || []}
                rooms={rooms || []}
                faceLogs={faceLogs || []}
              />
            </TabsContent>
            <TabsContent value="alerts" className="space-y-4">
              <RealTimeAlerts alerts={alerts || []} />
            </TabsContent>
            <TabsContent value="debug" className="space-y-4">
              <ConnectionDebug />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
