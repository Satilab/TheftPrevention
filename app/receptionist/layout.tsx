"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LayoutDashboard, UserPlus, Clock, Bell, Map, ShoppingBag, LogOut, Hotel, Menu, X } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/receptionist/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Registration",
      href: "/receptionist/registration",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      name: "Check-In/Out",
      href: "/receptionist/checkin",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Escalations",
      href: "/receptionist/escalations",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Room Map",
      href: "/receptionist/roommap",
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: "Linen Stock",
      href: "/receptionist/linen",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
  ]

  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
          <div className="flex flex-col h-full border-r bg-background">
            <div className="p-4 flex items-center gap-2">
              <Hotel className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Hotel Security</h1>
            </div>

            <Separator />

            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-4 mt-auto">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">Receptionist</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b h-14 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Hotel className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">Hotel Security</h1>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hotel className="h-6 w-6 text-primary" />
                      <h1 className="text-xl font-bold">Hotel Security</h1>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex-1 overflow-auto py-2">
                    <nav className="grid gap-1 px-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="p-4 mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">Receptionist</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 overflow-auto">
          <div className="md:p-6 p-4 pt-16 md:pt-6 min-h-screen">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
