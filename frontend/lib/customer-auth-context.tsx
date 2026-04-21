"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  ApiError,
  clearCustomerToken,
  getCustomerToken,
  setCustomerToken,
} from "@/lib/api"
import {
  apiFetchCustomerProfile,
  apiLoginCustomer,
  apiRegisterCustomer,
} from "@/lib/customer-api"

export type CustomerUser = {
  id: string
  name: string
  email: string
}

type CustomerAuthContextType = {
  user: CustomerUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; message: string }>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined)

const STORAGE_USER = "abs_customer_user"

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const applyProfile = useCallback((p: { _id: string; name: string; email: string }) => {
    const u: CustomerUser = { id: String(p._id), name: p.name, email: p.email }
    setUser(u)
    localStorage.setItem(STORAGE_USER, JSON.stringify(u))
  }, [])

  const refreshProfile = useCallback(async () => {
    const token = getCustomerToken()
    if (!token) {
      setUser(null)
      localStorage.removeItem(STORAGE_USER)
      return
    }
    const profile = await apiFetchCustomerProfile()
    applyProfile(profile)
  }, [applyProfile])

  useEffect(() => {
    if (typeof window === "undefined") return

    const token = getCustomerToken()
    const saved = localStorage.getItem(STORAGE_USER)

    if (!token) {
      if (saved) localStorage.removeItem(STORAGE_USER)
      setUser(null)
      setIsLoading(false)
      return
    }

    if (saved) {
      try {
        setUser(JSON.parse(saved) as CustomerUser)
      } catch {
        localStorage.removeItem(STORAGE_USER)
      }
    }
    setIsLoading(false)

    let cancelled = false
    const validate = () => {
      if (cancelled) return
      apiFetchCustomerProfile()
        .then((p) => {
          if (!cancelled) applyProfile(p)
        })
        .catch(() => {
          if (!cancelled) {
            clearCustomerToken()
            localStorage.removeItem(STORAGE_USER)
            setUser(null)
          }
        })
    }

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(validate, { timeout: 2500 })
      return () => {
        cancelled = true
        cancelIdleCallback(id)
      }
    }
    const t = setTimeout(validate, 0)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [applyProfile])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiLoginCustomer(email, password)
      setCustomerToken(data.token)
      applyProfile(data)
      return { ok: true as const }
    } catch (e: unknown) {
      if (e instanceof ApiError) return { ok: false as const, message: e.message }
      return { ok: false as const, message: "Login failed" }
    }
  }, [applyProfile])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const data = await apiRegisterCustomer(name, email, password)
      setCustomerToken(data.token)
      applyProfile(data)
      return { ok: true as const }
    } catch (e: unknown) {
      if (e instanceof ApiError) return { ok: false as const, message: e.message }
      return { ok: false as const, message: "Registration failed" }
    }
  }, [applyProfile])

  const logout = useCallback(() => {
    clearCustomerToken()
    localStorage.removeItem(STORAGE_USER)
    setUser(null)
  }, [])

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider")
  }
  return ctx
}
