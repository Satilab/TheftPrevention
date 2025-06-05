"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Plus,
  AlertTriangle,
  Users,
  Building,
  Camera,
  AlertOctagon,
  Mic,
  Package,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ObjectStatus {
  [key: string]: boolean
}

export function SalesforceObjectSetup() {
  const [isChecking, setIsChecking] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingSampleData, setIsCreatingSampleData] = useState(false)
  const [objectStatus, setObjectStatus] = useState<ObjectStatus>({})
  const [setupResults, setSetupResults] = useState<any[]>([])
  const [sampleDataResults, setSampleDataResults] = useState<any[]>([])
  const { toast } = useToast()

  const requiredObjects = [
    { name: "Guest__c", label: "Guest", icon: Users, description: "Hotel guests and their information" },
    { name: "Staff__c", label: "Staff", icon: Users, description: "Hotel staff members" },
    { name: "Room__c", label: "Room", icon: Building, description: "Hotel rooms and their status" },
    { name: "Face_Log__c", label: "Face Log", icon: Camera, description: "Face detection logs" },
    { name: "Alert__c", label: "Alert", icon: AlertOctagon, description: "Security alerts and incidents" },
    { name: "Audio_Log__c", label: "Audio Log", icon: Mic, description: "Voice recordings and logs" },
    { name: "Linen_Stock__c", label: "Linen Stock", icon: Package, description: "Linen inventory management" },
  ]

  const checkObjectsStatus = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/salesforce/setup-objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check-objects" }),
      })

      if (response.ok) {
        const data = await response.json()
        setObjectStatus(data.status)
        toast({
          title: "Status Check Complete",
          description: "Custom object status has been updated.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Check Failed",
          description: error.error || "Failed to check object status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check object status",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const createCustomObjects = async () => {
    setIsCreating(true)
    setSetupResults([])

    try {
      const response = await fetch("/api/salesforce/setup-objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-objects" }),
      })

      if (response.ok) {
        const data = await response.json()
        setSetupResults(data.results)
        toast({
          title: "Objects Created",
          description: "Custom objects and fields have been created in Salesforce.",
        })

        // Refresh status after creation
        setTimeout(() => {
          checkObjectsStatus()
        }, 5000)
      } else {
        const error = await response.json()
        toast({
          title: "Creation Failed",
          description: error.error || "Failed to create custom objects",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create custom objects",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const createSampleData = async () => {
    setIsCreatingSampleData(true)
    setSampleDataResults([])

    try {
      const response = await fetch("/api/salesforce/setup-objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-sample-data" }),
      })

      if (response.ok) {
        const data = await response.json()
        setSampleDataResults(data.results)
        toast({
          title: "Sample Data Created",
          description: "Sample records have been created in Salesforce.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Sample Data Creation Failed",
          description: error.error || "Failed to create sample data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sample data",
        variant: "destructive",
      })
    } finally {
      setIsCreatingSampleData(false)
    }
  }

  const getObjectsCreated = () => {
    return Object.values(objectStatus).filter(Boolean).length
  }

  const getTotalObjects = () => {
    return requiredObjects.length
  }

  const getProgressPercentage = () => {
    return (getObjectsCreated() / getTotalObjects()) * 100
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Salesforce Custom Objects Setup
          </CardTitle>
          <CardDescription>
            Create and manage custom objects required for the hotel theft prevention system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup Progress</span>
              <span>
                {getObjectsCreated()} of {getTotalObjects()} objects
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={checkObjectsStatus} disabled={isChecking} variant="outline">
              {isChecking ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Check Status
            </Button>

            <Button onClick={createCustomObjects} disabled={isCreating || getObjectsCreated() === getTotalObjects()}>
              {isCreating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create Missing Objects
            </Button>

            <Button
              onClick={createSampleData}
              disabled={isCreatingSampleData || getObjectsCreated() === 0}
              variant="outline"
            >
              {isCreatingSampleData ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Create Sample Data
            </Button>
          </div>

          {/* Objects Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requiredObjects.map((obj) => {
              const Icon = obj.icon
              const exists = objectStatus[obj.name]

              return (
                <Card
                  key={obj.name}
                  className={`border ${exists ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{obj.label}</span>
                      </div>
                      {exists ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{obj.description}</p>
                    <Badge variant={exists ? "default" : "destructive"} className="mt-2">
                      {exists ? "Created" : "Missing"}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Setup Results */}
          {setupResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Setup Results:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {setupResults.map((result, index) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded">
                    {result.object && <span className="font-medium">{result.object}: </span>}
                    {result.field && <span className="font-medium">{result.field}: </span>}
                    <Badge variant={result.status === "created" ? "default" : "destructive"}>{result.status}</Badge>
                    {result.error && <span className="text-red-600 ml-2">{result.error}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Data Results */}
          {sampleDataResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Sample Data Created:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {sampleDataResults.map((result, index) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded">
                    <span className="font-medium">{result.type}: </span>
                    <span>{result.name}</span>
                    <Badge variant="default" className="ml-2">
                      {result.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {getObjectsCreated() === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No custom objects found. Click "Create Missing Objects" to set up the required Salesforce objects.
              </AlertDescription>
            </Alert>
          )}

          {getObjectsCreated() > 0 && getObjectsCreated() < getTotalObjects() && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some custom objects are missing. The application may not function correctly until all objects are
                created.
              </AlertDescription>
            </Alert>
          )}

          {getObjectsCreated() === getTotalObjects() && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All required custom objects are set up correctly! You can now create sample data to test the
                application.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
