"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminProvider, useAdmin } from "@/lib/admin-context"
import { AdminDataProvider } from "@/lib/admin-data-context"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()
  
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, router, isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F9F8F6]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8E6E3] border-t-[#0A3D2E] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666] font-sans">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F9F8F6]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminDataProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminDataProvider>
    </AdminProvider>
  )
}
