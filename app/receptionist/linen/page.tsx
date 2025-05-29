"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Package, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface LinenItem {
  id: string
  name: string
  category: "bedsheets" | "towels" | "pillowcovers"
  total: number
  inUse: number
  available: number
  damaged: number
  lowStockThreshold: number
}

interface LinenTransaction {
  id: string
  itemId: string
  itemName: string
  type: "issue" | "return" | "damaged" | "restock"
  quantity: number
  room: string | null
  timestamp: string
  notes: string
}

const linenData: LinenItem[] = [
  {
    id: "L001",
    name: "Standard Bed Sheets",
    category: "bedsheets",
    total: 100,
    inUse: 45,
    available: 50,
    damaged: 5,
    lowStockThreshold: 20,
  },
  {
    id: "L002",
    name: "Deluxe Bed Sheets",
    category: "bedsheets",
    total: 60,
    inUse: 25,
    available: 32,
    damaged: 3,
    lowStockThreshold: 15,
  },
  {
    id: "L003",
    name: "Bath Towels",
    category: "towels",
    total: 150,
    inUse: 80,
    available: 65,
    damaged: 5,
    lowStockThreshold: 30,
  },
  {
    id: "L004",
    name: "Hand Towels",
    category: "towels",
    total: 200,
    inUse: 120,
    available: 75,
    damaged: 5,
    lowStockThreshold: 40,
  },
  {
    id: "L005",
    name: "Standard Pillow Covers",
    category: "pillowcovers",
    total: 120,
    inUse: 60,
    available: 55,
    damaged: 5,
    lowStockThreshold: 25,
  },
  {
    id: "L006",
    name: "Deluxe Pillow Covers",
    category: "pillowcovers",
    total: 80,
    inUse: 35,
    available: 15,
    damaged: 30,
    lowStockThreshold: 20,
  },
]

const transactionData: LinenTransaction[] = [
  {
    id: "T001",
    itemId: "L001",
    itemName: "Standard Bed Sheets",
    type: "issue",
    quantity: 2,
    room: "101",
    timestamp: "2023-05-29T14:30:00",
    notes: "Guest checkout, fresh sheets needed",
  },
  {
    id: "T002",
    itemId: "L003",
    itemName: "Bath Towels",
    type: "return",
    quantity: 4,
    room: "203",
    timestamp: "2023-05-29T13:15:00",
    notes: "Guest checkout, towels returned for washing",
  },
  {
    id: "T003",
    itemId: "L005",
    itemName: "Standard Pillow Covers",
    type: "damaged",
    quantity: 1,
    room: "305",
    timestamp: "2023-05-29T12:00:00",
    notes: "Pillow cover torn, marked as damaged",
  },
]

