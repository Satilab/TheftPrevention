"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import IntrusionReports from "@/components/intrusion-reports"

export default function OwnerIntrusionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Intrusion Reports</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Room-wise Intrusion Reports</CardTitle>
          <CardDescription>Detailed intrusion analysis by room and time period</CardDescription>
        </CardHeader>
        <CardContent>
          <IntrusionReports />
        </CardContent>
      </Card>
    </div>
  )
}
