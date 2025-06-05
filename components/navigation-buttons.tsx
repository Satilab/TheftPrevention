"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Home, Settings, Users, AlertTriangle, Camera, Package } from "lucide-react"

interface NavigationButtonsProps {
  userRole?: "owner" | "receptionist"
  currentPage?: string
}

export function NavigationButtons({ userRole = "owner", currentPage }: NavigationButtonsProps) {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const getButtonVariant = (page: string) => {
    return currentPage === page ? "default" : "outline"
  }

  if (userRole === "owner") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant={getButtonVariant("dashboard")} onClick={() => handleNavigation("/owner/dashboard")}>
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button variant={getButtonVariant("alerts")} onClick={() => handleNavigation("/owner/alerts")}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Alerts
        </Button>
        <Button variant={getButtonVariant("facelogs")} onClick={() => handleNavigation("/owner/facelogs")}>
          <Camera className="mr-2 h-4 w-4" />
          Face Logs
        </Button>
        <Button variant={getButtonVariant("roommap")} onClick={() => handleNavigation("/owner/roommap")}>
          <Users className="mr-2 h-4 w-4" />
          Room Map
        </Button>
        <Button variant={getButtonVariant("settings")} onClick={() => handleNavigation("/owner/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={getButtonVariant("dashboard")} onClick={() => handleNavigation("/receptionist/dashboard")}>
        <Home className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button variant={getButtonVariant("checkin")} onClick={() => handleNavigation("/receptionist/checkin")}>
        <Users className="mr-2 h-4 w-4" />
        Check-in
      </Button>
      <Button variant={getButtonVariant("escalations")} onClick={() => handleNavigation("/receptionist/escalations")}>
        <AlertTriangle className="mr-2 h-4 w-4" />
        Escalations
      </Button>
      <Button variant={getButtonVariant("linen")} onClick={() => handleNavigation("/receptionist/linen")}>
        <Package className="mr-2 h-4 w-4" />
        Linen Stock
      </Button>
      <Button variant={getButtonVariant("roommap")} onClick={() => handleNavigation("/receptionist/roommap")}>
        <Users className="mr-2 h-4 w-4" />
        Room Map
      </Button>
    </div>
  )
}
