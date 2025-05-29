"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "receptionist" | "owner" | null
type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
} | null

interface AuthContextType {
  user: User
  role: UserRole
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("hotelUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo login logic
    if (email && password) {
      const newUser = {
        id: role === "owner" ? "1" : "2",
        name: role === "owner" ? "John Owner" : "Sarah Receptionist",
        email,
        role,
        avatar: `/placeholder.svg?height=40&width=40&query=${role}`,
      }
      setUser(newUser)
      localStorage.setItem("hotelUser", JSON.stringify(newUser))
      setIsLoading(false)

      // Redirect based on role
      if (role === "owner") {
        router.push("/owner/dashboard")
      } else {
        router.push("/receptionist/dashboard")
      }

      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hotelUser")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
