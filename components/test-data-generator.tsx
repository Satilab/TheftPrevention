"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/contexts/data-context"
import { UserPlus, Bell, Users, Building } from "lucide-react"
import { useState } from "react"

export function TestDataGenerator() {
  const { generateTestGuest, generateTestAlert, generateTestStaff, generateTestRoom } = useData()
  const [isGeneratingGuest, setIsGeneratingGuest] = useState(false)
  const [isGeneratingAlert, setIsGeneratingAlert] = useState(false)
  const [isGeneratingStaff, setIsGeneratingStaff] = useState(false)
  const [isGeneratingRoom, setIsGeneratingRoom] = useState(false)

  const handleGenerateGuest = async () => {
    setIsGeneratingGuest(true)
    await generateTestGuest()
    setIsGeneratingGuest(false)
  }

  const handleGenerateAlert = async () => {
    setIsGeneratingAlert(true)
    await generateTestAlert()
    setIsGeneratingAlert(false)
  }

  const handleGenerateStaff = async () => {
    setIsGeneratingStaff(true)
    await generateTestStaff()
    setIsGeneratingStaff(false)
  }

  const handleGenerateRoom = async () => {
    setIsGeneratingRoom(true)
    await generateTestRoom()
    setIsGeneratingRoom(false)
  }

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25">
      <CardHeader>
        <CardTitle>Test Data Generator</CardTitle>
        <CardDescription>Generate test data to populate your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleGenerateGuest}
            disabled={isGeneratingGuest}
          >
            <UserPlus className="h-6 w-6" />
            <span>{isGeneratingGuest ? "Creating..." : "Add Guest"}</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleGenerateAlert}
            disabled={isGeneratingAlert}
          >
            <Bell className="h-6 w-6" />
            <span>{isGeneratingAlert ? "Creating..." : "Add Alert"}</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleGenerateStaff}
            disabled={isGeneratingStaff}
          >
            <Users className="h-6 w-6" />
            <span>{isGeneratingStaff ? "Creating..." : "Add Staff"}</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleGenerateRoom}
            disabled={isGeneratingRoom}
          >
            <Building className="h-6 w-6" />
            <span>{isGeneratingRoom ? "Creating..." : "Add Room"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
