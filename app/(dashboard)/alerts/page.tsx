"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AlertFilters } from "@/components/alert-filters"
import { AlertList } from "@/components/alert-list"
import { VoiceAlertList } from "@/components/voice-alert-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Mic } from "lucide-react"

export default function AlertsPage() {
  const { role } = useAuth()
  const [filters, setFilters] = useState({
    status: null,
    type: null,
    room: null,
    receptionist: null,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {role === "owner" ? "Alerts & Voice Monitoring" : "Alerts"}
        </h1>
      </div>

      {role === "owner" ? (
        <Tabs defaultValue="security" className="space-y-4">
          <TabsList>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Security Alerts
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <div className="space-y-4">
              <AlertFilters onFiltersChange={setFilters} />
              <AlertList {...filters} />
            </div>
          </TabsContent>

          <TabsContent value="voice">
            <VoiceAlertList />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <AlertFilters onFiltersChange={setFilters} />
          <AlertList {...filters} />
        </div>
      )}
    </div>
  )
}
