"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { PublicCollection } from "@/lib/collections-public"

const PublicCollectionsContext = createContext<PublicCollection[]>([])

export function PublicCollectionsProvider({
  children,
  value,
}: {
  children: ReactNode
  value: PublicCollection[]
}) {
  return (
    <PublicCollectionsContext.Provider value={value}>{children}</PublicCollectionsContext.Provider>
  )
}

export function usePublicCollections() {
  return useContext(PublicCollectionsContext)
}
