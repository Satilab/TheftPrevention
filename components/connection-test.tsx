"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Info, Database } from "lucide-react"

export function ConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)

  const testConnection = async () => {
    try {
      setStatus("loading")
      setMessage("Testing connection to Salesforce and checking custom objects...")
      setDetails(null)

      console.log("🧪 Starting connection test...")

      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "test" }),
      })

      const data = await response.json()
      console.log("📥 Test response:", data)

      if (response.ok && data.success) {
        setStatus("success")
        setMessage(`✅ Connection successful! Found ${data.available_objects}/${data.total_objects} custom objects`)
        setDetails(data)
      } else {
        setStatus("error")

        if (data.auth_success === false) {
          setMessage("❌ Authentication failed - Check your credentials")
        } else {
          setMessage(data.error || "Connection failed")
        }

        setDetails(data.details || data.error || null)
      }
    } catch (error) {
      console.error("🚨 Connection test error:", error)
      setStatus("error")
      setMessage("Network error - Check your internet connection")
      setDetails(error instanceof Error ? error.message : "Unknown error")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salesforce Connection Test</CardTitle>
        <CardDescription>Test connection and check your custom objects for the hotel security system</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Connection Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              {message}
              {details && (
                <div className="mt-3 space-y-2">
                  <p>
                    <strong>Instance:</strong> {details.instance_url}
                  </p>
                  <p>
                    <strong>Custom Objects Status:</strong>
                  </p>
                  <div className="ml-4 space-y-1">
                    {details.custom_objects?.map((obj: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Database className="h-3 w-3" />
                        <span className="font-mono">{obj.object}</span>
                        <span className={obj.status.includes("✅") ? "text-green-600" : "text-red-600"}>
                          {obj.status}
                        </span>
                        {obj.records !== undefined && <span className="text-gray-600">({obj.records} records)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Connection Failed</AlertTitle>
            <AlertDescription className="text-red-700">
              {message}
              {details && (
                <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono overflow-auto max-h-32">
                  {typeof details === "string" ? details : JSON.stringify(details, null, 2)}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {status === "loading" && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertTitle className="text-blue-800">Testing Connection</AlertTitle>
            <AlertDescription className="text-blue-700">{message}</AlertDescription>
          </Alert>
        )}

        {status === "idle" && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Ready to Test</AlertTitle>
            <AlertDescription>
              This will test:
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Authentication with your Salesforce credentials</li>
                <li>
                  Access to your custom objects: Guest__c, Staff__c, Room__c, Face_Log__c, Alert__c, Audio_Log__c,
                  Linen_Stock__c
                </li>
                <li>Record count for each available object</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={status === "loading"} className="w-full">
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection & Custom Objects"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
