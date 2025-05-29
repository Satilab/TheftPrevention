"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Users, Clock, Download } from "lucide-react"

const weeklyData = [
  { day: "Mon", intrusions: 2, alerts: 8, resolved: 6, falseAlarms: 1 },
  { day: "Tue", intrusions: 1, alerts: 5, resolved: 4, falseAlarms: 2 },
  { day: "Wed", intrusions: 4, alerts: 12, resolved: 9, falseAlarms: 1 },
  { day: "Thu", intrusions: 2, alerts: 7, resolved: 6, falseAlarms: 3 },
  { day: "Fri", intrusions: 6, alerts: 15, resolved: 11, falseAlarms: 2 },
  { day: "Sat", intrusions: 3, alerts: 9, resolved: 7, falseAlarms: 1 },
  { day: "Sun", intrusions: 1, alerts: 4, resolved: 4, falseAlarms: 0 },
]

const hourlyData = [
  { hour: "00:00", alerts: 1, intrusions: 0 },
  { hour: "02:00", alerts: 0, intrusions: 0 },
  { hour: "04:00", alerts: 2, intrusions: 1 },
  { hour: "06:00", alerts: 3, intrusions: 0 },
  { hour: "08:00", alerts: 5, intrusions: 1 },
  { hour: "10:00", alerts: 8, intrusions: 2 },
  { hour: "12:00", alerts: 12, intrusions: 3 },
  { hour: "14:00", alerts: 15, intrusions: 4 },
  { hour: "16:00", alerts: 18, intrusions: 2 },
  { hour: "18:00", alerts: 22, intrusions: 5 },
  { hour: "20:00", alerts: 16, intrusions: 3 },
  { hour: "22:00", alerts: 8, intrusions: 1 },
]

const roomData = [
  { room: "Lobby", intrusions: 8, alerts: 25, riskScore: 85 },
  { room: "Parking", intrusions: 12, alerts: 30, riskScore: 92 },
  { room: "Storage", intrusions: 6, alerts: 18, riskScore: 78 },
  { room: "Conference A", intrusions: 3, alerts: 12, riskScore: 45 },
  { room: "Conference B", intrusions: 2, alerts: 8, riskScore: 32 },
  { room: "Office 101", intrusions: 4, alerts: 15, riskScore: 58 },
  { room: "Office 102", intrusions: 1, alerts: 5, riskScore: 25 },
]

const alertTypeData = [
  { name: "Intrusion", value: 35, color: "#ef4444" },
  { name: "Suspicious Activity", value: 28, color: "#f59e0b" },
  { name: "Unauthorized Access", value: 22, color: "#8b5cf6" },
  { name: "System Alert", value: 15, color: "#06b6d4" },
]

const responseTimeData = [
  { period: "Week 1", avgResponse: 2.3, targetResponse: 3.0 },
  { period: "Week 2", avgResponse: 1.8, targetResponse: 3.0 },
  { period: "Week 3", avgResponse: 2.1, targetResponse: 3.0 },
  { period: "Week 4", avgResponse: 1.9, targetResponse: 3.0 },
]

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive security metrics and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Security Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.1% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1m</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -0.3m faster
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Alarm Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.3%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -1.2% reduction
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="rooms">Room Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Security Trends</CardTitle>
                <CardDescription>Security events over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="alerts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="intrusions" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="resolved" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution</CardTitle>
                <CardDescription>Breakdown of alert types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={alertTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {alertTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>24-Hour Activity Pattern</CardTitle>
              <CardDescription>Security events throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="alerts" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="intrusions" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Security Analysis</CardTitle>
              <CardDescription>Security metrics by room with risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={roomData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="room" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="intrusions" fill="#ef4444" />
                  <Bar dataKey="alerts" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Risk Assessment</CardTitle>
              <CardDescription>Risk scores based on security events and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomData.map((room) => (
                  <div key={room.room} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{room.room}</div>
                      <Badge
                        variant={room.riskScore > 80 ? "destructive" : room.riskScore > 50 ? "default" : "secondary"}
                      >
                        {room.riskScore > 80 ? "High Risk" : room.riskScore > 50 ? "Medium Risk" : "Low Risk"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{room.intrusions} intrusions</span>
                      <span>{room.alerts} alerts</span>
                      <span className="font-medium">{room.riskScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
              <CardDescription>Average response time vs target performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgResponse" stroke="#8884d8" strokeWidth={2} name="Actual" />
                  <Line
                    type="monotone"
                    dataKey="targetResponse"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Staff Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Sarah</span>
                    <span className="text-sm font-medium text-green-600">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">John</span>
                    <span className="text-sm font-medium text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Michael</span>
                    <span className="text-sm font-medium text-yellow-600">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Emma</span>
                    <span className="text-sm font-medium text-green-600">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">99.8%</div>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cameras</span>
                    <span>99.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>AI Processing</span>
                    <span>99.7%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Alerts System</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accuracy Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Face Detection</span>
                    <span className="text-sm font-medium">97.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Motion Detection</span>
                    <span className="text-sm font-medium">94.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Voice Analysis</span>
                    <span className="text-sm font-medium">91.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Alert Classification</span>
                    <span className="text-sm font-medium">93.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Peak Activity Hours</CardTitle>
                <CardDescription>When most security events occur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div>
                      <div className="font-medium">6:00 PM - 8:00 PM</div>
                      <div className="text-sm text-muted-foreground">Peak intrusion time</div>
                    </div>
                    <Badge variant="destructive">High Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <div>
                      <div className="font-medium">12:00 PM - 2:00 PM</div>
                      <div className="text-sm text-muted-foreground">Lunch hour activity</div>
                    </div>
                    <Badge variant="default">Medium Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div>
                      <div className="font-medium">2:00 AM - 6:00 AM</div>
                      <div className="text-sm text-muted-foreground">Lowest activity period</div>
                    </div>
                    <Badge variant="secondary">Low Risk</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Patterns</CardTitle>
                <CardDescription>Security trends by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div>
                      <div className="font-medium">Friday</div>
                      <div className="text-sm text-muted-foreground">Highest alert day</div>
                    </div>
                    <span className="text-sm font-medium">15 avg alerts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <div>
                      <div className="font-medium">Wednesday</div>
                      <div className="text-sm text-muted-foreground">Mid-week spike</div>
                    </div>
                    <span className="text-sm font-medium">12 avg alerts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div>
                      <div className="font-medium">Sunday</div>
                      <div className="text-sm text-muted-foreground">Quietest day</div>
                    </div>
                    <span className="text-sm font-medium">4 avg alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Predictive Insights</CardTitle>
              <CardDescription>AI-powered security predictions and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Risk Predictions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>High risk period: Today 6-8 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Parking area needs attention</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Weekend activity expected to be low</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Recommendations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Increase patrols during peak hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Review camera angles in lobby</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Update staff training on response protocols</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
