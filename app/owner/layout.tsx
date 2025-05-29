import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Bell, LayoutDashboard, Map, Scan, Settings, ShieldAlert } from "lucide-react"

const ownerNavItems = [
  {
    title: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Alerts & Voice Monitoring",
    href: "/owner/alerts",
    icon: Bell,
  },
  {
    title: "Face Detection Logs",
    href: "/owner/facelogs",
    icon: Scan,
  },
  {
    title: "Room Map",
    href: "/owner/roommap",
    icon: Map,
  },
  {
    title: "Intrusion Reports",
    href: "/owner/intrusions",
    icon: ShieldAlert,
  },
  {
    title: "Settings",
    href: "/owner/settings",
    icon: Settings,
  },
]

interface OwnerLayoutProps {
  children: React.ReactNode
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navItems={ownerNavItems} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}

export default OwnerLayout
