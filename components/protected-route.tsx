"use client"

import type React from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("owner" | "receptionist")[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  // For testing purposes, always allow access
  return <>{children}</>
}
