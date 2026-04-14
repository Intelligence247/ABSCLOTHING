"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { API_BASE_URL, clearAuthToken, getAuthToken, setAuthToken } from "@/lib/api"

interface AdminUser {
  id: string
  email: string
  name: string
}

interface AdminContextType {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  registerAdmin: (input: {
    name: string
    email: string
    password: string
    adminSecret: string
  }) => Promise<{ ok: true } | { ok: false; message: string }>
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

/** Client-side only: read JWT `exp` (seconds) without verifying signature. */
function getJwtExpiryMs(token: string): number | null {
  try {
    const part = token.split(".")[1]
    if (!part) return null
    const padded = part.replace(/-/g, "+").replace(/_/g, "/")
    const json = JSON.parse(atob(padded)) as { exp?: unknown }
    return typeof json.exp === "number" ? json.exp * 1000 : null
  } catch {
    return null
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    const token = getAuthToken()
    const savedUser = localStorage.getItem("adminUser")

    if (token) {
      const expMs = getJwtExpiryMs(token)
      if (expMs != null && Date.now() >= expMs) {
        clearAuthToken()
        localStorage.removeItem("adminUser")
        setUser(null)
        setIsLoading(false)
        return
      }
    }

    if (savedUser && !token) {
      localStorage.removeItem("adminUser")
      setUser(null)
      setIsLoading(false)
      return
    }

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser) as AdminUser)
      } catch {
        setUser(null)
        localStorage.removeItem("adminUser")
        clearAuthToken()
      }
    }

    setIsLoading(false)
  }, [])

  const registerAdmin = useCallback(
    async (input: { name: string; email: string; password: string; adminSecret: string }) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/register-admin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: input.name.trim(),
            email: input.email.trim(),
            password: input.password,
            adminSecret: input.adminSecret,
          }),
        })
        const data = (await res.json()) as {
          message?: string
          token?: string
          isAdmin?: boolean
          email?: string
          name?: string
          _id?: string
        }

        if (!res.ok || !data.token || !data.isAdmin) {
          return {
            ok: false as const,
            message: typeof data.message === "string" ? data.message : "Registration failed",
          }
        }

        setAuthToken(data.token)
        const newUser: AdminUser = {
          id: String(data._id ?? ""),
          email: data.email ?? input.email,
          name: data.name ?? input.name,
        }
        setUser(newUser)
        localStorage.setItem("adminUser", JSON.stringify(newUser))
        return { ok: true as const }
      } catch {
        return { ok: false as const, message: "Network error — check API URL and try again." }
      }
    },
    []
  )

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as {
        token?: string
        isAdmin?: boolean
        email?: string
        name?: string
        _id?: string
      }

      if (!res.ok || !data.token || !data.isAdmin) {
        return false
      }

      setAuthToken(data.token)
      const newUser: AdminUser = {
        id: String(data._id ?? ""),
        email: data.email ?? email,
        name: data.name ?? "Admin",
      }
      setUser(newUser)
      localStorage.setItem("adminUser", JSON.stringify(newUser))
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearAuthToken()
    localStorage.removeItem("adminUser")
  }, [])

  return (
    <AdminContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, registerAdmin, logout }}
    >
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
