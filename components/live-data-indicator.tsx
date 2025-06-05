"use client"

import { useData } from "@/contexts/data-context"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export function LiveDataIndicator() {
  const { isConnectedToSalesforce, isLoading, lastRefresh } = useData()

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnectedToSalesforce ? "default" : "destructive"} className="flex items-center gap-1">
        {isConnectedToSalesforce ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnectedToSalesforce ? "Live" : "Offline"}
      </Badge>

      {isLoading && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Syncing...
        </div>
      )}

      {lastRefresh && <span className="text-xs text-muted-foreground">{lastRefresh.toLocaleTimeString()}</span>}
    </div>
  )
}
