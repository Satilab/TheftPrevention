"use client"

import { SalesforceObjectSetup } from "@/components/salesforce-object-setup"
import { ConnectionStatus } from "@/components/connection-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesforceSetup } from "@/components/salesforce-setup"
import { TestDataGenerator } from "@/components/test-data-generator"

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Setup</h1>
        <p className="text-muted-foreground">Configure Salesforce integration and set up required custom objects</p>
      </div>

      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="objects">Custom Objects</TabsTrigger>
          <TabsTrigger value="data">Test Data</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salesforce Connection</CardTitle>
              <CardDescription>Check and configure your Salesforce connection</CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectionStatus />
            </CardContent>
          </Card>

          <SalesforceSetup />
        </TabsContent>

        <TabsContent value="objects" className="space-y-4">
          <SalesforceObjectSetup />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Data Generation</CardTitle>
              <CardDescription>Generate sample data for testing the application</CardDescription>
            </CardHeader>
            <CardContent>
              <TestDataGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
