"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSalesforceApi } from "@/hooks/use-salesforce-api"
import { useData } from "@/contexts/data-context"
import { SalesforceSetup } from "@/components/salesforce-setup"
import { SalesforceTroubleshooter } from "@/components/salesforce-troubleshooter"
import { Cloud, Users, AlertTriangle, ExternalLink, Loader2, RefreshCw, Settings } from "lucide-react"
import type { SecurityCase, SalesforceContact } from "@/hooks/use-salesforce-api"

export function SalesforceIntegration() {
  const { isLoading, error, checkConnection, createContact, createSecurityCase, findContactByEmail, getSecurityCases } =
    useSalesforceApi()
  const { isConnectedToSalesforce, salesforceError, checkSalesforceConnection, syncWithSalesforce } = useData()
  const [isConnected, setIsConnected] = useState(false)
  const [securityCases, setSecurityCases] = useState<SecurityCase[]>([])
  const [selectedContact, setSelectedContact] = useState<SalesforceContact | null>(null)
  const [searchEmail, setSearchEmail] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)

  // New case form state
  const [newCase, setNewCase] = useState({
    subject: "",
    description: "",
    priority: "Medium" as const,
    type: "Security Incident" as const,
    roomNumber: "",
    alertType: "",
    confidenceScore: 0,
  })

  // New contact form state
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roomNumber: "",
    guestId: "",
  })

  useEffect(() => {
    const init = async () => {
      const connected = await checkConnection()
      setIsConnected(connected)

      if (connected) {
        loadSecurityCases()
      }
    }

    init()
  }, [])

  const loadSecurityCases = async () => {
    const cases = await getSecurityCases()
    setSecurityCases(cases)
  }

  const handleSearchContact = async () => {
    if (!searchEmail) return
    const contact = await findContactByEmail(searchEmail)
    setSelectedContact(contact)
  }

  const handleCreateCase = async () => {
    const caseData: SecurityCase = {
      Subject: newCase.subject,
      Description: newCase.description,
      Status: "New",
      Priority: newCase.priority,
      Type: newCase.type,
      Room_Number__c: newCase.roomNumber,
      Alert_Type__c: newCase.alertType,
      Confidence_Score__c: newCase.confidenceScore,
      Incident_Time__c: new Date().toISOString(),
      ContactId: selectedContact?.Id,
    }

    const caseId = await createSecurityCase(caseData)
    if (caseId) {
      setNewCase({
        subject: "",
        description: "",
        priority: "Medium",
        type: "Security Incident",
        roomNumber: "",
        alertType: "",
        confidenceScore: 0,
      })
      loadSecurityCases()
    }
  }

  const handleCreateContact = async () => {
    const contactData: SalesforceContact = {
      FirstName: newContact.firstName,
      LastName: newContact.lastName,
      Email: newContact.email,
      Phone: newContact.phone,
      Hotel_Guest_ID__c: newContact.guestId,
      Room_Number__c: newContact.roomNumber,
      Guest_Status__c: "Checked In",
    }

    const contactId = await createContact(contactData)
    if (contactId) {
      setNewContact({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roomNumber: "",
        guestId: "",
      })
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    await syncWithSalesforce()
    setIsSyncing(false)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Connecting to Salesforce...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Salesforce Integration</h2>
          <p className="text-muted-foreground">Connect your hotel security system to Salesforce</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={checkSalesforceConnection}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Test Connection
          </Button>
          <Button onClick={handleSync} disabled={!isConnectedToSalesforce || isSyncing}>
            <Cloud className="mr-2 h-4 w-4" />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      </div>

      {salesforceError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Connection Error</h3>
            <p className="text-sm">{salesforceError}</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="cases" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cases">Security Cases</TabsTrigger>
          <TabsTrigger value="contacts">Guest Management</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Cases</CardTitle>
              <CardDescription>Security incidents tracked in Salesforce</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityCases.map((case_) => (
                  <div key={case_.Id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-medium">{case_.Subject}</h4>
                        <p className="text-sm text-muted-foreground">{case_.Description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={case_.Priority === "Critical" ? "destructive" : "secondary"}>
                            {case_.Priority}
                          </Badge>
                          <Badge variant="outline">{case_.Status}</Badge>
                          {case_.Room_Number__c && <Badge variant="outline">Room {case_.Room_Number__c}</Badge>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View in SF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guest Lookup</CardTitle>
              <CardDescription>Search for guest information in Salesforce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter guest email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
                <Button onClick={handleSearchContact}>
                  <Users className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {selectedContact && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">
                    {selectedContact.FirstName} {selectedContact.LastName}
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedContact.Email}</p>
                  {selectedContact.Room_Number__c && (
                    <Badge variant="outline">Room {selectedContact.Room_Number__c}</Badge>
                  )}
                  {selectedContact.Guest_Status__c && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedContact.Guest_Status__c}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Security Case</CardTitle>
                <CardDescription>Log a new security incident in Salesforce</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newCase.subject}
                    onChange={(e) => setNewCase({ ...newCase, subject: e.target.value })}
                    placeholder="Brief description of the incident"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCase.description}
                    onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                    placeholder="Detailed description of the security incident"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newCase.priority}
                      onValueChange={(value: any) => setNewCase({ ...newCase, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Room Number</Label>
                    <Input
                      id="room"
                      value={newCase.roomNumber}
                      onChange={(e) => setNewCase({ ...newCase, roomNumber: e.target.value })}
                      placeholder="Room number"
                    />
                  </div>
                </div>

                <Button onClick={handleCreateCase} className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Create Security Case
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Guest Contact</CardTitle>
                <CardDescription>Add a new guest to Salesforce</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newContact.firstName}
                      onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newContact.lastName}
                      onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactRoom">Room Number</Label>
                    <Input
                      id="contactRoom"
                      value={newContact.roomNumber}
                      onChange={(e) => setNewContact({ ...newContact, roomNumber: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleCreateContact} className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Create Guest Contact
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="setup">
          <SalesforceSetup />
        </TabsContent>

        <TabsContent value="troubleshoot">
          <SalesforceTroubleshooter />
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced Salesforce integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-10 text-muted-foreground">
                <p>Advanced settings would be displayed here</p>
                <Button className="mt-4" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Advanced Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
