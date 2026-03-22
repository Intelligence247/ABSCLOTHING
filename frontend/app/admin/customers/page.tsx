"use client"

import { useMemo } from "react"
import { useAdminData } from "@/lib/admin-data-context"
import { motion } from "framer-motion"
import { Mail, ShoppingBag, DollarSign } from "lucide-react"

export default function CustomersPage() {
  const { orders } = useAdminData()

  // Get unique customers with their stats
  const customers = useMemo(() => {
    const customerMap = new Map<
      string,
      {
        email: string
        name: string
        totalOrders: number
        totalSpent: number
        lastOrder: Date
      }
    >()

    orders.forEach((order) => {
      const key = order.email
      if (customerMap.has(key)) {
        const existing = customerMap.get(key)!
        customerMap.set(key, {
          ...existing,
          totalOrders: existing.totalOrders + 1,
          totalSpent: existing.totalSpent + order.total,
          lastOrder:
            order.createdAt > existing.lastOrder ? order.createdAt : existing.lastOrder,
        })
      } else {
        customerMap.set(key, {
          email: order.email,
          name: order.customerName,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrder: order.createdAt,
        })
      }
    })

    return Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    )
  }, [orders])

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">
          Customers
        </h1>
        <p className="text-[#666666]">Manage your customer base</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-2">
                Total Customers
              </p>
              <p className="text-3xl font-serif font-bold text-[#1A1A1A]">
                {customers.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Mail className="text-blue-600 w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-2">
                Total Orders
              </p>
              <p className="text-3xl font-serif font-bold text-[#1A1A1A]">
                {orders.length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingBag className="text-green-600 w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-[#E8E6E3] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-2">
                Average Order Value
              </p>
              <p className="text-3xl font-serif font-bold text-[#1A1A1A]">
                ₦{orders.length > 0 ? Math.floor(
                  orders.reduce((sum, o) => sum + o.total, 0) / orders.length
                ).toLocaleString() : "0"}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="text-purple-600 w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-[#E8E6E3] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9F8F6] border-b border-[#E8E6E3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">
                  Email
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[#1A1A1A]">
                  Orders
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#1A1A1A]">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">
                  Last Order
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#666666]">
                    No customers yet
                  </td>
                </tr>
              ) : (
                customers.map((customer, idx) => (
                  <motion.tr
                    key={customer.email}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-[#E8E6E3] hover:bg-[#F9F8F6] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#1A1A1A]">
                        {customer.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[#666666]">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block bg-[#F9F8F6] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-semibold">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-[#1A1A1A]">
                      ₦{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[#666666] text-sm">
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {customers.length > 0 && (
          <div className="bg-[#F9F8F6] border-t border-[#E8E6E3] px-6 py-4 text-sm text-[#666666]">
            Showing {customers.length} customers
          </div>
        )}
      </motion.div>
    </div>
  )
}
