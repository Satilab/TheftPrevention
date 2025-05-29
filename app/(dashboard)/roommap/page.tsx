"use client"

import { RoomMap } from "@/components/room-map"

export default function RoomMapPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Room Map</h1>
      </div>
      <RoomMap />
    </div>
  )
}
