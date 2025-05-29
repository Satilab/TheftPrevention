import type React from "react"
import { Bell, LayoutDashboard, Map, Settings, Users } from "lucide-react"

import Sidebar from "@/components/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["owner", "receptionist"],
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: <Bell className="h-5 w-5" />,
      roles: ["owner", "receptionist"],
    },
    {
      name: "Face Logs",
      href: "/facelogs",
      icon: <Users className="h-5 w-5" />,
      roles: ["owner", "receptionist"],
    },
    {
      name: "Room Map",
      href: "/roommap",
      icon: <Map className="h-5 w-5" />,
      roles: ["owner", "receptionist"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["owner"],
    },
  ]

  return (
    <div className="h-full">
      <Sidebar items={navItems} />
      <main className="md:pl-64">{children}</main>
    </div>
  )
}

export default DashboardLayout
