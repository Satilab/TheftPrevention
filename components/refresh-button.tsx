"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RefreshButtonProps {
  onClick: () => Promise<void>
  isLoading: boolean
  lastRefresh?: Date | null
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function RefreshButton({
  onClick,
  isLoading,
  lastRefresh,
  variant = "outline",
  size = "default",
  className = "",
}: RefreshButtonProps) {
  return (
    <div className="flex flex-col items-end">
      <Button variant={variant} size={size} onClick={onClick} disabled={isLoading} className={className}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Refreshing..." : "Refresh"}
      </Button>
      {lastRefresh && (
        <div className="text-xs text-muted-foreground mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</div>
      )}
    </div>
  )
}
