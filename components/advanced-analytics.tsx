"use client"

import { useData } from "@/contexts/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function AdvancedAnalytics() {
  const { alerts = [], faceLogs = [], isLoading = false } = useData() || {}

  // Generate analytics data
  const generateAlertTypeData = () => {
    if (!Array.isArray(alerts) || alerts.length === 0) return []

    const typeCounts = {}
    alerts.forEach((alert) => {
      if (alert && alert.type) {
        typeCounts[alert.type] = (typeCounts[alert.type] || 0) + 1
      }
    })

    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
  }

  const generateMatchTypeData = () => {
    if (!Array.isArray(faceLogs) || faceLogs.length === 0) return []

    const typeCounts = {}
    faceLogs.forEach((log) => {
      if (log && log.matchType) {
        typeCounts[log.matchType] = (typeCounts[log.matchType] || 0) + 1
      }
    })

    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
  }

  const alertTypeData = generateAlertTypeData()
  const matchTypeData = generateMatchTypeData()

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if ((!alertTypeData || alertTypeData.length === 0) && (!matchTypeData || matchTypeData.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
          <CardDescription>No data available for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <p className="text-lg font-medium">No Analytics Data</p>
            <p className="text-sm text-muted-foreground">There is no data available to generate analytics</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Alert Types</CardTitle>
          <CardDescription>Distribution of security alerts by type</CardDescription>
        </CardHeader>
        <CardContent>
          {alertTypeData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {alertTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <p className="text-lg font-medium">No Alert Data</p>
              <p className="text-sm text-muted-foreground">No alerts available for analysis</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Face Detection Types</CardTitle>
          <CardDescription>Distribution of face detection match types</CardDescription>
        </CardHeader>
        <CardContent>
          {matchTypeData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matchTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {matchTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <p className="text-lg font-medium">No Face Detection Data</p>
              <p className="text-sm text-muted-foreground">No face logs available for analysis</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