export default function LinenStockPage() {
  const { toast } = useToast()
  const [linenItems, setLinenItems] = useState<LinenItem[]>(linenData)
  const [transactions, setTransactions] = useState<LinenTransaction[]>(transactionData)
  const [selectedItem, setSelectedItem] = useState<LinenItem | null>(null)
  const [transactionType, setTransactionType] = useState<"issue" | "return" | "damaged" | "restock">("issue")
  const [quantity, setQuantity] = useState("1")
  const [room, setRoom] = useState("")
  const [notes, setNotes] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleTransaction = () => {
    if (!selectedItem || !quantity || Number.parseInt(quantity) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select an item and enter a valid quantity.",
        variant: "destructive",
      })
      return
    }

    if ((transactionType === "issue" || transactionType === "return") && !room) {
      toast({
        title: "Room Required",
        description: "Please specify a room number for this transaction.",
        variant: "destructive",
      })
      return
    }

    const qty = Number.parseInt(quantity)
    const newTransaction: LinenTransaction = {
      id: `T${String(transactions.length + 1).padStart(3, "0")}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      type: transactionType,
      quantity: qty,
      room: transactionType === "issue" || transactionType === "return" ? room : null,
      timestamp: new Date().toISOString(),
      notes: notes || "",
    }

    // Update linen quantities
    setLinenItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          const newItem = { ...item }
          switch (transactionType) {
            case "issue":
              newItem.available = Math.max(0, item.available - qty)
              newItem.inUse = item.inUse + qty
              break
            case "return":
              newItem.inUse = Math.max(0, item.inUse - qty)
              newItem.available = item.available + qty
              break
            case "damaged":
              newItem.available = Math.max(0, item.available - qty)
              newItem.damaged = item.damaged + qty
              break
            case "restock":
              newItem.available = item.available + qty
              newItem.total = item.total + qty
              break
          }
          return newItem
        }
        return item
      }),
    )

    setTransactions((prev) => [newTransaction, ...prev])

    // Reset form
    setSelectedItem(null)
    setQuantity("1")
    setRoom("")
    setNotes("")

    toast({
      title: "Transaction Completed",
      description: `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} of ${qty} ${
        selectedItem.name
      } completed successfully.`,
    })
  }

  const getCategoryIcon = (category: LinenItem["category"]) => {
    switch (category) {
      case "bedsheets":
        return "🛏️"
      case "towels":
        return "🏊"
      case "pillowcovers":
        return "🛌"
    }
  }

  const getStockStatus = (item: LinenItem) => {
    if (item.available <= item.lowStockThreshold) {
      return <Badge variant="destructive">Low Stock</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">In Stock</Badge>
  }

  const getTransactionBadge = (type: LinenTransaction["type"]) => {
    switch (type) {
      case "issue":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Issue</Badge>
      case "return":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Return</Badge>
      case "damaged":
        return <Badge variant="destructive">Damaged</Badge>
      case "restock":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Restock</Badge>
    }
  }

  const filteredItems = linenItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const lowStockItems = linenItems.filter((item) => item.available <= item.lowStockThreshold)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Linen Stock Management</h1>
        <p className="text-muted-foreground">Manage bedsheets, towels, and pillow covers inventory</p>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800 dark:text-amber-200">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 dark:text-amber-300 mb-2">
              The following items are running low and need restocking:
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge key={item.id} variant="outline" className="border-amber-300">
                  {item.name} ({item.available} left)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Linen Inventory</CardTitle>
                      <CardDescription>Current stock levels for all linen items</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search items..."
                        className="pl-8 w-full sm:w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-4 md:w-1/3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                                </div>
                              </div>
                              {getStockStatus(item)}
                            </div>
                            <div className="p-4 bg-muted/50 flex-1">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="font-medium">Total</p>
                                  <p className="text-lg">{item.total}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Available</p>
                                  <p className="text-lg text-green-600">{item.available}</p>
                                </div>
                                <div>
                                  <p className="font-medium">In Use</p>
                                  <p className="text-lg text-blue-600">{item.inUse}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Damaged</p>
                                  <p className="text-lg text-red-600">{item.damaged}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Transaction</CardTitle>
                  <CardDescription>Issue, return, or manage linen items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Item</Label>
                    <Select
                      value={selectedItem?.id || ""}
                      onValueChange={(value) => {
                        const item = linenItems.find((i) => i.id === value)
                        setSelectedItem(item || null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose linen item" />
                      </SelectTrigger>
                      <SelectContent>
                        {linenItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} (Available: {item.available})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select value={transactionType} onValueChange={(value: any) => setTransactionType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="issue">Issue to Room</SelectItem>
                        <SelectItem value="return">Return from Room</SelectItem>
                        <SelectItem value="damaged">Mark as Damaged</SelectItem>
                        <SelectItem value="restock">Restock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </div>

                  {(transactionType === "issue" || transactionType === "return") && (
                    <div className="space-y-2">
                      <Label>Room Number</Label>
                      <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g., 101" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
                  </div>

                  <Button onClick={handleTransaction} className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    Complete Transaction
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent linen transactions and movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-1/4">
                          <h3 className="font-medium">{transaction.itemName}</h3>
                          <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
                        </div>
                        <div className="p-4 bg-muted/50 flex-1">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                            <div>
                              <p className="text-sm font-medium">Type</p>
                              <div>{getTransactionBadge(transaction.type)}</div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Quantity</p>
                              <p className="text-sm">{transaction.quantity}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Room</p>
                              <p className="text-sm">{transaction.room || "—"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Time</p>
                              <p className="text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          {transaction.notes && (
                            <div>
                              <p className="text-sm font-medium">Notes</p>
                              <p className="text-sm bg-background p-2 rounded">{transaction.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Bedsheets</CardTitle>
                <CardDescription>Current bedsheet inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {linenItems
                  .filter((item) => item.category === "bedsheets")
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <span className="text-sm">{item.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.available} available</p>
                        <p className="text-xs text-muted-foreground">{item.inUse} in use</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Towels</CardTitle>
                <CardDescription>Current towel inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {linenItems
                  .filter((item) => item.category === "towels")
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <span className="text-sm">{item.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.available} available</p>
                        <p className="text-xs text-muted-foreground">{item.inUse} in use</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pillow Covers</CardTitle>
                <CardDescription>Current pillow cover inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {linenItems
                  .filter((item) => item.category === "pillowcovers")
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <span className="text-sm">{item.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.available} available</p>
                        <p className="text-xs text-muted-foreground">{item.inUse} in use</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Overall Summary</CardTitle>
                <CardDescription>Total inventory across all categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {linenItems.reduce((sum, item) => sum + item.total, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {linenItems.reduce((sum, item) => sum + item.available, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {linenItems.reduce((sum, item) => sum + item.inUse, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">In Use</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {linenItems.reduce((sum, item) => sum + item.damaged, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Damaged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
