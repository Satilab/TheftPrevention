"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"

interface DiagnosticResult {
  step: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export function SalesforceDiagnostic() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<DiagnosticResult[]>([])

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])

    const addResult = (result: DiagnosticResult) => {
      setResults((prev) => [...prev, result])
    }

    try {
      // Step 1: Test authentication
      addResult({ step: "Authentication", status: "success", message: "Testing authentication..." })

      const authResponse = await fetch("/api/salesforce/auth", {
        method: "POST",
      })

      if (!authResponse.ok) {
        const authError = await authResponse.json()
        addResult({
          step: "Authentication",
          status: "error",
          message: "Authentication failed",
          details: authError,
        })
        return
      }

      const authData = await authResponse.json()
      addResult({
        step: "Authentication",
        status: "success",
        message: `Connected to ${authData.instance_url}`,
      })

      // Step 2: Test basic query
      addResult({ step: "Basic Query", status: "success", message: "Testing basic query..." })

      const queryResponse = await fetch("/api/salesforce/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "SELECT Id, Name FROM User LIMIT 1" }),
      })

      if (!queryResponse.ok) {
        const queryError = await queryResponse.json()
        addResult({
          step: "Basic Query",
          status: "error",
          message: "Basic query failed",
          details: queryError,
        })
        return
      }

      const queryData = await queryResponse.json()
      addResult({
        step: "Basic Query",
        status: "success",
        message: `Query successful, found ${queryData.totalSize} records`,
      })

      // Step 3: Check custom objects
      const customObjects = ["Guest__c", "Staff__c", "Room__c", "Alert__c", "Face_Log__c"]

      for (const objectName of customObjects) {
        addResult({
          step: `Custom Object: ${objectName}`,
          status: "success",
          message: `Checking ${objectName}...`,
        })

        const testQuery = `SELECT Id FROM ${objectName} LIMIT 1`
        const testResponse = await fetch("/api/salesforce/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: testQuery }),
        })

        if (!testResponse.ok) {
          const error = await testResponse.json()
          if (error.details?.[0]?.errorCode === "INVALID_TYPE") {
            addResult({
              step: `Custom Object: ${objectName}`,
              status: "warning",
              message: `${objectName} does not exist`,
              details: "This custom object needs to be created in Salesforce",
            })
          } else {
            addResult({
              step: `Custom Object: ${objectName}`,
              status: "error",
              message: `Error checking ${objectName}`,
              details: error,
            })
          }
        } else {
          const data = await testResponse.json()
          addResult({
            step: `Custom Object: ${objectName}`,
            status: "success",
            message: `${objectName} exists (${data.totalSize} records)`,
          })
        }
      }
    } catch (error) {
      addResult({
        step: "Diagnostics",
        status: "error",
        message: "Diagnostic failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salesforce Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={isRunning} className="w-full">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.step}</span>
                </div>
                <div className="flex items-center gap-2">{getStatusBadge(result.status)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
