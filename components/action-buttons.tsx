"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Plus, Download, Upload, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ActionButtonsProps {
  onRefresh?: () => Promise<void>
  onAdd?: () => Promise<void>
  onExport?: () => Promise<void>
  onImport?: () => Promise<void>
  onSettings?: () => void
  isLoading?: boolean
  showAdd?: boolean
  showExport?: boolean
  showImport?: boolean
  showSettings?: boolean
}

export function ActionButtons({
  onRefresh,
  onAdd,
  onExport,
  onImport,
  onSettings,
  isLoading = false,
  showAdd = true,
  showExport = false,
  showImport = false,
  showSettings = false,
}: ActionButtonsProps) {
  const { toast } = useToast()

  const handleAction = async (action: () => Promise<void>, actionName: string) => {
    try {
      await action()
      toast({
        title: "Success",
        description: `${actionName} completed successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${actionName.toLowerCase()}.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      {onRefresh && (
        <Button variant="outline" onClick={() => handleAction(onRefresh, "Refresh")} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      )}

      {showAdd && onAdd && (
        <Button onClick={() => handleAction(onAdd, "Add item")} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      )}

      {showExport && onExport && (
        <Button variant="outline" onClick={() => handleAction(onExport, "Export data")} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      )}

      {showImport && onImport && (
        <Button variant="outline" onClick={() => handleAction(onImport, "Import data")} disabled={isLoading}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      )}

      {showSettings && onSettings && (
        <Button variant="outline" onClick={onSettings} disabled={isLoading}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      )}
    </div>
  )
}
