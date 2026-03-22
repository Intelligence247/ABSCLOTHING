"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

interface AdminUser {
  id: string
  email: string
  name: string
}

interface AdminContextType {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user on mount
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("adminUser")
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          setUser(null)
          localStorage.removeItem("adminUser")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    if (email === "admin@absclothing.com" && password === "admin123") {
      const newUser = {
        id: "1",
        email: email,
        name: "Admin",
      }
      setUser(newUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("adminUser", JSON.stringify(newUser))
      }
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminUser")
    }
  }, [])

  return (
    <AdminContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
