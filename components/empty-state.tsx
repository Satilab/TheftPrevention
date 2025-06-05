"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, actionLabel, onAction, icon, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-lg border border-dashed ${className}`}
    >
      <div className="text-center p-8">
        {icon && <div className="mx-auto mb-4">{icon}</div>}
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
