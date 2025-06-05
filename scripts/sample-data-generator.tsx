"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/contexts/data-context"
import { useState } from "react"

export function SampleDataGenerator() {
  const { generateTestGuest, generateTestStaff, generateTestRoom, generateTestAlert, isConnectedToSalesforce } =
    useData()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)

  const generateSampleData = async () => {
    if (!isConnectedToSalesforce) {
      alert("Please connect to Salesforce first")
      return
    }

    setIsGenerating(true)
    setGeneratedCount(0)

    // Generate 5 guests
    for (let i = 0; i < 5; i++) {
      await generateTestGuest()
      setGeneratedCount((prev) => prev + 1)
    }

    // Generate 3 staff members
    for (let i = 0; i < 3; i++) {
      await generateTestStaff()
      setGeneratedCount((prev) => prev + 1)
    }

    // Generate 10 rooms
    for (let i = 0; i < 10; i++) {
      await generateTestRoom()
      setGeneratedCount((prev) => prev + 1)
    }

    // Generate 8 alerts
    for (let i = 0; i < 8; i++) {
      await generateTestAlert()
      setGeneratedCount((prev) => prev + 1)
    }

    setIsGenerating(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Sample Data</CardTitle>
        <CardDescription>Create sample data in your Salesforce org for testing</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={generateSampleData} disabled={isGenerating || !isConnectedToSalesforce} className="w-full">
          {isGenerating ? `Generating... (${generatedCount}/26)` : "Generate Complete Sample Dataset"}
        </Button>
      </CardContent>
    </Card>
  )
}
