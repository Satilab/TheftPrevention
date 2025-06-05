"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, Download, Filter, Search, Shield } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useData } from "@/contexts/data-context"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function IntrusionReports() {
  const { alerts = [], isLoading } = useData()
  const [activeTab, setActiveTab] = useState<string>("list")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterResolved, setFilterResolved] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Filter alerts to only show intrusion-related ones
  const intrusionEvents = alerts.filter(
    (alert) =>
      alert.type?.toLowerCase().includes("intrusion") ||
      alert.type?.toLowerCase().includes("unauthorized") ||
      alert.type?.toLowerCase().includes("breach") ||
      alert.type?.toLowerCase().includes("entry") ||
      alert.description?.toLowerCase().includes("intrusion") ||
      alert.description?.toLowerCase().includes("unauthorized") ||
      alert.description?.toLowerCase().includes("breach"),
  )

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "default"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const filteredEvents = intrusionEvents.filter((event) => {
    // Filter by type
    if (filterType !== "all" && !event.type?.toLowerCase().includes(filterType.toLowerCase())) return false

    // Filter by severity
    if (filterSeverity !== "all" && event.severity?.toLowerCase() !== filterSeverity) return false

    // Filter by resolved status
    if (filterResolved === "resolved" && event.status !== "resolved") return false
    if (filterResolved === "unresolved" && event.status === "resolved") return false

    // Filter by search query
    if (
      searchQuery &&
      !event.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.type?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true
  })

  // Generate analytics data from real intrusion events
  const roomIntrusionStats = intrusionEvents.reduce(
    (acc, event) => {
      const roomName = event.roomNumber || "Unknown Room"
      const existing = acc.find((item) => item.name === roomName)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({ name: roomName, count: 1 })
      }
      return acc
    },
    [] as { name: string; count: number }[],
  )

  const typeIntrusionStats = intrusionEvents.reduce(
    (acc, event) => {
      const type = event.type || "Unknown Type"
      const existing = acc.find((item) => item.name === type)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: type, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading intrusion reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Intrusion Reports</h2>
          <p className="text-muted-foreground">Monitor and analyze security intrusion events</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {intrusionEvents.length} Total Events
          </Badge>
          <Badge variant="destructive" className="text-sm">
            {intrusionEvents.filter((e) => e.status !== "resolved").length} Unresolved
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Event List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="heatmap">Room Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by room or description..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-1 gap-2">
                  <div className="w-1/3">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="unauthorized">Unauthorized Entry</SelectItem>
                        <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                        <SelectItem value="forced">Forced Entry</SelectItem>
                        <SelectItem value="breach">Security Breach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/3">
                    <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/3">
                    <Select value={filterResolved} onValueChange={setFilterResolved}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="unresolved">Unresolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert ID</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.id}</TableCell>
                          <TableCell>{event.roomNumber || "N/A"}</TableCell>
                          <TableCell>{event.timestamp ? new Date(event.timestamp).toLocaleString() : "N/A"}</TableCell>
                          <TableCell className="capitalize">{event.type || "Unknown"}</TableCell>
                          <TableCell>
                            <Badge variant={getSeverityBadgeVariant(event.severity)} className="capitalize">
                              {event.severity || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={event.status === "resolved" ? "outline" : "destructive"}
                              className="capitalize"
                            >
                              {event.status || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>{event.description || "No description available"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Shield className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {intrusionEvents.length === 0
                                ? "No intrusion events found"
                                : "No intrusion events match your filters"}
                            </p>
                            {intrusionEvents.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                This is good news - your security system is working well!
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-6">
              {intrusionEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Intrusion Data</h3>
                  <p className="text-muted-foreground">
                    No intrusion events have been recorded. Your security system is working effectively!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-4">Intrusions by Room</h3>
                    {roomIntrusionStats.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={roomIntrusionStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No room data available
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-4">Intrusions by Type</h3>
                    {typeIntrusionStats.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={typeIntrusionStats}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {typeIntrusionStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No type data available
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Intrusion Trends</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>

                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <p>Detailed trend analysis based on {intrusionEvents.length} intrusion events</p>
                  {intrusionEvents.length === 0 && <p className="text-sm mt-2">No data available for trend analysis</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Room Security Heatmap</h3>
                <div className="flex items-center gap-2">
                  <Select defaultValue="30days">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <ChevronDown className="mr-2 h-4 w-4" />
                    All Floors
                  </Button>
                </div>
              </div>

              <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">Interactive floor plan heatmap</p>
                  <p className="text-sm text-muted-foreground">Based on {intrusionEvents.length} intrusion events</p>
                  {intrusionEvents.length === 0 && (
                    <p className="text-sm text-green-600 mt-2">All areas secure - no intrusions detected</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm">Secure (0 events)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Low Risk (1-2 events)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Medium Risk (3-5 events)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm">High Risk (6+ events)</span>
                  </div>
                </div>

                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Heatmap
                </Button>
              </div>

              {roomIntrusionStats.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Room Risk Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {roomIntrusionStats.map((room) => (
                      <div key={room.name} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{room.name}</span>
                        <Badge
                          variant={
                            room.count >= 6
                              ? "destructive"
                              : room.count >= 3
                                ? "default"
                                : room.count >= 1
                                  ? "secondary"
                                  : "outline"
                          }
                          className="text-xs"
                        >
                          {room.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
