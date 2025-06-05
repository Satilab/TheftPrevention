"use client"

import type React from "react"

import {
  LayoutDashboard,
  Settings,
  ListChecks,
  User2,
  Calendar,
  Bell,
  HelpCircle,
  CreditCard,
  Lock,
} from "lucide-react"

export const ownerNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Setup",
    href: "/setup",
    icon: Settings,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ListChecks,
  },
  {
    title: "Users",
    href: "/users",
    icon: User2,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
]

export const generalNavigation = [
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User2,
  },
  {
    title: "Security",
    href: "/security",
    icon: Lock,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  navigation: Array<{
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

export default function Sidebar({ className, navigation, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
