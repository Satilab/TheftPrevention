"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings } from "lucide-react"

export function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking")
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<any>(null)

  const checkConnection = async () => {
    setStatus("checking")
    setError(null)
    setDetails(null)

    try {
      const response = await fetch("/api/salesforce/auth", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.access_token) {
        setStatus("connected")
      } else {
        setStatus("error")
        setError(data.error || "Connection failed")
        setDetails(data.details)
      }
    } catch (err) {
      setStatus("disconnected")
      setError("Failed to reach Salesforce API")
      setDetails(err instanceof Error ? err.message : "Network error")
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "disconnected":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected to Salesforce"
      case "error":
        return "Connection Error"
      case "disconnected":
        return "Not Connected"
      default:
        return "Checking Connection..."
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "disconnected":
        return <Badge variant="secondary">Disconnected</Badge>
      default:
        return <Badge variant="outline">Checking...</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusText()}
          </div>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>Salesforce integration status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant={status === "error" ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p>{error}</p>
                {details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium">Technical Details</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                      {typeof details === "string" ? details : JSON.stringify(details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button onClick={checkConnection} disabled={status === "checking"} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${status === "checking" ? "animate-spin" : ""}`} />
            Test Connection
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>

        {status === "error" && (
          <div className="text-sm text-muted-foreground space-y-2">
            <h4 className="font-medium">Common Solutions:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Check that all environment variables are set in .env.local</li>
              <li>Verify your Salesforce username and password are correct</li>
              <li>Ensure your security token is appended to your password</li>
              <li>Confirm your Connected App has the correct permissions</li>
              <li>Restart your Next.js server after updating environment variables</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
