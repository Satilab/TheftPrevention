"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, LogOut, Calendar, Search, Plus, RefreshCw, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useData } from "@/contexts/data-context"

export default function CheckInPage() {
  const { toast } = useToast()
  const { guests, isLoading, updateGuest, isConnectedToSalesforce } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extendDays, setExtendDays] = useState("1")
  const [processingGuests, setProcessingGuests] = useState<Record<string, boolean>>({})

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.roomNumber?.includes(searchQuery) ||
      guest.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCheckIn = async (guest: any) => {
    setProcessingGuests((prev) => ({ ...prev, [guest.id]: true }))

    try {
      console.log("🔄 Checking in guest:", guest.id)

      // Update guest with check-in date
      await updateGuest(guest.id, {
        status: "checked-in",
        checkInDate: new Date().toISOString().split("T")[0],
      })

      toast({
        title: "Check-In Successful",
        description: `${guest.name} has been checked in to Room ${guest.roomNumber}.${isConnectedToSalesforce ? " Synced to Salesforce." : ""}`,
      })
    } catch (error) {
      console.error("❌ Check-in error:", error)
      toast({
        title: "Check-In Failed",
        description: `Failed to check in ${guest.name}. ${error instanceof Error ? error.message : "Please try again."}`,
        variant: "destructive",
      })
    } finally {
      setProcessingGuests((prev) => ({ ...prev, [guest.id]: false }))
    }
  }

  const handleCheckOut = async (guest: any) => {
    setProcessingGuests((prev) => ({ ...prev, [guest.id]: true }))

    try {
      console.log("🔄 Checking out guest:", guest.id)

      // Update guest with check-out date
      await updateGuest(guest.id, {
        status: "checked-out",
        checkOutDate: new Date().toISOString().split("T")[0],
      })

      toast({
        title: "Check-Out Successful",
        description: `${guest.name} has been checked out from Room ${guest.roomNumber}.${isConnectedToSalesforce ? " Synced to Salesforce." : ""}`,
      })
    } catch (error) {
      console.error("❌ Check-out error:", error)
      toast({
        title: "Check-Out Failed",
        description: `Failed to check out ${guest.name}. ${error instanceof Error ? error.message : "Please try again."}`,
        variant: "destructive",
      })
    } finally {
      setProcessingGuests((prev) => ({ ...prev, [guest.id]: false }))
    }
  }

  const handleExtendStay = async (guest: any) => {
    setProcessingGuests((prev) => ({ ...prev, [guest.id]: true }))

    try {
      console.log("🔄 Extending stay for guest:", guest.id, extendDays)

      // Calculate new check-out date
      const currentCheckOut = guest.checkOutDate ? new Date(guest.checkOutDate) : new Date()
      const newCheckOut = new Date(currentCheckOut)
      newCheckOut.setDate(newCheckOut.getDate() + Number.parseInt(extendDays))

      // Update guest with new check-out date
      await updateGuest(guest.id, {
        checkOutDate: newCheckOut.toISOString().split("T")[0],
      })

      toast({
        title: "Stay Extended",
        description: `${guest.name}'s stay has been extended by ${extendDays} days.${isConnectedToSalesforce ? " Synced to Salesforce." : ""}`,
      })
    } catch (error) {
      console.error("❌ Stay extension error:", error)
      toast({
        title: "Extension Failed",
        description: `Failed to extend stay for ${guest.name}. ${error instanceof Error ? error.message : "Please try again."}`,
        variant: "destructive",
      })
    } finally {
      setProcessingGuests((prev) => ({ ...prev, [guest.id]: false }))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not-arrived":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Not Arrived
          </Badge>
        )
      case "checked-in":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Checked In
          </Badge>
        )
      case "checked-out":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Checked Out
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleString()
  }

  const calculateDuration = (checkIn: string | null | undefined, checkOut: string | null | undefined) => {
    if (!checkIn || !checkOut) return "—"

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading guest data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Check-In / Check-Out</h1>
        <p className="text-muted-foreground">Manage guest arrivals and departures</p>
        {!isConnectedToSalesforce && (
          <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Not connected to Salesforce. Changes will only be saved locally.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, room, or ID..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Guests</TabsTrigger>
          <TabsTrigger value="not-arrived">Not Arrived</TabsTrigger>
          <TabsTrigger value="checked-in">Checked In</TabsTrigger>
          <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Guest List</CardTitle>
              <CardDescription>All registered guests and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGuests.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <AlertCircle className="mx-auto h-10 w-10 mb-2" />
                    <p>No guests found matching your search criteria</p>
                  </div>
                ) : (
                  filteredGuests.map((guest) => (
                    <Card key={guest.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-4 flex items-center gap-4 sm:w-1/3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={guest.photoUrl || "/placeholder.svg"} />
                              <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{guest.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {guest.id}</p>
                              {guest.salesforceId && (
                                <p className="text-xs text-green-600 dark:text-green-400">
                                  SF: {guest.salesforceId.substring(0, 8)}...
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="p-4 bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:w-2/3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-medium">Room</p>
                                <p>{guest.roomNumber}</p>
                              </div>
                              <div>
                                <p className="font-medium">Status</p>
                                <div>{getStatusBadge(guest.status)}</div>
                              </div>
                              <div>
                                <p className="font-medium">Check-In</p>
                                <p>{formatDate(guest.checkInDate)}</p>
                              </div>
                              <div>
                                <p className="font-medium">Check-Out</p>
                                <p>{formatDate(guest.checkOutDate)}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="font-medium">Duration</p>
                                <p>{calculateDuration(guest.checkInDate, guest.checkOutDate)}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {guest.status === "not-arrived" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCheckIn(guest)}
                                  disabled={processingGuests[guest.id]}
                                >
                                  {processingGuests[guest.id] ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                  )}
                                  Check-In
                                </Button>
                              )}

                              {guest.status === "checked-in" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCheckOut(guest)}
                                    disabled={processingGuests[guest.id]}
                                  >
                                    {processingGuests[guest.id] ? (
                                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <LogOut className="mr-2 h-4 w-4" />
                                    )}
                                    Check-Out
                                  </Button>

                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Extend Stay
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Extend Stay</DialogTitle>
                                        <DialogDescription>
                                          Extend the guest's stay by specifying additional days.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="extendDays">Number of Days</Label>
                                          <Input
                                            id="extendDays"
                                            type="number"
                                            min="1"
                                            value={extendDays}
                                            onChange={(e) => setExtendDays(e.target.value)}
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">Current Check-Out</p>
                                          <p className="text-sm">{formatDate(guest.checkOutDate)}</p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium">New Check-Out</p>
                                          <p className="text-sm">
                                            {guest.checkOutDate
                                              ? formatDate(
                                                  new Date(
                                                    new Date(guest.checkOutDate).getTime() +
                                                      Number.parseInt(extendDays) * 24 * 60 * 60 * 1000,
                                                  ).toISOString(),
                                                )
                                              : "—"}
                                          </p>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button
                                          onClick={() => handleExtendStay(guest)}
                                          disabled={processingGuests[guest.id]}
                                        >
                                          {processingGuests[guest.id] ? (
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                          ) : (
                                            <Calendar className="mr-2 h-4 w-4" />
                                          )}
                                          Confirm Extension
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}

                              {guest.status === "checked-out" && (
                                <Button size="sm" variant="outline" disabled>
                                  <Clock className="mr-2 h-4 w-4" />
                                  Completed
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="not-arrived">
          <Card>
            <CardHeader>
              <CardTitle>Not Arrived</CardTitle>
              <CardDescription>Guests who have not checked in yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGuests.filter((g) => g.status === "not-arrived").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No guests pending arrival</p>
                  </div>
                ) : (
                  filteredGuests
                    .filter((g) => g.status === "not-arrived")
                    .map((guest) => (
                      <Card key={guest.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="p-4 flex items-center gap-4 sm:w-1/3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={guest.photoUrl || "/placeholder.svg"} />
                                <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{guest.name}</p>
                                <p className="text-sm text-muted-foreground">ID: {guest.id}</p>
                                {guest.salesforceId && (
                                  <p className="text-xs text-green-600 dark:text-green-400">
                                    SF: {guest.salesforceId.substring(0, 8)}...
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="p-4 bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:w-2/3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="font-medium">Room</p>
                                  <p>{guest.roomNumber}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Expected Check-Out</p>
                                  <p>{formatDate(guest.checkOutDate)}</p>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                onClick={() => handleCheckIn(guest)}
                                disabled={processingGuests[guest.id]}
                              >
                                {processingGuests[guest.id] ? (
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Check-In
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checked-in">
          <Card>
            <CardHeader>
              <CardTitle>Checked In</CardTitle>
              <CardDescription>Guests currently staying at the hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGuests.filter((g) => g.status === "checked-in").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No guests currently checked in</p>
                  </div>
                ) : (
                  filteredGuests
                    .filter((g) => g.status === "checked-in")
                    .map((guest) => (
                      <Card key={guest.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="p-4 flex items-center gap-4 sm:w-1/3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={guest.photoUrl || "/placeholder.svg"} />
                                <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{guest.name}</p>
                                <p className="text-sm text-muted-foreground">ID: {guest.id}</p>
                                {guest.salesforceId && (
                                  <p className="text-xs text-green-600 dark:text-green-400">
                                    SF: {guest.salesforceId.substring(0, 8)}...
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="p-4 bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:w-2/3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="font-medium">Room</p>
                                  <p>{guest.roomNumber}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Check-In</p>
                                  <p>{formatDate(guest.checkInDate)}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Check-Out</p>
                                  <p>{formatDate(guest.checkOutDate)}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Duration</p>
                                  <p>{calculateDuration(guest.checkInDate, guest.checkOutDate)}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCheckOut(guest)}
                                  disabled={processingGuests[guest.id]}
                                >
                                  {processingGuests[guest.id] ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <LogOut className="mr-2 h-4 w-4" />
                                  )}
                                  Check-Out
                                </Button>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Calendar className="mr-2 h-4 w-4" />
                                      Extend Stay
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Extend Stay</DialogTitle>
                                      <DialogDescription>
                                        Extend the guest's stay by specifying additional days.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="extendDays">Number of Days</Label>
                                        <Input
                                          id="extendDays"
                                          type="number"
                                          min="1"
                                          value={extendDays}
                                          onChange={(e) => setExtendDays(e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Current Check-Out</p>
                                        <p className="text-sm">{formatDate(guest.checkOutDate)}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">New Check-Out</p>
                                        <p className="text-sm">
                                          {guest.checkOutDate
                                            ? formatDate(
                                                new Date(
                                                  new Date(guest.checkOutDate).getTime() +
                                                    Number.parseInt(extendDays) * 24 * 60 * 60 * 1000,
                                                ).toISOString(),
                                              )
                                            : "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        onClick={() => handleExtendStay(guest)}
                                        disabled={processingGuests[guest.id]}
                                      >
                                        {processingGuests[guest.id] ? (
                                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                          <Calendar className="mr-2 h-4 w-4" />
                                        )}
                                        Confirm Extension
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checked-out">
          <Card>
            <CardHeader>
              <CardTitle>Checked Out</CardTitle>
              <CardDescription>Guests who have completed their stay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGuests.filter((g) => g.status === "checked-out").length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No guests have checked out yet</p>
                  </div>
                ) : (
                  filteredGuests
                    .filter((g) => g.status === "checked-out")
                    .map((guest) => (
                      <Card key={guest.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="p-4 flex items-center gap-4 sm:w-1/3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={guest.photoUrl || "/placeholder.svg"} />
                                <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{guest.name}</p>
                                <p className="text-sm text-muted-foreground">ID: {guest.id}</p>
                                {guest.salesforceId && (
                                  <p className="text-xs text-green-600 dark:text-green-400">
                                    SF: {guest.salesforceId.substring(0, 8)}...
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="p-4 bg-muted/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:w-2/3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="font-medium">Room</p>
                                  <p>{guest.roomNumber}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Check-In</p>
                                  <p>{formatDate(guest.checkInDate)}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Check-Out</p>
                                  <p>{formatDate(guest.checkOutDate)}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Duration</p>
                                  <p>{calculateDuration(guest.checkInDate, guest.checkOutDate)}</p>
                                </div>
                              </div>

                              <Button size="sm" variant="outline" disabled>
                                <Clock className="mr-2 h-4 w-4" />
                                Completed
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
