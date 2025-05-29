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
import { CalendarIcon, ChevronDown, Download, Filter, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface IntrusionEvent {
  id: string
  roomId: string
  roomName: string
  timestamp: string
  type: "unauthorized_entry" | "suspicious_activity" | "forced_entry" | "window_breach"
  severity: "low" | "medium" | "high" | "critical"
  resolved: boolean
  description: string
}

const intrusionEvents: IntrusionEvent[] = [
  {
    id: "INT001",
    roomId: "103",
    roomName: "Standard Room 103",
    timestamp: "2023-05-30T08:15:00",
    type: "unauthorized_entry",
    severity: "high",
    resolved: false,
    description: "Card key used during guest absence",
  },
  {
    id: "INT002",
    roomId: "202",
    roomName: "Suite 202",
    timestamp: "2023-05-30T09:45:00",
    type: "suspicious_activity",
    severity: "medium",
    resolved: true,
    description: "Multiple entry attempts with wrong key",
  },
  {
    id: "INT003",
    roomId: "S1",
    roomName: "Storage Room",
    timestamp: "2023-05-29T22:30:00",
    type: "forced_entry",
    severity: "critical",
    resolved: true,
    description: "Door lock tampered",
  },
  {
    id: "INT004",
    roomId: "103",
    roomName: "Standard Room 103",
    timestamp: "2023-05-29T23:15:00",
    type: "unauthorized_entry",
    severity: "high",
    resolved: false,
    description: "Entry during do-not-disturb hours",
  },
  {
    id: "INT005",
    roomId: "201",
    roomName: "Suite 201",
    timestamp: "2023-05-28T14:20:00",
    type: "window_breach",
    severity: "critical",
    resolved: true,
    description: "Window sensor triggered",
  },
  {
    id: "INT006",
    roomId: "102",
    roomName: "Standard Room 102",
    timestamp: "2023-05-28T16:45:00",
    type: "suspicious_activity",
    severity: "low",
    resolved: true,
    description: "Unusual movement pattern detected",
  },
]

const roomIntrusionStats = [
  { name: "Room 103", count: 2 },
  { name: "Suite 202", count: 1 },
  { name: "Storage", count: 1 },
  { name: "Suite 201", count: 1 },
  { name: "Room 102", count: 1 },
]

const typeIntrusionStats = [
  { name: "Unauthorized Entry", value: 2 },
  { name: "Suspicious Activity", value: 2 },
  { name: "Forced Entry", value: 1 },
  { name: "Window Breach", value: 1 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function IntrusionReports() {
  const [activeTab, setActiveTab] = useState<string>("list")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterResolved, setFilterResolved] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())

  const getSeverityBadgeVariant = (severity: IntrusionEvent["severity"]) => {
    switch (severity) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "warning"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const filteredEvents = intrusionEvents.filter((event) => {
    // Filter by type
    if (filterType !== "all" && event.type !== filterType) return false

    // Filter by severity
    if (filterSeverity !== "all" && event.severity !== filterSeverity) return false

    // Filter by resolved status
    if (filterResolved === "resolved" && !event.resolved) return false
    if (filterResolved === "unresolved" && event.resolved) return false

    // Filter by search query
    if (
      searchQuery &&
      !event.roomName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.roomId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !event.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true
  })

  return (
    <div className="w-full space-y-4">
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
                        <SelectItem value="unauthorized_entry">Unauthorized Entry</SelectItem>
                        <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                        <SelectItem value="forced_entry">Forced Entry</SelectItem>
                        <SelectItem value="window_breach">Window Breach</SelectItem>
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
                      <TableHead>ID</TableHead>
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
                          <TableCell>
                            {event.roomName} ({event.roomId})
                          </TableCell>
                          <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="capitalize">{event.type.replace("_", " ")}</TableCell>
                          <TableCell>
                            <Badge variant={getSeverityBadgeVariant(event.severity)} className="capitalize">
                              {event.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={event.resolved ? "outline" : "destructive"} className="capitalize">
                              {event.resolved ? "Resolved" : "Unresolved"}
                            </Badge>
                          </TableCell>
                          <TableCell>{event.description}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No intrusion events match your filters.
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
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Intrusions by Room</h3>
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
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">Intrusions by Type</h3>
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
                </div>
              </div>

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
                  Detailed trend analysis would be displayed here based on selected date range
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
                    Floor 1
                  </Button>
                </div>
              </div>

              <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interactive floor plan heatmap would be displayed here</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm">Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm">High Risk</span>
                  </div>
                </div>

                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Heatmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
