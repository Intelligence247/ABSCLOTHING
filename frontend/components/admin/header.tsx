"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { Bell, User, LogOut, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AdminHeader() {
  const { user, logout } = useAdmin()
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  return (
    <header className="h-16 bg-white border-b border-[#E8E6E3] px-6 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[#F9F8F6] rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-[#1A1A1A]" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          className="p-2 hover:bg-[#F9F8F6] rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#666666]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex sm:hidden items-center justify-center rounded-lg border border-[#E8E6E3] bg-white p-2 text-[#1A1A1A] transition-colors hover:border-[#0A3D2E] hover:bg-[#F9F8F6]"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-[#E8E6E3] bg-white px-3 py-2 text-sm font-semibold text-[#1A1A1A] transition-colors hover:border-[#0A3D2E] hover:bg-[#F9F8F6] hover:text-[#0A3D2E]"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Log out
        </button>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#F9F8F6] rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-[#0A3D2E] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) ?? "?"}
            </div>
            <span className="text-sm font-medium text-[#1A1A1A]">{user?.name}</span>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E8E6E3] z-50"
              >
                <div className="p-4 border-b border-[#E8E6E3]">
                  <p className="text-sm font-semibold text-[#1A1A1A]">{user?.name}</p>
                  <p className="text-xs text-[#666666]">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    // Add profile/settings redirect here
                  }}
                  className="w-full px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F9F8F6] flex items-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-[#E8E6E3]"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
