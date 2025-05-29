"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ("owner" | "receptionist")[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(role as "owner" | "receptionist")) {
      if (role === "owner") {
        router.push("/owner/dashboard")
      } else if (role === "receptionist") {
        router.push("/receptionist/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router, role, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(role as "owner" | "receptionist")) {
    return null
  }

  return <>{children}</>
}
