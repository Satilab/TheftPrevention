"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Key } from "lucide-react"

export function SalesforceTroubleshooter() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("env")

  const runDiagnostics = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/salesforce/diagnostics", {
        method: "POST",
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({
        success: false,
        error: "Failed to run diagnostics",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Salesforce Integration Troubleshooter
        </CardTitle>
        <CardDescription>Diagnose and fix issues with your Salesforce integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="env">Environment</TabsTrigger>
            <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            <TabsTrigger value="data">Data Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="env" className="space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertTitle>Environment Variables</AlertTitle>
              <AlertDescription>
                Ensure all required environment variables are set correctly in your .env.local file
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Required Variables:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between p-2 border rounded-md">
                  <span>SALESFORCE_LOGIN_URL</span>
                  <Badge variant="outline">{process.env.SALESFORCE_LOGIN_URL ? "Set" : "Missing"}</Badge>
                </li>
                <li className="flex items-center justify-between p-2 border rounded-md">
                  <span>SALESFORCE_CLIENT_ID</span>
                  <Badge variant="outline">{process.env.SALESFORCE_CLIENT_ID ? "Set" : "Missing"}</Badge>
                </li>
                <li className="flex items-center justify-between p-2 border rounded-md">
                  <span>SALESFORCE_CLIENT_SECRET</span>
                  <Badge variant="outline">{process.env.SALESFORCE_CLIENT_SECRET ? "Set" : "Missing"}</Badge>
                </li>
                <li className="flex items-center justify-between p-2 border rounded-md">
                  <span>SALESFORCE_USERNAME</span>
                  <Badge variant="outline">{process.env.SALESFORCE_USERNAME ? "Set" : "Missing"}</Badge>
                </li>
                <li className="flex items-center justify-between p-2 border rounded-md">
                  <span>SALESFORCE_PASSWORD</span>
                  <Badge variant="outline">{process.env.SALESFORCE_PASSWORD ? "Set" : "Missing"}</Badge>
                </li>
                <li className="flex items-center justify-between p-2 border rounded-md">
                  <span>SALESFORCE_SECURITY_TOKEN</span>
                  <Badge variant="outline">{process.env.SALESFORCE_SECURITY_TOKEN ? "Set" : "Missing"}</Badge>
                </li>
                <li className="flex items-center justify-between p-2 border rounded-md">
                  <span>NEXT_PUBLIC_SALESFORCE_LOGIN_URL</span>
                  <Badge variant="outline">{process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL ? "Set" : "Missing"}</Badge>
                </li>
              </ul>
            </div>

            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                If you've just added or updated environment variables, you need to restart your Next.js server for the
                changes to take effect.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Custom Objects</AlertTitle>
              <AlertDescription>
                Verify that all required custom objects are created in your Salesforce org
              </AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="guest-object">
                <AccordionTrigger>Guest__c Object</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Name</div>
                      <div className="text-xs text-muted-foreground">Text - Full name</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Photo_URL__c</div>
                      <div className="text-xs text-muted-foreground">URL - Stored image reference</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Room_No__c</div>
                      <div className="text-xs text-muted-foreground">Text - Room assigned</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">ID_Proof__c</div>
                      <div className="text-xs text-muted-foreground">Text - ID number</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Checkin_Time__c</div>
                      <div className="text-xs text-muted-foreground">DateTime - Check-in timestamp</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Checkout_Time__c</div>
                      <div className="text-xs text-muted-foreground">DateTime - Checkout timestamp</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Voice_Log_URL__c</div>
                      <div className="text-xs text-muted-foreground">URL - Audio file reference</div>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="staff-object">
                <AccordionTrigger>Staff__c Object</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Name</div>
                      <div className="text-xs text-muted-foreground">Text - Staff name</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Role__c</div>
                      <div className="text-xs text-muted-foreground">Picklist - Security / Receptionist / Cleaner</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Photo_URL__c</div>
                      <div className="text-xs text-muted-foreground">URL - Staff face image</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Shift_Start__c</div>
                      <div className="text-xs text-muted-foreground">Time - Shift start time</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Shift_End__c</div>
                      <div className="text-xs text-muted-foreground">Time - Shift end time</div>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="alert-object">
                <AccordionTrigger>Alert__c Object</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Alert_Type__c</div>
                      <div className="text-xs text-muted-foreground">Picklist - Intruder / Mismatch / Tailgating</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Face_Log__c</div>
                      <div className="text-xs text-muted-foreground">Lookup(Face_Log__c) - Linked face event</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Status__c</div>
                      <div className="text-xs text-muted-foreground">
                        Picklist - Open / Responded / Resolved / Escalated
                      </div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Assigned_To__c</div>
                      <div className="text-xs text-muted-foreground">Lookup(User) - Assigned receptionist</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Receptionist_Comment__c</div>
                      <div className="text-xs text-muted-foreground">Long Text - Receptionist remarks</div>
                    </li>
                    <li className="p-2 border rounded-md">
                      <div className="font-medium">Owner_Review__c</div>
                      <div className="text-xs text-muted-foreground">Long Text - Owner's resolution comment</div>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other-objects">
                <AccordionTrigger>Other Objects (Face_Log__c, Room__c, Audio_Log__c, Linen_Stock__c)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Additional objects for face detection logs, room management, audio recordings, and linen inventory
                    tracking.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Alert>
              <RefreshCw className="h-4 w-4" />
              <AlertTitle>Data Synchronization</AlertTitle>
              <AlertDescription>Test data synchronization between your application and Salesforce</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Create Test Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Creates a test guest in your app and syncs it to Salesforce as a Contact
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      Create Test Contact
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Create Test Case</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Creates a test security alert in your app and syncs it to Salesforce as a Case
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      Create Test Case
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Fetch Salesforce Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Manually fetch the latest data from Salesforce and update your application
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full">
                    Sync Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t">
          <Button onClick={runDiagnostics} disabled={isChecking} className="w-full">
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Full Diagnostics
              </>
            )}
          </Button>
        </div>

        {results && (
          <div className="mt-4 p-4 border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              {results.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="font-medium">{results.success ? "Diagnostics Passed" : "Issues Detected"}</h3>
            </div>
            <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-40">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
