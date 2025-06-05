"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, FileText, Settings, Key, User, Shield } from "lucide-react"

export function EnvSetupGuide() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(item)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const envTemplate = `# Salesforce Configuration for Hotel Security System
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=your_connected_app_consumer_key_here
SALESFORCE_CLIENT_SECRET=your_connected_app_consumer_secret_here
SALESFORCE_USERNAME=your_salesforce_username@company.com
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_SECURITY_TOKEN=your_security_token_here
NEXT_PUBLIC_SALESFORCE_LOGIN_URL=https://login.salesforce.com`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Step 1: Create .env.local File
          </CardTitle>
          <CardDescription>
            Create this file in the root directory of your project (same level as package.json)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>File Location</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <p>
                  Create a new file called <code className="bg-muted px-1 rounded">.env.local</code> in your project
                  root:
                </p>
                <div className="bg-muted p-2 rounded font-mono text-sm">
                  your-project-folder/
                  <br />
                  ├── app/
                  <br />
                  ├── components/
                  <br />
                  ├── package.json
                  <br />
                  └── <strong>.env.local</strong> ← Create this file here
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Environment Variables Template</h4>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(envTemplate, "template")}>
                <Copy className="h-3 w-3 mr-1" />
                {copiedItem === "template" ? "Copied!" : "Copy Template"}
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">{envTemplate}</pre>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="connected-app" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connected-app">Connected App</TabsTrigger>
          <TabsTrigger value="credentials">User Credentials</TabsTrigger>
          <TabsTrigger value="security-token">Security Token</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="connected-app">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Step 2: Create Connected App in Salesforce
              </CardTitle>
              <CardDescription>You need to create a Connected App to allow API access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Go to Salesforce Setup</p>
                    <p className="text-sm text-muted-foreground">Login to Salesforce → Click the gear icon → Setup</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Navigate to App Manager</p>
                    <p className="text-sm text-muted-foreground">
                      In Quick Find, search for "App Manager" → Click "App Manager"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Create New Connected App</p>
                    <p className="text-sm text-muted-foreground">Click "New Connected App" button</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">4</Badge>
                  <div>
                    <p className="font-medium">Fill Basic Information</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        • Connected App Name: <code>Hotel Security System</code>
                      </p>
                      <p>
                        • API Name: <code>Hotel_Security_System</code>
                      </p>
                      <p>• Contact Email: Your email address</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">5</Badge>
                  <div>
                    <p className="font-medium">Enable OAuth Settings</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Check "Enable OAuth Settings"</p>
                      <p>
                        • Callback URL: <code>https://localhost:3000/callback</code>
                      </p>
                      <p>• Selected OAuth Scopes:</p>
                      <ul className="ml-4 list-disc">
                        <li>Full access (full)</li>
                        <li>Perform requests on your behalf at any time (refresh_token, offline_access)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">6</Badge>
                  <div>
                    <p className="font-medium">Save and Get Keys</p>
                    <p className="text-sm text-muted-foreground">
                      After saving, you'll get the Consumer Key and Consumer Secret
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertTitle>Important Keys</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p>
                      • <strong>Consumer Key</strong> = SALESFORCE_CLIENT_ID
                    </p>
                    <p>
                      • <strong>Consumer Secret</strong> = SALESFORCE_CLIENT_SECRET
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Step 3: Get User Credentials
              </CardTitle>
              <CardDescription>Use your Salesforce login credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">SALESFORCE_USERNAME</h4>
                  <p className="text-sm text-muted-foreground">This is your regular Salesforce login email address.</p>
                  <div className="mt-2 p-2 bg-muted rounded text-sm font-mono">Example: john.doe@company.com</div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">SALESFORCE_PASSWORD</h4>
                  <p className="text-sm text-muted-foreground">This is your regular Salesforce login password.</p>
                  <Alert className="mt-2">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> You'll need to append your Security Token to this password. Final
                      format: <code>your_password + security_token</code>
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h4 className="font-medium mb-2">SALESFORCE_LOGIN_URL</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the standard Salesforce login URL, or your custom domain if you have one.
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="p-2 bg-muted rounded text-sm font-mono">Standard: https://login.salesforce.com</div>
                    <div className="p-2 bg-muted rounded text-sm font-mono">
                      Custom Domain: https://yourcompany.my.salesforce.com
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-token">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Step 4: Get Security Token
              </CardTitle>
              <CardDescription>Security tokens are required for API access from external applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Go to Personal Settings</p>
                    <p className="text-sm text-muted-foreground">
                      In Salesforce, click your profile picture → Settings
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Find Reset Security Token</p>
                    <p className="text-sm text-muted-foreground">In Quick Find, search for "Reset My Security Token"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Reset Token</p>
                    <p className="text-sm text-muted-foreground">
                      Click "Reset Security Token" - you'll receive it via email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">4</Badge>
                  <div>
                    <p className="font-medium">Update Password</p>
                    <p className="text-sm text-muted-foreground">
                      In your .env.local file, combine your password with the security token
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Password + Security Token</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <p>
                      If your password is <code>MyPassword123</code> and your security token is{" "}
                      <code>AbCdEfGhIjKlMnOp</code>
                    </p>
                    <p>Then SALESFORCE_PASSWORD should be:</p>
                    <div className="p-2 bg-muted rounded font-mono text-sm">
                      SALESFORCE_PASSWORD=MyPassword123AbCdEfGhIjKlMnOp
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Test Your Configuration</CardTitle>
              <CardDescription>After setting up your .env.local file, test the connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Restart Your Server</p>
                    <p className="text-sm text-muted-foreground">
                      Stop your Next.js server (Ctrl+C) and restart it with <code>npm run dev</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Test Connection</p>
                    <p className="text-sm text-muted-foreground">
                      Go to Settings page and use the "Test Connection" button
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Check for Errors</p>
                    <p className="text-sm text-muted-foreground">
                      If there are issues, the error messages will guide you to the solution
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <ExternalLink className="h-4 w-4" />
                <AlertTitle>Need Help?</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p>If you're still having issues:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Check the browser console for detailed error messages</li>
                      <li>Verify all environment variables are spelled correctly</li>
                      <li>Make sure there are no extra spaces in your .env.local file</li>
                      <li>Confirm your Salesforce user has API access permissions</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
