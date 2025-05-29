"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { RefreshCw } from "lucide-react"

interface FaceLogFiltersProps {
  date: Date | null
  camera: string | null
  confidence: number | null
  type: string | null
  onDateChange: (value: Date | null) => void
  onCameraChange: (value: string | null) => void
  onConfidenceChange: (value: number | null) => void
  onTypeChange: (value: string | null) => void
  onReset: () => void
}

export function FaceLogFilters({
  date,
  camera,
  confidence,
  type,
  onDateChange,
  onCameraChange,
  onConfidenceChange,
  onTypeChange,
  onReset,
}: FaceLogFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date || undefined} onSelect={onDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Camera</label>
        <Select value={camera || "all"} onValueChange={(value) => onCameraChange(value === "all" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Cameras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cameras</SelectItem>
            <SelectItem value="CAM001">Main Lobby</SelectItem>
            <SelectItem value="CAM002">Conference Room A</SelectItem>
            <SelectItem value="CAM003">Office 101</SelectItem>
            <SelectItem value="CAM004">Storage Room</SelectItem>
            <SelectItem value="CAM005">Conference Room B</SelectItem>
            <SelectItem value="CAM006">Office 102</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Confidence Level</label>
          <span className="text-xs text-muted-foreground">{confidence || 0}%+</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={confidence || 0}
          onChange={(e) => onConfidenceChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Detection Type</label>
        <Select value={type || "all"} onValueChange={(value) => onTypeChange(value === "all" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
            <SelectItem value="visitor">Visitor</SelectItem>
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
