"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useData } from "@/contexts/data-context"
import { CheckCircle, AlertTriangle, ExternalLink, Copy, Settings } from "lucide-react"

export function SalesforceSetup() {
  const { isConnectedToSalesforce, salesforceError, checkSalesforceConnection, getSetupInstructions } = useData()
  const [setupInstructions, setSetupInstructions] = useState<any>(null)
  const [showInstructions, setShowInstructions] = useState(false)

  const handleGetSetupInstructions = async () => {
    const instructions = await getSetupInstructions()
    setSetupInstructions(instructions)
    setShowInstructions(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Salesforce Connection Status
          </CardTitle>
          <CardDescription>Connect to your Salesforce org to sync guest data and security incidents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {isConnectedToSalesforce ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">Successfully connected to Salesforce</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Disconnected
                </Badge>
                <span className="text-sm text-muted-foreground">Not connected to Salesforce</span>
              </>
            )}
          </div>

          {salesforceError && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{salesforceError}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={checkSalesforceConnection} variant="outline">
              Test Connection
            </Button>
            <Button onClick={handleGetSetupInstructions} variant="outline">
              Setup Instructions
            </Button>
          </div>
        </CardContent>
      </Card>

      {showInstructions && setupInstructions && (
        <Card>
          <CardHeader>
            <CardTitle>Salesforce Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to configure your Salesforce org for the hotel security system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {setupInstructions.instructions?.map((instruction: any, index: number) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Step {instruction.step}: {instruction.title}
                </h3>

                {instruction.description && <p className="text-sm text-muted-foreground">{instruction.description}</p>}

                {instruction.fields && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Create these custom fields:</p>
                    <div className="grid gap-2">
                      {instruction.fields.map((field: any, fieldIndex: number) => (
                        <div key={fieldIndex} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-muted-foreground">
                              API Name: {field.name} | Type: {field.type}
                              {field.length && ` | Length: ${field.length}`}
                              {field.values && ` | Values: ${field.values.join(", ")}`}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(field.name)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertDescription>
                For detailed instructions on creating custom fields, visit:{" "}
                <a href={setupInstructions.setupUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  Salesforce Help Documentation
                </a>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {!isConnectedToSalesforce && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Make sure these environment variables are set in your .env.local file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div>SALESFORCE_LOGIN_URL=https://login.salesforce.com</div>
              <div>SALESFORCE_CLIENT_ID=your_connected_app_client_id</div>
              <div>SALESFORCE_CLIENT_SECRET=your_connected_app_client_secret</div>
              <div>SALESFORCE_USERNAME=your_salesforce_username</div>
              <div>SALESFORCE_PASSWORD=your_salesforce_password</div>
              <div>SALESFORCE_SECURITY_TOKEN=your_security_token</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
