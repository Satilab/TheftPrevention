"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <SidebarProvider>
        <AppSidebar variant="owner" />
        <SidebarInset>
          <Header />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
