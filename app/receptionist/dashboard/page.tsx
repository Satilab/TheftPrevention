"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Clock, Bell, Map, Mic, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function ReceptionistDashboard() {
  // Get current time for shift info
  const currentTime = new Date()
  const hours = currentTime.getHours()
  let shift = "Morning"

  if (hours >= 15) {
    shift = "Evening"
  } else if (hours >= 7) {
    shift = "Morning"
  } else {
    shift = "Night"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Sarah</h1>
        <p className="text-muted-foreground">
          {currentTime.toLocaleDateString()} | {shift} Shift
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guests Checked-in Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 in the last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 receptionists, 6 staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground text-red-500">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Linen Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 issues, 3 returns</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for receptionists</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/receptionist/registration">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Register New Guest/Staff
              </Button>
            </Link>
            <Link href="/receptionist/checkin">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Check-In/Out Guest
              </Button>
            </Link>
            <Link href="/receptionist/escalations">
              <Button className="w-full justify-start" variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                View Escalations (3)
              </Button>
            </Link>
            <Link href="/receptionist/roommap">
              <Button className="w-full justify-start" variant="outline">
                <Map className="mr-2 h-4 w-4" />
                View Room Map
              </Button>
            </Link>
            <Link href="/receptionist/voice">
              <Button className="w-full justify-start" variant="outline">
                <Mic className="mr-2 h-4 w-4" />
                Record Voice Interaction
              </Button>
            </Link>
            <Link href="/receptionist/linen">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Manage Linen Stock
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in the hotel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4 rounded-md bg-muted p-3">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New guest checked in to Room 203</p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 rounded-md bg-muted p-3">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-amber-600">Alert: Unregistered face detected near Room 105</p>
                <p className="text-xs text-muted-foreground">25 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 rounded-md bg-muted p-3">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Staff member John logged in</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 rounded-md bg-muted p-3">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Linen issued to Room 302</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 rounded-md bg-muted p-3">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-green-600">
                  Alert resolved: Room 105 issue was maintenance staff
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
