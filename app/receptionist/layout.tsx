import type React from "react"
import { LayoutDashboard, UserPlus, CalendarCheck, Map, ShoppingBasket, AlertCircle } from "lucide-react"

import { Sidebar } from "@/components/sidebar"

const receptionistNavItems = [
  {
    title: "Dashboard",
    href: "/receptionist/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Registration",
    href: "/receptionist/registration",
    icon: UserPlus,
  },
  {
    title: "Check-In/Out",
    href: "/receptionist/checkin",
    icon: CalendarCheck,
  },
  {
    title: "Room Map",
    href: "/receptionist/roommap",
    icon: Map,
  },
  {
    title: "Linen Stock",
    href: "/receptionist/linen",
    icon: ShoppingBasket,
  },
  {
    title: "Escalations",
    href: "/receptionist/escalations",
    icon: AlertCircle,
  },
]

interface ReceptionistLayoutProps {
  children: React.ReactNode
}

const ReceptionistLayout = ({ children }: ReceptionistLayoutProps) => {
  return (
    <div className="h-full">
      <Sidebar items={receptionistNavItems} />
      <main className="md:pl-64 p-6">{children}</main>
    </div>
  )
}

export default ReceptionistLayout
