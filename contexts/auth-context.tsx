"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  role: "owner" | "receptionist"
  name: string
  email?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
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
      // Check if user was previously logged in
      const savedUser = localStorage.getItem("hotel_user")
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("hotel_user")
        }
      } else {
        // Auto-login test user for development
        const testUser: User = {
          id: "test_user_1",
          username: "owner",
          role: "owner",
          name: "Test Owner",
          email: "owner@hotel.com",
        }
        setUser(testUser)
        localStorage.setItem("hotel_user", JSON.stringify(testUser))
      }
      setIsLoading(false)
    }

    // Small delay to simulate loading
    setTimeout(autoLogin, 100)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simple validation for demo
      if (password === "password") {
        const newUser: User = {
          id: `user_${Date.now()}`,
          username,
          role: username.toLowerCase().includes("owner") ? "owner" : "receptionist",
          name: username.toLowerCase().includes("owner") ? "Hotel Owner" : "Hotel Receptionist",
          email: `${username}@hotel.com`,
        }

        setUser(newUser)
        localStorage.setItem("hotel_user", JSON.stringify(newUser))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Clear user state and localStorage
      setUser(null)
      localStorage.removeItem("hotel_user")

      // Force redirect to login page
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
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
