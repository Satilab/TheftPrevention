"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Bell, Shield, Mic, Users, AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const { role } = useAuth()
  const [aiSensitivity, setAiSensitivity] = useState([75])
  const [voiceSensitivity, setVoiceSensitivity] = useState([65])
  const [faceSensitivity, setFaceSensitivity] = useState([80])
  const [motionSensitivity, setMotionSensitivity] = useState([70])
  const [gracePeriod, setGracePeriod] = useState("10")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [appNotifications, setAppNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Only show settings for owners
  if (role !== "owner") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Only owners can access settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alert Settings</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <CardDescription>Configure global alert settings and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Global AI Sensitivity: {aiSensitivity[0]}%</Label>
                  <Slider
                    value={aiSensitivity}
                    onValueChange={setAiSensitivity}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher sensitivity detects more potential threats but may increase false positives
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grace-period">Alert Grace Period (minutes)</Label>
                  <Input
                    id="grace-period"
                    type="number"
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(e.target.value)}
                    min="1"
                    max="60"
                  />
                  <p className="text-xs text-muted-foreground">Time to wait before escalating an unresolved alert</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Types</CardTitle>
                <CardDescription>Enable or disable specific types of alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Unregistered Face Detection</Label>
                    <p className="text-xs text-muted-foreground">Detect faces not in the system</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Wrong Room Entry</Label>
                    <p className="text-xs text-muted-foreground">Alert when guest enters wrong room</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Suspicious Voice Detection</Label>
                    <p className="text-xs text-muted-foreground">Detect concerning conversations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Face Detection Settings</CardTitle>
                <CardDescription>Configure face detection sensitivity and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Face Detection Sensitivity: {faceSensitivity[0]}%</Label>
                  <Slider
                    value={faceSensitivity}
                    onValueChange={setFaceSensitivity}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Confidence Threshold</Label>
                  <Select defaultValue="75">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90% (Very Strict)</SelectItem>
                      <SelectItem value="80">80% (Strict)</SelectItem>
                      <SelectItem value="75">75% (Balanced)</SelectItem>
                      <SelectItem value="65">65% (Relaxed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Motion Detection Settings</CardTitle>
                <CardDescription>Configure motion detection sensitivity and zones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Motion Detection Sensitivity: {motionSensitivity[0]}%</Label>
                  <Slider
                    value={motionSensitivity}
                    onValueChange={setMotionSensitivity}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice Monitoring Settings</CardTitle>
              <CardDescription>Configure AI voice analysis and detection thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Voice Analysis Sensitivity: {voiceSensitivity[0]}%</Label>
                <Slider
                  value={voiceSensitivity}
                  onValueChange={setVoiceSensitivity}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>App Notifications</Label>
                  <p className="text-xs text-muted-foreground">Push notifications in the app</p>
                </div>
                <Switch checked={appNotifications} onCheckedChange={setAppNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-xs text-muted-foreground">Text message alerts</p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Add, remove, and manage hotel staff access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                <p>Staff management interface would be displayed here</p>
                <Button className="mt-4">Add New Staff Member</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
