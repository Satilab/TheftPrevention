"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Search, Plus, CheckCircle, X, AlertTriangle } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { EmptyState } from "@/components/empty-state"
import { useToast } from "@/components/ui/use-toast"

export default function LinenStockPage() {
  const { linenStock, rooms, isLoading, refreshAllData, updateLinenStock, addLinenStock } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  const handleRefresh = async () => {
    await refreshAllData()
  }

  const handleStatusChange = async (id: string, newStatus: "Issued" | "Returned" | "Damaged") => {
    try {
      await updateLinenStock(id, { status: newStatus })
      toast({
        title: "Status Updated",
        description: `Linen item marked as ${newStatus.toLowerCase()}.`,
      })
      await refreshAllData()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update linen status.",
        variant: "destructive",
      })
    }
  }

  const handleAddNewLinen = async () => {
    try {
      await addLinenStock({
        type: "Bedsheet",
        status: "Issued",
        issueDate: new Date().toISOString().split("T")[0],
      })
      toast({
        title: "Item Added",
        description: "New linen item has been added.",
      })
      await refreshAllData()
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add new linen item.",
        variant: "destructive",
      })
    }
  }

  // Filter linen stock based on search query and filters
  const filteredLinenStock = linenStock.filter((item) => {
    // Filter by type
    if (filterType !== "all" && item.type?.toLowerCase() !== filterType.toLowerCase()) {
      return false
    }

    // Filter by status
    if (filterStatus !== "all" && item.status?.toLowerCase() !== filterStatus.toLowerCase()) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const roomNumber = item.roomId?.toLowerCase() || ""
      const type = item.type?.toLowerCase() || ""
      const id = item.id?.toLowerCase() || ""

      return roomNumber.includes(query) || type.includes(query) || id.includes(query)
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "issued":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Issued</Badge>
      case "returned":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Returned</Badge>
      case "damaged":
        return <Badge variant="destructive">Damaged</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRoomNumber = (roomId: string | undefined) => {
    if (!roomId) return "Not assigned"
    const room = rooms.find((r) => r.id === roomId)
    return room ? `Room ${room.roomNumber}` : "Unknown Room"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Linen Stock Management</h1>
          <p className="text-muted-foreground">Track and manage hotel linen inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={handleAddNewLinen}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by room number or type..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bedsheet">Bedsheets</SelectItem>
              <SelectItem value="towel">Towels</SelectItem>
              <SelectItem value="pillow cover">Pillow Covers</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items ({linenStock.length})</TabsTrigger>
          <TabsTrigger value="issued">
            Issued ({linenStock.filter((item) => item.status?.toLowerCase() === "issued").length})
          </TabsTrigger>
          <TabsTrigger value="returned">
            Returned ({linenStock.filter((item) => item.status?.toLowerCase() === "returned").length})
          </TabsTrigger>
          <TabsTrigger value="damaged">
            Damaged ({linenStock.filter((item) => item.status?.toLowerCase() === "damaged").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredLinenStock.length === 0 ? (
            <EmptyState
              icon={<AlertTriangle className="h-10 w-10 text-muted-foreground" />}
              title="No Linen Items Found"
              description={
                searchQuery || filterType !== "all" || filterStatus !== "all"
                  ? "No items match your current filters. Try adjusting your search criteria."
                  : "No linen items found in the system. Add new items to get started."
              }
              action={{
                label: "Add New Item",
                onClick: handleAddNewLinen,
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLinenStock.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.type || "Unknown Type"}</CardTitle>
                        <CardDescription>{getRoomNumber(item.roomId)}</CardDescription>
                      </div>
                      {getStatusBadge(item.status || "")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">ID</p>
                          <p>{item.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Issue Date</p>
                          <p>{item.issueDate || "Not recorded"}</p>
                        </div>
                        {item.status?.toLowerCase() === "returned" && (
                          <div>
                            <p className="text-muted-foreground">Return Date</p>
                            <p>{item.returnDate || "Not recorded"}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {item.status?.toLowerCase() !== "returned" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleStatusChange(item.id, "Returned")}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Mark Returned
                          </Button>
                        )}
                        {item.status?.toLowerCase() !== "damaged" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleStatusChange(item.id, "Damaged")}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Mark Damaged
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="issued">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLinenStock
                .filter((item) => item.status?.toLowerCase() === "issued")
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.type || "Unknown Type"}</CardTitle>
                          <CardDescription>{getRoomNumber(item.roomId)}</CardDescription>
                        </div>
                        {getStatusBadge(item.status || "")}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">ID</p>
                            <p>{item.id}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Issue Date</p>
                            <p>{item.issueDate || "Not recorded"}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleStatusChange(item.id, "Returned")}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Mark Returned
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleStatusChange(item.id, "Damaged")}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Mark Damaged
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="returned">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLinenStock
                .filter((item) => item.status?.toLowerCase() === "returned")
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.type || "Unknown Type"}</CardTitle>
                          <CardDescription>{getRoomNumber(item.roomId)}</CardDescription>
                        </div>
                        {getStatusBadge(item.status || "")}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">ID</p>
                            <p>{item.id}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Issue Date</p>
                            <p>{item.issueDate || "Not recorded"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Return Date</p>
                            <p>{item.returnDate || "Not recorded"}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleStatusChange(item.id, "Damaged")}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Mark Damaged
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="damaged">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLinenStock
                .filter((item) => item.status?.toLowerCase() === "damaged")
                .map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.type || "Unknown Type"}</CardTitle>
                          <CardDescription>{getRoomNumber(item.roomId)}</CardDescription>
                        </div>
                        {getStatusBadge(item.status || "")}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">ID</p>
                            <p>{item.id}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Issue Date</p>
                            <p>{item.issueDate || "Not recorded"}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
