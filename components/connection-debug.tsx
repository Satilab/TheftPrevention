"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { useSalesforceReal } from "@/hooks/use-salesforce-real"

export function ConnectionDebug() {
  const salesforce = useSalesforceReal()
  const [testResults, setTestResults] = useState<any[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const runDiagnostics = async () => {
    setIsTesting(true)
    setTestResults([])

    const results = []

    // Test connection
    try {
      await salesforce.checkConnection()
      results.push({
        test: "Connection Test",
        status: salesforce.isConnected ? "success" : "error",
        message: salesforce.isConnected ? "Connected successfully" : salesforce.error || "Connection failed",
      })
    } catch (error) {
      results.push({
        test: "Connection Test",
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test each object type with simple queries
    const objectTests = [
      { name: "Guest__c", label: "Guests" },
      { name: "Staff__c", label: "Staff" },
      { name: "Room__c", label: "Rooms" },
      { name: "Alert__c", label: "Alerts" },
      { name: "Face_Log__c", label: "Face Logs" },
      { name: "Audio_Log__c", label: "Audio Logs" },
      { name: "Linen_Stock__c", label: "Linen Stock" },
    ]

    for (const obj of objectTests) {
      try {
        if (salesforce.isConnected) {
          const data = await fetch("/api/salesforce", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "query",
              query: `SELECT Id, Name FROM ${obj.name} LIMIT 1`,
            }),
          })

          if (data.ok) {
            const result = await data.json()
            results.push({
              test: `${obj.label} Query`,
              status: "success",
              message: `Found ${result.totalSize || 0} records`,
            })
          } else {
            const error = await data.json()
            results.push({
              test: `${obj.label} Query`,
              status: "warning",
              message: error.error || "Object may not exist",
            })
          }
        }
      } catch (error) {
        results.push({
          test: `${obj.label} Query`,
          status: "error",
          message: error instanceof Error ? error.message : "Query failed",
        })
      }
    }

    setTestResults(results)
    setIsTesting(false)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {salesforce.isConnected ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Salesforce Connection Debug
        </CardTitle>
        <CardDescription>Diagnose connection and data access issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={salesforce.isConnected ? "default" : "destructive"}>
                {salesforce.isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            {salesforce.error && <p className="text-sm text-red-600">{salesforce.error}</p>}
            {salesforce.lastConnectionAttempt && (
              <p className="text-xs text-gray-500">
                Last attempt: {salesforce.lastConnectionAttempt.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button onClick={runDiagnostics} disabled={isTesting} size="sm">
            {isTesting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
            Run Diagnostics
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded border">
                {result.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                {result.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                {result.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                <div className="flex-1">
                  <div className="text-sm font-medium">{result.test}</div>
                  <div className="text-xs text-gray-600">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
