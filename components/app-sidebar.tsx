"use client"

import * as React from "react"
import { LayoutDashboard, Users, AlertTriangle, Camera, Settings, Map, UserCheck, Package, Shield } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Owner navigation items
const ownerNavItems = [
  {
    title: "Dashboard",
    url: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Alerts",
    url: "/owner/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Face Logs",
    url: "/owner/facelogs",
    icon: Camera,
  },
  {
    title: "Room Map",
    url: "/owner/roommap",
    icon: Map,
  },
  {
    title: "Intrusions",
    url: "/owner/intrusions",
    icon: Shield,
  },
  {
    title: "Settings",
    url: "/owner/settings",
    icon: Settings,
  },
]

// Receptionist navigation items
const receptionistNavItems = [
  {
    title: "Dashboard",
    url: "/receptionist/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Check-in",
    url: "/receptionist/checkin",
    icon: UserCheck,
  },
  {
    title: "Registration",
    url: "/receptionist/registration",
    icon: Users,
  },
  {
    title: "Room Map",
    url: "/receptionist/roommap",
    icon: Map,
  },
  {
    title: "Linen Stock",
    url: "/receptionist/linen",
    icon: Package,
  },
  {
    title: "Escalations",
    url: "/receptionist/escalations",
    icon: AlertTriangle,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  variant?: "owner" | "receptionist"
}

export function AppSidebar({ variant, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Determine navigation items based on variant or user role
  const navItems = React.useMemo(() => {
    if (variant === "owner" || user?.role === "owner") {
      return ownerNavItems
    }
    return receptionistNavItems
  }, [variant, user?.role])

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <span className="font-semibold">Hotel Security</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
