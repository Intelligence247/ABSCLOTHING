"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  Folder,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react"
import { BrandLogo } from "@/components/brand/logo"

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Collections", href: "/admin/collections", icon: Folder },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-[#E8E6E3] overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-[#E8E6E3]">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#05120F] rounded-lg flex items-center justify-center border border-[#C5A059]/30">
            <span className="text-[#C5A059] font-serif font-bold text-lg">A</span>
          </div>
          <div>
            <BrandLogo href="" compact theme="dark" />
            <p className="text-xs text-[#666666]">Management Panel</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <motion.div key={item.href} whileHover={{ x: 4 }}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#0A3D2E] text-white"
                    : "text-[#666666] hover:bg-[#F9F8F6]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </aside>
  )
}
