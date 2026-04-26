"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type WishlistContextType = {
  ids: string[]
  isHydrated: boolean
  isWishlisted: (productId: string) => boolean
  toggleWishlist: (productId: string) => boolean
}

const STORAGE_KEY = "abs_wishlist"

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : []
      setIds(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [])
    } catch {
      setIds([])
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids, isHydrated])

  const isWishlisted = (productId: string) => ids.includes(productId)

  const toggleWishlist = (productId: string) => {
    const added = !ids.includes(productId)
    setIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId)
      }
      return [...current, productId]
    })
    return added
  }

  return (
    <WishlistContext.Provider value={{ ids, isHydrated, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
