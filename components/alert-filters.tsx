"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from "lucide-react"

interface AlertFiltersProps {
  status: string | null
  type: string | null
  room: string | null
  receptionist: string | null
  onStatusChange: (value: string | null) => void
  onTypeChange: (value: string | null) => void
  onRoomChange: (value: string | null) => void
  onReceptionistChange: (value: string | null) => void
  onReset: () => void
}

export function AlertFilters({
  status,
  type,
  room,
  receptionist,
  onStatusChange,
  onTypeChange,
  onRoomChange,
  onReceptionistChange,
  onReset,
}: AlertFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={status || "all"} onValueChange={(value) => onStatusChange(value === "all" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select value={type || "all"} onValueChange={(value) => onTypeChange(value === "all" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="intruder">Intruder</SelectItem>
            <SelectItem value="suspicious">Suspicious Activity</SelectItem>
            <SelectItem value="unauthorized">Unauthorized Access</SelectItem>
            <SelectItem value="system">System Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Room</label>
        <Select value={room || "all"} onValueChange={(value) => onRoomChange(value === "all" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="R001">Main Lobby</SelectItem>
            <SelectItem value="R002">Conference Room A</SelectItem>
            <SelectItem value="R003">Office 101</SelectItem>
            <SelectItem value="R004">Storage Room</SelectItem>
            <SelectItem value="R005">Conference Room B</SelectItem>
            <SelectItem value="R006">Office 102</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Receptionist</label>
        <Select
          value={receptionist || "all"}
          onValueChange={(value) => onReceptionistChange(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Receptionists" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Receptionists</SelectItem>
            <SelectItem value="sarah">Sarah</SelectItem>
            <SelectItem value="john">John</SelectItem>
            <SelectItem value="michael">Michael</SelectItem>
            <SelectItem value="emma">Emma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
