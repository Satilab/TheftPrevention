"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  role: "owner" | "receptionist"
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  role: "owner" | "receptionist"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-login for testing purposes
  useEffect(() => {
    const autoLogin = () => {
      const testUser: User = {
        id: "test_user_1",
        username: "owner",
        role: "owner",
        name: "Test Owner",
      }

      setUser(testUser)
      setIsLoading(false)
    }

    // Small delay to simulate loading
    setTimeout(autoLogin, 100)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Not used during testing, but keeping for future use
    return true
  }

  const logout = () => {
    // Not used during testing
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: true, // Always authenticated for testing
        role: user?.role || "owner",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
