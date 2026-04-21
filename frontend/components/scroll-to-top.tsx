"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/** Resets window scroll on client-side navigations (App Router). */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return null
}
